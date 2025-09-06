CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_subscription_id" varchar(255) NOT NULL,
	"stripe_customer_id" varchar(255),
	"plan_id" integer,
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
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "project_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "client_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "project_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "company_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "company_email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "page_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "investment_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "faq_subtitle" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "end_message_title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "end_message_title_2" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_clients" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_expertise" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_plans" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_process_steps" ALTER COLUMN "step_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_results" ALTER COLUMN "client" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_services" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_team_members" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_team_members" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_testimonials" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "project_testimonials" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_person_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;