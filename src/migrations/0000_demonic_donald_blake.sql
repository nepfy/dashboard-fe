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
CREATE TABLE "onboarding_used_before" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(50),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"plan_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_name" varchar(255) NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"project_sent_date" timestamp NOT NULL,
	"project_status" varchar(255) NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"archived_at" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "company_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"cnpj" varchar(255),
	"phone" varchar(255),
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_job_type" integer,
	"user_discovery" integer,
	"user_used_before" integer,
	CONSTRAINT "company_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "person_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255) NOT NULL,
	"cpf" varchar(255),
	"phone" varchar(255),
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_job_type" integer,
	"user_discovery" integer,
	"user_used_before" integer,
	CONSTRAINT "person_user_email_unique" UNIQUE("email")
);
