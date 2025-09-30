import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateTestimonialsTable = pgTable("flash_template_testimonials", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  ...timestamps,
});

export const flashTemplateTestimonialsListTable = pgTable("flash_template_testimonials_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  testimonialsSectionId: uuid("testimonials_section_id")
    .notNull()
    .references(() => flashTemplateTestimonialsTable.id, { onDelete: "cascade" }),
  
  photo: text("photo").notNull(),
  hidePhoto: boolean("hide_photo").default(false),
  
  testimonial: text("testimonial").notNull(),
  hideTestimonial: boolean("hide_testimonial").default(false),
  
  name: text("name").notNull(),
  hideName: boolean("hide_name").default(false),
  
  role: text("role").notNull(),
  hideRole: boolean("hide_role").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateTestimonialsRelations = relations(
  flashTemplateTestimonialsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateTestimonialsTable.projectId],
      references: [projectsTable.id],
    }),
    testimonialsList: many(flashTemplateTestimonialsListTable),
  })
);

export const flashTemplateTestimonialsListRelations = relations(
  flashTemplateTestimonialsListTable,
  ({ one }) => ({
    testimonialsSection: one(flashTemplateTestimonialsTable, {
      fields: [flashTemplateTestimonialsListTable.testimonialsSectionId],
      references: [flashTemplateTestimonialsTable.id],
    }),
  })
);