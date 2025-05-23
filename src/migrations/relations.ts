import { relations } from "drizzle-orm/relations";
import { personUser, companyUser, projects } from "./schema";

export const companyUserRelations = relations(companyUser, ({one}) => ({
	personUser: one(personUser, {
		fields: [companyUser.personId],
		references: [personUser.id]
	}),
}));

export const personUserRelations = relations(personUser, ({many}) => ({
	companyUsers: many(companyUser),
	projects: many(projects),
}));

export const projectsRelations = relations(projects, ({one}) => ({
	personUser: one(personUser, {
		fields: [projects.personId],
		references: [personUser.id]
	}),
}));