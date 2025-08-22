-- Migration: Add subscriptions table
-- This table stores subscription data for better data management and analytics

CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "person_user"("id") ON DELETE CASCADE,
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX IF NOT EXISTS "subscriptions_stripe_subscription_id_idx" ON "subscriptions"("stripe_subscription_id");
CREATE INDEX IF NOT EXISTS "subscriptions_status_idx" ON "subscriptions"("status");

-- Add comment to table
COMMENT ON TABLE "subscriptions" IS 'Stores subscription data synchronized between Clerk and Stripe';
