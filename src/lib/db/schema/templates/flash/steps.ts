import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateStepsTable = pgTable("flash_template_steps", {
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

export const flashTemplateStepsTopicsTable = pgTable("flash_template_steps_topics", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  stepsId: uuid("steps_id")
    .notNull()
    .references(() => flashTemplateStepsTable.id, { onDelete: "cascade" }),
  
  stepName: text("step_name").notNull(),
  hideStepName: boolean("hide_step_name").default(false),
  
  stepDescription: text("step_description").notNull(),
  hideStepDescription: boolean("hide_step_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateStepsMarqueeTable = pgTable("flash_template_steps_marquee", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  stepsId: uuid("steps_id")
    .notNull()
    .references(() => flashTemplateStepsTable.id, { onDelete: "cascade" }),
  
  serviceName: text("service_name").notNull(),
  hideService: boolean("hide_service").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateStepsRelations = relations(
  flashTemplateStepsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateStepsTable.projectId],
      references: [projectsTable.id],
    }),
    topics: many(flashTemplateStepsTopicsTable),
    marquee: many(flashTemplateStepsMarqueeTable),
  })
);

export const flashTemplateStepsTopicsRelations = relations(
  flashTemplateStepsTopicsTable,
  ({ one }) => ({
    steps: one(flashTemplateStepsTable, {
      fields: [flashTemplateStepsTopicsTable.stepsId],
      references: [flashTemplateStepsTable.id],
    }),
  })
);

export const flashTemplateStepsMarqueeRelations = relations(
  flashTemplateStepsMarqueeTable,
  ({ one }) => ({
    steps: one(flashTemplateStepsTable, {
      fields: [flashTemplateStepsMarqueeTable.stepsId],
      references: [flashTemplateStepsTable.id],
    }),
  })
);