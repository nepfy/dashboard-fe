// src/lib/db/schema/projects.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps, address } from "#/lib/db/schema/helpers/columns.helpers";
import { personUserTable } from "#/lib/db/schema/users";

export const projectsTable = pgTable("projects", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  personId: uuid("person_id")
    .notNull()
    .references(() => personUserTable.id),

  projectName: varchar("project_name", { length: 255 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  ...address,
  projectSentDate: timestamp("project_sent_date", { mode: "date" }),
  projectValidUntil: timestamp("project_valid_until", {
    mode: "date",
  }).notNull(),
  projectStatus: varchar("project_status", { length: 255 }).notNull(),
  projectVisualizationDate: timestamp("project_visualization_date", {
    mode: "date",
  }),

  templateType: varchar("template_type", { length: 50 }),

  mainColor: varchar("main_color", { length: 7 }),
  companyName: varchar("company_name", { length: 255 }),
  companyEmail: varchar("company_email", { length: 255 }),
  ctaButtonTitle: varchar("cta_button_title", { length: 100 }),
  pageTitle: varchar("page_title", { length: 255 }),
  pageSubtitle: text("page_subtitle"),
  services: text("services"), // comma-separated values or JSON array

  aboutUsTitle: varchar("about_us_title", { length: 255 }),
  aboutUsSubtitle1: text("about_us_subtitle_1"),
  aboutUsSubtitle2: text("about_us_subtitle_2"),

  ourTeamSubtitle: text("our_team_subtitle"),

  expertiseSubtitle: text("expertise_subtitle"),

  resultsSubtitle: text("results_subtitle"),

  processSubtitle: text("process_subtitle"),

  ctaBackgroundImage: text("cta_background_image"), // URL or file path

  investmentTitle: varchar("investment_title", { length: 255 }),

  deliveryServices: text("delivery_services"),

  endMessageTitle: varchar("end_message_title", { length: 255 }),
  endMessageDescription: text("end_message_description"),

  projectUrl: varchar("project_url", { length: 255 }), // Just the project part, not full URL
  pagePassword: varchar("page_password", { length: 255 }),

  isPublished: boolean("is_published").default(false),
  isProposalGenerated: boolean("is_proposal_generated").default(false), // Flag to know if it has proposal data

  ...timestamps,
});

// Team members table
export const projectTeamMembersTable = pgTable("project_team_members", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  photo: text("photo"), // URL or file path
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Expertise/Skills table
export const projectExpertiseTable = pgTable("project_expertise", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  icon: text("icon"), // URL, file path, or icon name
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Results/Case Studies table
export const projectResultsTable = pgTable("project_results", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  photo: text("photo"), // URL or file path
  client: varchar("client", { length: 255 }),
  subtitle: text("subtitle"),
  investment: decimal("investment", { precision: 10, scale: 2 }),
  roi: decimal("roi", { precision: 10, scale: 2 }), // Return on Investment
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Clients table
export const projectClientsTable = pgTable("project_clients", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  logo: text("logo"), // URL or file path
  name: varchar("name", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Process steps table
export const projectProcessStepsTable = pgTable("project_process_steps", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  stepCounter: integer("step_counter").notNull(),
  stepName: varchar("step_name", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Testimonials table
export const projectTestimonialsTable = pgTable("project_testimonials", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  testimonial: text("testimonial").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  photo: text("photo"), // URL or file path
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Services table
export const projectServicesTable = pgTable("project_services", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Plans table
export const projectPlansTable = pgTable("project_plans", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isBestOffer: boolean("is_best_offer").default(false),
  price: decimal("price", { precision: 10, scale: 2 }),
  pricePeriod: varchar("price_period", { length: 50 }), // monthly, yearly, one-time
  ctaButtonTitle: varchar("cta_button_title", { length: 100 }),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Plan details table
export const projectPlanDetailsTable = pgTable("project_plan_details", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => projectPlansTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Terms and conditions table
export const projectTermsConditionsTable = pgTable("project_terms_conditions", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// FAQ table
export const projectFaqTable = pgTable("project_faq", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Relations
export const projectUserRelations = relations(
  projectsTable,
  ({ one, many }) => ({
    personUser: one(personUserTable, {
      fields: [projectsTable.personId],
      references: [personUserTable.id],
    }),
    teamMembers: many(projectTeamMembersTable),
    expertise: many(projectExpertiseTable),
    results: many(projectResultsTable),
    clients: many(projectClientsTable),
    processSteps: many(projectProcessStepsTable),
    testimonials: many(projectTestimonialsTable),
    services: many(projectServicesTable),
    plans: many(projectPlansTable),
    termsConditions: many(projectTermsConditionsTable),
    faq: many(projectFaqTable),
  })
);

export const projectTeamMembersRelations = relations(
  projectTeamMembersTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectTeamMembersTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectExpertiseRelations = relations(
  projectExpertiseTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectExpertiseTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectResultsRelations = relations(
  projectResultsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectResultsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectClientsRelations = relations(
  projectClientsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectClientsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectProcessStepsRelations = relations(
  projectProcessStepsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectProcessStepsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectTestimonialsRelations = relations(
  projectTestimonialsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectTestimonialsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectServicesRelations = relations(
  projectServicesTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectServicesTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectPlansRelations = relations(
  projectPlansTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [projectPlansTable.projectId],
      references: [projectsTable.id],
    }),
    planDetails: many(projectPlanDetailsTable),
  })
);

export const projectPlanDetailsRelations = relations(
  projectPlanDetailsTable,
  ({ one }) => ({
    plan: one(projectPlansTable, {
      fields: [projectPlanDetailsTable.planId],
      references: [projectPlansTable.id],
    }),
  })
);

export const projectTermsConditionsRelations = relations(
  projectTermsConditionsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [projectTermsConditionsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const projectFaqRelations = relations(projectFaqTable, ({ one }) => ({
  project: one(projectsTable, {
    fields: [projectFaqTable.projectId],
    references: [projectsTable.id],
  }),
}));
