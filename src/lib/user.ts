import { db } from "#/lib/db";
import { eq } from "drizzle-orm";
import { personUserTable } from "#/lib/db/schema/users";

export async function getPersonIdByEmail(
  emailAddress: string
): Promise<string | null> {
  const result = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return result[0]?.id || null;
}

