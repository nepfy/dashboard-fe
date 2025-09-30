import { pgTable, uuid, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateIntroductionTable = pgTable("prime_template_introduction", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" })
    .unique(),
  
  // Introduction section cannot be hidden (default is false)
  
  name: text("name").notNull(),
  
  validity: timestamp("validity", { mode: "date" }).notNull(),
  
  email: text("email").notNull(),
  
  title: text("title").notNull(),
  
  subtitle: text("subtitle").notNull(),
  
  buttonTitle: text("button_title").notNull(),
  
  photo: text("photo"),
  hidePhoto: boolean("hide_photo").default(false),
  
  memberName: text("member_name"),
  hideMemberName: boolean("hide_member_name").default(false),
  
  ...timestamps,
});

export const primeTemplateIntroductionMarqueeTable = pgTable("prime_template_introduction_marquee", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  introductionId: uuid("introduction_id")
    .notNull()
    .references(() => primeTemplateIntroductionTable.id, { onDelete: "cascade" }),
  
  serviceName: text("service_name").notNull(),
  hideService: boolean("hide_service").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateIntroductionRelations = relations(
  primeTemplateIntroductionTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateIntroductionTable.projectId],
      references: [projectsTable.id],
    }),
    marquee: many(primeTemplateIntroductionMarqueeTable),
  })
);

export const primeTemplateIntroductionMarqueeRelations = relations(
  primeTemplateIntroductionMarqueeTable,
  ({ one }) => ({
    introduction: one(primeTemplateIntroductionTable, {
      fields: [primeTemplateIntroductionMarqueeTable.introductionId],
      references: [primeTemplateIntroductionTable.id],
    }),
  })
);