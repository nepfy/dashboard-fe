"use server";

import { personUserTable, companyUserTable } from "#/lib/db/schema/users";
import { db } from "#/lib/db";

export async function createPersonalAccount() {
  await db.insert(personUserTable).values({
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function createCompanyAccount() {
  await db.insert(companyUserTable).values({
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
