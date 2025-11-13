/**
 * Proposal Events Webhook
 * Handles incoming events from proposals (viewed, accepted, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { NotificationHelper } from "#/lib/services/notification-helper";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema";
import { eq } from "drizzle-orm";

interface ProposalEventPayload {
  event:
    | "proposal_viewed"
    | "proposal_accepted"
    | "proposal_rejected"
    | "proposal_feedback";
  projectId: string;
  clientName?: string;
  feedbackText?: string;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    // In production, you should verify the webhook signature
    const body: ProposalEventPayload = await request.json();

    const { event, projectId, clientName, feedbackText } = body;

    // Get project details
    const [project] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const userId = project.personId;
    const projectName = project.projectName || "Sem nome";
    const client = clientName || project.clientName || "Cliente";

    // Create appropriate notification based on event type
    let notification = null;

    switch (event) {
      case "proposal_viewed":
        notification = await NotificationHelper.notifyProposalViewed(
          userId,
          projectId,
          projectName,
          client
        );

        // Update project visualization date if not set
        if (!project.projectVisualizationDate) {
          await db
            .update(projectsTable)
            .set({
              projectVisualizationDate: new Date(),
              updated_at: new Date(),
            })
            .where(eq(projectsTable.id, projectId));
        }
        break;

      case "proposal_accepted":
        notification = await NotificationHelper.notifyProposalAccepted(
          userId,
          projectId,
          projectName,
          client
        );

        // Update project status to approved
        await db
          .update(projectsTable)
          .set({
            projectStatus: "approved",
            updated_at: new Date(),
          })
          .where(eq(projectsTable.id, projectId));
        break;

      case "proposal_rejected":
        notification = await NotificationHelper.notifyProposalRejected(
          userId,
          projectId,
          projectName,
          client
        );

        // Update project status to rejected
        await db
          .update(projectsTable)
          .set({
            projectStatus: "rejected",
            updated_at: new Date(),
          })
          .where(eq(projectsTable.id, projectId));
        break;

      case "proposal_feedback":
        notification = await NotificationHelper.notifyProposalFeedback(
          userId,
          projectId,
          projectName,
          client,
          feedbackText
        );
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Unknown event type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error processing proposal event:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error processing event",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
