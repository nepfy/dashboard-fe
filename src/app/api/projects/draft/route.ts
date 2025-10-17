import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema/projects";
import { eq, and } from "drizzle-orm/expressions";
import { personUserTable } from "#/lib/db/schema/users";

async function getUserIdFromEmail(emailAddress: string): Promise<{
  id: string;
  firstName: string | null;
  lastName: string | null;
} | null> {
  const personResult = await db
    .select({
      id: personUserTable.id,
      firstName: personUserTable.firstName,
      lastName: personUserTable.lastName,
    })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]
    ? {
        id: personResult[0].id,
        firstName: personResult[0].firstName,
        lastName: personResult[0].lastName,
      }
    : null;
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { formData, templateType, projectId } = body;

    if (!formData || !templateType) {
      return NextResponse.json(
        { success: false, error: "Dados obrigatórios não fornecidos" },
        { status: 400 }
      );
    }

    // If projectId is provided, update existing draft
    if (projectId) {
      const [updatedProject] = await db
        .update(projectsTable)
        .set({
          clientName: formData.clientName || null,
          projectName: formData.projectName || "Proposta - Rascunho",
          projectStatus: "draft",
          templateType: templateType,
          mainColor: formData.mainColor || "#3B82F6",
          updated_at: new Date(),
        })
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId.id)
          )
        )
        .returning();

      if (updatedProject) {
        return NextResponse.json({
          success: true,
          message: "Rascunho atualizado com sucesso",
          data: {
            id: updatedProject.id,
            projectName: updatedProject.projectName,
          },
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Projeto não encontrado" },
          { status: 404 }
        );
      }
    }

    // Create new draft
    const [newProject] = await db
      .insert(projectsTable)
      .values({
        personId: userId.id,
        clientName: formData.clientName || null,
        projectName: formData.projectName || "Rascunho",
        projectStatus: "draft",
        templateType: templateType,
        mainColor: formData.mainColor || "#3B82F6",
        isPublished: false,
        isProposalGenerated: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Rascunho salvo com sucesso",
      data: {
        id: newProject.id,
        projectName: newProject.projectName,
      },
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao salvar rascunho",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
