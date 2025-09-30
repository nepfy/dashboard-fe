import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  primeTemplateIntroductionTable,
  primeTemplateAboutUsTable,
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
    const { projectData, templateData, projectId } = body;

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Create or update main project
    const mainProjectData = {
      personId: userId,
      projectName: projectData.projectName || `Rascunho Prime ${new Date().toLocaleDateString()}`,
      clientName: projectData.clientName || "Cliente não informado",
      templateType: "prime" as const,
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
            eq(projectsTable.templateType, "prime")
          )
        )
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json(
          { success: false, error: "Projeto Prime não encontrado" },
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
            eq(projectsTable.templateType, "prime")
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
        { success: false, error: "Falha ao salvar rascunho Prime" },
        { status: 500 }
      );
    }

    const finalProjectId = savedProject[0].id;

    // Save template-specific data for Prime template
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

    // Save About Us section
    if (templateData.aboutUs) {
      await db
        .insert(primeTemplateAboutUsTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.aboutUs.hideSection || false,
          title: templateData.aboutUs.title,
          paragraph1: templateData.aboutUs.paragraph1,
          hideParagraph1: templateData.aboutUs.hideParagraph1 || false,
          paragraph2: templateData.aboutUs.paragraph2,
          hideParagraph2: templateData.aboutUs.hideParagraph2 || false,
        })
        .onConflictDoUpdate({
          target: primeTemplateAboutUsTable.projectId,
          set: {
            hideSection: templateData.aboutUs.hideSection || false,
            title: templateData.aboutUs.title,
            paragraph1: templateData.aboutUs.paragraph1,
            hideParagraph1: templateData.aboutUs.hideParagraph1 || false,
            paragraph2: templateData.aboutUs.paragraph2,
            hideParagraph2: templateData.aboutUs.hideParagraph2 || false,
            updated_at: new Date(),
          },
        });
    }

    // Continue with other sections as needed...
    // (Team, Expertise, Results, etc. - following the same pattern)

    return NextResponse.json({
      success: true,
      message: "Rascunho Prime salvo com sucesso",
      data: savedProject[0],
    });
  } catch (error) {
    console.error("Error saving Prime draft:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}