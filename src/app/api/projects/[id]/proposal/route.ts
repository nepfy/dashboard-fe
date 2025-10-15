/**
 * API Endpoints for unified Proposal Data
 * Replaces 15+ old endpoints with just 3 simple ones
 */

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getProposalData,
  updateProposalData,
  mergeProposalData,
} from "#/lib/db/helpers/proposal-data.helpers";
import type { ProposalData, PartialProposalData } from "#/types/proposal-data";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import { eq, and } from "drizzle-orm";

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

async function verifyProjectOwnership(
  projectId: string,
  userId: string
): Promise<boolean> {
  const project = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(
      and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
    )
    .limit(1);

  return project.length > 0;
}

/**
 * GET /api/projects/[id]/proposal
 * Fetch complete proposal data for a project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
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
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verify ownership
    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Get proposal data
    const proposalData = await getProposalData(projectId);

    if (!proposalData) {
      return NextResponse.json(
        { success: false, error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: proposalData,
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar proposta",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]/proposal
 * Replace entire proposal data
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
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
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verify ownership
    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Parse proposal data
    const proposalData: ProposalData = await request.json();

    // Validate basic structure
    if (!proposalData || typeof proposalData !== "object") {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Update proposal data
    await updateProposalData(projectId, proposalData);

    return NextResponse.json({
      success: true,
      message: "Proposta atualizada com sucesso",
    });
  } catch (error) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar proposta",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/projects/[id]/proposal
 * Partially update proposal data (merge with existing)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
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
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Verify ownership
    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Parse partial proposal data
    const partialData: PartialProposalData = await request.json();

    // Validate basic structure
    if (!partialData || typeof partialData !== "object") {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Merge with existing data
    await mergeProposalData(projectId, partialData);

    return NextResponse.json({
      success: true,
      message: "Proposta atualizada parcialmente",
    });
  } catch (error) {
    console.error("Error patching proposal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar proposta",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
