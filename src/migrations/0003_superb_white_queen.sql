ALTER TABLE "person_user" ADD COLUMN "clerk_user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "button_config" jsonb;--> statement-breakpoint
ALTER TABLE "person_user" ADD CONSTRAINT "person_user_clerk_user_id_unique" UNIQUE("clerk_user_id");