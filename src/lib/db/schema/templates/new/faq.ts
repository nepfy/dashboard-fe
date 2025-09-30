import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const newTemplateFaqTable = pgTable("new_template_faq", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  ...timestamps,
});

export const newTemplateFaqListTable = pgTable("new_template_faq_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  faqSectionId: uuid("faq_section_id")
    .notNull()
    .references(() => newTemplateFaqTable.id, { onDelete: "cascade" }),
  
  question: text("question").notNull(),
  hideQuestion: boolean("hide_question").default(false),
  
  answer: text("answer").notNull(),
  hideAnswer: boolean("hide_answer").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplateFaqRelations = relations(
  newTemplateFaqTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [newTemplateFaqTable.projectId],
      references: [projectsTable.id],
    }),
    faqList: many(newTemplateFaqListTable),
  })
);

export const newTemplateFaqListRelations = relations(
  newTemplateFaqListTable,
  ({ one }) => ({
    faqSection: one(newTemplateFaqTable, {
      fields: [newTemplateFaqListTable.faqSectionId],
      references: [newTemplateFaqTable.id],
    }),
  })
);