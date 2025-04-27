import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { timestamps, address } from "#/lib/db/schema/helpers/columns.helpers";

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  ...address,
  projectSentDate: timestamp("project_sent_date", { mode: "date" }).notNull(),
  projectStatus: varchar("project_status", { length: 255 }).notNull(),
  ...timestamps,
  archivedAt: varchar("archived_at", { length: 255 }),
});
