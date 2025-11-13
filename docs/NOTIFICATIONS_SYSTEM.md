# Sistema de Notificações Nepfy

## 📋 Visão Geral

Sistema completo de notificações em tempo real integrado à plataforma Nepfy, com suporte para notificações in-app e emails automáticos.

## 🎯 Objetivos Alcançados

- ✅ Centro de notificações na topnav
- ✅ Backend completo com API REST
- ✅ Eventos automáticos para propostas
- ✅ Integração com email (Resend)
- ✅ Tracking com PostHog
- ✅ Sistema de preferências
- ✅ Notificações em tempo real

## 📊 Arquitetura

### Database Schema

Duas tabelas principais:

#### `notifications`
- `id` - UUID único
- `user_id` - Referência ao usuário
- `project_id` - Referência ao projeto (opcional)
- `type` - Tipo de notificação
- `title` - Título da notificação
- `message` - Mensagem completa
- `metadata` - Dados adicionais (JSON)
- `is_read` - Status de leitura
- `read_at` - Data de leitura
- `email_sent` - Status de envio de email
- `email_sent_at` - Data de envio
- `action_url` - Link de ação
- `created_at`, `updated_at`, `deleted_at`

#### `notification_preferences`
- `id` - UUID único
- `user_id` - Referência ao usuário (único)
- `email_enabled` - Emails habilitados globalmente
- `email_proposal_viewed` - Email para proposta visualizada
- `email_proposal_accepted` - Email para proposta aceita
- `email_proposal_feedback` - Email para feedback
- `email_proposal_expiring` - Email para proposta expirando
- `email_payment_received` - Email para pagamento
- `in_app_*` - Mesmas preferências para in-app
- `created_at`, `updated_at`, `deleted_at`

### Tipos de Notificações

1. **`proposal_viewed`** - Cliente visualizou a proposta
2. **`proposal_accepted`** - Cliente aceitou a proposta
3. **`proposal_rejected`** - Cliente rejeitou a proposta
4. **`proposal_feedback`** - Cliente deixou feedback
5. **`proposal_expired`** - Proposta expirou
6. **`proposal_expiring_soon`** - Proposta expirando em breve
7. **`project_status_changed`** - Status do projeto mudou
8. **`payment_received`** - Pagamento recebido
9. **`subscription_updated`** - Assinatura atualizada
10. **`system_announcement`** - Anúncio do sistema

## 🔧 Componentes Implementados

### Backend

#### Services
- **`NotificationService`** (`src/lib/services/notification-service.ts`)
  - CRUD de notificações
  - Gerenciamento de preferências
  - Verificação de permissões

- **`NotificationHelper`** (`src/lib/services/notification-helper.ts`)
  - Criação simplificada de notificações
  - Integração automática com email
  - Tracking automático

- **`EmailService`** (`src/lib/services/email-service.ts`)
  - Envio de emails via Resend
  - Templates HTML responsivos
  - Sistema de retry

#### API Routes
- `GET /api/notifications` - Listar notificações
- `GET /api/notifications/unread-count` - Contador de não lidas
- `PATCH /api/notifications/[id]/read` - Marcar como lida
- `PATCH /api/notifications/mark-all-read` - Marcar todas como lidas
- `DELETE /api/notifications/[id]` - Deletar notificação
- `GET /api/notifications/preferences` - Obter preferências
- `PUT /api/notifications/preferences` - Atualizar preferências
- `POST /api/webhooks/proposal-events` - Webhook para eventos

### Frontend

#### Components
- **`Notifications`** (`src/app/dashboard/components/Notifications/index.tsx`)
  - Centro de notificações completo
  - Interface responsiva
  - Indicadores visuais de não lidas
  - Ações inline (marcar como lida, deletar)

#### Hooks
- **`useNotifications`** (`src/hooks/useNotifications.ts`)
  - Gerenciamento de estado
  - Polling automático (30s)
  - Cache local
  - Refetch manual

#### Navbar Integration
- Ícone de notificações com badge
- Contador de não lidas em tempo real
- Dropdown integrado

