// src/app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import {
  projectsTable,
  projectTeamMembersTable,
  projectExpertiseTable,
} from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
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

    const { id: projectId } = await params;

    const personResult = await db
      .select({
        id: personUserTable.id,
      })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress));

    if (!personResult[0]?.id) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = personResult[0].id;

    const project = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Get team members
    const teamMembers = await db
      .select()
      .from(projectTeamMembersTable)
      .where(eq(projectTeamMembersTable.projectId, projectId))
      .orderBy(projectTeamMembersTable.sortOrder);

    // Get expertise
    const expertise = await db
      .select()
      .from(projectExpertiseTable)
      .where(eq(projectExpertiseTable.projectId, projectId))
      .orderBy(projectExpertiseTable.sortOrder);

    // Combine project data with relations
    const projectWithRelations = {
      ...project[0],
      teamMembers: teamMembers || [],
      expertise: expertise || [],
    };

    return NextResponse.json({
      success: true,
      data: projectWithRelations,
    });
  } catch (error) {
    console.error("Error loading project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
