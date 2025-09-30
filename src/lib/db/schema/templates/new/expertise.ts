import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const newTemplateExpertiseTable = pgTable("new_template_expertise", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  tagline: text("tagline"),
  hideTagline: boolean("hide_tagline").default(false),
  
  title: text("title"),
  hideTitle: boolean("hide_title").default(false),
  
  ...timestamps,
});

export const newTemplateExpertiseTopicsTable = pgTable("new_template_expertise_topics", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  expertiseId: uuid("expertise_id")
    .notNull()
    .references(() => newTemplateExpertiseTable.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  hideTitleField: boolean("hide_title_field").default(false),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplateExpertiseRelations = relations(
  newTemplateExpertiseTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [newTemplateExpertiseTable.projectId],
      references: [projectsTable.id],
    }),
    topics: many(newTemplateExpertiseTopicsTable),
  })
);

export const newTemplateExpertiseTopicsRelations = relations(
  newTemplateExpertiseTopicsTable,
  ({ one }) => ({
    expertise: one(newTemplateExpertiseTable, {
      fields: [newTemplateExpertiseTopicsTable.expertiseId],
      references: [newTemplateExpertiseTable.id],
    }),
  })
);