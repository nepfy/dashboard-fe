ALTER TABLE "person_user" ADD COLUMN "user_name" varchar(255);--> statement-breakpoint
ALTER TABLE "person_user" ADD CONSTRAINT "person_user_user_name_unique" UNIQUE("user_name");