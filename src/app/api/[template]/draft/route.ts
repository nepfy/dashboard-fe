import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  isValidTemplate,
  getTemplateDisplayName,
  type TemplateType,
} from "#/lib/db/helpers/template-tables";
import { saveTemplateDraft } from "#/lib/db/helpers/template-data-savers";

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ template: string }> }
) {
  try {
    const { template } = await params;

    // Validate template type
    if (!isValidTemplate(template)) {
      return NextResponse.json(
        {
          success: false,
          error: `Template inválido. Templates válidos: flash, prime, minimal`,
        },
        { status: 400 }
      );
    }

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

    const body = await request.json();
    const { projectData, templateData, projectId } = body;

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const templateDisplayName = getTemplateDisplayName(template);

    // Create or update main project
    const mainProjectData = {
      personId: userId,
      projectName:
        projectData.projectName ||
        `Rascunho ${templateDisplayName} ${new Date().toLocaleDateString()}`,
      clientName: projectData.clientName || "Cliente não informado",
      templateType: template as TemplateType,
      projectStatus: "draft" as const,
      mainColor: projectData.mainColor || "#3B82F6",
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      isProposalGenerated: false,
      created_at: projectId ? undefined : new Date(),
      updated_at: new Date(),
    };

    let savedProject;

    if (projectId) {
      // Update existing project
      const existingProject = await db
        .select()
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId),
            eq(projectsTable.templateType, template)
          )
        )
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Projeto ${templateDisplayName} não encontrado`,
          },
          { status: 404 }
        );
      }

      savedProject = await db
        .update(projectsTable)
        .set({
          ...mainProjectData,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId),
            eq(projectsTable.templateType, template)
          )
        )
        .returning();
    } else {
      // Create new project
      savedProject = await db
        .insert(projectsTable)
        .values(mainProjectData)
        .returning();
    }

    if (savedProject.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Falha ao salvar rascunho ${templateDisplayName}`,
        },
        { status: 500 }
      );
    }

    const finalProjectId = savedProject[0].id;

    // Save template-specific data using generic helper
    await saveTemplateDraft(template, finalProjectId, templateData);

    return NextResponse.json({
      success: true,
      message: `Rascunho ${templateDisplayName} salvo com sucesso`,
      data: savedProject[0],
    });
  } catch (error) {
    console.error("Error saving template draft:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}

