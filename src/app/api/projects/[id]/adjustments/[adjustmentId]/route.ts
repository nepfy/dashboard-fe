import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { proposalAdjustmentsTable } from "#/lib/db/schema";
import { projectsTable } from "#/lib/db/schema";
import { personUserTable } from "#/lib/db/schema/users";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; adjustmentId: string }>;
  }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;
    if (!emailAddress) {
      return NextResponse.json({ error: "Email not found" }, { status: 400 });
    }

    const { id, adjustmentId } = await params;

    const [personUser] = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress))
      .limit(1);

    if (!personUser?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, id), eq(projectsTable.personId, personUser.id))
      )
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const [adjustment] = await db
      .select()
      .from(proposalAdjustmentsTable)
      .where(
        and(
          eq(proposalAdjustmentsTable.id, adjustmentId),
          eq(proposalAdjustmentsTable.projectId, id)
        )
      )
      .limit(1);

    if (!adjustment) {
      return NextResponse.json(
        { error: "Adjustment not found" },
        { status: 404 }
      );
    }

    await db
      .update(proposalAdjustmentsTable)
      .set({ deleted_at: new Date() })
      .where(eq(proposalAdjustmentsTable.id, adjustmentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting adjustment:", error);
    return NextResponse.json(
      {
        error: "Error deleting adjustment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

