import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const plansTable = pgTable("plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  planName: varchar("plan_name", { length: 255 }).notNull(),
});
