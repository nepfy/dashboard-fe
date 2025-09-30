import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateTermsConditionsTable = pgTable("prime_template_terms_conditions", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const primeTemplateTermsConditionsListTable = pgTable("prime_template_terms_conditions_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  termsSectionId: uuid("terms_section_id")
    .notNull()
    .references(() => primeTemplateTermsConditionsTable.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  hideTitleField: boolean("hide_title_field").default(false),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateTermsConditionsRelations = relations(
  primeTemplateTermsConditionsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateTermsConditionsTable.projectId],
      references: [projectsTable.id],
    }),
    termsList: many(primeTemplateTermsConditionsListTable),
  })
);

export const primeTemplateTermsConditionsListRelations = relations(
  primeTemplateTermsConditionsListTable,
  ({ one }) => ({
    termsSection: one(primeTemplateTermsConditionsTable, {
      fields: [primeTemplateTermsConditionsListTable.termsSectionId],
      references: [primeTemplateTermsConditionsTable.id],
    }),
  })
);