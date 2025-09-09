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
ALTER TABLE "agent_templates" ADD CONSTRAINT "agent_templates_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;