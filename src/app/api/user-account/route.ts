// src/app/api/user-account/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { personUserTable } from "#/lib/db/schema/users";
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

    const userData = await db
      .select()
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: userData[0] });
  } catch (error) {
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

    const updatedUser = await db
      .update(personUserTable)
      .set({
        ...body,
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

    return NextResponse.json({ success: true, data: updatedUser[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}
