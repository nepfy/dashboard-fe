import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { proposalAdjustmentsTable } from "#/lib/db/schema";
import { projectsTable } from "#/lib/db/schema";
import { personUserTable } from "#/lib/db/schema/users";
import { eq, and, desc, isNull } from "drizzle-orm";
import { NotificationHelper } from "#/lib/services/notification-helper";

/**
 * GET /api/projects/[id]/adjustments
 * Get all adjustments for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;
    if (!emailAddress) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    const { id } = await params;

    // Get user ID from email
    const [personUser] = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress))
      .limit(1);

    if (!personUser?.id) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify project belongs to user
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, id), eq(projectsTable.personId, personUser.id))
      )
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get adjustments
    const adjustments = await db
      .select()
      .from(proposalAdjustmentsTable)
      .where(
        and(
          eq(proposalAdjustmentsTable.projectId, id),
          isNull(proposalAdjustmentsTable.deleted_at)
        )
      )
      .orderBy(desc(proposalAdjustmentsTable.created_at));

    return NextResponse.json({
      success: true,
      adjustments,
    });
  } catch (error) {
    console.error("Error fetching adjustments:", error);
    return NextResponse.json(
      {
        error: "Error fetching adjustments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/adjustments
 * Create a new adjustment request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;
    if (!emailAddress) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { type, description, clientName, requestedBy, metadata } = body;

    if (!type || !description) {
      return NextResponse.json(
        { error: "Type and description are required" },
        { status: 400 }
      );
    }

    // Get user ID from email
    const [personUser] = await db
      .select({ id: personUserTable.id })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress))
      .limit(1);

    if (!personUser?.id) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify project belongs to user
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, id), eq(projectsTable.personId, personUser.id))
      )
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Create adjustment
    const [adjustment] = await db
      .insert(proposalAdjustmentsTable)
      .values({
        projectId: id,
        type,
        description,
        clientName: clientName || project.clientName || undefined,
        requestedBy,
        metadata: metadata || undefined,
        status: "pending",
      })
      .returning();

    // 🔔 Create notification for the project owner
    try {
      await NotificationHelper.notifyAdjustmentRequested(
        personUser.id,
        id,
        project.projectName,
        clientName || project.clientName || "Cliente",
        type,
        description
      );
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      adjustment,
    });
  } catch (error) {
    console.error("Error creating adjustment:", error);
    return NextResponse.json(
      {
        error: "Error creating adjustment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

