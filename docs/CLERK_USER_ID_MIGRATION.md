# Migração: Integração clerk_user_id

## 📋 Resumo

Corrigido o erro **"Usuário não encontrado"** no dashboard, adicionando a coluna `clerk_user_id` na tabela `person_user` e integrando o webhook do Clerk para sincronizar usuários automaticamente.

## 🔧 Mudanças Implementadas

### 1. Schema do Banco de Dados

**Arquivo:** `src/lib/db/schema/users.ts`

- ✅ Adicionada coluna `clerkUserId` (VARCHAR, NOT NULL, UNIQUE)
- ✅ Migração gerada: `src/migrations/0003_superb_white_queen.sql`

```typescript
export const personUserTable = pgTable("person_user", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).unique().notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  // ... outros campos
});
```

### 2. Webhook do Clerk

**Arquivo:** `src/app/api/webhooks/clerk/route.ts`

Atualizado para sincronizar automaticamente usuários entre Clerk e banco de dados:

#### `user.created` Event
- Cria registro na tabela `person_user`
- Armazena `clerkUserId`, email, firstName, lastName
- Sincroniza com Stripe se houver metadata de assinatura

#### `user.updated` Event
- Atualiza dados do usuário em `person_user`
- Sincroniza mudanças com Stripe

#### `user.deleted` Event
- Remove usuário da tabela `person_user`
- Preserva dados do Stripe para histórico de cobrança

### 3. Endpoint de Sincronização

**Arquivo:** `src/app/api/sync/clerk-users/route.ts`

Endpoint para backfill de usuários existentes do Clerk:

```bash
POST /api/sync/clerk-users
```

**Resposta:**
```json
{
  "success": true,
  "summary": {
    "total": 10,
    "created": 8,
    "updated": 2,
    "errors": 0
  }
}
```

### 4. Onboarding Refatorado

**Arquivo:** `src/app/actions/onboarding/_save-user-data.ts`

- ✅ Agora **atualiza** o usuário existente (criado pelo webhook)
- ✅ Fallback: cria usuário se webhook não executou ainda
- ✅ Validação de CPF/userName agora ignora o próprio usuário

**Antes:**
```typescript
// Sempre criava novo usuário (causava duplicação)
await db.insert(personUserTable).values({...});
```

**Depois:**
```typescript
// Verifica se usuário existe e atualiza, ou cria se necessário
if (currentUserInDb.length > 0) {
  await db.update(personUserTable).set({...});
} else {
  await db.insert(personUserTable).values({
    clerkUserId, // Agora obrigatório
    ...
  });
}
```

### 5. Endpoints de Debug

Criados para diagnóstico (podem ser removidos depois):

- `GET /api/debug/check-user` - Verifica autenticação e existência do usuário
- `GET /api/debug/db-schema` - Inspeciona schema do banco
- `GET /api/debug/test-button-config?projectId=xxx` - Testa acesso a button_config

### 6. Limpeza

**Removido:** `src/app/actions/auth/create-account.ts`
- Função obsoleta que criava contas vazias
- Substituída pelo webhook do Clerk

## 🚀 Como Aplicar

### 1. Migração Já Aplicada no Staging ✅

A migração foi aplicada via `drizzle-kit push` no banco de staging.

### 2. Sincronizar Usuários Existentes

Depois do deploy, execute:

```bash
# Usando o script helper
./scripts/sync-clerk-users.sh

# Ou manualmente
curl -X POST https://staging-app.nepfy.com/api/sync/clerk-users
```

### 3. Para Produção (quando for fazer deploy)

```bash
# 1. Mudar .env para apontar para produção
# 2. Aplicar migração
npm run migrations  # Gera migration
npx drizzle-kit push  # Aplica no banco

# 3. Sincronizar usuários
curl -X POST https://app.nepfy.com/api/sync/clerk-users
```

## 🔄 Fluxo Completo

### Novo Usuário

1. **Usuário cria conta no Clerk** → Clerk dispara webhook `user.created`
2. **Webhook cria registro** em `person_user` com `clerkUserId`
3. **Usuário completa onboarding** → `saveUserData` **atualiza** o registro
4. **Usuário acessa dashboard** → Sistema encontra usuário via `clerkUserId`

### Usuário Existente (antes da migração)

1. **Já tem conta no Clerk**, mas não tem registro em `person_user`
2. **Admin executa** `/api/sync/clerk-users`
3. **Sistema cria** registros para todos os usuários do Clerk
4. **Próximo login** → Dashboard funciona normalmente

## 📊 Verificação

### Check 1: Migração Aplicada

```sql
-- Via SQL
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'person_user'
AND column_name = 'clerk_user_id';
```

Resultado esperado:
```
column_name    | data_type      | is_nullable
---------------|----------------|------------
clerk_user_id  | varchar(255)   | NO
```

### Check 2: Usuários Sincronizados

```sql
SELECT 
  COUNT(*) as total_users,
  COUNT(clerk_user_id) as users_with_clerk_id,
  COUNT(*) - COUNT(clerk_user_id) as missing_clerk_id
FROM person_user;
```

Resultado esperado: `missing_clerk_id` = 0

### Check 3: Dashboard Funciona

1. Login no staging: https://staging-app.nepfy.com/login
2. Acessar dashboard: https://staging-app.nepfy.com/dashboard
3. ✅ Deve carregar sem erro "Usuário não encontrado"

## 🐛 Troubleshooting

### Erro: "Usuário não encontrado"

**Causa:** Usuário no Clerk, mas não em `person_user`

**Solução:**
```bash
curl -X POST https://staging-app.nepfy.com/api/sync/clerk-users
```

### Webhook não está funcionando

**Verificar:**
1. `CLERK_WEBHOOK_SECRET` está configurado no Vercel
2. Webhook URL está configurado no Clerk Dashboard
3. Eventos `user.created`, `user.updated`, `user.deleted` estão habilitados

**URL do Webhook:**
```
https://staging-app.nepfy.com/api/webhooks/clerk
```

### Erro no Onboarding: "clerkUserId is required"

**Causa:** Webhook não criou usuário ainda

**Solução:** O código tem fallback automático. Se persistir:
```bash
# Forçar sincronização
curl -X POST https://staging-app.nepfy.com/api/sync/clerk-users
```

## 📝 Commits

1. `4df8760` - feat: Add user authentication debug endpoint
2. `4752166` - fix: Adiciona clerk_user_id à tabela person_user e corrige webhook
3. `4886067` - fix: Corrige integração completa do clerk_user_id

## ✅ Status

- ✅ Schema atualizado
- ✅ Migração aplicada no staging
- ✅ Webhook configurado
- ✅ Onboarding refatorado
- ✅ Build passando
- ✅ Deploy em progresso

## 🔜 Próximos Passos

1. Aguardar deploy no Vercel
2. Executar sincronização de usuários: `./scripts/sync-clerk-users.sh`
3. Testar login e dashboard
4. (Opcional) Remover endpoints de debug se tudo estiver funcionando
5. Aplicar no ambiente de produção quando pronto

## 📚 Referências

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks)
- [Drizzle Kit Push](https://orm.drizzle.team/kit-docs/commands#push)
- Documentação interna: `docs/CLERK_STRIPE_SYNC.md`

