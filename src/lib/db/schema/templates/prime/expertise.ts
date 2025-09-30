import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateExpertiseTable = pgTable("prime_template_expertise", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const primeTemplateExpertiseTopicsTable = pgTable("prime_template_expertise_topics", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  expertiseId: uuid("expertise_id")
    .notNull()
    .references(() => primeTemplateExpertiseTable.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  hideTitleField: boolean("hide_title_field").default(false),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateExpertiseRelations = relations(
  primeTemplateExpertiseTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateExpertiseTable.projectId],
      references: [projectsTable.id],
    }),
    topics: many(primeTemplateExpertiseTopicsTable),
  })
);

export const primeTemplateExpertiseTopicsRelations = relations(
  primeTemplateExpertiseTopicsTable,
  ({ one }) => ({
    expertise: one(primeTemplateExpertiseTable, {
      fields: [primeTemplateExpertiseTopicsTable.expertiseId],
      references: [primeTemplateExpertiseTable.id],
    }),
  })
);