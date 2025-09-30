import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateInvestmentTable = pgTable("prime_template_investment", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const primeTemplateInvestmentRelations = relations(
  primeTemplateInvestmentTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateInvestmentTable.projectId],
      references: [projectsTable.id],
    }),
  })
);