# 🚀 Guia Rápido - Sistema de Notificações

## Instalação e Configuração (5 minutos)

### 1️⃣ Aplicar Migrations ao Banco de Dados

```bash
# Na raiz do projeto
npm run migrations  # Gera as migrations
npm run migrate     # Aplica ao banco
```

✅ Isso criará as tabelas `notifications` e `notification_preferences`

### 2️⃣ Configurar Email (Resend)

1. Acesse [resend.com](https://resend.com) e crie uma conta
2. Verifique seu domínio (ou use sandbox para testes)
3. Obtenha sua API Key
4. Adicione ao `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Nota:** Sem a API key, as notificações funcionarão normalmente, mas emails não serão enviados.

### 3️⃣ Verificar se está funcionando

1. **Start o servidor:**
```bash
npm run dev
```

2. **Acesse o dashboard:**
```
http://localhost:3000/dashboard
```

3. **Veja o ícone de notificações** na topnav (sino) ✅

## 🧪 Testar o Sistema

### Opção 1: Criar Notificação via API

Use um cliente REST (Insomnia, Postman, Thunder Client):

```bash
# Você precisa estar autenticado
# Use o token do Clerk no header

POST http://localhost:3000/api/notifications/test
Content-Type: application/json

{
  "type": "system_announcement",
  "title": "Teste de Notificação",
  "message": "Esta é uma notificação de teste!"
}
```

### Opção 2: Simular Evento de Proposta

```bash
# Com um projeto existente
POST http://localhost:3000/api/webhooks/proposal-events
Content-Type: application/json

{
  "event": "proposal_viewed",
  "projectId": "seu-project-id",
  "clientName": "Cliente Teste"
}
```

### Opção 3: Script de Teste

Crie um arquivo `src/scripts/test-notifications.ts`:

```typescript
import { NotificationHelper } from '#/lib/services/notification-helper';

async function test() {
  // Substitua com seu user ID
  const userId = 'seu-user-id-aqui';
  
  await NotificationHelper.notifyProposalViewed(
    userId,
    'project-123',
    'Proposta de Teste',
    'Cliente Teste'
  );
  
  console.log('✅ Notificação criada!');
}

test();
```

Execute:
```bash
npx tsx src/scripts/test-notifications.ts
```

## ✅ Checklist de Verificação

- [ ] Migrations aplicadas ao banco
- [ ] Ícone de sino aparece na topnav
- [ ] Contador de notificações funciona
- [ ] Consegue abrir o centro de notificações
- [ ] Consegue marcar notificação como lida
- [ ] Consegue deletar notificação
- [ ] Email configurado (opcional)
- [ ] Teste de notificação funcionou

## 🎯 Próximos Passos

### Integrar com Seus Eventos

1. **Quando cliente visualiza proposta:**

```typescript
// Em src/app/[subdomain]/page.tsx ou onde renderiza a proposta
import { NotificationHelper } from '#/lib/services/notification-helper';

// No useEffect ou onMount
await fetch('/api/webhooks/proposal-events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'proposal_viewed',
    projectId: project.id,
    clientName: project.clientName
  })
});
```

2. **Quando status de proposta muda:**

```typescript
import { NotificationHelper } from '#/lib/services/notification-helper';

// Após atualizar status
if (newStatus === 'approved') {
  await NotificationHelper.notifyProposalAccepted(
    userId,
    projectId,
    projectName,
    clientName
  );
}
```

3. **Configurar Cron para Expiração:**

```bash
# Em seu servidor ou Vercel Cron
0 9,18 * * * cd /path/to/nepfy && npm run check-expiring-proposals
```

## 🐛 Problemas Comuns

### "Não vejo notificações"
- ✅ Verifique se está logado
- ✅ Abra o console do navegador (F12)
- ✅ Verifique se a API retorna dados: `GET /api/notifications`

### "Emails não chegam"
- ✅ Verifique `RESEND_API_KEY` no `.env.local`
- ✅ Verifique se domínio está verificado no Resend
- ✅ Cheque logs do servidor
- ✅ Verifique preferências do usuário

### "Erro ao aplicar migration"
- ✅ Verifique conexão com banco
- ✅ Verifique `DATABASE_URL` no `.env.local`
- ✅ Execute `npm run migrations` novamente

## 📚 Documentação Completa

Veja: `docs/NOTIFICATIONS_SYSTEM.md`

## 💡 Dicas

1. **Use o PostHog** para acompanhar engajamento
2. **Configure cron jobs** para notificações automáticas
3. **Customize templates** de email no `EmailService`
4. **Adicione novos tipos** de notificação conforme necessário

## 🎉 Pronto!

Seu sistema de notificações está configurado e funcionando!

Para dúvidas, consulte a documentação completa ou entre em contato com a equipe.

---

**Tempo estimado de setup:** 5-10 minutos  
**Última atualização:** November 2025

