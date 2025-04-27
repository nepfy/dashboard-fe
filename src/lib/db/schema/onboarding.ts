import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const jobTypesTable = pgTable("onboarding_job_types", {
  id: integer().notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const discoverySourcesTable = pgTable("onboarding_discovery", {
  id: integer().notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export const usedBeforeSourceTable = pgTable("onboarding_used_before", {
  id: integer().notNull().primaryKey(),
  name: varchar({ length: 50 }),
  ...timestamps,
});
