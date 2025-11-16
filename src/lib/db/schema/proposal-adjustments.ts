import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";
import { projectsTable } from "./projects";

/**
 * Proposal Adjustment Types
 */
export type AdjustmentType =
  | "change_values_or_plans" // Alterar valores ou planos
  | "change_scope" // Alterar escopo
  | "change_timeline" // Alterar prazo
  | "other"; // Outro

/**
 * Adjustment Status
 */
export type AdjustmentStatus =
  | "pending" // Pendente
  | "reviewed" // Revisado
  | "resolved" // Resolvido
  | "rejected"; // Rejeitado

/**
 * Proposal Adjustments Table
 * Stores client-requested adjustments for proposals
 */
export const proposalAdjustmentsTable = pgTable("proposal_adjustments", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  
  // Project reference
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  
  // Adjustment details
  type: varchar("type", { length: 50 }).notNull().$type<AdjustmentType>(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 })
    .notNull()
    .default("pending")
    .$type<AdjustmentStatus>(),
  
  // Client information
  clientName: varchar("client_name", { length: 255 }),
  requestedBy: varchar("requested_by", { length: 255 }), // Nome de quem solicitou
  
  // Additional metadata (JSON)
  metadata: jsonb("metadata"),
  
  // Resolution information
  resolvedAt: timestamp("resolved_at", { mode: "date" }),
  resolvedBy: uuid("resolved_by"), // User ID who resolved it
  
  ...timestamps,
});

/**
 * Proposal Acceptances Table
 * Stores information about proposal acceptances
 */
export const proposalAcceptancesTable = pgTable("proposal_acceptances", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  
  // Project reference
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  
  // Acceptance details
  chosenPlan: varchar("chosen_plan", { length: 255 }), // Nome do plano escolhido
  chosenPlanValue: varchar("chosen_plan_value", { length: 100 }), // Valor do plano (ex: "R$ 3.500,00 mensal")
  
  // Client information
  clientName: varchar("client_name", { length: 255 }),
  acceptedBy: varchar("accepted_by", { length: 255 }), // Nome de quem aceitou
  
  // Additional metadata (JSON)
  metadata: jsonb("metadata"),
  
  ...timestamps,
});

// Relations
export const proposalAdjustmentsRelations = relations(
  proposalAdjustmentsTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [proposalAdjustmentsTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

export const proposalAcceptancesRelations = relations(
  proposalAcceptancesTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [proposalAcceptancesTable.projectId],
      references: [projectsTable.id],
    }),
  })
);

