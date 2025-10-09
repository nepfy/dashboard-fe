import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

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
    const { formData, templateType, projectId } = body;

    // Get the user's person ID
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

    // Convert form data to simplified project data (core metadata only)
    const projectData = {
      personId: userId,
      projectName:
        formData.step1?.projectName ||
        `Rascunho ${new Date().toLocaleDateString()}`,
      projectSentDate: null,
      projectValidUntil: formData.step15?.projectValidUntil
        ? new Date(formData.step15.projectValidUntil)
        : null,
      projectStatus: "draft" as const,
      projectVisualizationDate: null,
      templateType: templateType || "flash",
      mainColor: formData.step1?.mainColor || "#3B82F6",
      projectUrl: formData.step16?.pageUrl || null,
      pagePassword: formData.step16?.pagePassword || null,
      isPublished: false,
      isProposalGenerated: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let savedProject;

    if (projectId) {
      // Update existing draft
      const existingProject = await db
        .select()
        .from(projectsTable)
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId)
          )
        )
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json(
          { success: false, error: "Projeto não encontrado" },
          { status: 404 }
        );
      }

      savedProject = await db
        .update(projectsTable)
        .set({
          ...projectData,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId)
          )
        )
        .returning();
    } else {
      // Create new draft
      savedProject = await db
        .insert(projectsTable)
        .values(projectData)
        .returning();
    }

    if (savedProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao salvar rascunho" },
        { status: 500 }
      );
    }

    // TODO: Implement template-specific data saving for manual form builder
    // The template-specific content (teamMembers, expertise, results, etc.) should be saved
    // to template-specific tables based on the templateType (flash/prime/new).
    // This requires creating save handlers similar to saveFlashTemplateData and savePrimeTemplateData
    // but adapted for the manual form data structure (ProposalFormData).
    //
    // For now, only core project metadata is saved. Template-specific data will be handled
    // in a future update when manual form builder template save handlers are implemented.

    console.log(
      `Draft saved successfully. Project ID: ${savedProject[0].id}, Template: ${templateType}`
    );
    console.log(
      "Note: Template-specific content data is not yet saved to template tables for manual drafts."
    );

    return NextResponse.json({
      success: true,
      message: "Rascunho salvo com sucesso",
      data: savedProject[0],
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
