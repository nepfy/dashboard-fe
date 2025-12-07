# ⚠️ IMPORTANTE: Criar Usuário de Teste

O teste E2E falhou porque o usuário de teste não foi encontrado ou as credenciais estão incorretas.

## 📝 Passos para criar o usuário de teste:

### Opção 1: Via Clerk Dashboard (se usando Clerk)

1. Acesse: https://dashboard.clerk.com/
2. Selecione seu aplicativo Nepfy
3. Vá em **Users** → **Create User**
4. Preencha:
   ```
   Email: teste.e2e@nepfy.com
   Password: TestPassword123!
   First Name: Teste
   Last Name: E2E
   ```
5. Clique em **Create**

### Opção 2: Via Interface da Aplicação (Recomendado)

1. Abra o navegador em: http://localhost:3000
2. Vá para **Criar conta** (http://localhost:3000/criar-conta)
3. Preencha o formulário:
   ```
   Nome: Teste
   Sobrenome: E2E
   Email: teste.e2e@nepfy.com
   Senha: TestPassword123!
   ```
4. Confirme o email se necessário
5. Faça logout

### Opção 3: Via Banco de Dados (Desenvolvimento)

Se você tem acesso direto ao banco:

```sql
-- Verificar se usuário existe
SELECT * FROM users WHERE email = 'teste.e2e@nepfy.com';

-- Se precisar criar manualmente, use a interface ou Clerk
```

## ✅ Verificar se o usuário foi criado

Teste o login manualmente:

1. Abra: http://localhost:3000/login
2. Email: `teste.e2e@nepfy.com`
3. Senha: `TestPassword123!`
4. Clique em "Acessar conta"

Se funcionar, o usuário está criado corretamente! 

## 🚀 Depois de criar, execute:

```bash
npm run test:e2e:visual:headed
```

---

## 🐛 Se continuar falhando:

1. **Verifique as variáveis de ambiente:**
   ```bash
   echo $TEST_USER_EMAIL
   echo $TEST_USER_PASSWORD
   ```

2. **Tente com outro email:**
   Edite `e2e/fixtures/auth.fixture.ts` e mude:
   ```typescript
   process.env.TEST_USER_EMAIL || 'SEU_EMAIL@exemplo.com'
   process.env.TEST_USER_PASSWORD || 'SUA_SENHA'
   ```

3. **Verifique os logs do servidor:**
   O servidor dev deve mostrar tentativas de login.

4. **Verifique se o Clerk está configurado:**
   ```bash
   echo $CLERK_SECRET_KEY
   echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   ```

