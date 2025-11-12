import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import { prepareProjectSlug } from "#/lib/project-slug";

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

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error loading project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Check if project exists and belongs to user
    const existingProject = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    let projectSlug = existingProject[0].projectUrl;

    if (body.projectUrl !== undefined) {
      projectSlug =
        (await prepareProjectSlug({
          userId,
          desiredSlug: body.projectUrl,
          fallbackValue: body.clientName ?? existingProject[0].clientName,
          projectIdToExclude: projectId,
        })) ?? null;
    }

    // Parse and validate date fields
    const parseDate = (dateValue: Date | string | null): Date | null => {
      if (!dateValue) return null;
      if (dateValue instanceof Date) return dateValue;
      if (typeof dateValue === "string") {
        const parsed = new Date(dateValue);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    };

    // Update project with new data
    const updatedProject = await db
      .update(projectsTable)
      .set({
        id: body.id,
        personId: body.personId,
        clientName: body.clientName,
        projectName: body.projectName,
        projectSentDate: parseDate(body.projectSentDate),
        projectValidUntil: parseDate(body.projectValidUntil),
        projectStatus: body.projectStatus,
        projectVisualizationDate: parseDate(body.projectVisualizationDate),
        templateType: body.templateType,
        mainColor: body.mainColor,
        projectUrl: projectSlug,
        pagePassword: body.pagePassword,
        isPublished: body.isPublished ?? true,
        isProposalGenerated: body.isProposalGenerated,
        proposalData: body.proposalData,
        buttonConfig: body.buttonConfig,
        updated_at: new Date(),
      })
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .returning();

    return NextResponse.json({
      success: true,
      message: "Projeto atualizado com sucesso",
      data: updatedProject[0],
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
