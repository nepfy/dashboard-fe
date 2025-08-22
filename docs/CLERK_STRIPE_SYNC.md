# Clerk-Stripe Data Synchronization

This document describes the comprehensive data synchronization system between Clerk (authentication) and Stripe (billing) in the Nepfy application.

## Overview

The synchronization system ensures that user data, subscription information, and billing details are consistently maintained across both Clerk and Stripe platforms, with a local database backup for analytics and data integrity.

## Architecture

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────┐
│   Clerk     │◄──►│  Sync Service   │◄──►│   Stripe    │
│ (Auth)      │    │                 │    │ (Billing)   │
└─────────────┘    └─────────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ PostgreSQL  │
                   │ (Local DB)  │
                   └─────────────┘
```

## Components

### 1. Database Schema

#### Subscriptions Table

```sql
CREATE TABLE "subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "person_user"("id"),
  "stripe_subscription_id" varchar(255) NOT NULL UNIQUE,
  "stripe_customer_id" varchar(255),
  "plan_id" integer REFERENCES "plans"("id"),
  "status" varchar(50) NOT NULL,
  "subscription_type" varchar(50) DEFAULT 'monthly',
  "current_period_start" timestamp,
  "current_period_end" timestamp,
  "cancel_at_period_end" boolean DEFAULT false,
  "canceled_at" timestamp,
  "trial_start" timestamp,
  "trial_end" timestamp,
  "metadata" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
```

### 2. Sync Service (`ClerkStripeSyncService`)

The core service that handles all synchronization operations:

#### Key Methods

- **`syncSubscriptionToClerkAndDB(userId, subscription, subscriptionType)`**
  - Syncs subscription data from Stripe to both Clerk metadata and local database
- **`syncUserToStripe(userId)`**
  - Syncs user profile data from Clerk to Stripe customer records
- **`getUserSubscriptionData(userId)`**
  - Retrieves subscription data from both Clerk and local database
- **`cancelSubscription(userId, subscriptionId)`**
  - Cancels subscription in Stripe and syncs the change
- **`reactivateSubscription(userId, subscriptionId)`**
  - Reactivates subscription in Stripe and syncs the change

### 3. Webhooks

#### Clerk Webhook (`/api/webhooks/clerk`)

Handles user lifecycle events:

- `user.created` - Creates Stripe customer when user signs up
- `user.updated` - Syncs profile changes to Stripe
- `user.deleted` - Preserves Stripe data for billing history

#### Stripe Webhook (`/api/webhooks/stripe`)

Handles billing events:

- `checkout.session.completed` - Links subscriptions to users
- `customer.subscription.updated` - Syncs subscription changes
- `payment_intent.succeeded` - Processes payments and updates status
- `invoice.payment_succeeded` - Confirms successful payments

### 4. Manual Sync API (`/api/sync/clerk-stripe`)

Provides endpoints for manual synchronization:

#### GET `/api/sync/clerk-stripe`

Returns current user's subscription data from both systems.

#### POST `/api/sync/clerk-stripe`

Performs various sync operations:

```json
{
  "action": "sync-user",
  "targetUserId": "optional_user_id"
}
```

Available actions:

- `sync-user` - Sync user data to Stripe
- `get-subscription-data` - Get subscription information
- `cancel-subscription` - Cancel subscription (requires `subscriptionId`)
- `reactivate-subscription` - Reactivate subscription (requires `reactivationSubscriptionId`)

## Data Flow

### User Registration Flow

1. User signs up via Clerk
2. Clerk webhook triggers `user.created`
3. Sync service creates Stripe customer
4. Customer ID stored in local database

### Subscription Creation Flow

1. User completes Stripe checkout
2. Stripe webhook triggers `checkout.session.completed`
3. Sync service links subscription to user
4. Subscription data stored in both Clerk metadata and local database

### Profile Update Flow

1. User updates profile in Clerk
2. Clerk webhook triggers `user.updated`
3. Sync service updates Stripe customer record
4. Changes reflected in both systems

## Environment Variables

Required environment variables:

```bash
# Clerk
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Setup Instructions

### 1. Database Migration

Run the migration to create the subscriptions table:

```bash
npm run db:migrate
# or
pnpm db:migrate
```

### 2. Webhook Configuration

#### Clerk Webhook

- URL: `https://yourdomain.com/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`

#### Stripe Webhook

- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `payment_intent.succeeded`, `invoice.payment_succeeded`

### 3. Testing

Test the synchronization system:

```bash
# Get current user's subscription data
curl -X GET /api/sync/clerk-stripe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Manually sync user to Stripe
curl -X POST /api/sync/clerk-stripe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "sync-user"}'
```

## Error Handling

The system includes comprehensive error handling:

- **Webhook verification failures** - Returns 400 status
- **User not found** - Returns 404 status
- **Stripe API errors** - Logged and handled gracefully
- **Database errors** - Rollback and retry mechanisms

## Monitoring and Logging

All synchronization operations are logged with:

- Operation type and parameters
- Success/failure status
- Error details and stack traces
- Timestamps for debugging

## Best Practices

1. **Idempotency** - All operations are idempotent and safe to retry
2. **Data Consistency** - Changes are applied to both systems atomically
3. **Error Recovery** - Failed operations can be retried manually
4. **Audit Trail** - All changes are logged and tracked
5. **Performance** - Database indexes optimize query performance

## Troubleshooting

### Common Issues

1. **Webhook signature verification fails**

   - Check webhook secret configuration
   - Verify request headers are properly set

2. **User not found in Clerk**

   - Ensure user exists and is not deleted
   - Check Clerk API key permissions

3. **Stripe customer creation fails**

   - Verify Stripe API key and permissions
   - Check email format and uniqueness

4. **Database constraint violations**
   - Run database migrations
   - Check foreign key relationships

### Debug Mode

Enable detailed logging by setting:

```bash
NODE_ENV=development
DEBUG=clerk-stripe-sync:*
```

## Future Enhancements

- **Real-time sync** - WebSocket-based live updates
- **Bulk operations** - Sync multiple users simultaneously
- **Advanced analytics** - Subscription metrics and reporting
- **Webhook retry** - Automatic retry for failed webhooks
- **Admin dashboard** - Visual interface for sync management
