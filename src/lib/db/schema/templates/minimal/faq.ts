import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const minimalTemplateFaqTable = pgTable("minimal_template_faq", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),

  hideSection: boolean("hide_section").default(false),

  ...timestamps,
});

export const minimalTemplateFaqListTable = pgTable(
  "minimal_template_faq_list",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    faqSectionId: uuid("faq_section_id")
      .notNull()
      .references(() => minimalTemplateFaqTable.id, { onDelete: "cascade" }),

    question: text("question").notNull(),
    hideQuestion: boolean("hide_question").default(false),

    answer: text("answer").notNull(),
    hideAnswer: boolean("hide_answer").default(false),

    sortOrder: integer("sort_order").default(0),

    ...timestamps,
  }
);

export const minimalTemplateFaqRelations = relations(
  minimalTemplateFaqTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [minimalTemplateFaqTable.projectId],
      references: [projectsTable.id],
    }),
    faqList: many(minimalTemplateFaqListTable),
  })
);

export const minimalTemplateFaqListRelations = relations(
  minimalTemplateFaqListTable,
  ({ one }) => ({
    faqSection: one(minimalTemplateFaqTable, {
      fields: [minimalTemplateFaqListTable.faqSectionId],
      references: [minimalTemplateFaqTable.id],
    }),
  })
);
