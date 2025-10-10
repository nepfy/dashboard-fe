import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const minimalTemplateFooterTable = pgTable("minimal_template_footer", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),

  // Footer section cannot be hidden (default is false)

  callToAction: text("call_to_action").notNull(),

  validity: timestamp("validity", { mode: "date" }).notNull(),

  email: text("email").notNull(),

  whatsapp: text("whatsapp").notNull(),

  ...timestamps,
});

export const minimalTemplateFooterMarqueeTable = pgTable(
  "minimal_template_footer_marquee",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    footerId: uuid("footer_id")
      .notNull()
      .references(() => minimalTemplateFooterTable.id, { onDelete: "cascade" }),

    serviceName: text("service_name").notNull(),
    hideService: boolean("hide_service").default(false),

    sortOrder: integer("sort_order").default(0),

    ...timestamps,
  }
);

export const minimalTemplateFooterRelations = relations(
  minimalTemplateFooterTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [minimalTemplateFooterTable.projectId],
      references: [projectsTable.id],
    }),
    marquee: many(minimalTemplateFooterMarqueeTable),
  })
);

export const minimalTemplateFooterMarqueeRelations = relations(
  minimalTemplateFooterMarqueeTable,
  ({ one }) => ({
    footer: one(minimalTemplateFooterTable, {
      fields: [minimalTemplateFooterMarqueeTable.footerId],
      references: [minimalTemplateFooterTable.id],
    }),
  })
);
