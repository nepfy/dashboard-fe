ALTER TABLE "projects" ADD COLUMN "person_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_person_id_person_user_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_person_id_unique" UNIQUE("person_id");