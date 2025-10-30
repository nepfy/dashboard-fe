# Implementação de Tracking PostHog - Resumo

## Status da Implementação

### ✅ Concluído

1. **Instalação e Configuração Base**
   - PostHog instalado (`posthog-js`)
   - Provider criado (`PostHogProvider.tsx`)
   - Utilitários de tracking criados (`track.ts`, `events.ts`, `posthog.ts`)

2. **Onboarding**
   - ✅ `onboarding_started` - Quando a página é carregada
   - ✅ `onboarding_question_answered` - Quando passa para o próximo passo
   - ✅ `onboarding_completed` - Quando completa o onboarding com todos os dados

3. **Dashboard**
   - ✅ `dashboard_viewed` - Quando a página do dashboard é carregada
   - ✅ `dashboard_tab_clicked` - Quando clica em "Propostas" no sidebar
   - ✅ `proposal_clicked` - Quando clica em "Editar" uma proposta

4. **Criação de Propostas com IA**
   - ✅ `proposal_creation_started` - Quando a página de geração é carregada
   - ✅ `proposal_ai_generation_requested` - Quando solicita a geração
   - ✅ `proposal_ai_generation_completed` - Quando a geração é concluída (sucesso ou erro)

### ⏳ Pendente (Implementação Necessária)

5. **Editor, Publicação e Compartilhamento**
   - ⏳ `editor_opened` - Quando abre o editor (`/editar`)
   - ⏳ `editor_text_edited` - Quando edita textos (pode ser debounced)
   - ⏳ `editor_settings_changed` - Quando muda configurações
   - ⏳ `proposal_published` - Quando publica a proposta (atualiza `isPublished: true`)
   - ⏳ `proposal_shared` - Quando copia/compartilha link

6. **Interações com Clientes**
   - ⏳ `proposal_viewed_by_client` - Quando um cliente visualiza a proposta (via subdomain)
   - ⏳ `proposal_feedback_received` - Quando recebe feedback (se houver API/sistema de feedback)
   - ⏳ `proposal_accepted` - Quando uma proposta é aceita (muda status para "approved")

7. **Planos e Retenção**
   - ⏳ `plan_trial_started` - Quando inicia um trial
   - ⏳ `plan_upgraded` - Quando faz upgrade (webhook Stripe ou checkout completion)
   - ⏳ `plan_limit_reached` - Quando atinge limite do plano
   - ⏳ `plan_canceled` - Quando cancela plano (webhook Stripe)

8. **Identificação de Usuário**
   - ✅ Implementado no `PostHogProvider` - identifica automaticamente quando o usuário é carregado

## Variáveis de Ambiente Necessárias

Adicione estas variáveis ao seu `.env.local` ou `.env`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=ph_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # ou sua instância self-hosted
```

## Como Completar a Implementação

### 1. Editor e Publicação

**Localização:** `src/app/editar/`

Adicionar tracking em:

- Página de edição: `trackEditorOpened()` quando carrega
- Ao salvar mudanças: `trackEditorTextEdited()` ou `trackEditorSettingsChanged()`
- Ao publicar: `trackProposalPublished()` (verificar onde `isPublished` é atualizado para `true`)
- Ao copiar link: `trackProposalShared()` (já existe `handleCopyLink` em vários lugares)

### 2. Interações com Clientes

**Localização:** `src/app/project/` (subdomain pages)

Adicionar tracking em:

- Quando a proposta é visualizada: verificar se existe middleware ou API que detecta visualização
- Status changes: quando status muda para "approved", chamar `trackProposalAccepted()`

### 3. Planos

**Localização:**

- Webhooks: `src/app/api/webhooks/stripe/route.ts`
- Checkout: `src/app/api/stripe/create-checkout-session/route.ts`
- Página de planos: `src/app/planos/page.tsx`

Adicionar tracking em:

- Webhook `checkout.session.completed`: `trackPlanUpgraded()`
- Webhook `customer.subscription.deleted`: `trackPlanCanceled()`
- Quando atinge limite: verificar onde há validação de limites do plano

### 4. Feedback da IA

**Localização:** Onde houver sistema de feedback/rating após geração

Se não existir, pode ser adicionado no componente `FinalStep` ou após geração bem-sucedida.

## Testando

1. Adicione as variáveis de ambiente
2. Abra o painel PostHog Live Events
3. Navegue pelo app e verifique se os eventos aparecem
4. Verifique que os usuários estão sendo identificados corretamente

## Próximos Passos Recomendados

1. Implementar eventos pendentes listados acima
2. Criar dashboards no PostHog conforme documentação fornecida
3. Adicionar propriedades extras nos eventos conforme necessário
4. Integrar com Stripe para cruzar dados de receita (fase 2)
5. Configurar automações baseadas em eventos (ex: email para quem não completou publicação)
