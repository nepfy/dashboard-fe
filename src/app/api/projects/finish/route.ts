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

    // Validate required fields for finishing
    if (!formData?.step16?.pageUrl || !formData?.step16?.pagePassword) {
      return NextResponse.json(
        {
          success: false,
          error: "URL e senha são obrigatórios para finalizar",
        },
        { status: 400 }
      );
    }

    // Convert form data to database format
    const projectData = {
      personId: userId,
      projectName:
        formData.step1?.projectName ||
        `Proposta ${new Date().toLocaleDateString()}`,
      clientName: formData.step1?.clientName || "Cliente não informado",
      templateType: templateType || "flash",
      mainColor: formData.step1?.mainColor,
      companyName: formData.step1?.companyName,
      companyEmail: formData.step1?.companyEmail,
      ctaButtonTitle: formData.step1?.ctaButtonTitle,
      pageTitle: formData.step1?.pageTitle,
      pageSubtitle: formData.step1?.pageSubtitle,
      services: formData.step1?.services?.join(","),

      aboutUsTitle: formData.step2?.aboutUsTitle,
      aboutUsSubtitle1: formData.step2?.aboutUsSubtitle1,
      aboutUsSubtitle2: formData.step2?.aboutUsSubtitle2,

      ourTeamSubtitle: formData.step3?.ourTeamSubtitle,

      expertiseSubtitle: formData.step4?.expertiseSubtitle,

      resultsSubtitle: formData.step5?.resultsSubtitle,

      processSubtitle: formData.step7?.processSubtitle,

      ctaBackgroundImage: formData.step8?.ctaBackgroundImage,

      investmentTitle: formData.step10?.investmentTitle,

      termsTitle: formData.step13?.termsTitle,

      endMessageTitle: formData.step15?.endMessageTitle,
      endMessageDescription: formData.step15?.endMessageDescription,

      projectUrl: formData.step16?.pageUrl,
      pagePassword: formData.step16?.pagePassword,
      projectValidUntil: formData.step16?.projectValidUntil
        ? new Date(formData.step16.projectValidUntil)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now

      // Set as active and proposal generated when finishing
      projectStatus: "active",
      isProposalGenerated: true,
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
      // Create new project
      savedProject = await db
        .insert(projectsTable)
        .values({
          ...projectData,
          created_at: new Date(),
        })
        .returning();
    }

    if (savedProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao finalizar projeto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Projeto finalizado com sucesso",
      data: savedProject[0],
    });
  } catch (error) {
    console.error("Error finishing project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
