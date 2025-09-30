import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const flashTemplateFooterTable = pgTable("flash_template_footer", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  thankYouMessage: text("thank_you_message").notNull(),
  
  ctaMessage: text("cta_message").notNull(),
  
  disclaimer: text("disclaimer"),
  hideDisclaimer: boolean("hide_disclaimer").default(false),
  
  validity: text("validity").notNull(),
  
  ...timestamps,
});

export const flashTemplateFooterMarqueeTable = pgTable("flash_template_footer_marquee", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  footerId: uuid("footer_id")
    .notNull()
    .references(() => flashTemplateFooterTable.id, { onDelete: "cascade" }),
  
  buttonTitle: text("button_title").notNull(), // Comes from Introduction Section
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const flashTemplateFooterRelations = relations(
  flashTemplateFooterTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [flashTemplateFooterTable.projectId],
      references: [projectsTable.id],
    }),
    marquee: many(flashTemplateFooterMarqueeTable),
  })
);

export const flashTemplateFooterMarqueeRelations = relations(
  flashTemplateFooterMarqueeTable,
  ({ one }) => ({
    footer: one(flashTemplateFooterTable, {
      fields: [flashTemplateFooterMarqueeTable.footerId],
      references: [flashTemplateFooterTable.id],
    }),
  })
);