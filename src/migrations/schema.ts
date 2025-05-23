import {
  pgTable,
  integer,
  varchar,
  timestamp,
  unique,
  uuid,
  foreignKey,
} from "drizzle-orm/pg-core";

export const onboardingUsedBefore = pgTable("onboarding_used_before", {
  id: integer().primaryKey().notNull(),
  name: varchar({ length: 50 }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

export const onboardingDiscovery = pgTable("onboarding_discovery", {
  id: integer().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

export const plans = pgTable("plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    name: "plans_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  planName: varchar("plan_name", { length: 255 }).notNull(),
});

export const onboardingJobTypes = pgTable("onboarding_job_types", {
  id: integer().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { mode: "string" }),
});

export const personUser = pgTable(
  "person_user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    email: varchar({ length: 255 }).notNull(),
    cpf: varchar({ length: 255 }),
    phone: varchar({ length: 255 }),
    street: varchar({ length: 255 }),
    number: varchar({ length: 255 }),
    neighborhood: varchar({ length: 255 }),
    state: varchar({ length: 255 }),
    city: varchar({ length: 255 }),
    cep: varchar({ length: 255 }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    userJobType: integer("user_job_type"),
    userDiscovery: integer("user_discovery"),
    userUsedBefore: integer("user_used_before"),
    additionalAddress: varchar("additional_address", { length: 255 }),
    userName: varchar("user_name", { length: 255 }),
  },
  (table) => [
    unique("person_user_email_unique").on(table.email),
    unique("person_user_user_name_unique").on(table.userName),
  ]
);

export const companyUser = pgTable(
  "company_user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 255 }),
    cnpj: varchar({ length: 255 }),
    phone: varchar({ length: 255 }),
    street: varchar({ length: 255 }),
    number: varchar({ length: 255 }),
    neighborhood: varchar({ length: 255 }),
    state: varchar({ length: 255 }),
    city: varchar({ length: 255 }),
    cep: varchar({ length: 255 }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
    userJobType: integer("user_job_type"),
    userDiscovery: integer("user_discovery"),
    userUsedBefore: integer("user_used_before"),
    additionalAddress: varchar("additional_address", { length: 255 }),
    personId: uuid("person_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.personId],
      foreignColumns: [personUser.id],
      name: "company_user_person_id_person_user_id_fk",
    }),
    unique("company_user_person_id_unique").on(table.personId),
  ]
);

export const projects = pgTable(
  "projects",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    personId: uuid("person_id").notNull(),
    projectName: varchar("project_name", { length: 255 }).notNull(),
    clientName: varchar("client_name", { length: 255 }).notNull(),
    street: varchar({ length: 255 }),
    number: varchar({ length: 255 }),
    neighborhood: varchar({ length: 255 }),
    state: varchar({ length: 255 }),
    city: varchar({ length: 255 }),
    cep: varchar({ length: 255 }),
    additionalAddress: varchar("additional_address", { length: 255 }),
    projectSentDate: timestamp("project_sent_date", {
      mode: "string",
    }).notNull(),
    projectValidUntil: timestamp("project_valid_until", {
      mode: "string",
    }).notNull(),
    projectStatus: varchar("project_status", { length: 255 }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
  },
  (table) => [
    foreignKey({
      columns: [table.personId],
      foreignColumns: [personUser.id],
      name: "projects_person_id_person_user_id_fk",
    }),
    unique("projects_person_id_unique").on(table.personId),
  ]
);
