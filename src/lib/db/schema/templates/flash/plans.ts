import { pgTable, uuid, text, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplatePlansTable = pgTable("flash_template_plans", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  ...timestamps,
});

export const flashTemplatePlansListTable = pgTable("flash_template_plans_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  plansSectionId: uuid("plans_section_id")
    .notNull()
    .references(() => flashTemplatePlansTable.id, { onDelete: "cascade" }),
  
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

export const flashTemplatePlansIncludedItemsTable = pgTable("flash_template_plans_included_items", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => flashTemplatePlansListTable.id, { onDelete: "cascade" }),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplatePlansRelations = relations(
  flashTemplatePlansTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplatePlansTable.projectId],
      references: [projectsTable.id],
    }),
    plansList: many(flashTemplatePlansListTable),
  })
);

export const flashTemplatePlansListRelations = relations(
  flashTemplatePlansListTable,
  ({ one, many }) => ({
    plansSection: one(flashTemplatePlansTable, {
      fields: [flashTemplatePlansListTable.plansSectionId],
      references: [flashTemplatePlansTable.id],
    }),
    includedItems: many(flashTemplatePlansIncludedItemsTable),
  })
);

export const flashTemplatePlansIncludedItemsRelations = relations(
  flashTemplatePlansIncludedItemsTable,
  ({ one }) => ({
    plan: one(flashTemplatePlansListTable, {
      fields: [flashTemplatePlansIncludedItemsTable.planId],
      references: [flashTemplatePlansListTable.id],
    }),
  })
);