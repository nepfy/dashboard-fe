import { pgTable, uuid, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const newTemplateAboutUsTable = pgTable("new_template_about_us", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  hideSection: boolean("hide_section").default(false),
  
  validity: timestamp("validity", { mode: "date" }).notNull(),
  
  title: text("title").notNull(),
  
  subtitle: text("subtitle"),
  hideSubtitle: boolean("hide_subtitle").default(false),
  
  mainDescription: text("main_description"),
  hideMainDescription: boolean("hide_main_description").default(false),
  
  additionalDescription1: text("additional_description_1"),
  hideAdditionalDescription1: boolean("hide_additional_description_1").default(false),
  
  additionalDescription2: text("additional_description_2"),
  hideAdditionalDescription2: boolean("hide_additional_description_2").default(false),
  
  ...timestamps,
});

export const newTemplateAboutUsTeamTable = pgTable("new_template_about_us_team", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  aboutUsId: uuid("about_us_id")
    .notNull()
    .references(() => newTemplateAboutUsTable.id, { onDelete: "cascade" }),
  
  photo: text("photo").notNull(),
  hidePhoto: boolean("hide_photo").default(false),
  
  description: text("description").notNull(),
  hideDescription: boolean("hide_description").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplateAboutUsMarqueeTable = pgTable("new_template_about_us_marquee", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  aboutUsId: uuid("about_us_id")
    .notNull()
    .references(() => newTemplateAboutUsTable.id, { onDelete: "cascade" }),
  
  serviceName: text("service_name").notNull(),
  hideService: boolean("hide_service").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const newTemplateAboutUsRelations = relations(
  newTemplateAboutUsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [newTemplateAboutUsTable.projectId],
      references: [projectsTable.id],
    }),
    team: many(newTemplateAboutUsTeamTable),
    marquee: many(newTemplateAboutUsMarqueeTable),
  })
);

export const newTemplateAboutUsTeamRelations = relations(
  newTemplateAboutUsTeamTable,
  ({ one }) => ({
    aboutUs: one(newTemplateAboutUsTable, {
      fields: [newTemplateAboutUsTeamTable.aboutUsId],
      references: [newTemplateAboutUsTable.id],
    }),
  })
);

export const newTemplateAboutUsMarqueeRelations = relations(
  newTemplateAboutUsMarqueeTable,
  ({ one }) => ({
    aboutUs: one(newTemplateAboutUsTable, {
      fields: [newTemplateAboutUsMarqueeTable.aboutUsId],
      references: [newTemplateAboutUsTable.id],
    }),
  })
);