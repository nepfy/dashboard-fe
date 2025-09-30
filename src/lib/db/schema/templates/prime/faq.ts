import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateFaqTable = pgTable("prime_template_faq", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  subtitle: text("subtitle"),
  hideSubtitle: boolean("hide_subtitle").default(false),
  
  ...timestamps,
});

export const primeTemplateFaqListTable = pgTable("prime_template_faq_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  faqSectionId: uuid("faq_section_id")
    .notNull()
    .references(() => primeTemplateFaqTable.id, { onDelete: "cascade" }),
  
  question: text("question").notNull(),
  hideQuestion: boolean("hide_question").default(false),
  
  answer: text("answer").notNull(),
  hideAnswer: boolean("hide_answer").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateFaqRelations = relations(
  primeTemplateFaqTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateFaqTable.projectId],
      references: [projectsTable.id],
    }),
    faqList: many(primeTemplateFaqListTable),
  })
);

export const primeTemplateFaqListRelations = relations(
  primeTemplateFaqListTable,
  ({ one }) => ({
    faqSection: one(primeTemplateFaqTable, {
      fields: [primeTemplateFaqListTable.faqSectionId],
      references: [primeTemplateFaqTable.id],
    }),
  })
);