CREATE TABLE "project_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"logo" text,
	"name" varchar(255) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_expertise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"icon" text,
	"title" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_faq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_plan_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"is_best_offer" boolean DEFAULT false,
	"price" numeric(10, 2),
	"price_period" varchar(50),
	"cta_button_title" varchar(100),
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_process_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"step_counter" integer NOT NULL,
	"step_name" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"photo" text,
	"client" varchar(255),
	"subtitle" text,
	"investment" numeric(10, 2),
	"roi" numeric(10, 2),
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"photo" text,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_terms_conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"testimonial" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"photo" text,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "template_type" varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "main_color" varchar(7);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "company_name" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "company_email" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "cta_button_title" varchar(100);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "page_title" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "page_subtitle" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "services" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "about_us_title" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "about_us_subtitle_1" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "about_us_subtitle_2" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "our_team_subtitle" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "expertise_subtitle" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "results_subtitle" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "process_subtitle" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "cta_background_image" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "investment_title" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "terms_title" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "end_message_title" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "end_message_description" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "project_url" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "page_password" varchar(255);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_published" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_proposal_generated" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "project_clients" ADD CONSTRAINT "project_clients_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_expertise" ADD CONSTRAINT "project_expertise_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_faq" ADD CONSTRAINT "project_faq_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_plan_details" ADD CONSTRAINT "project_plan_details_plan_id_project_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."project_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_plans" ADD CONSTRAINT "project_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_process_steps" ADD CONSTRAINT "project_process_steps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_results" ADD CONSTRAINT "project_results_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_team_members" ADD CONSTRAINT "project_team_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_terms_conditions" ADD CONSTRAINT "project_terms_conditions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_testimonials" ADD CONSTRAINT "project_testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;