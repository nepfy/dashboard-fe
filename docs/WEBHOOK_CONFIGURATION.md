# Configuração de Webhooks e Alertas - Stripe

Este documento descreve a configuração recomendada dos webhooks do Stripe e os alertas que devem ser configurados para garantir o funcionamento correto do sistema de assinaturas.

## Eventos Obrigatórios no Stripe Dashboard

Configure estes eventos no Stripe Dashboard (Webhooks > Adicionar endpoint):

### Eventos Críticos (Obrigatórios)

1. **`checkout.session.completed`**
   - Quando: Checkout é concluído com sucesso
   - Uso: Vincula subscription ao usuário e sincroniza com Clerk/DB
   - Prioridade: **CRÍTICA**

2. **`payment_intent.succeeded`**
   - Quando: Pagamento é processado com sucesso
   - Uso: Ativa subscription e atualiza status
   - Prioridade: **CRÍTICA**

3. **`invoice.payment_succeeded`**
   - Quando: Invoice é pago com sucesso
   - Uso: Confirma pagamento e sincroniza subscription
   - Prioridade: **CRÍTICA**

4. **`invoice_payment.paid`**
   - Quando: Formato alternativo do evento acima
   - Uso: Mesmo que `invoice.payment_succeeded`
   - Prioridade: **CRÍTICA**

5. **`customer.subscription.created`**
   - Quando: Subscription é criada
   - Uso: Sincroniza subscription inicial
   - Prioridade: **ALTA**

6. **`customer.subscription.updated`**
   - Quando: Subscription é atualizada (status, plano, etc)
   - Uso: Mantém dados sincronizados
   - Prioridade: **ALTA**

7. **`customer.subscription.deleted`**
   - Quando: Subscription é cancelada
   - Uso: Atualiza status no sistema
   - Prioridade: **ALTA**

8. **`subscription_schedule.updated`**
   - Quando: Schedule da subscription é atualizado
   - Uso: Atualiza metadata do usuário
   - Prioridade: **MÉDIA**

### Eventos Recomendados para Monitoramento

1. **`payment_intent.payment_failed`**
   - Quando: Falha no pagamento
   - Uso: Notificar usuário e registrar falha
   - Prioridade: **MÉDIA**

2. **`invoice.payment_failed`**
   - Quando: Falha no pagamento da invoice
   - Uso: Atualizar status e notificar
   - Prioridade: **MÉDIA**

3. **`customer.subscription.trial_will_end`**
   - Quando: Trial está prestes a acabar
   - Uso: Enviar notificação ao usuário
   - Prioridade: **BAIXA**

4. **`customer.subscription.past_due`**
   - Quando: Subscription está em atraso
   - Uso: Notificar e tentar cobrança
   - Prioridade: **MÉDIA**

## Configuração do Endpoint

### URL do Webhook
```
https://seu-dominio.com/api/webhooks/stripe
```

### Versão da API do Stripe
Recomendado: **Versão mais recente estável**

### Método de Autenticação
- Usar **Stripe Signature** (padrão)
- Configurar `STRIPE_WEBHOOK_SECRET` nas variáveis de ambiente

## Alertas Recomendados

### 1. Alertas Críticos (Email/Slack)

Configure alertas para os seguintes cenários:

#### Webhook Retornando Erro 500
- **Condição**: Mais de 3 falhas consecutivas em 5 minutos
- **Ação**: Enviar alerta imediato para equipe técnica
- **Configuração**: No Stripe Dashboard > Webhooks > [Seu endpoint] > Alertas

#### Subscription Criada Sem `user_id` no Metadata
- **Condição**: Subscription ativa sem `user_id` no metadata após 5 minutos
- **Ação**: Criar ticket para investigação manual
- **Monitoramento**: Query no Stripe ou script de verificação

#### Customer Sem `clerkUserId` no Metadata
- **Condição**: Customer criado sem `clerkUserId` após checkout completo
- **Ação**: Log de warning e tentativa de correção automática
- **Monitoramento**: Logs do webhook

#### Falha ao Sincronizar Subscription
- **Condição**: Erro ao sincronizar subscription para Clerk/DB
- **Ação**: Alertar equipe e registrar erro
- **Monitoramento**: Logs do webhook com stack trace

### 2. Alertas de Warning

