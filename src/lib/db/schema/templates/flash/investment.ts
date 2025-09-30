import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateInvestmentTable = pgTable("flash_template_investment", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const flashTemplateInvestmentRelations = relations(
  flashTemplateInvestmentTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateInvestmentTable.projectId],
      references: [projectsTable.id],
    }),
  })
);