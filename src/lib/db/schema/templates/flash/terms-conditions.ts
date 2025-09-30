import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateTermsConditionsTable = pgTable("flash_template_terms_conditions", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  // Terms and Conditions section cannot be hidden (default is false)
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const flashTemplateTermsConditionsListTable = pgTable("flash_template_terms_conditions_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  termsSectionId: uuid("terms_section_id")
    .notNull()
    .references(() => flashTemplateTermsConditionsTable.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  hideTitleField: boolean("hide_title_field").default(false),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateTermsConditionsRelations = relations(
  flashTemplateTermsConditionsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateTermsConditionsTable.projectId],
      references: [projectsTable.id],
    }),
    termsList: many(flashTemplateTermsConditionsListTable),
  })
);

export const flashTemplateTermsConditionsListRelations = relations(
  flashTemplateTermsConditionsListTable,
  ({ one }) => ({
    termsSection: one(flashTemplateTermsConditionsTable, {
      fields: [flashTemplateTermsConditionsListTable.termsSectionId],
      references: [flashTemplateTermsConditionsTable.id],
    }),
  })
);