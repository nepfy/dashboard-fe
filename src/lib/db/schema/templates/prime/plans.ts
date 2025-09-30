import { pgTable, uuid, text, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplatePlansTable = pgTable("prime_template_plans", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title").notNull(),
  
  ...timestamps,
});

export const primeTemplatePlansListTable = pgTable("prime_template_plans_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  plansSectionId: uuid("plans_section_id")
    .notNull()
    .references(() => primeTemplatePlansTable.id, { onDelete: "cascade" }),
  
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

export const primeTemplatePlansIncludedItemsTable = pgTable("prime_template_plans_included_items", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => primeTemplatePlansListTable.id, { onDelete: "cascade" }),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplatePlansRelations = relations(
  primeTemplatePlansTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplatePlansTable.projectId],
      references: [projectsTable.id],
    }),
    plansList: many(primeTemplatePlansListTable),
  })
);

export const primeTemplatePlansListRelations = relations(
  primeTemplatePlansListTable,
  ({ one, many }) => ({
    plansSection: one(primeTemplatePlansTable, {
      fields: [primeTemplatePlansListTable.plansSectionId],
      references: [primeTemplatePlansTable.id],
    }),
    includedItems: many(primeTemplatePlansIncludedItemsTable),
  })
);

export const primeTemplatePlansIncludedItemsRelations = relations(
  primeTemplatePlansIncludedItemsTable,
  ({ one }) => ({
    plan: one(primeTemplatePlansListTable, {
      fields: [primeTemplatePlansIncludedItemsTable.planId],
      references: [primeTemplatePlansListTable.id],
    }),
  })
);