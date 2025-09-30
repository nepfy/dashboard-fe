import { pgTable, uuid, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const newTemplateFooterTable = pgTable("new_template_footer", {
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

export const newTemplateFooterMarqueeTable = pgTable("new_template_footer_marquee", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  footerId: uuid("footer_id")
    .notNull()
    .references(() => newTemplateFooterTable.id, { onDelete: "cascade" }),
  
  serviceName: text("service_name").notNull(),
  hideService: boolean("hide_service").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplateFooterRelations = relations(
  newTemplateFooterTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [newTemplateFooterTable.projectId],
      references: [projectsTable.id],
    }),
    marquee: many(newTemplateFooterMarqueeTable),
  })
);

export const newTemplateFooterMarqueeRelations = relations(
  newTemplateFooterMarqueeTable,
  ({ one }) => ({
    footer: one(newTemplateFooterTable, {
      fields: [newTemplateFooterMarqueeTable.footerId],
      references: [newTemplateFooterTable.id],
    }),
  })
);