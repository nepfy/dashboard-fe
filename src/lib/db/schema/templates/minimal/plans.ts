import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const minimalTemplatePlansTable = pgTable("minimal_template_plans", {
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

export const minimalTemplatePlansListTable = pgTable(
  "minimal_template_plans_list",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    plansSectionId: uuid("plans_section_id")
      .notNull()
      .references(() => minimalTemplatePlansTable.id, { onDelete: "cascade" }),

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
  }
);

export const minimalTemplatePlansIncludedItemsTable = pgTable(
  "minimal_template_plans_included_items",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => minimalTemplatePlansListTable.id, {
        onDelete: "cascade",
      }),

    description: text("description").notNull(),
    hideDescription: boolean("hide_description").default(false),

    sortOrder: integer("sort_order").default(0),

    ...timestamps,
  }
);

export const minimalTemplatePlansRelations = relations(
  minimalTemplatePlansTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [minimalTemplatePlansTable.projectId],
      references: [projectsTable.id],
    }),
    plansList: many(minimalTemplatePlansListTable),
  })
);

export const minimalTemplatePlansListRelations = relations(
  minimalTemplatePlansListTable,
  ({ one, many }) => ({
    plansSection: one(minimalTemplatePlansTable, {
      fields: [minimalTemplatePlansListTable.plansSectionId],
      references: [minimalTemplatePlansTable.id],
    }),
    includedItems: many(minimalTemplatePlansIncludedItemsTable),
  })
);

export const minimalTemplatePlansIncludedItemsRelations = relations(
  minimalTemplatePlansIncludedItemsTable,
  ({ one }) => ({
    plan: one(minimalTemplatePlansListTable, {
      fields: [minimalTemplatePlansIncludedItemsTable.planId],
      references: [minimalTemplatePlansListTable.id],
    }),
  })
);
