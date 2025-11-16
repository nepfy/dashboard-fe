import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { proposalAcceptancesTable } from "#/lib/db/schema";
import { projectsTable } from "#/lib/db/schema";
import { personUserTable } from "#/lib/db/schema/users";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/projects/[id]/acceptance
 * Get acceptance information for a project
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

    // Get acceptance
    const [acceptance] = await db
      .select()
      .from(proposalAcceptancesTable)
      .where(eq(proposalAcceptancesTable.projectId, id))
      .limit(1);

    return NextResponse.json({
      success: true,
      acceptance: acceptance || null,
    });
  } catch (error) {
    console.error("Error fetching acceptance:", error);
    return NextResponse.json(
      {
        error: "Error fetching acceptance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects/[id]/acceptance
 * Create or update acceptance information
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

    const {
      chosenPlan,
      chosenPlanValue,
      clientName,
      acceptedBy,
      metadata,
    } = body;

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

    // Check if acceptance already exists
    const [existing] = await db
      .select()
      .from(proposalAcceptancesTable)
      .where(eq(proposalAcceptancesTable.projectId, id))
      .limit(1);

    let acceptance;

    if (existing) {
      // Update existing acceptance
      [acceptance] = await db
        .update(proposalAcceptancesTable)
        .set({
          chosenPlan,
          chosenPlanValue,
          clientName: clientName || project.clientName || undefined,
          acceptedBy,
          metadata: metadata || undefined,
        })
        .where(eq(proposalAcceptancesTable.id, existing.id))
        .returning();
    } else {
      // Create new acceptance
      [acceptance] = await db
        .insert(proposalAcceptancesTable)
        .values({
          projectId: id,
          chosenPlan,
          chosenPlanValue,
          clientName: clientName || project.clientName || undefined,
          acceptedBy,
          metadata: metadata || undefined,
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      acceptance,
    });
  } catch (error) {
    console.error("Error creating/updating acceptance:", error);
    return NextResponse.json(
      {
        error: "Error creating/updating acceptance",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

