/**
 * User Database Helpers
 * Common functions for user-related database operations
 */

import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
import { eq } from "drizzle-orm";

/**
 * Get user ID from email address
 * Returns only the user ID
 */
export async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

/**
 * Get user details from email address
 * Returns user ID, first name, and last name
 */
export async function getUserDetailsFromEmail(emailAddress: string): Promise<{
  id: string;
  firstName: string | null;
  lastName: string | null;
} | null> {
  const personResult = await db
    .select({
      id: personUserTable.id,
      firstName: personUserTable.firstName,
      lastName: personUserTable.lastName,
    })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]
    ? {
        id: personResult[0].id,
        firstName: personResult[0].firstName,
        lastName: personResult[0].lastName,
      }
    : null;
}

/**
 * Get full user from email address
 */
export async function getUserFromEmail(emailAddress: string) {
  const personResult = await db
    .select()
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0] || null;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const personResult = await db
    .select()
    .from(personUserTable)
    .where(eq(personUserTable.id, userId));

  return personResult[0] || null;
}

