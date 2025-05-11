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
    const userData = await db.query.personUserTable.findFirst({
      where: eq(personUserTable.email, emailAddress),
      with: {
        companyUser: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

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

    const result = await db.transaction(async (tx) => {
      const updatedUser = await tx
        .update(personUserTable)
        .set({
          ...personData,
          updated_at: new Date(),
        })
        .where(eq(personUserTable.email, emailAddress))
        .returning();

      if (updatedUser.length === 0) {
        throw new Error("Failed to update user");
      }

      if (companyData) {
        const existingCompany = await tx
          .select()
          .from(companyUserTable)
          .where(eq(companyUserTable.personId, updatedUser[0].id))
          .limit(1);

        if (existingCompany.length > 0) {
          await tx
            .update(companyUserTable)
            .set({
              ...companyData,
              updated_at: new Date(),
            })
            .where(eq(companyUserTable.id, existingCompany[0].id));
        } else {
          await tx.insert(companyUserTable).values({
            ...companyData,
            personId: updatedUser[0].id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }

      const updatedUserWithCompany = await tx.query.personUserTable.findFirst({
        where: eq(personUserTable.id, updatedUser[0].id),
        with: {
          companyUser: true,
          jobType: true,
          discoverySource: true,
          usedBeforeSource: true,
        },
      });

      return updatedUserWithCompany;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}
