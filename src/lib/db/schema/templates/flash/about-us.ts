import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateAboutUsTable = pgTable("flash_template_about_us", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title"),
  hideTitle: boolean("hide_title").default(false),
  
  supportText: text("support_text"),
  hideSupportText: boolean("hide_support_text").default(false),
  
  subtitle: text("subtitle"),
  hideSubtitle: boolean("hide_subtitle").default(false),
  
  ...timestamps,
});

export const flashTemplateAboutUsRelations = relations(
  flashTemplateAboutUsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateAboutUsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);