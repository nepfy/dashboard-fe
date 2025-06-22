// src/app/api/projects/draft/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import {
  projectsTable,
  projectServicesTable,
  projectTeamMembersTable,
  projectExpertiseTable,
} from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

import { TeamMember, Expertise } from "#/types/project";

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

    // Convert form data to database format
    const projectData = {
      personId: userId,
      projectName:
        formData.step1?.projectName ||
        `Rascunho ${new Date().toLocaleDateString()}`,
      clientName: formData.step1?.clientName || "Cliente não informado",
      templateType: templateType || "flash",
      mainColor: formData.step1?.mainColor,
      companyName: formData.step1?.companyName,
      companyEmail: formData.step1?.companyEmail,
      ctaButtonTitle: formData.step1?.ctaButtonTitle,
      pageTitle: formData.step1?.pageTitle,
      pageSubtitle: formData.step1?.pageSubtitle,
      services: Array.isArray(formData.step1?.services)
        ? formData.step1.services.join(",")
        : formData.step1?.services,

      aboutUsTitle: formData.step2?.aboutUsTitle,
      aboutUsSubtitle1: formData.step2?.aboutUsSubtitle1,
      aboutUsSubtitle2: formData.step2?.aboutUsSubtitle2,

      ourTeamSubtitle: formData.step3?.ourTeamSubtitle,

      expertiseSubtitle: formData.step4?.expertiseSubtitle,

      resultsSubtitle: formData.step5?.resultsSubtitle,

      processSubtitle: formData.step7?.processSubtitle,

      ctaBackgroundImage: formData.step8?.ctaBackgroundImage,

      investmentTitle: formData.step10?.investmentTitle,

      // Handle deliveryServices - convert array to comma-separated string
      deliveryServices: Array.isArray(formData.step11?.deliveryServices)
        ? formData.step11.deliveryServices.join(",")
        : formData.step11?.deliveryServices,

      termsTitle: formData.step13?.termsTitle,

      endMessageTitle: formData.step15?.endMessageTitle,
      endMessageDescription: formData.step15?.endMessageDescription,

      projectUrl: formData.step16?.pageUrl,
      pagePassword: formData.step16?.pagePassword,
      projectValidUntil: formData.step16?.projectValidUntil
        ? new Date(formData.step16.projectValidUntil)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now

      projectStatus: "draft",
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

    const finalProjectId = savedProject[0].id;

    if (
      formData.step3?.teamMembers &&
      Array.isArray(formData.step3.teamMembers)
    ) {
      // Delete existing team members for this project
      await db
        .delete(projectTeamMembersTable)
        .where(eq(projectTeamMembersTable.projectId, finalProjectId));

      // Insert new team members
      if (formData.step3.teamMembers.length > 0) {
        const teamMembersToInsert = formData.step3.teamMembers.map(
          (member: TeamMember, index: number) => ({
            projectId: finalProjectId,
            name: member.name || "",
            role: member.role || "",
            photo: member.photo || null,
            sortOrder: member.sortOrder || index,
          })
        );

        await db.insert(projectTeamMembersTable).values(teamMembersToInsert);
      }
    }

    if (formData.step4?.expertise && Array.isArray(formData.step4.expertise)) {
      // Delete existing expertise for this project
      await db
        .delete(projectExpertiseTable)
        .where(eq(projectExpertiseTable.projectId, finalProjectId));

      // Insert new expertise
      if (formData.step4.expertise.length > 0) {
        const expertiseToInsert = formData.step4.expertise.map(
          (expertise: Expertise, index: number) => ({
            projectId: finalProjectId,
            title: expertise.title || "",
            description: expertise.description || "",
            icon: expertise.icon || null,
            sortOrder: expertise.sortOrder || index,
          })
        );

        await db.insert(projectExpertiseTable).values(expertiseToInsert);
      }
    }

    // Handle includedServices - save to projectServicesTable
    if (
      formData.step11?.includedServices &&
      Array.isArray(formData.step11.includedServices)
    ) {
      // Delete existing services for this project
      await db
        .delete(projectServicesTable)
        .where(eq(projectServicesTable.projectId, finalProjectId));

      // Insert new services
      if (formData.step11.includedServices.length > 0) {
        interface IncludedService {
          title?: string;
          description?: string;
          sortOrder?: number;
        }

        const servicesToInsert = formData.step11.includedServices.map(
          (service: IncludedService, index: number) => ({
            projectId: finalProjectId,
            title: service.title || "",
            description: service.description || "",
            sortOrder: service.sortOrder || index,
          })
        );

        await db.insert(projectServicesTable).values(servicesToInsert);
      }
    }

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
