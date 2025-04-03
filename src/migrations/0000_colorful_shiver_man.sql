CREATE TABLE "plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"planName" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "proposals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"projectName" varchar(255) NOT NULL,
	"clientName" varchar(255) NOT NULL,
	"clientAddress" varchar(255) NOT NULL,
	"proposalSentDate" timestamp NOT NULL,
	"proposalStatus" varchar(255) NOT NULL,
	"createdAt" varchar(255) NOT NULL,
	"updatedAt" varchar(255) NOT NULL,
	"archivedAt" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "companyUser" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"cnpj" varchar(255),
	"phone" varchar(255),
	"password" varchar(255),
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "companyUser_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "personUser" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"lastName" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp,
	"cpf" varchar(255),
	"phone" varchar(255),
	"password" varchar(255),
	"street" varchar(255),
	"number" varchar(255),
	"neighborhood" varchar(255),
	"state" varchar(255),
	"city" varchar(255),
	"cep" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "personUser_email_unique" UNIQUE("email")
);