#### Webhook Retornando Erro 400
- **Condição**: Erro de validação (bad request)
- **Ação**: Verificar logs e corrigir payload
- **Frequência**: Diária

#### Subscription Sem `user_id` Encontrada
- **Condição**: Busca por email falhou ao encontrar usuário
- **Ação**: Verificar se email está correto no Clerk
- **Monitoramento**: Logs do webhook

#### Múltiplos Usuários com Mesmo Email
- **Condição**: Mais de um usuário encontrado com mesmo email
- **Ação**: Investigar duplicação de contas
- **Monitoramento**: Logs do webhook

### 3. Métricas de Monitoramento

Configure dashboards para acompanhar:

#### Taxa de Sucesso dos Webhooks
- **Meta**: > 99%
- **Medição**: (Sucessos / Total) * 100
- **Alerta**: Se < 95% por mais de 1 hora

#### Tempo Médio de Processamento
- **Meta**: < 2 segundos
- **Medição**: Tempo entre recebimento e resposta 200
- **Alerta**: Se > 5 segundos consistentemente

#### Subscriptions Órfãs
- **Condição**: Subscription sem `user_id` após 1 hora
- **Ação**: Script de correção automática ou manual
- **Frequência**: Verificação diária

#### Customers Sem `clerkUserId`
- **Condição**: Customer criado sem `clerkUserId` no metadata
- **Ação**: Script de correção automática
- **Frequência**: Verificação diária

## Checklist de Validação

Após configurar os webhooks, validar:

- [ ] Todos os eventos obrigatórios estão configurados
- [ ] Webhook está respondendo com status 200 para eventos de teste
- [ ] `STRIPE_WEBHOOK_SECRET` está configurado corretamente
- [ ] Logs estão sendo gerados corretamente
- [ ] Customer tem `clerkUserId` no metadata após checkout
- [ ] Subscription tem `user_id` no metadata após checkout
- [ ] Clerk metadata tem `customerId` atualizado
- [ ] Banco de dados tem subscription vinculada ao usuário correto
- [ ] Alertas estão configurados e funcionando

## Scripts de Verificação

### Verificar Subscriptions Órfãs

```typescript
// Script para encontrar subscriptions sem user_id
const subscriptions = await stripe.subscriptions.list({
  status: 'active',
  limit: 100,
});

const orphaned = subscriptions.data.filter(
  (sub) => !sub.metadata?.user_id
);

console.log(`Found ${orphaned.length} orphaned subscriptions`);
```

### Verificar Customers Sem clerkUserId

```typescript
// Script para encontrar customers sem clerkUserId
const customers = await stripe.customers.list({
  limit: 100,
});

const withoutClerkId = customers.data.filter(
  (customer) => !customer.metadata?.clerkUserId
);

console.log(`Found ${withoutClerkId.length} customers without clerkUserId`);
```

## Troubleshooting

### Webhook Retornando 500

1. Verificar logs do servidor
2. Verificar se `STRIPE_WEBHOOK_SECRET` está correto
3. Verificar se todas as dependências estão disponíveis (Clerk, DB)
4. Verificar se o usuário existe no banco de dados

### Subscription Não Sendo Vinculada ao Usuário

1. Verificar se `userId` está sendo enviado no metadata do checkout session
2. Verificar se o email do customer corresponde ao email no Clerk
3. Verificar logs do webhook para ver qual etapa está falhando
4. Verificar se o usuário existe no banco de dados

### Customer Sem clerkUserId

1. Verificar se o webhook `checkout.session.completed` está sendo processado
2. Verificar logs para ver se a atualização do customer está sendo executada
3. Executar script de correção manual se necessário

## Manutenção

### Verificações Diárias

- [ ] Revisar logs de webhooks com erro
- [ ] Verificar subscriptions órfãs
- [ ] Verificar customers sem clerkUserId
- [ ] Revisar métricas de performance

### Verificações Semanais

- [ ] Revisar taxa de sucesso dos webhooks
- [ ] Analisar padrões de erro
- [ ] Atualizar documentação se necessário
- [ ] Revisar e ajustar alertas

### Verificações Mensais

- [ ] Auditoria completa de subscriptions
- [ ] Revisar e otimizar queries
- [ ] Atualizar versão da API do Stripe se necessário
- [ ] Revisar e melhorar scripts de correção

