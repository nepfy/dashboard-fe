import {
  integer,
  pgTable,
  uuid,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps, address } from "#/lib/db/schema/helpers/columns.helpers";
import { personUserTable } from "#/lib/db/schema/users";

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  personId: uuid("person_id")
    .notNull()
    .references(() => personUserTable.id)
    .unique(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  ...address,
  projectSentDate: timestamp("project_sent_date", { mode: "date" }).notNull(),
  projectStatus: varchar("project_status", { length: 255 }).notNull(),
  ...timestamps,
});

export const projectUserRelations = relations(projectsTable, ({ one }) => ({
  personUser: one(personUserTable, {
    fields: [projectsTable.personId],
    references: [personUserTable.id],
  }),
}));
