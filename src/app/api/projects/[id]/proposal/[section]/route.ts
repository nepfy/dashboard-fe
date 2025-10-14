/**
 * API Endpoints for individual proposal sections
 */

import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getProposalSection,
  updateProposalSection,
} from "#/lib/db/helpers/proposal-data.helpers";
import type { ProposalData } from "#/types/proposal-data";
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
 * GET /api/projects/[id]/proposal/[section]
 * Fetch a specific section from proposal data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; section: string } }
) {
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

    const projectId = params.id;
    const sectionKey = params.section as keyof ProposalData;

    // Verify ownership
    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Get section data
    const sectionData = await getProposalSection(projectId, sectionKey);

    if (!sectionData) {
      return NextResponse.json(
        { success: false, error: "Seção não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sectionData,
    });
  } catch (error) {
    console.error("Error fetching proposal section:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar seção",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/projects/[id]/proposal/[section]
 * Update a specific section of proposal data
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; section: string } }
) {
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

    const projectId = params.id;
    const sectionKey = params.section as keyof ProposalData;

    // Verify ownership
    const isOwner = await verifyProjectOwnership(projectId, userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Parse section data
    const sectionData = await request.json();

    // Validate basic structure
    if (!sectionData || typeof sectionData !== "object") {
      return NextResponse.json(
        { success: false, error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // Update section
    await updateProposalSection(projectId, sectionKey, sectionData);

    return NextResponse.json({
      success: true,
      message: `Seção ${sectionKey} atualizada com sucesso`,
    });
  } catch (error) {
    console.error("Error updating proposal section:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao atualizar seção",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
