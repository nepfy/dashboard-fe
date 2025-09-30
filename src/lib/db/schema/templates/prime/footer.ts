import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateFooterTable = pgTable("prime_template_footer", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  // Footer section cannot be hidden (default is false)
  
  thankYouTitle: text("thank_you_title"),
  hideThankYouTitle: boolean("hide_thank_you_title").default(false),
  
  thankYouMessage: text("thank_you_message"),
  hideThankYouMessage: boolean("hide_thank_you_message").default(false),
  
  disclaimer: text("disclaimer"),
  hideDisclaimer: boolean("hide_disclaimer").default(false),
  
  email: text("email").notNull(), // Comes from Introduction
  
  buttonTitle: text("button_title").notNull(), // Comes from Introduction
  
  validity: timestamp("validity", { mode: "date" }).notNull(),
  
  ...timestamps,
});

export const primeTemplateFooterRelations = relations(
  primeTemplateFooterTable,
  ({ one }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateFooterTable.projectId],
      references: [projectsTable.id],
    }),
  })
);