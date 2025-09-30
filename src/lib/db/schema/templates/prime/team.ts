import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { timestamps } from "#/lib/db/schema/helpers/columns.helpers";

export const primeTemplateTeamTable = pgTable("prime_template_team", {
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

export const primeTemplateTeamMembersTable = pgTable("prime_template_team_members", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  teamSectionId: uuid("team_section_id")
    .notNull()
    .references(() => primeTemplateTeamTable.id, { onDelete: "cascade" }),
  
  memberPhoto: text("member_photo").notNull(),
  hideMemberPhoto: boolean("hide_member_photo").default(false),
  
  memberName: text("member_name").notNull(),
  hideMemberName: boolean("hide_member_name").default(false),
  
  memberRole: text("member_role").notNull(),
  hideMemberRole: boolean("hide_member_role").default(false),
  
  sortOrder: integer("sort_order").default(0),
  
  ...timestamps,
});

export const primeTemplateTeamRelations = relations(
  primeTemplateTeamTable,
  ({ one, many }) => ({
    project: one(projectsTable, {
      fields: [primeTemplateTeamTable.projectId],
      references: [projectsTable.id],
    }),
    members: many(primeTemplateTeamMembersTable),
  })
);

export const primeTemplateTeamMembersRelations = relations(
  primeTemplateTeamMembersTable,
  ({ one }) => ({
    teamSection: one(primeTemplateTeamTable, {
      fields: [primeTemplateTeamMembersTable.teamSectionId],
      references: [primeTemplateTeamTable.id],
    }),
  })
);