ALTER TABLE "projects" ADD COLUMN "hide_about_us_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_about_your_team_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_expertise_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_results_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_clients_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_process_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_cta_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_testimonials_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_investment_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_included_services_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_plans_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_terms_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_faq_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "hide_final_message_section" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "delivery_services";