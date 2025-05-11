"use server";

import { personUserTable } from "#/lib/db/schema/users";
import { db } from "#/lib/db";

export async function createPersonalAccount() {
  await db.insert(personUserTable).values({
    email: "",
    created_at: new Date(),
    updated_at: new Date(),
  });
}
