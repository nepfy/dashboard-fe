# Configuração do PostHog

## Credenciais do Projeto

Com base na imagem compartilhada, aqui estão as credenciais do seu projeto PostHog:

- **Project API Key**: `phc_X2LTDMyVolYLABT1iKNR3Y7PFimsaIhNLZqUIK@vz8r`
- **Project ID**: `239550`
- **Project Region**: US Cloud

## Configuração das Variáveis de Ambiente

### Para desenvolvimento local

Crie ou edite o arquivo `.env.local` na raiz do projeto:

```bash
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_X2LTDMyVolYLABT1iKNR3Y7PFimsaIhNLZqUIK@vz8r
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Para produção (Vercel)

Adicione as mesmas variáveis nas configurações do projeto no Vercel:

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - `NEXT_PUBLIC_POSTHOG_KEY` = `phc_X2LTDMyVolYLABT1iKNR3Y7PFimsaIhNLZqUIK@vz8r`
   - `NEXT_PUBLIC_POSTHOG_HOST` = `https://app.posthog.com`

## Verificação

Após configurar:

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse o PostHog → **Live Events** (https://app.posthog.com/events/live)
3. Navegue pelo app (faça login, complete onboarding, etc.)
4. Você deverá ver os eventos aparecendo em tempo real no PostHog

## Eventos Implementados

### ✅ Já funcionando:

- `onboarding_started`
- `onboarding_question_answered`
- `onboarding_completed`
- `dashboard_viewed`
- `dashboard_tab_clicked`
- `proposal_clicked`
- `proposal_creation_started`
- `proposal_ai_generation_requested`
- `proposal_ai_generation_completed`

### ⏳ Próximos eventos a implementar:

Ver `POSTHOG_IMPLEMENTATION.md` para detalhes dos eventos pendentes.

