import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { personUserTable, companyUserTable } from "#/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerkUserId = user.id;
    const emailAddress = user.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "User email not found" },
        { status: 404 }
      );
    }

    console.log("🔍 Searching for user with Clerk ID:", clerkUserId);
    console.log("📧 User email:", emailAddress);

    // Search by clerkUserId instead of email
    const personData = await db
      .select()
      .from(personUserTable)
      .where(eq(personUserTable.clerkUserId, clerkUserId))
      .limit(1);

    console.log("📊 Person data found:", personData.length > 0 ? "Yes" : "No");
    if (personData.length > 0) {
      console.log("✅ User found:", personData[0].email);
    }

    if (personData.length === 0) {
      // Try searching by email as fallback
      console.log("⚠️ User not found by Clerk ID, trying by email...");
      const personDataByEmail = await db
        .select()
        .from(personUserTable)
        .where(eq(personUserTable.email, emailAddress))
        .limit(1);

      if (personDataByEmail.length > 0) {
        console.log("✅ User found by email, updating Clerk ID...");
        // Update the clerk_user_id
        await db
          .update(personUserTable)
          .set({ clerkUserId: clerkUserId, updated_at: new Date() })
          .where(eq(personUserTable.email, emailAddress));

        // Re-fetch the user data
        const updatedPersonData = await db
          .select()
          .from(personUserTable)
          .where(eq(personUserTable.clerkUserId, clerkUserId))
          .limit(1);

        if (updatedPersonData.length === 0) {
          return NextResponse.json(
            { success: false, error: "Failed to update user Clerk ID" },
            { status: 500 }
          );
        }

        // Continue with the updated data
        personData.push(updatedPersonData[0]);
      } else {
        console.error("❌ User not found by Clerk ID or email");
        return NextResponse.json(
          { success: false, error: "User not found in database" },
          { status: 404 }
        );
      }
    }

    const companyData = await db
      .select()
      .from(companyUserTable)
      .where(eq(companyUserTable.personId, personData[0].id))
      .limit(1);

    // Merge Clerk data with database data (Clerk data takes precedence for name/email)
    const userData = {
      ...personData[0],
      // Use Clerk data if database fields are null/empty
      // If both are null, extract name from email
      firstName:
        personData[0].firstName ||
        user.firstName ||
        emailAddress.split("@")[0] ||
        "Usuário",
      lastName: personData[0].lastName || user.lastName || null,
      email: personData[0].email || emailAddress,
      companyData: companyData.length > 0 ? companyData[0] : null,
      unsafeMetadata: user.unsafeMetadata,
      publicMetadata: user.publicMetadata,
      stripe: user.unsafeMetadata?.stripe || null,
    };

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clerkUserId = user.id;
    const emailAddress = user.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "User email not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { companyData, ...personData } = body;

    console.log("🔄 Updating user with Clerk ID:", clerkUserId);

    // First, ensure the user has the correct clerkUserId
    const existingUser = await db
      .select()
      .from(personUserTable)
      .where(eq(personUserTable.clerkUserId, clerkUserId))
      .limit(1);

    if (existingUser.length === 0) {
      console.log("⚠️ User not found by Clerk ID, trying by email...");
      // Try to find by email and update the clerkUserId
      const userByEmail = await db
        .select()
        .from(personUserTable)
        .where(eq(personUserTable.email, emailAddress))
        .limit(1);

      if (userByEmail.length > 0) {
        console.log("✅ User found by email, updating Clerk ID first...");
        await db
          .update(personUserTable)
          .set({ clerkUserId: clerkUserId, updated_at: new Date() })
          .where(eq(personUserTable.email, emailAddress));
      } else {
        return NextResponse.json(
          { success: false, error: "User not found in database" },
          { status: 404 }
        );
      }
    }

    // Update by clerkUserId
    const updatedUser = await db
      .update(personUserTable)
      .set({
        ...personData,
        clerkUserId: clerkUserId, // Ensure clerkUserId is always set
        updated_at: new Date(),
      })
      .where(eq(personUserTable.clerkUserId, clerkUserId))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update user" },
        { status: 500 }
      );
    }

    console.log("✅ User updated successfully:", updatedUser[0].email);

    if (companyData) {
      const existingCompany = await db
        .select()
        .from(companyUserTable)
        .where(eq(companyUserTable.personId, updatedUser[0].id))
        .limit(1);

      if (existingCompany.length > 0) {
        await db
          .update(companyUserTable)
          .set({
            ...companyData,
            updated_at: new Date(),
          })
          .where(eq(companyUserTable.id, existingCompany[0].id));
      } else {
        // Create new company
        await db.insert(companyUserTable).values({
          ...companyData,
          personId: updatedUser[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    const updatedCompany = await db
      .select()
      .from(companyUserTable)
      .where(eq(companyUserTable.personId, updatedUser[0].id))
      .limit(1);

    const result = {
      ...updatedUser[0],
      // Merge with Clerk data
      // If both are null, extract name from email
      firstName:
        updatedUser[0].firstName ||
        user.firstName ||
        emailAddress.split("@")[0] ||
        "Usuário",
      lastName: updatedUser[0].lastName || user.lastName || null,
      email: updatedUser[0].email || emailAddress,
      companyData: updatedCompany.length > 0 ? updatedCompany[0] : null,
      unsafeMetadata: user.unsafeMetadata,
      publicMetadata: user.publicMetadata,
      stripe: user.unsafeMetadata?.stripe || null,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}
