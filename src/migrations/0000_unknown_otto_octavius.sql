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
CREATE TABLE "flash_template_about_us" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"support_text" text,
	"hide_support_text" boolean DEFAULT false,
	"subtitle" text,
	"hide_subtitle" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_about_us_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_clients_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clients_section_id" uuid NOT NULL,
	"logo" text NOT NULL,
	"hide_logo" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_clients_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_cta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"button_title" text NOT NULL,
	"background_image" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_cta_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_deliverables_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deliverables_section_id" uuid NOT NULL,
	"delivery_name" text NOT NULL,
	"hide_delivery_name" boolean DEFAULT false,
	"delivery_content" text NOT NULL,
	"hide_delivery_content" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_deliverables_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_expertise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_expertise_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_expertise_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expertise_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_faq_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faq_section_id" uuid NOT NULL,
	"question" text NOT NULL,
	"hide_question" boolean DEFAULT false,
	"answer" text NOT NULL,
	"hide_answer" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_faq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_faq_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_footer_marquee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"footer_id" uuid NOT NULL,
	"button_title" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_footer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"thank_you_message" text NOT NULL,
	"cta_message" text NOT NULL,
	"disclaimer" text,
	"hide_disclaimer" boolean DEFAULT false,
	"validity" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_footer_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_introduction_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"introduction_id" uuid NOT NULL,
	"service_name" text NOT NULL,
	"hide_service" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_introduction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"button_title" text NOT NULL,
	"title" text NOT NULL,
	"validity" timestamp NOT NULL,
	"subtitle" text,
	"hide_subtitle" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_introduction_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_investment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_investment_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_plans_included_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_plans_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plans_section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"price" numeric(15, 2),
	"hide_price" boolean DEFAULT false,
	"plan_period" text NOT NULL,
	"hide_plan_period" boolean DEFAULT false,
	"button_title" text NOT NULL,
	"hide_button_title" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_plans_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_results_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"results_section_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"hide_photo" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"instagram" text NOT NULL,
	"hide_instagram" boolean DEFAULT false,
	"invested" numeric(15, 2) NOT NULL,
	"hide_invested" boolean DEFAULT false,
	"return_value" numeric(15, 2) NOT NULL,
	"hide_return" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_results_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_steps_marquee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"steps_id" uuid NOT NULL,
	"service_name" text NOT NULL,
	"hide_service" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_steps_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_steps_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"steps_id" uuid NOT NULL,
	"step_name" text NOT NULL,
	"hide_step_name" boolean DEFAULT false,
	"step_description" text NOT NULL,
	"hide_step_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_section_id" uuid NOT NULL,
	"member_photo" text NOT NULL,
	"hide_member_photo" boolean DEFAULT false,
	"member_name" text NOT NULL,
	"hide_member_name" boolean DEFAULT false,
	"member_role" text NOT NULL,
	"hide_member_role" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_team_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_terms_conditions_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"terms_section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_terms_conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_terms_conditions_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "flash_template_testimonials_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"testimonials_section_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"hide_photo" boolean DEFAULT false,
	"testimonial" text NOT NULL,
	"hide_testimonial" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"role" text NOT NULL,
	"hide_role" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "flash_template_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "flash_template_testimonials_project_id_unique" UNIQUE("project_id")
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
CREATE TABLE "minimal_template_about_us_marquee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"about_us_id" uuid NOT NULL,
	"service_name" text NOT NULL,
	"hide_service" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_about_us" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"validity" timestamp NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"hide_subtitle" boolean DEFAULT false,
	"main_description" text,
	"hide_main_description" boolean DEFAULT false,
	"additional_description_1" text,
	"hide_additional_description_1" boolean DEFAULT false,
	"additional_description_2" text,
	"hide_additional_description_2" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_about_us_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_about_us_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"about_us_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"hide_photo" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_clients_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clients_section_id" uuid NOT NULL,
	"logo" text NOT NULL,
	"hide_logo" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_clients_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_expertise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"tagline" text,
	"hide_tagline" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_expertise_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_expertise_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expertise_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_faq_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faq_section_id" uuid NOT NULL,
	"question" text NOT NULL,
	"hide_question" boolean DEFAULT false,
	"answer" text NOT NULL,
	"hide_answer" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_faq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_faq_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_footer_marquee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"footer_id" uuid NOT NULL,
	"service_name" text NOT NULL,
	"hide_service" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_footer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"call_to_action" text NOT NULL,
	"validity" timestamp NOT NULL,
	"email" text NOT NULL,
	"whatsapp" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_footer_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_introduction_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"introduction_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"hide_photo" boolean DEFAULT false,
	"sort_order" text DEFAULT '0',
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_introduction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"company_name" text,
	"hide_company_name" boolean DEFAULT false,
	"company_logo" text,
	"hide_company_logo" boolean DEFAULT false,
	"button_title" text NOT NULL,
	"client_name" text NOT NULL,
	"client_photo" text,
	"hide_client_photo" boolean DEFAULT false,
	"title" text NOT NULL,
	"validity" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_introduction_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_plans_included_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_plans_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plans_section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"price" numeric(15, 2),
	"hide_price" boolean DEFAULT false,
	"plan_period" text NOT NULL,
	"hide_plan_period" boolean DEFAULT false,
	"button_title" text NOT NULL,
	"hide_button_title" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"subtitle" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_plans_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "minimal_template_terms_conditions_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"terms_section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "minimal_template_terms_conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "minimal_template_terms_conditions_project_id_unique" UNIQUE("project_id")
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
CREATE TABLE "prime_template_about_us" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"paragraph_1" text,
	"hide_paragraph_1" boolean DEFAULT false,
	"paragraph_2" text,
	"hide_paragraph_2" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_about_us_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_clients_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clients_section_id" uuid NOT NULL,
	"logo" text NOT NULL,
	"hide_logo" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_clients_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_cta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"button_title" text NOT NULL,
	"background_image" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_cta_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_deliverables_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"deliverables_section_id" uuid NOT NULL,
	"delivery_name" text NOT NULL,
	"hide_delivery_name" boolean DEFAULT false,
	"delivery_content" text NOT NULL,
	"hide_delivery_content" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_deliverables_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_expertise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_expertise_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_expertise_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"expertise_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_faq_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"faq_section_id" uuid NOT NULL,
	"question" text NOT NULL,
	"hide_question" boolean DEFAULT false,
	"answer" text NOT NULL,
	"hide_answer" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_faq" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"subtitle" text,
	"hide_subtitle" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_faq_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_footer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"thank_you_title" text,
	"hide_thank_you_title" boolean DEFAULT false,
	"thank_you_message" text,
	"hide_thank_you_message" boolean DEFAULT false,
	"disclaimer" text,
	"hide_disclaimer" boolean DEFAULT false,
	"email" text NOT NULL,
	"button_title" text NOT NULL,
	"validity" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_footer_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_introduction_marquee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"introduction_id" uuid NOT NULL,
	"service_name" text NOT NULL,
	"hide_service" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_introduction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" text NOT NULL,
	"validity" timestamp NOT NULL,
	"email" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"button_title" text NOT NULL,
	"photo" text,
	"hide_photo" boolean DEFAULT false,
	"member_name" text,
	"hide_member_name" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_introduction_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_investment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_investment_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_plans_included_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_plans_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plans_section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"price" numeric(15, 2),
	"hide_price" boolean DEFAULT false,
	"plan_period" text NOT NULL,
	"hide_plan_period" boolean DEFAULT false,
	"button_title" text NOT NULL,
	"hide_button_title" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_plans_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_results_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"results_section_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"hide_photo" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"instagram" text NOT NULL,
	"hide_instagram" boolean DEFAULT false,
	"invested" numeric(15, 2) NOT NULL,
	"hide_invested" boolean DEFAULT false,
	"return_value" numeric(15, 2) NOT NULL,
	"hide_return" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_results_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_steps_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_steps_topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"steps_id" uuid NOT NULL,
	"step_name" text NOT NULL,
	"hide_step_name" boolean DEFAULT false,
	"step_description" text NOT NULL,
	"hide_step_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_section_id" uuid NOT NULL,
	"member_photo" text NOT NULL,
	"hide_member_photo" boolean DEFAULT false,
	"member_name" text NOT NULL,
	"hide_member_name" boolean DEFAULT false,
	"member_role" text NOT NULL,
	"hide_member_role" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text,
	"hide_title" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_team_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_terms_conditions_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"terms_section_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hide_title_field" boolean DEFAULT false,
	"description" text NOT NULL,
	"hide_description" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_terms_conditions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"title" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_terms_conditions_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "prime_template_testimonials_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"testimonials_section_id" uuid NOT NULL,
	"photo" text NOT NULL,
	"hide_photo" boolean DEFAULT false,
	"testimonial" text NOT NULL,
	"hide_testimonial" boolean DEFAULT false,
	"name" text NOT NULL,
	"hide_name" boolean DEFAULT false,
	"role" text NOT NULL,
	"hide_role" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "prime_template_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"hide_section" boolean DEFAULT false,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "prime_template_testimonials_project_id_unique" UNIQUE("project_id")
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
ALTER TABLE "flash_template_about_us" ADD CONSTRAINT "flash_template_about_us_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_clients_list" ADD CONSTRAINT "flash_template_clients_list_clients_section_id_flash_template_clients_id_fk" FOREIGN KEY ("clients_section_id") REFERENCES "public"."flash_template_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_clients" ADD CONSTRAINT "flash_template_clients_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_cta" ADD CONSTRAINT "flash_template_cta_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_deliverables_list" ADD CONSTRAINT "flash_template_deliverables_list_deliverables_section_id_flash_template_deliverables_id_fk" FOREIGN KEY ("deliverables_section_id") REFERENCES "public"."flash_template_deliverables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_deliverables" ADD CONSTRAINT "flash_template_deliverables_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_expertise" ADD CONSTRAINT "flash_template_expertise_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_expertise_topics" ADD CONSTRAINT "flash_template_expertise_topics_expertise_id_flash_template_expertise_id_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."flash_template_expertise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_faq_list" ADD CONSTRAINT "flash_template_faq_list_faq_section_id_flash_template_faq_id_fk" FOREIGN KEY ("faq_section_id") REFERENCES "public"."flash_template_faq"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_faq" ADD CONSTRAINT "flash_template_faq_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_footer_marquee" ADD CONSTRAINT "flash_template_footer_marquee_footer_id_flash_template_footer_id_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."flash_template_footer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_footer" ADD CONSTRAINT "flash_template_footer_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_introduction_services" ADD CONSTRAINT "flash_template_introduction_services_introduction_id_flash_template_introduction_id_fk" FOREIGN KEY ("introduction_id") REFERENCES "public"."flash_template_introduction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_introduction" ADD CONSTRAINT "flash_template_introduction_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_investment" ADD CONSTRAINT "flash_template_investment_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_plans_included_items" ADD CONSTRAINT "flash_template_plans_included_items_plan_id_flash_template_plans_list_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."flash_template_plans_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_plans_list" ADD CONSTRAINT "flash_template_plans_list_plans_section_id_flash_template_plans_id_fk" FOREIGN KEY ("plans_section_id") REFERENCES "public"."flash_template_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_plans" ADD CONSTRAINT "flash_template_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_results_list" ADD CONSTRAINT "flash_template_results_list_results_section_id_flash_template_results_id_fk" FOREIGN KEY ("results_section_id") REFERENCES "public"."flash_template_results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_results" ADD CONSTRAINT "flash_template_results_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_steps_marquee" ADD CONSTRAINT "flash_template_steps_marquee_steps_id_flash_template_steps_id_fk" FOREIGN KEY ("steps_id") REFERENCES "public"."flash_template_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_steps" ADD CONSTRAINT "flash_template_steps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_steps_topics" ADD CONSTRAINT "flash_template_steps_topics_steps_id_flash_template_steps_id_fk" FOREIGN KEY ("steps_id") REFERENCES "public"."flash_template_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_team_members" ADD CONSTRAINT "flash_template_team_members_team_section_id_flash_template_team_id_fk" FOREIGN KEY ("team_section_id") REFERENCES "public"."flash_template_team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_team" ADD CONSTRAINT "flash_template_team_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_terms_conditions_list" ADD CONSTRAINT "flash_template_terms_conditions_list_terms_section_id_flash_template_terms_conditions_id_fk" FOREIGN KEY ("terms_section_id") REFERENCES "public"."flash_template_terms_conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_terms_conditions" ADD CONSTRAINT "flash_template_terms_conditions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_testimonials_list" ADD CONSTRAINT "flash_template_testimonials_list_testimonials_section_id_flash_template_testimonials_id_fk" FOREIGN KEY ("testimonials_section_id") REFERENCES "public"."flash_template_testimonials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flash_template_testimonials" ADD CONSTRAINT "flash_template_testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_about_us_marquee" ADD CONSTRAINT "minimal_template_about_us_marquee_about_us_id_minimal_template_about_us_id_fk" FOREIGN KEY ("about_us_id") REFERENCES "public"."minimal_template_about_us"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_about_us" ADD CONSTRAINT "minimal_template_about_us_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_about_us_team" ADD CONSTRAINT "minimal_template_about_us_team_about_us_id_minimal_template_about_us_id_fk" FOREIGN KEY ("about_us_id") REFERENCES "public"."minimal_template_about_us"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_clients_list" ADD CONSTRAINT "minimal_template_clients_list_clients_section_id_minimal_template_clients_id_fk" FOREIGN KEY ("clients_section_id") REFERENCES "public"."minimal_template_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_clients" ADD CONSTRAINT "minimal_template_clients_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_expertise" ADD CONSTRAINT "minimal_template_expertise_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_expertise_topics" ADD CONSTRAINT "minimal_template_expertise_topics_expertise_id_minimal_template_expertise_id_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."minimal_template_expertise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_faq_list" ADD CONSTRAINT "minimal_template_faq_list_faq_section_id_minimal_template_faq_id_fk" FOREIGN KEY ("faq_section_id") REFERENCES "public"."minimal_template_faq"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_faq" ADD CONSTRAINT "minimal_template_faq_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_footer_marquee" ADD CONSTRAINT "minimal_template_footer_marquee_footer_id_minimal_template_footer_id_fk" FOREIGN KEY ("footer_id") REFERENCES "public"."minimal_template_footer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_footer" ADD CONSTRAINT "minimal_template_footer_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_introduction_photos" ADD CONSTRAINT "minimal_template_introduction_photos_introduction_id_minimal_template_introduction_id_fk" FOREIGN KEY ("introduction_id") REFERENCES "public"."minimal_template_introduction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_introduction" ADD CONSTRAINT "minimal_template_introduction_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_plans_included_items" ADD CONSTRAINT "minimal_template_plans_included_items_plan_id_minimal_template_plans_list_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."minimal_template_plans_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_plans_list" ADD CONSTRAINT "minimal_template_plans_list_plans_section_id_minimal_template_plans_id_fk" FOREIGN KEY ("plans_section_id") REFERENCES "public"."minimal_template_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_plans" ADD CONSTRAINT "minimal_template_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_terms_conditions_list" ADD CONSTRAINT "minimal_template_terms_conditions_list_terms_section_id_minimal_template_terms_conditions_id_fk" FOREIGN KEY ("terms_section_id") REFERENCES "public"."minimal_template_terms_conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minimal_template_terms_conditions" ADD CONSTRAINT "minimal_template_terms_conditions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_about_us" ADD CONSTRAINT "prime_template_about_us_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_clients_list" ADD CONSTRAINT "prime_template_clients_list_clients_section_id_prime_template_clients_id_fk" FOREIGN KEY ("clients_section_id") REFERENCES "public"."prime_template_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_clients" ADD CONSTRAINT "prime_template_clients_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_cta" ADD CONSTRAINT "prime_template_cta_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_deliverables_list" ADD CONSTRAINT "prime_template_deliverables_list_deliverables_section_id_prime_template_deliverables_id_fk" FOREIGN KEY ("deliverables_section_id") REFERENCES "public"."prime_template_deliverables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_deliverables" ADD CONSTRAINT "prime_template_deliverables_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_expertise" ADD CONSTRAINT "prime_template_expertise_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_expertise_topics" ADD CONSTRAINT "prime_template_expertise_topics_expertise_id_prime_template_expertise_id_fk" FOREIGN KEY ("expertise_id") REFERENCES "public"."prime_template_expertise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_faq_list" ADD CONSTRAINT "prime_template_faq_list_faq_section_id_prime_template_faq_id_fk" FOREIGN KEY ("faq_section_id") REFERENCES "public"."prime_template_faq"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_faq" ADD CONSTRAINT "prime_template_faq_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_footer" ADD CONSTRAINT "prime_template_footer_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_introduction_marquee" ADD CONSTRAINT "prime_template_introduction_marquee_introduction_id_prime_template_introduction_id_fk" FOREIGN KEY ("introduction_id") REFERENCES "public"."prime_template_introduction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_introduction" ADD CONSTRAINT "prime_template_introduction_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_investment" ADD CONSTRAINT "prime_template_investment_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_plans_included_items" ADD CONSTRAINT "prime_template_plans_included_items_plan_id_prime_template_plans_list_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."prime_template_plans_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_plans_list" ADD CONSTRAINT "prime_template_plans_list_plans_section_id_prime_template_plans_id_fk" FOREIGN KEY ("plans_section_id") REFERENCES "public"."prime_template_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_plans" ADD CONSTRAINT "prime_template_plans_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_results_list" ADD CONSTRAINT "prime_template_results_list_results_section_id_prime_template_results_id_fk" FOREIGN KEY ("results_section_id") REFERENCES "public"."prime_template_results"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_results" ADD CONSTRAINT "prime_template_results_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_steps" ADD CONSTRAINT "prime_template_steps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_steps_topics" ADD CONSTRAINT "prime_template_steps_topics_steps_id_prime_template_steps_id_fk" FOREIGN KEY ("steps_id") REFERENCES "public"."prime_template_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_team_members" ADD CONSTRAINT "prime_template_team_members_team_section_id_prime_template_team_id_fk" FOREIGN KEY ("team_section_id") REFERENCES "public"."prime_template_team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_team" ADD CONSTRAINT "prime_template_team_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_terms_conditions_list" ADD CONSTRAINT "prime_template_terms_conditions_list_terms_section_id_prime_template_terms_conditions_id_fk" FOREIGN KEY ("terms_section_id") REFERENCES "public"."prime_template_terms_conditions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_terms_conditions" ADD CONSTRAINT "prime_template_terms_conditions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_testimonials_list" ADD CONSTRAINT "prime_template_testimonials_list_testimonials_section_id_prime_template_testimonials_id_fk" FOREIGN KEY ("testimonials_section_id") REFERENCES "public"."prime_template_testimonials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prime_template_testimonials" ADD CONSTRAINT "prime_template_testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_person_id_person_user_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_person_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;