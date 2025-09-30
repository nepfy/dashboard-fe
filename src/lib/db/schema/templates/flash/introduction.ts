import { pgTable, uuid, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateIntroductionTable = pgTable("flash_template_introduction", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  // Introduction section cannot be hidden (default is false)
  
  name: text("name").notNull(),
  
  email: text("email").notNull(),
  
  buttonTitle: text("button_title").notNull(),
  
  title: text("title").notNull(),
  
  validity: timestamp("validity", { mode: "date" }).notNull(),
  
  subtitle: text("subtitle"),
  hideSubtitle: boolean("hide_subtitle").default(false),
  
  ...timestamps,
});

export const flashTemplateIntroductionServicesTable = pgTable("flash_template_introduction_services", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  introductionId: uuid("introduction_id")
    .notNull()
    .references(() => flashTemplateIntroductionTable.id, { onDelete: "cascade" }),
  
  serviceName: text("service_name").notNull(),
  hideService: boolean("hide_service").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateIntroductionRelations = relations(
  flashTemplateIntroductionTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateIntroductionTable.projectId],
      references: [projectsTable.id],
    }),
    services: many(flashTemplateIntroductionServicesTable),
  })
);

export const flashTemplateIntroductionServicesRelations = relations(
  flashTemplateIntroductionServicesTable,
  ({ one }) => ({
    introduction: one(flashTemplateIntroductionTable, {
      fields: [flashTemplateIntroductionServicesTable.introductionId],
      references: [flashTemplateIntroductionTable.id],
    }),
  })
);