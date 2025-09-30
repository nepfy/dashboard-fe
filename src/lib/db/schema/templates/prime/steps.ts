import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateStepsTable = pgTable("prime_template_steps", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title"),
  hideTitle: boolean("hide_title").default(false),
  
  ...timestamps,
});

export const primeTemplateStepsTopicsTable = pgTable("prime_template_steps_topics", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  stepsId: uuid("steps_id")
    .notNull()
    .references(() => primeTemplateStepsTable.id, { onDelete: "cascade" }),
  
  stepName: text("step_name").notNull(),
  hideStepName: boolean("hide_step_name").default(false),
  
  stepDescription: text("step_description").notNull(),
  hideStepDescription: boolean("hide_step_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateStepsRelations = relations(
  primeTemplateStepsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateStepsTable.projectId],
      references: [projectsTable.id],
    }),
    topics: many(primeTemplateStepsTopicsTable),
  })
);

export const primeTemplateStepsTopicsRelations = relations(
  primeTemplateStepsTopicsTable,
  ({ one }) => ({
    steps: one(primeTemplateStepsTable, {
      fields: [primeTemplateStepsTopicsTable.stepsId],
      references: [primeTemplateStepsTable.id],
    }),
  })
);