import { pgTable, uuid, text, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateResultsTable = pgTable("prime_template_results", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const primeTemplateResultsListTable = pgTable("prime_template_results_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  resultsSectionId: uuid("results_section_id")
    .notNull()
    .references(() => primeTemplateResultsTable.id, { onDelete: "cascade" }),
  
  photo: text("photo").notNull(),
  hidePhoto: boolean("hide_photo").default(false),
  
  name: text("name").notNull(),
  hideName: boolean("hide_name").default(false),
  
  instagram: text("instagram").notNull(),
  hideInstagram: boolean("hide_instagram").default(false),
  
  invested: decimal("invested", { precision: 15, scale: 2 }).notNull(),
  hideInvested: boolean("hide_invested").default(false),
  
  returnValue: decimal("return_value", { precision: 15, scale: 2 }).notNull(),
  hideReturn: boolean("hide_return").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateResultsRelations = relations(
  primeTemplateResultsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateResultsTable.projectId],
      references: [projectsTable.id],
    }),
    resultsList: many(primeTemplateResultsListTable),
  })
);

export const primeTemplateResultsListRelations = relations(
  primeTemplateResultsListTable,
  ({ one }) => ({
    resultsSection: one(primeTemplateResultsTable, {
      fields: [primeTemplateResultsListTable.resultsSectionId],
      references: [primeTemplateResultsTable.id],
    }),
  })
);