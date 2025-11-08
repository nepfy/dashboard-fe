import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { persons } from "@/lib/db/schema/persons";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Sync all Clerk users to the persons table
 * This endpoint should be called once to backfill existing users
 */
export async function POST() {
  try {
    const clerk = await clerkClient();
    
    // Get all users from Clerk
    const { data: users, totalCount } = await clerk.users.getUserList({
      limit: 500, // Adjust based on your needs
    });

    console.log(`Found ${totalCount} users in Clerk`);

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Get primary email
        const primaryEmail = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId
        );

        if (!primaryEmail) {
          console.warn(`No primary email for user ${user.id}`);
          errors++;
          continue;
        }

        // Check if user already exists
        const existingPerson = await db
          .select()
          .from(persons)
          .where(eq(persons.clerkUserId, user.id))
          .limit(1);

        const userData = {
          clerkUserId: user.id,
          email: primaryEmail.emailAddress,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || primaryEmail.emailAddress,
        };

        if (existingPerson.length > 0) {
          // Update existing user
          await db
            .update(persons)
            .set(userData)
            .where(eq(persons.clerkUserId, user.id));
          updated++;
        } else {
          // Create new user
          await db.insert(persons).values(userData);
          created++;
        }

        console.log(`Processed user ${user.id}`);
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: users.length,
        created,
        updated,
        errors,
      },
    });
  } catch (error) {
    console.error("Error syncing users:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

