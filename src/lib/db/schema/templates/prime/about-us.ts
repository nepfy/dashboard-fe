import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateAboutUsTable = pgTable("prime_template_about_us", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  paragraph1: text("paragraph_1"),
  hideParagraph1: boolean("hide_paragraph_1").default(false),
  
  paragraph2: text("paragraph_2"),
  hideParagraph2: boolean("hide_paragraph_2").default(false),
  
  ...timestamps,
});

export const primeTemplateAboutUsRelations = relations(
  primeTemplateAboutUsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateAboutUsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);