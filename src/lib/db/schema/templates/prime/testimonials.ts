import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateTestimonialsTable = pgTable("prime_template_testimonials", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  ...timestamps,
});

export const primeTemplateTestimonialsListTable = pgTable("prime_template_testimonials_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  testimonialsSectionId: uuid("testimonials_section_id")
    .notNull()
    .references(() => primeTemplateTestimonialsTable.id, { onDelete: "cascade" }),
  
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

export const primeTemplateTestimonialsRelations = relations(
  primeTemplateTestimonialsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateTestimonialsTable.projectId],
      references: [projectsTable.id],
    }),
    testimonialsList: many(primeTemplateTestimonialsListTable),
  })
);

export const primeTemplateTestimonialsListRelations = relations(
  primeTemplateTestimonialsListTable,
  ({ one }) => ({
    testimonialsSection: one(primeTemplateTestimonialsTable, {
      fields: [primeTemplateTestimonialsListTable.testimonialsSectionId],
      references: [primeTemplateTestimonialsTable.id],
    }),
  })
);