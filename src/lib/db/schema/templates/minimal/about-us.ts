import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const minimalTemplateAboutUsTable = pgTable(
  "minimal_template_about_us",
  {
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
    hideAdditionalDescription1: boolean(
      "hide_additional_description_1"
    ).default(false),

    additionalDescription2: text("additional_description_2"),
    hideAdditionalDescription2: boolean(
      "hide_additional_description_2"
    ).default(false),

    ...timestamps,
  }
);

export const minimalTemplateAboutUsTeamTable = pgTable(
  "minimal_template_about_us_team",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    aboutUsId: uuid("about_us_id")
      .notNull()
      .references(() => minimalTemplateAboutUsTable.id, {
        onDelete: "cascade",
      }),

    photo: text("photo").notNull(),
    hidePhoto: boolean("hide_photo").default(false),

    description: text("description").notNull(),
    hideDescription: boolean("hide_description").default(false),

    sortOrder: integer("sort_order").default(0),

    ...timestamps,
  }
);

export const minimalTemplateAboutUsMarqueeTable = pgTable(
  "minimal_template_about_us_marquee",
  {
    id: uuid().notNull().primaryKey().defaultRandom(),
    aboutUsId: uuid("about_us_id")
      .notNull()
      .references(() => minimalTemplateAboutUsTable.id, {
        onDelete: "cascade",
      }),

    serviceName: text("service_name").notNull(),
    hideService: boolean("hide_service").default(false),

    sortOrder: integer("sort_order").default(0),

    ...timestamps,
  }
);

export const minimalTemplateAboutUsRelations = relations(
  minimalTemplateAboutUsTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [minimalTemplateAboutUsTable.projectId],
      references: [projectsTable.id],
    }),
    team: many(minimalTemplateAboutUsTeamTable),
    marquee: many(minimalTemplateAboutUsMarqueeTable),
  })
);

export const minimalTemplateAboutUsTeamRelations = relations(
  minimalTemplateAboutUsTeamTable,
  ({ one }) => ({
    aboutUs: one(minimalTemplateAboutUsTable, {
      fields: [minimalTemplateAboutUsTeamTable.aboutUsId],
      references: [minimalTemplateAboutUsTable.id],
    }),
  })
);

export const minimalTemplateAboutUsMarqueeRelations = relations(
  minimalTemplateAboutUsMarqueeTable,
  ({ one }) => ({
    aboutUs: one(minimalTemplateAboutUsTable, {
      fields: [minimalTemplateAboutUsMarqueeTable.aboutUsId],
      references: [minimalTemplateAboutUsTable.id],
    }),
  })
);
