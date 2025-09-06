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
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";
import { personUserTable } from "#/lib/db/schema/users";

export const projectsTable = pgTable("projects", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  personId: uuid("person_id")
    .notNull()
    .references(() => personUserTable.id),

  projectName: text("project_name").notNull(),
  hideClientName: boolean("hide_client_name").default(false),
  clientName: text("client_name").notNull(),
  hideClientPhoto: boolean("hide_client_photo").default(false),
  clientPhoto: text("client_photo"),
  projectSentDate: timestamp("project_sent_date", { mode: "date" }),
  projectValidUntil: timestamp("project_valid_until", {
    mode: "date",
  }),
  projectStatus: text("project_status").notNull(),
  projectVisualizationDate: timestamp("project_visualization_date", {
    mode: "date",
  }),

  templateType: varchar("template_type", { length: 50 }),

  mainColor: varchar("main_color", { length: 7 }),
  companyName: text("company_name"),
  companyEmail: text("company_email"),
  ctaButtonTitle: varchar("cta_button_title", { length: 100 }),
  pageTitle: text("page_title"),
  pageSubtitle: text("page_subtitle"),
  hidePageSubtitle: boolean("hide_page_subtitle").default(false),
  services: text("services"),
  hideServices: boolean("hide_services").default(false),

  hideAboutUsSection: boolean("hide_about_us_section").default(false),
  hideAboutUsTitle: boolean("hide_about_us_title").default(false),
  hideAboutUsSubtitle1: boolean("hide_about_us_subtitle_1").default(false),
  hideAboutUsSubtitle2: boolean("hide_about_us_subtitle_2").default(false),
  aboutUsTitle: varchar("about_us_title", { length: 420 }),
  aboutUsSubtitle1: text("about_us_subtitle_1"),
  aboutUsSubtitle2: text("about_us_subtitle_2"),

  hideAboutYourTeamSection: boolean("hide_about_your_team_section").default(
    false
  ),
  ourTeamSubtitle: text("our_team_subtitle"),

  hideExpertiseSection: boolean("hide_expertise_section").default(false),
  expertiseSubtitle: text("expertise_subtitle"),

  hideResultsSection: boolean("hide_results_section").default(false),
  resultsSubtitle: text("results_subtitle"),

  hideClientsSection: boolean("hide_clients_section").default(false),
  clientSubtitle: text("client_subtitle"),

  hideProcessSection: boolean("hide_process_section").default(false),
  hideProcessSubtitle: boolean("hide_process_subtitle").default(false),
  processSubtitle: text("process_subtitle"),

  hideCTASection: boolean("hide_cta_section").default(false),
  ctaBackgroundImage: text("cta_background_image"),

  hideTestimonialsSection: boolean("hide_testimonials_section").default(false),

  hideInvestmentSection: boolean("hide_investment_section").default(false),
  investmentTitle: text("investment_title"),

  hideIncludedServicesSection: boolean(
    "hide_included_services_section"
  ).default(false),

  hidePlansSection: boolean("hide_plans_section").default(false),

  hideTermsSection: boolean("hide_terms_section").default(false),

  hideFaqSection: boolean("hide_faq_section").default(false),
  hideFaqSubtitle: boolean("hide_faq_subtitle").default(false),
  faqSubtitle: text("faq_subtitle"),

  hideFinalMessageSection: boolean("hide_final_message_section").default(false),
  hideFinalMessageSubtitle: boolean("hide_final_message_subtitle").default(
    false
  ),
  endMessageTitle: text("end_message_title"),
  endMessageTitle2: text("end_message_title_2"),
  endMessageDescription: text("end_message_description"),

  projectUrl: varchar("project_url", { length: 255 }), // Just the project part, not full URL
  pagePassword: varchar("page_password", { length: 255 }),

  isPublished: boolean("is_published").default(false),
  isProposalGenerated: boolean("is_proposal_generated").default(false),

  ...timestamps,
});

// Team members table
export const projectTeamMembersTable = pgTable("project_team_members", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role"),
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
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0),
  hideExpertiseIcon: boolean("hide_expertise_icon").default(false),
  ...timestamps,
});

// Results/Case Studies table
export const projectResultsTable = pgTable("project_results", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  hidePhoto: boolean("hide_photo").default(false),
  photo: text("photo"), // URL or file path
  client: text("client"),
  subtitle: text("subtitle"),
  investment: decimal("investment", { precision: 15, scale: 2 }),
  roi: decimal("roi", { precision: 10, scale: 2 }),
  sortOrder: integer("sort_order").default(0),
  ...timestamps,
});

// Clients table
export const projectClientsTable = pgTable("project_clients", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  hideLogo: boolean("hide_logo").default(false),
  logo: text("logo"),
  hideClientName: boolean("hide_client_name").default(false),
  name: text("name").notNull(),
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
  stepName: text("step_name").notNull(),
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
  name: text("name").notNull(),
  role: text("role"),
  photo: text("photo"), // URL or file path
  sortOrder: integer("sort_order").default(0),
  hidePhoto: boolean("hide_photo").default(false),
  ...timestamps,
});

// Services table
export const projectServicesTable = pgTable("project_services", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
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
  title: text("title").notNull(),
  description: text("description"),
  isBestOffer: boolean("is_best_offer").default(false),
  price: decimal("price", { precision: 15, scale: 2 }),
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
