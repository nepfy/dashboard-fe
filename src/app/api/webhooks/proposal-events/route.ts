/**
 * Proposal Events Webhook
 * Handles incoming events from proposals (viewed, accepted, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { NotificationHelper } from "#/lib/services/notification-helper";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema";
import {
  proposalAdjustmentsTable,
  proposalAcceptancesTable,
} from "#/lib/db/schema";
import { eq, sql } from "drizzle-orm";

interface ProposalEventPayload {
  event:
    | "proposal_viewed"
    | "proposal_accepted"
    | "proposal_rejected"
    | "proposal_feedback";
  projectId: string;
  clientName?: string;
  feedbackText?: string;
  feedbackType?: "adjustment_request" | "question" | "other";
  adjustmentType?: "change_values_or_plans" | "change_scope" | "change_timeline" | "other";
  chosenPlan?: string;
  chosenPlanValue?: string;
  acceptedBy?: string;
  requestedBy?: string;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    // In production, you should verify the webhook signature
    const body: ProposalEventPayload = await request.json();

    const {
      event,
      projectId,
      clientName,
      feedbackText,
    } = body;

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

        // Increment view count and update visualization date if not set
        await db
          .update(projectsTable)
          .set({
            viewCount: sql`view_count + 1`,
            projectVisualizationDate:
              project.projectVisualizationDate || new Date(),
            updated_at: new Date(),
          })
          .where(eq(projectsTable.id, projectId));
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

        // Store acceptance information
        const acceptanceData = {
          projectId,
          chosenPlan: body.chosenPlan || undefined,
          chosenPlanValue: body.chosenPlanValue || undefined,
          clientName: client,
          acceptedBy: body.acceptedBy || client,
          metadata: {
            timestamp: body.timestamp || new Date().toISOString(),
          },
        };

        // Check if acceptance already exists
        const [existingAcceptance] = await db
          .select()
          .from(proposalAcceptancesTable)
          .where(eq(proposalAcceptancesTable.projectId, projectId))
          .limit(1);

        if (existingAcceptance) {
          await db
            .update(proposalAcceptancesTable)
            .set(acceptanceData)
            .where(eq(proposalAcceptancesTable.id, existingAcceptance.id));
        } else {
          await db.insert(proposalAcceptancesTable).values(acceptanceData);
        }
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

        // If feedback is an adjustment request, store it
        if (
          body.feedbackType === "adjustment_request" &&
          feedbackText &&
          body.adjustmentType
        ) {
          await db.insert(proposalAdjustmentsTable).values({
            projectId,
            type: body.adjustmentType,
            description: feedbackText,
            clientName: client,
            requestedBy: body.requestedBy || client,
            status: "pending",
            metadata: {
              feedbackType: body.feedbackType,
              timestamp: body.timestamp || new Date().toISOString(),
            },
          });
        }
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
