// src/app/api/user-account/route.ts
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

    const emailAddress = user?.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "User email not found" },
        { status: 404 }
      );
    }

    const personData = await db
      .select()
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress))
      .limit(1);

    if (personData.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const companyData = await db
      .select()
      .from(companyUserTable)
      .where(eq(companyUserTable.personId, personData[0].id))
      .limit(1);

    const userData = {
      ...personData[0],
      companyData: companyData.length > 0 ? companyData[0] : null,
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

    const emailAddress = user?.emailAddresses[0]?.emailAddress;

    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "User email not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { companyData, ...personData } = body;

    const updatedUser = await db
      .update(personUserTable)
      .set({
        ...personData,
        updated_at: new Date(),
      })
      .where(eq(personUserTable.email, emailAddress))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update user" },
        { status: 500 }
      );
    }

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
      companyUser: updatedCompany.length > 0 ? updatedCompany[0] : null,
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
