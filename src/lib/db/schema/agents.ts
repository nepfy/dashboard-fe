import { pgTable, varchar, text, boolean, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

// Service types table
export const serviceTypesTable = pgTable("service_types", {
  id: varchar("id", { length: 50 }).notNull().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

// Template types table
export const templateTypesTable = pgTable("template_types", {
  id: varchar("id", { length: 20 }).notNull().primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

// Main agents table
export const agentsTable = pgTable("agents", {
  id: varchar("id", { length: 50 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sector: varchar("sector", { length: 100 }).notNull(),
  serviceType: varchar("service_type", { length: 50 }).notNull(),
  systemPrompt: text("system_prompt").notNull(),
  expertise: json("expertise").notNull().default([]),
  commonServices: json("common_services").notNull().default([]),
  pricingModel: varchar("pricing_model", { length: 50 }).notNull(),
  proposalStructure: json("proposal_structure").notNull().default([]),
  keyTerms: json("key_terms").notNull().default([]),
  templateConfig: json("template_config"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

// Agent templates table for template-specific configurations
export const agentTemplatesTable = pgTable("agent_templates", {
  id: varchar("id", { length: 50 }).notNull().primaryKey(),
  agentId: varchar("agent_id", { length: 50 })
    .notNull()
    .references(() => agentsTable.id, { onDelete: "cascade" }),
  templateType: varchar("template_type", { length: 20 }).notNull(),
  introductionStyle: text("introduction_style"),
  aboutUsFocus: text("about_us_focus"),
  specialtiesApproach: text("specialties_approach"),
  processEmphasis: text("process_emphasis"),
  investmentStrategy: text("investment_strategy"),
  additionalPrompt: text("additional_prompt"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

// Relations
export const agentsRelations = relations(agentsTable, ({ many }) => ({
  templates: many(agentTemplatesTable),
}));

export const agentTemplatesRelations = relations(
  agentTemplatesTable,
  ({ one }) => ({
    agent: one(agentsTable, {
      fields: [agentTemplatesTable.agentId],
      references: [agentsTable.id],
    }),
  })
);

// Types for TypeScript
export type Agent = typeof agentsTable.$inferSelect;
export type NewAgent = typeof agentsTable.$inferInsert;
export type AgentTemplate = typeof agentTemplatesTable.$inferSelect;
export type NewAgentTemplate = typeof agentTemplatesTable.$inferInsert;
export type ServiceType = typeof serviceTypesTable.$inferSelect;
export type NewServiceType = typeof serviceTypesTable.$inferInsert;
export type TemplateType = typeof templateTypesTable.$inferSelect;
export type NewTemplateType = typeof templateTypesTable.$inferInsert;