## 📧 Configuração de Email

### Resend Setup

1. Criar conta no [Resend](https://resend.com)
2. Verificar domínio (ou usar sandbox)
3. Obter API key
4. Adicionar ao `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Templates de Email

Templates HTML responsivos incluídos:
- Design moderno e clean
- Suporte para light/dark mode
- Botões de CTA
- Links para dashboard
- Footer com preferências

## 🔄 Eventos Automáticos

### Proposta Visualizada
```typescript
// Quando cliente abre a proposta
await NotificationHelper.notifyProposalViewed(
  userId,
  projectId,
  projectName,
  clientName
);
```

### Proposta Aceita
```typescript
// Quando cliente aceita
await NotificationHelper.notifyProposalAccepted(
  userId,
  projectId,
  projectName,
  clientName
);
```

### Proposta Expirando
```typescript
// Executado por cron job
npm run check-expiring-proposals
```

### Webhook de Eventos
```bash
POST /api/webhooks/proposal-events
{
  "event": "proposal_viewed",
  "projectId": "uuid",
  "clientName": "João Silva"
}
```

## 📈 Tracking (PostHog)

Eventos implementados:

1. **`notification_center_opened`**
   - Quando abre o centro de notificações
   - Properties: `unread_count`

2. **`notification_clicked`**
   - Quando clica em uma notificação
   - Properties: `notification_id`, `notification_type`

3. **`notifications_marked_all_read`**
   - Quando marca todas como lidas
   - Properties: `count`

4. **`notification_deleted`**
   - Quando deleta uma notificação
   - Properties: `notification_id`, `notification_type`

5. **`notification_sent`**
   - Quando notificação é criada
   - Properties: `notification_id`, `notification_type`, `user_id`, `via_email`

6. **`notification_email_sent`**
   - Quando email é enviado
   - Properties: `notification_id`, `notification_type`, `user_id`, `email_address`

## 🚀 Como Usar

### Criar uma Notificação Simples

```typescript
import { NotificationService } from '#/lib/services/notification-service';

await NotificationService.create({
  userId: 'user-uuid',
  type: 'system_announcement',
  title: 'Nova funcionalidade!',
  message: 'Confira a nova funcionalidade de relatórios.',
  actionUrl: '/dashboard/relatorios'
});
```

### Criar Notificação com Email

```typescript
import { NotificationHelper } from '#/lib/services/notification-helper';

await NotificationHelper.notifyProposalAccepted(
  userId,
  projectId,
  'Website Corporativo',
  'Empresa XYZ'
);
```

### Verificar Preferências

```typescript
const shouldSend = await NotificationService.shouldSendEmail(
  userId,
  'proposal_viewed'
);

if (shouldSend) {
  // Enviar email
}
```

### Usar no Frontend

```tsx
import { useNotifications } from '#/hooks/useNotifications';

function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead,
    markAllAsRead 
  } = useNotifications();

  return (
    <div>
      <p>Você tem {unreadCount} notificações não lidas</p>
      {notifications.map(notif => (
        <div key={notif.id}>
          <h3>{notif.title}</h3>
          <p>{notif.message}</p>
          <button onClick={() => markAsRead(notif.id)}>
            Marcar como lida
          </button>
        </div>
      ))}
    </div>
  );
}
```

## ⏰ Cron Jobs

### Verificar Propostas Expirando

Execute duas vezes ao dia:

```bash
# Manhã e tarde
npm run check-expiring-proposals
```

**Crontab sugerido:**
```cron
# 9 AM e 6 PM todos os dias
0 9,18 * * * cd /path/to/nepfy && npm run check-expiring-proposals
```

### Vercel Cron (recomendado)

Em `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-expiring-proposals",
      "schedule": "0 9,18 * * *"
    }
  ]
}
```

Criar rota: `src/app/api/cron/check-expiring-proposals/route.ts`

## 🔐 Segurança

### Validação de Usuário
Todas as rotas validam:
- Autenticação via Clerk
- Ownership de recursos
- Permissões de acesso

### Rate Limiting
Considere adicionar rate limiting:
- Máximo de notificações por minuto
- Throttling de emails
- Cache de contadores

### Webhook Security
Para webhooks externos:
```typescript
// Verificar assinatura
const signature = request.headers.get('x-webhook-signature');
if (!verifySignature(signature, body)) {
  return new Response('Unauthorized', { status: 401 });
}
```

## 📊 KPIs e Métricas

### Métricas Implementadas

1. **Abertura média diária da dashboard**
   - Event: `dashboard_viewed`
   - Com notificações: `notification_center_opened`

2. **Taxa de retorno após email**
   - Event: `notification_email_sent`
   - Seguido de: `dashboard_viewed`
   - Janela: 24h após envio

### Queries PostHog Sugeridas

```sql
-- Taxa de abertura de notificações
SELECT 
  COUNT(DISTINCT notification_clicked.user_id) / 
  COUNT(DISTINCT notification_sent.user_id) as open_rate
