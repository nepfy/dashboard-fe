import { pgTable, uuid, text, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const newTemplatePlansTable = pgTable("new_template_plans", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title"),
  hideTitle: boolean("hide_title").default(false),
  
  subtitle: text("subtitle").notNull(),
  
  ...timestamps,
});

export const newTemplatePlansListTable = pgTable("new_template_plans_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  plansSectionId: uuid("plans_section_id")
    .notNull()
    .references(() => newTemplatePlansTable.id, { onDelete: "cascade" }),
  
  title: text("title").notNull(),
  hideTitleField: boolean("hide_title_field").default(false),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  price: decimal("price", { precision: 15, scale: 2 }),
  hidePrice: boolean("hide_price").default(false),
  
  planPeriod: text("plan_period").notNull(), // monthly, yearly, one-time
  hidePlanPeriod: boolean("hide_plan_period").default(false),
  
  buttonTitle: text("button_title").notNull(),
  hideButtonTitle: boolean("hide_button_title").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplatePlansIncludedItemsTable = pgTable("new_template_plans_included_items", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => newTemplatePlansListTable.id, { onDelete: "cascade" }),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplatePlansRelations = relations(
  newTemplatePlansTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [newTemplatePlansTable.projectId],
      references: [projectsTable.id],
    }),
    plansList: many(newTemplatePlansListTable),
  })
);

export const newTemplatePlansListRelations = relations(
  newTemplatePlansListTable,
  ({ one, many }) => ({
    plansSection: one(newTemplatePlansTable, {
      fields: [newTemplatePlansListTable.plansSectionId],
      references: [newTemplatePlansTable.id],
    }),
    includedItems: many(newTemplatePlansIncludedItemsTable),
  })
);

export const newTemplatePlansIncludedItemsRelations = relations(
  newTemplatePlansIncludedItemsTable,
  ({ one }) => ({
    plan: one(newTemplatePlansListTable, {
      fields: [newTemplatePlansIncludedItemsTable.planId],
      references: [newTemplatePlansListTable.id],
    }),
  })
);