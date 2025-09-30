import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateClientsTable = pgTable("flash_template_clients", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  ...timestamps,
});

export const flashTemplateClientsListTable = pgTable("flash_template_clients_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  clientsSectionId: uuid("clients_section_id")
    .notNull()
    .references(() => flashTemplateClientsTable.id, { onDelete: "cascade" }),
  
  logo: text("logo").notNull(),
  hideLogo: boolean("hide_logo").default(false),
  
  name: text("name").notNull(),
  hideName: boolean("hide_name").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateClientsRelations = relations(
  flashTemplateClientsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateClientsTable.projectId],
      references: [projectsTable.id],
    }),
    clientsList: many(flashTemplateClientsListTable),
  })
);

export const flashTemplateClientsListRelations = relations(
  flashTemplateClientsListTable,
  ({ one }) => ({
    clientsSection: one(flashTemplateClientsTable, {
      fields: [flashTemplateClientsListTable.clientsSectionId],
      references: [flashTemplateClientsTable.id],
    }),
  })
);