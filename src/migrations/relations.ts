import { relations } from "drizzle-orm/relations";
import { personUser, companyUser } from "./schema";

export const companyUserRelations = relations(companyUser, ({one}) => ({
	personUser: one(personUser, {
		fields: [companyUser.personId],
		references: [personUser.id]
	}),
}));

export const personUserRelations = relations(personUser, ({many}) => ({
	companyUsers: many(companyUser),
}));