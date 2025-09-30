import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateCtaTable = pgTable("prime_template_cta", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  buttonTitle: text("button_title").notNull(),
  
  backgroundImage: text("background_image").notNull(),
  
  ...timestamps,
});

export const primeTemplateCtaRelations = relations(
  primeTemplateCtaTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateCtaTable.projectId],
      references: [projectsTable.id],
    }),
  })
);