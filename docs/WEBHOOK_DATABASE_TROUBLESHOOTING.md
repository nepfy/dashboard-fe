# Troubleshooting: Webhook usando banco de dados errado

## Problema

O webhook do Stripe está procurando usuários no banco de dados errado. Por exemplo:
- Usuário `user_35LL2WBRsOrbxbWEa1lIi9OYdJS` existe no STAGING
- Mas o webhook está procurando no banco de PRODUÇÃO

## Causa

O webhook do Stripe está usando a variável `DATABASE_URL` do ambiente onde está rodando. Se o webhook está configurado para apontar para uma URL de produção, mas o usuário está no staging, ocorre o erro.

## Solução

### 1. Verificar qual banco o webhook está usando

Os logs agora mostram qual banco está sendo usado:

```
[Webhook Init] Using database at: <hostname>
[DB Debug] Looking for user <clerkUserId> in database at <hostname>
```

### 2. Verificar configuração do webhook no Stripe Dashboard

1. Acesse o [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Encontre o webhook endpoint configurado
3. Verifique a URL do endpoint:
   - **Staging**: `https://staging-app.nepfy.com/api/webhooks/stripe`
   - **Production**: `https://app.nepfy.com/api/webhooks/stripe` (ou seu domínio de produção)

### 3. Verificar variáveis de ambiente no Vercel

#### Para Staging:
1. Acesse [Vercel Dashboard](https://vercel.com)
2. Vá para o projeto **staging**
3. Settings > Environment Variables
4. Verifique que `DATABASE_URL` aponta para o banco de **STAGING**

#### Para Production:
1. Acesse [Vercel Dashboard](https://vercel.com)
2. Vá para o projeto **production**
3. Settings > Environment Variables
4. Verifique que `DATABASE_URL` aponta para o banco de **PRODUCTION**

### 4. Configurar webhooks separados por ambiente

**Recomendação**: Configure webhooks separados no Stripe para cada ambiente:

#### Webhook Staging:
- **URL**: `https://staging-app.nepfy.com/api/webhooks/stripe`
- **Secret**: `STRIPE_WEBHOOK_SECRET_STAGING` (variável de ambiente no Vercel staging)
- **Eventos**: Todos os eventos necessários

#### Webhook Production:
- **URL**: `https://app.nepfy.com/api/webhooks/stripe` (ou seu domínio)
- **Secret**: `STRIPE_WEBHOOK_SECRET_PRODUCTION` (variável de ambiente no Vercel production)
- **Eventos**: Todos os eventos necessários

### 5. Verificar logs para confirmar

Após configurar corretamente, os logs devem mostrar:

```
[Webhook Init] Using database at: <hostname-do-banco-staging>
[DB Debug] Looking for user user_35LL2WBRsOrbxbWEa1lIi9OYdJS in database at <hostname-do-banco-staging>
[DB Debug] Found user user_35LL2WBRsOrbxbWEa1lIi9OYdJS in database at <hostname-do-banco-staging>
```

## Checklist de Verificação

- [ ] Webhook do Stripe aponta para a URL correta (staging ou production)
- [ ] `DATABASE_URL` no Vercel está correto para cada ambiente
- [ ] `STRIPE_WEBHOOK_SECRET` está correto para cada ambiente
- [ ] Logs mostram o hostname correto do banco de dados
- [ ] Usuário existe no banco de dados correto

## Como identificar qual banco está sendo usado

Os logs agora incluem o hostname do banco. Compare com:

- **Staging DB**: Hostname deve conter algo relacionado a staging
- **Production DB**: Hostname deve conter algo relacionado a production

## Próximos passos

1. Verifique os logs do webhook para ver qual `dbHost` está sendo usado
2. Compare com o hostname do banco onde o usuário realmente existe
3. Se não corresponder, ajuste a variável `DATABASE_URL` no Vercel para o ambiente correto
4. Ou configure webhooks separados no Stripe para cada ambiente

