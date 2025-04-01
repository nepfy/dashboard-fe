import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const proposalsTable = pgTable("proposals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectName: varchar({ length: 255 }).notNull(),
  clientName: varchar({ length: 255 }).notNull(),
  clientAddress: varchar({ length: 255 }).notNull(),
  proposalSentDate: timestamp("proposalSentDate", { mode: "date" }).notNull(),
  proposalStatus: varchar({ length: 255 }).notNull(),
  createdAt: varchar({ length: 255 }).notNull(),
  updatedAt: varchar({ length: 255 }).notNull(),
  archivedAt: varchar({ length: 255 }),
});
