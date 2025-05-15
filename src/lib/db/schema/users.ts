import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps, address } from "#/lib/db/schema/helpers/columns.helpers";
import {
  jobTypesTable,
  discoverySourcesTable,
  usedBeforeSourceTable,
} from "./onboarding";

export const personUserTable = pgTable("person_user", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  userName: varchar("user_name", { length: 255 }).unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  cpf: varchar({ length: 255 }),
  phone: varchar({ length: 255 }),
  ...address,
  ...timestamps,
  userJobType: integer("user_job_type"),
  userDiscovery: integer("user_discovery"),
  userUsedBefore: integer("user_used_before"),
});

export const companyUserTable = pgTable("company_user", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  personId: uuid("person_id")
    .notNull()
    .references(() => personUserTable.id)
    .unique(),
  name: varchar({ length: 255 }),
  cnpj: varchar({ length: 255 }),
  phone: varchar({ length: 255 }),
  ...address,
  ...timestamps,
  userJobType: integer("user_job_type"),
  userDiscovery: integer("user_discovery"),
  userUsedBefore: integer("user_used_before"),
});

export const personUserRelations = relations(personUserTable, ({ one }) => ({
  companyUser: one(companyUserTable, {
    fields: [personUserTable.id],
    references: [companyUserTable.personId],
  }),
  jobType: one(jobTypesTable, {
    fields: [personUserTable.userJobType],
    references: [jobTypesTable.id],
  }),
  discoverySource: one(discoverySourcesTable, {
    fields: [personUserTable.userDiscovery],
    references: [discoverySourcesTable.id],
  }),
  usedBeforeSource: one(usedBeforeSourceTable, {
    fields: [personUserTable.userUsedBefore],
    references: [usedBeforeSourceTable.id],
  }),
}));

export const companyUserRelations = relations(companyUserTable, ({ one }) => ({
  personUser: one(personUserTable, {
    fields: [companyUserTable.personId],
    references: [personUserTable.id],
  }),
  jobType: one(jobTypesTable, {
    fields: [companyUserTable.userJobType],
    references: [jobTypesTable.id],
  }),
  discoverySource: one(discoverySourcesTable, {
    fields: [companyUserTable.userDiscovery],
    references: [discoverySourcesTable.id],
  }),
  usedBeforeSource: one(usedBeforeSourceTable, {
    fields: [companyUserTable.userUsedBefore],
    references: [usedBeforeSourceTable.id],
  }),
}));