FROM notification_sent
LEFT JOIN notification_clicked 
  ON notification_sent.notification_id = notification_clicked.notification_id
WHERE notification_sent.timestamp > now() - interval '7 days'

-- Tempo médio para ação
SELECT 
  AVG(notification_clicked.timestamp - notification_sent.timestamp) as avg_time_to_action
FROM notification_sent
INNER JOIN notification_clicked 
  ON notification_sent.notification_id = notification_clicked.notification_id
WHERE notification_sent.timestamp > now() - interval '30 days'
```

## 🧪 Testes

### Testar Notificação Simples

```typescript
// src/scripts/test-notification.ts
import { NotificationHelper } from '#/lib/services/notification-helper';

await NotificationHelper.notifyProposalViewed(
  'user-id',
  'project-id',
  'Teste de Proposta',
  'Cliente Teste'
);
```

### Testar Email

```typescript
import { EmailService } from '#/lib/services/email-service';

await EmailService.sendNotificationEmail({
  to: 'seu-email@teste.com',
  notification: {
    id: 'test-id',
    title: 'Teste de Email',
    message: 'Esta é uma mensagem de teste',
    type: 'system_announcement',
    // ... outros campos
  },
  userName: 'Seu Nome'
});
```

## 🐛 Troubleshooting

### Notificações não aparecem
1. Verificar se o usuário está autenticado
2. Verificar preferências do usuário
3. Checar console do navegador
4. Verificar logs do servidor

### Emails não são enviados
1. Verificar `RESEND_API_KEY`
2. Verificar domínio verificado
3. Checar logs do servidor
4. Verificar preferências do usuário

### Contador não atualiza
1. Verificar polling (30s)
2. Força refetch: `refetch()`
3. Verificar cache do navegador
4. Verificar API response

## 📚 Próximos Passos

### Melhorias Sugeridas

1. **WebSockets para Real-time**
   - Remover polling
   - Notificações instantâneas
   - Menor carga no servidor

2. **Push Notifications**
   - Notificações no browser
   - Service Worker
   - Suporte mobile

3. **Agrupamento de Notificações**
   - "3 propostas visualizadas hoje"
   - Digest diário/semanal
   - Smart grouping

4. **Rich Notifications**
   - Preview de imagens
   - Embedded actions
   - Reply inline

5. **Analytics Avançado**
   - A/B testing de mensagens
   - Otimização de timing
   - Segmentação avançada

## 📝 Migrations

Para aplicar as migrations:

```bash
# Gerar migration
npm run migrations

# Aplicar ao banco
npm run migrate
```

Migration criada: `src/migrations/0004_chief_hex.sql`

## 🤝 Contribuindo

Ao adicionar novos tipos de notificação:

1. Adicionar tipo em `src/lib/db/schema/notifications.ts`
2. Criar helper em `NotificationHelper`
3. Adicionar preferência se necessário
4. Criar template de email
5. Adicionar evento no PostHog
6. Documentar aqui

## 📄 Licença

Propriedade de Nepfy. Uso interno apenas.

---

**Versão:** 1.0.0  
**Data:** November 2025  
**Autor:** Sistema Nepfy

