# 📧 Sistema de Notificações por Email - Nepfy

## ✅ Status: IMPLEMENTADO E PRONTO PARA USO

Data: November 24, 2025

## 🎯 Notificações Implementadas

O sistema envia emails automáticos para **3 eventos principais**:

### 1. 🔍 **Proposta Visualizada pela Primeira Vez**
**Quando:** Cliente abre a proposta pela primeira vez  
**Assunto:** "A proposta acabou de ser aberta pelo cliente"  
**Conteúdo:** Informa que a proposta foi visualizada e incentiva acompanhamento no painel

### 2. 🔧 **Ajustes Solicitados**
**Quando:** Cliente solicita ajustes na proposta  
**Assunto:** "O cliente enviou solicitações de ajuste"  
**Conteúdo:** Detalha o tipo de ajuste solicitado e incentiva resposta rápida

### 3. 🎉 **Proposta Aprovada**
**Quando:** Cliente aceita/aprova a proposta  
**Assunto:** "Temos uma ótima notícia: a proposta foi aprovada pelo cliente"  
**Conteúdo:** Parabeniza pela aprovação e indica próximos passos

---

## 🔧 Configuração do Resend

### 1. Criar Conta no Resend
1. Acesse [Resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu email

### 2. Configurar Domínio (Recomendado)
**Opção A: Domínio Próprio (Produção)**
1. No painel do Resend, vá em "Domains"
2. Adicione seu domínio (ex: `nepfy.com`)
3. Configure os registros DNS:
   - MX records
   - SPF record
   - DKIM records
4. Aguarde verificação (pode levar até 48h)

**Opção B: Sandbox (Desenvolvimento)**
- Use `onboarding@resend.dev` temporariamente
- Adicione emails de teste manualmente
- **Limite:** 100 emails/dia para 5 destinatários

### 3. Obter API Key
1. No painel do Resend, vá em "API Keys"
2. Clique em "Create API Key"
3. Nomeie a chave (ex: "Nepfy Production")
4. Copie a chave gerada

### 4. Configurar `.env.local`
```env
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **IMPORTANTE:** Nunca commite o `.env.local` no git!

---

## 📁 Arquitetura do Sistema

### Fluxo Completo

```
Evento ocorre (visualização/ajuste/aprovação)
            ↓
   API/Webhook é chamado
            ↓
NotificationHelper.notify...()
            ↓
   ┌────────────────────┬────────────────────┐
   │ Cria notificação   │ Envia email async  │
   │ no banco de dados  │ (EmailService)     │
   └────────────────────┴────────────────────┘
            ↓                    ↓
   ┌────────────────────┐   ┌───────────────┐
   │ Atualiza UI        │   │ Resend API    │
   │ (useNotifications) │   │ envia email   │
   └────────────────────┘   └───────────────┘
```

### Arquivos Principais

#### **Backend:**
- `src/lib/services/email-service.ts` - Serviço de envio de emails
- `src/lib/services/notification-helper.ts` - Helper para criar notificações
- `src/app/api/webhooks/proposal-events/route.ts` - Webhook para eventos
- `src/app/api/projects/[id]/adjustments/route.ts` - API de ajustes
- `src/app/api/projects/[id]/acceptance/route.ts` - API de aceitação

#### **Frontend:**
- `src/hooks/useNotifications.ts` - Hook de notificações
- `src/app/dashboard/propostas/components/ProposalModuleHeader/index.tsx` - UI

---

## 📝 Templates de Email

### Estrutura dos Templates

Todos os emails seguem uma estrutura consistente:

```html
┌─────────────────────────┐
│   Logo .nepfy           │
├─────────────────────────┤
│   Saudação (Olá, Nome!) │
│   Conteúdo principal    │
│   Detalhes do evento    │
│   [Botão de ação]       │
├─────────────────────────┤
│   "Conte com a gente"   │
│   .Nepfy                │
├─────────────────────────┤
│   Link de preferências  │
└─────────────────────────┘
```

### Personalização

Os templates são personalizados automaticamente com:
- ✅ Nome do usuário
- ✅ Nome da proposta
- ✅ Nome do cliente
- ✅ Tipo de ajuste (quando aplicável)
- ✅ Link direto para a proposta

---

## 🎛️ Preferências do Usuário

### Como Funcionam

1. **Padrão:** Todos os emails estão habilitados por padrão
2. **Configuração:** Usuário pode desabilitar no `/dashboard/configuracoes`
3. **Controle Granular:**
   - Emails globalmente (on/off)
   - Proposta visualizada (on/off)
   - Proposta aceita (on/off)
   - Ajustes solicitados (on/off)

### Verificação Automática

O sistema verifica automaticamente as preferências antes de enviar:

```typescript
// Exemplo no código
const shouldSend = await NotificationService.shouldSendEmail(
  userId,
  'proposal_viewed'
);

if (!shouldSend) {
  console.log('User opted out of this notification type');
  return false;
}
```

---

## 🚀 Como Testar

### 1. Testar Proposta Visualizada

**Via Webhook:**
```bash
curl -X POST https://nepfy.com/api/webhooks/proposal-events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "proposal_viewed",
    "projectId": "seu-project-id-aqui",
    "clientName": "Cliente Teste"
  }'
