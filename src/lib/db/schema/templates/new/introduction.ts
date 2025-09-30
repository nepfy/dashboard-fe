import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const newTemplateIntroductionTable = pgTable("new_template_introduction", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  companyName: text("company_name"),
  hideCompanyName: boolean("hide_company_name").default(false),
  
  companyLogo: text("company_logo"),
  hideCompanyLogo: boolean("hide_company_logo").default(false),
  
  buttonTitle: text("button_title").notNull(),
  
  clientName: text("client_name").notNull(),
  
  clientPhoto: text("client_photo"),
  hideClientPhoto: boolean("hide_client_photo").default(false),
  
  title: text("title").notNull(),
  
  validity: timestamp("validity", { mode: "date" }).notNull(),
  
  ...timestamps,
});

export const newTemplateIntroductionPhotosTable = pgTable("new_template_introduction_photos", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  introductionId: uuid("introduction_id")
    .notNull()
    .references(() => newTemplateIntroductionTable.id, { onDelete: "cascade" }),
  
  photo: text("photo").notNull(),
  hidePhoto: boolean("hide_photo").default(false),
  sortOrder: text("sort_order").default("0"),
  
  ...timestamps,
});

export const newTemplateIntroductionRelations = relations(
  newTemplateIntroductionTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [newTemplateIntroductionTable.projectId],
      references: [projectsTable.id],
    }),
    photos: many(newTemplateIntroductionPhotosTable),
  })
);

export const newTemplateIntroductionPhotosRelations = relations(
  newTemplateIntroductionPhotosTable,
  ({ one }) => ({
    introduction: one(newTemplateIntroductionTable, {
      fields: [newTemplateIntroductionPhotosTable.introductionId],
      references: [newTemplateIntroductionTable.id],
    }),
  })
);