import { auth } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({
        success: false,
        error: "Not authenticated",
        clerkUserId: null,
      }, { status: 401 });
    }

    // Try to find user in database
    const personResult = await db
      .select({
        id: personUserTable.id,
        email: personUserTable.email,
        clerkUserId: personUserTable.clerkUserId,
        firstName: personUserTable.firstName,
        lastName: personUserTable.lastName,
      })
      .from(personUserTable)
      .where(eq(personUserTable.clerkUserId, clerkUserId))
      .limit(1);

    // Also check if there are any persons at all
    const allPersonsCount = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .limit(10);

    return NextResponse.json({
      success: true,
      clerkUserId,
      personFound: personResult.length > 0,
      person: personResult[0] || null,
      totalPersonsInDb: allPersonsCount.length,
      allPersons: allPersonsCount.map(p => p.id),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

