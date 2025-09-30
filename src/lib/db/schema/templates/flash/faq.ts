import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateFaqTable = pgTable("flash_template_faq", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  title: text("title"),
  hideTitle: boolean("hide_title").default(false),
  
  ...timestamps,
});

export const flashTemplateFaqListTable = pgTable("flash_template_faq_list", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  faqSectionId: uuid("faq_section_id")
    .notNull()
    .references(() => flashTemplateFaqTable.id, { onDelete: "cascade" }),
  
  question: text("question").notNull(),
  hideQuestion: boolean("hide_question").default(false),
  
  answer: text("answer").notNull(),
  hideAnswer: boolean("hide_answer").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateFaqRelations = relations(
  flashTemplateFaqTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateFaqTable.projectId],
      references: [projectsTable.id],
    }),
    faqList: many(flashTemplateFaqListTable),
  })
);

export const flashTemplateFaqListRelations = relations(
  flashTemplateFaqListTable,
  ({ one }) => ({
    faqSection: one(flashTemplateFaqTable, {
      fields: [flashTemplateFaqListTable.faqSectionId],
      references: [flashTemplateFaqTable.id],
    }),
  })
);