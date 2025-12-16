import { jsonb, pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { personUserTable } from "./users";
import type { TemplateData } from "#/types/template-data";

export const proposalTemplatesTable = pgTable("proposal_templates", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  personId: uuid("person_id")
    .notNull()
    .references(() => personUserTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  templateType: varchar("template_type", { length: 50 }),
  mainColor: varchar("main_color", { length: 7 }),
  templateData: jsonb("template_data").$type<TemplateData>().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const proposalTemplateRelations = relations(
  proposalTemplatesTable,
  ({ one }) => ({
    personUser: one(personUserTable, {
      fields: [proposalTemplatesTable.personId],
      references: [personUserTable.id],
    }),
  })
);

