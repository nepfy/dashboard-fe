import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateDeliverablesTable = pgTable("prime_template_deliverables", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  // Deliverables section cannot be hidden (default is false)
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const primeTemplateDeliverablesListTable = pgTable("prime_template_deliverables_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  deliverablesSectionId: uuid("deliverables_section_id")
    .notNull()
    .references(() => primeTemplateDeliverablesTable.id, { onDelete: "cascade" }),
  
  deliveryName: text("delivery_name").notNull(),
  hideDeliveryName: boolean("hide_delivery_name").default(false),
  
  deliveryContent: text("delivery_content").notNull(),
  hideDeliveryContent: boolean("hide_delivery_content").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateDeliverablesRelations = relations(
  primeTemplateDeliverablesTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateDeliverablesTable.projectId],
      references: [projectsTable.id],
    }),
    deliverablesList: many(primeTemplateDeliverablesListTable),
  })
);

export const primeTemplateDeliverablesListRelations = relations(
  primeTemplateDeliverablesListTable,
  ({ one }) => ({
    deliverablesSection: one(primeTemplateDeliverablesTable, {
      fields: [primeTemplateDeliverablesListTable.deliverablesSectionId],
      references: [primeTemplateDeliverablesTable.id],
    }),
  })
);