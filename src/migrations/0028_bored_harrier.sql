ALTER TABLE "projects" ADD COLUMN "hide_client_name" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_client_photo" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_photo" text;