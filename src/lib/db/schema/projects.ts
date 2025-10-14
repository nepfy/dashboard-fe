import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";
import { personUserTable } from "#/lib/db/schema/users";
import type { ProposalData } from "#/types/proposal-data";

export const projectsTable = pgTable("projects", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  personId: uuid("person_id")
    .notNull()
    .references(() => personUserTable.id),

  projectName: text("project_name").notNull(),
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

  projectUrl: varchar("project_url", { length: 255 }),
  pagePassword: varchar("page_password", { length: 255 }),

  isPublished: boolean("is_published").default(false),
  isProposalGenerated: boolean("is_proposal_generated").default(false),

  // Unified proposal data - replaces 29+ separate tables with a single JSON field
  proposalData: jsonb("proposal_data").$type<ProposalData>(),

  ...timestamps,
});

// Relations
export const projectUserRelations = relations(projectsTable, ({ one }) => ({
  personUser: one(personUserTable, {
    fields: [projectsTable.personId],
    references: [personUserTable.id],
  }),
}));
