import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateDeliverablesTable = pgTable("flash_template_deliverables", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const flashTemplateDeliverablesListTable = pgTable("flash_template_deliverables_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  deliverablesSectionId: uuid("deliverables_section_id")
    .notNull()
    .references(() => flashTemplateDeliverablesTable.id, { onDelete: "cascade" }),
  
  deliveryName: text("delivery_name").notNull(),
  hideDeliveryName: boolean("hide_delivery_name").default(false),
  
  deliveryContent: text("delivery_content").notNull(),
  hideDeliveryContent: boolean("hide_delivery_content").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateDeliverablesRelations = relations(
  flashTemplateDeliverablesTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateDeliverablesTable.projectId],
      references: [projectsTable.id],
    }),
    deliverablesList: many(flashTemplateDeliverablesListTable),
  })
);

export const flashTemplateDeliverablesListRelations = relations(
  flashTemplateDeliverablesListTable,
  ({ one }) => ({
    deliverablesSection: one(flashTemplateDeliverablesTable, {
      fields: [flashTemplateDeliverablesListTable.deliverablesSectionId],
      references: [flashTemplateDeliverablesTable.id],
    }),
  })
);