ALTER TABLE "projects" ADD COLUMN "hide_faq_subtitle" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "faq_subtitle" varchar(255);