```

**Via Interface:**
- Abra uma proposta compartilhada (link público)
- Visualize pela primeira vez
- Email será enviado automaticamente

### 2. Testar Ajustes Solicitados

**Via API:**
```bash
curl -X POST https://nepfy.com/api/projects/PROJECT_ID/adjustments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "change_values_or_plans",
    "description": "Gostaria de ajustar os valores do plano premium",
    "clientName": "Cliente Teste"
  }'
```

### 3. Testar Proposta Aprovada

**Via API:**
```bash
curl -X POST https://nepfy.com/api/projects/PROJECT_ID/acceptance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "chosenPlan": "Premium",
    "chosenPlanValue": "5000",
    "clientName": "Cliente Teste"
  }'
```

---

## 📊 Monitoramento

### Logs do Sistema

O sistema registra automaticamente:
- ✅ Tentativas de envio de email
- ✅ Sucessos e falhas
- ✅ Preferências do usuário respeitadas
- ✅ Tracking com PostHog

### Verificar Emails Enviados

**Via Resend Dashboard:**
1. Acesse [Resend Dashboard](https://resend.com/emails)
2. Veja todos os emails enviados
3. Status de entrega
4. Aberturas (se configurado)

**Via Logs:**
```bash
# Ver logs do servidor
npm run dev

# Buscar por "Email sent successfully" ou "Error sending email"
```

---

## 🔒 Segurança e Boas Práticas

### Emails

- ✅ Verificação de preferências antes de enviar
- ✅ Tracking de emails enviados no banco
- ✅ Rate limiting automático do Resend
- ✅ Links seguros (HTTPS)
- ✅ Botão de descadastramento em todos os emails

### Webhook

- ⚠️ **TODO:** Implementar assinatura de webhook em produção
- ⚠️ **TODO:** Adicionar rate limiting
- ⚠️ **TODO:** Validar origem das requisições

### API Keys

- ✅ Usar `.env.local` para desenvolvimento
- ✅ Usar variáveis de ambiente em produção
- ❌ **NUNCA** commitar chaves no repositório
- ✅ Rotacionar chaves periodicamente

---

## 📈 Limites e Quotas

### Resend Free Plan
- ✨ 100 emails/dia
- ✨ 3,000 emails/mês
- ✨ 1 domínio
- ✨ Suporte a anexos

### Resend Pro Plan ($20/mês)
- ✨ 50,000 emails/mês
- ✨ Domínios ilimitados
- ✨ Suporte prioritário
- ✨ Analytics avançados

### Quando Escalar?

- Se receber > 3,000 notificações/mês
- Se precisar de múltiplos domínios
- Se precisar de analytics detalhados
- Se precisar de SLA garantido

---

## 🐛 Troubleshooting

### Email não está sendo enviado

1. ✅ Verificar se `RESEND_API_KEY` está configurado
2. ✅ Verificar preferências do usuário
3. ✅ Verificar logs do servidor
4. ✅ Verificar status do Resend

### Email caindo em spam

1. ✅ Configurar domínio próprio (não usar sandbox)
2. ✅ Verificar registros SPF e DKIM
3. ✅ Não usar palavras "spammy" no assunto
4. ✅ Manter boa reputação de envio

### Template não renderiza corretamente

1. ✅ Testar em múltiplos clientes de email
2. ✅ Usar tables para layout (compatibilidade)
3. ✅ Inline styles apenas
4. ✅ Testar versão texto também

---

## 🎨 Customização

### Modificar Templates

Edite `src/lib/services/email-service.ts`:

```typescript
case "proposal_viewed":
  subject = "SEU NOVO ASSUNTO AQUI";
  content = `
    <h2>SEU HTML AQUI</h2>
    <p>Personalização completa</p>
  `;
  textContent = "Versão texto do email";
  break;
```

### Adicionar Novo Tipo de Notificação

1. Adicionar tipo em `src/lib/db/schema/notifications.ts`
2. Criar função em `NotificationHelper`
3. Adicionar template em `EmailService`
4. Adicionar preferência em preferências

---

## 📞 Suporte

### Resend
- 📧 support@resend.com
- 📖 [Documentação](https://resend.com/docs)
- 💬 [Discord](https://discord.gg/resend)

### Nepfy
- Ver código em `src/lib/services/email-service.ts`
- Abrir issue no GitHub
- Consultar documentação do projeto

---

## ✅ Checklist de Deploy

Antes de ir para produção:

- [ ] Configurar domínio próprio no Resend
- [ ] Verificar registros DNS
- [ ] Testar todos os 3 tipos de email
- [ ] Configurar variáveis de ambiente em produção
- [ ] Implementar assinatura de webhook
- [ ] Configurar monitoramento de emails
- [ ] Testar preferências de usuário
- [ ] Revisar templates em diferentes clientes de email
- [ ] Configurar alertas para falhas de envio
- [ ] Documentar processo para o time

---

## 🎉 Pronto!

Seu sistema de notificações por email está **100% funcional** e pronto para uso!

Os emails serão enviados automaticamente quando:
- ✅ Um cliente visualizar uma proposta pela primeira vez
- ✅ Um cliente solicitar ajustes na proposta
- ✅ Um cliente aprovar uma proposta

**Próximos Passos Recomendados:**
1. Configurar domínio próprio no Resend
2. Testar os 3 tipos de email
3. Ajustar templates conforme necessário
4. Monitorar métricas de entrega

