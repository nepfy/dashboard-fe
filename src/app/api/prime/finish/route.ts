import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  primeTemplateIntroductionTable,
} from "#/lib/db/schema/templates/prime";

async function getUserIdFromEmail(emailAddress: string): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { projectData, templateData, projectId, pageUrl, pagePassword } = body;

    // Validate required fields for finishing
    if (!pageUrl || !pagePassword) {
      return NextResponse.json(
        {
          success: false,
          error: "URL e senha são obrigatórios para finalizar projeto Prime",
        },
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

    // Validate project ownership and template type
    if (projectId) {
      const existingProject = await db
        .select()
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId),
            eq(projectsTable.templateType, "prime")
          )
        )
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json(
          { success: false, error: "Projeto Prime não encontrado para finalização" },
          { status: 404 }
        );
      }
    }

    // Update the main project with finalization data
    const projectUpdateData = {
      personId: userId,
      projectName: projectData.projectName || `Proposta Prime ${new Date().toLocaleDateString()}`,
      clientName: projectData.clientName || "Cliente não informado",
      templateType: "prime" as const,
      projectStatus: "draft" as const,
      mainColor: projectData.mainColor || "#3B82F6",
      companyName: projectData.companyName,
      companyEmail: projectData.companyEmail,
      projectUrl: pageUrl,
      pagePassword: pagePassword,
      isProposalGenerated: true,
      projectSentDate: null,
      created_at: projectId ? undefined : new Date(),
      updated_at: new Date(),
    };

    let savedProject;

    if (projectId) {
      // Update existing project
      savedProject = await db
        .update(projectsTable)
        .set({
          ...projectUpdateData,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId),
            eq(projectsTable.templateType, "prime")
          )
        )
        .returning();
    } else {
      // Create new project (unlikely in finish flow, but possible)
      savedProject = await db
        .insert(projectsTable)
        .values(projectUpdateData)
        .returning();
    }

    if (savedProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao finalizar projeto Prime" },
        { status: 500 }
      );
    }

    const finalProjectId = savedProject[0].id;

    // Save/update all template sections with the finalized data
    // Similar to draft but with isProposalGenerated: true
    if (templateData.introduction) {
      const introData = templateData.introduction;
      
      await db
        .insert(primeTemplateIntroductionTable)
        .values({
          projectId: finalProjectId,
          name: introData.name,
          validity: new Date(introData.validity),
          email: introData.email,
          title: introData.title,
          subtitle: introData.subtitle,
          buttonTitle: introData.buttonTitle,
          photo: introData.photo,
          hidePhoto: introData.hidePhoto || false,
          memberName: introData.memberName,
          hideMemberName: introData.hideMemberName || false,
        })
        .onConflictDoUpdate({
          target: primeTemplateIntroductionTable.projectId,
          set: {
            name: introData.name,
            validity: new Date(introData.validity),
            email: introData.email,
            title: introData.title,
            subtitle: introData.subtitle,
            buttonTitle: introData.buttonTitle,
            photo: introData.photo,
            hidePhoto: introData.hidePhoto || false,
            memberName: introData.memberName,
            hideMemberName: introData.hideMemberName || false,
            updated_at: new Date(),
          },
        });
    }

    return NextResponse.json({
      success: true,
      message: "Projeto Prime finalizado com sucesso",
      data: {
        ...savedProject[0],
        projectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${pageUrl}`,
      },
    });
  } catch (error) {
    console.error("Error finishing Prime project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}