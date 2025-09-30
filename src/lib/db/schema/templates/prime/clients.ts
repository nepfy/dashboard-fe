import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateClientsTable = pgTable("prime_template_clients", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  ...timestamps,
});

export const primeTemplateClientsListTable = pgTable("prime_template_clients_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  clientsSectionId: uuid("clients_section_id")
    .notNull()
    .references(() => primeTemplateClientsTable.id, { onDelete: "cascade" }),
  
  logo: text("logo").notNull(),
  hideLogo: boolean("hide_logo").default(false),
  
  name: text("name").notNull(),
  hideName: boolean("hide_name").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateClientsRelations = relations(
  primeTemplateClientsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateClientsTable.projectId],
      references: [projectsTable.id],
    }),
    clientsList: many(primeTemplateClientsListTable),
  })
);

export const primeTemplateClientsListRelations = relations(
  primeTemplateClientsListTable,
  ({ one }) => ({
    clientsSection: one(primeTemplateClientsTable, {
      fields: [primeTemplateClientsListTable.clientsSectionId],
      references: [primeTemplateClientsTable.id],
    }),
  })
);