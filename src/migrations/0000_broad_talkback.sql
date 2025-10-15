CREATE TABLE "agent_templates" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"agent_id" varchar(50) NOT NULL,
	"template_type" varchar(20) NOT NULL,
	"introduction_style" text,
	"about_us_focus" text,
	"specialties_approach" text,
	"process_emphasis" text,
	"investment_strategy" text,
	"additional_prompt" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"sector" varchar(100) NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"system_prompt" text NOT NULL,
	"expertise" json DEFAULT '[]'::json NOT NULL,
	"common_services" json DEFAULT '[]'::json NOT NULL,
	"pricing_model" varchar(50) NOT NULL,
	"proposal_structure" json DEFAULT '[]'::json NOT NULL,
	"key_terms" json DEFAULT '[]'::json NOT NULL,
	"template_config" json,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "service_types" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "template_types" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "company_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"name" varchar(255),
	"cnpj" varchar(255),
	"phone" varchar(255),
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"additional_address" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_job_type" integer,
	"user_discovery" integer,
	"user_used_before" integer,
	CONSTRAINT "company_user_person_id_unique" UNIQUE("person_id")
);
--> statement-breakpoint
CREATE TABLE "onboarding_discovery" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "onboarding_job_types" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "person_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"user_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"cpf" varchar(255),
	"phone" varchar(255),
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"additional_address" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_job_type" integer,
	"user_discovery" integer,
	"user_used_before" integer,
	CONSTRAINT "person_user_user_name_unique" UNIQUE("user_name"),
	CONSTRAINT "person_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"plan_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"project_name" text NOT NULL,
	"project_sent_date" timestamp,
	"project_valid_until" timestamp,
	"project_status" text NOT NULL,
	"project_visualization_date" timestamp,
	"template_type" varchar(50),
	"main_color" varchar(7),
	"project_url" varchar(255),
	"page_password" varchar(255),
	"is_published" boolean DEFAULT false,
	"is_proposal_generated" boolean DEFAULT false,
	"proposal_data" jsonb,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
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
CREATE TABLE "onboarding_used_before" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "agent_templates" ADD CONSTRAINT "agent_templates_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_person_id_person_user_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_person_id_person_user_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_person_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;