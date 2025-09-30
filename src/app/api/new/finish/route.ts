import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  newTemplateIntroductionTable,
  newTemplateAboutUsTable,
  newTemplateClientsTable,
  newTemplateExpertiseTable,
  newTemplatePlansTable,
  newTemplateTermsConditionsTable,
  newTemplateFaqTable,
  newTemplateFooterTable,
} from "#/lib/db/schema/templates/new";

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
          error: "URL e senha são obrigatórios para finalizar projeto New",
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
            eq(projectsTable.templateType, "new")
          )
        )
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json(
          { success: false, error: "Projeto New não encontrado para finalização" },
          { status: 404 }
        );
      }
    }

    // Update the main project with finalization data
    const projectUpdateData = {
      personId: userId,
      projectName: projectData.projectName || `Proposta New ${new Date().toLocaleDateString()}`,
      clientName: projectData.clientName || "Cliente não informado",
      templateType: "new" as const,
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
            eq(projectsTable.templateType, "new")
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
        { success: false, error: "Falha ao finalizar projeto New" },
        { status: 500 }
      );
    }

    const finalProjectId = savedProject[0].id;

    // Save/update all template sections with the finalized data
    // Similar to draft but with isProposalGenerated: true
    if (templateData.introduction) {
      const introData = templateData.introduction;
      
      await db
        .insert(newTemplateIntroductionTable)
        .values({
          projectId: finalProjectId,
          companyName: introData.companyName,
          hideCompanyName: introData.hideCompanyName || false,
          companyLogo: introData.companyLogo,
          hideCompanyLogo: introData.hideCompanyLogo || false,
          buttonTitle: introData.buttonTitle,
          clientName: introData.clientName,
          clientPhoto: introData.clientPhoto,
          hideClientPhoto: introData.hideClientPhoto || false,
          title: introData.title,
          validity: new Date(introData.validity),
        })
        .onConflictDoUpdate({
          target: newTemplateIntroductionTable.projectId,
          set: {
            companyName: introData.companyName,
            hideCompanyName: introData.hideCompanyName || false,
            companyLogo: introData.companyLogo,
            hideCompanyLogo: introData.hideCompanyLogo || false,
            buttonTitle: introData.buttonTitle,
            clientName: introData.clientName,
            clientPhoto: introData.clientPhoto,
            hideClientPhoto: introData.hideClientPhoto || false,
            title: introData.title,
            validity: new Date(introData.validity),
            updated_at: new Date(),
          },
        });
    }

    // Save About Us section
    if (templateData.aboutUs) {
      await db
        .insert(newTemplateAboutUsTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.aboutUs.hideSection || false,
          validity: new Date(templateData.aboutUs.validity),
          title: templateData.aboutUs.title,
          subtitle: templateData.aboutUs.subtitle,
          hideSubtitle: templateData.aboutUs.hideSubtitle || false,
          mainDescription: templateData.aboutUs.mainDescription,
          hideMainDescription: templateData.aboutUs.hideMainDescription || false,
          additionalDescription1: templateData.aboutUs.additionalDescription1,
          hideAdditionalDescription1: templateData.aboutUs.hideAdditionalDescription1 || false,
          additionalDescription2: templateData.aboutUs.additionalDescription2,
          hideAdditionalDescription2: templateData.aboutUs.hideAdditionalDescription2 || false,
        })
        .onConflictDoUpdate({
          target: newTemplateAboutUsTable.projectId,
          set: {
            hideSection: templateData.aboutUs.hideSection || false,
            validity: new Date(templateData.aboutUs.validity),
            title: templateData.aboutUs.title,
            subtitle: templateData.aboutUs.subtitle,
            hideSubtitle: templateData.aboutUs.hideSubtitle || false,
            mainDescription: templateData.aboutUs.mainDescription,
            hideMainDescription: templateData.aboutUs.hideMainDescription || false,
            additionalDescription1: templateData.aboutUs.additionalDescription1,
            hideAdditionalDescription1: templateData.aboutUs.hideAdditionalDescription1 || false,
            additionalDescription2: templateData.aboutUs.additionalDescription2,
            hideAdditionalDescription2: templateData.aboutUs.hideAdditionalDescription2 || false,
            updated_at: new Date(),
          },
        });
    }

    // Save Clients section
    if (templateData.clients) {
      await db
        .insert(newTemplateClientsTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.clients.hideSection || false,
        })
        .onConflictDoUpdate({
          target: newTemplateClientsTable.projectId,
          set: {
            hideSection: templateData.clients.hideSection || false,
            updated_at: new Date(),
          },
        });
    }

    // Save Expertise section
    if (templateData.expertise) {
      await db
        .insert(newTemplateExpertiseTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.expertise.hideSection || false,
          tagline: templateData.expertise.tagline,
          hideTagline: templateData.expertise.hideTagline || false,
          title: templateData.expertise.title,
          hideTitle: templateData.expertise.hideTitle || false,
        })
        .onConflictDoUpdate({
          target: newTemplateExpertiseTable.projectId,
          set: {
            hideSection: templateData.expertise.hideSection || false,
            tagline: templateData.expertise.tagline,
            hideTagline: templateData.expertise.hideTagline || false,
            title: templateData.expertise.title,
            hideTitle: templateData.expertise.hideTitle || false,
            updated_at: new Date(),
          },
        });
    }

    // Save Plans section
    if (templateData.plans) {
      await db
        .insert(newTemplatePlansTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.plans.hideSection || false,
          title: templateData.plans.title,
          hideTitle: templateData.plans.hideTitle || false,
          subtitle: templateData.plans.subtitle || "",
        })
        .onConflictDoUpdate({
          target: newTemplatePlansTable.projectId,
          set: {
            hideSection: templateData.plans.hideSection || false,
            title: templateData.plans.title,
            hideTitle: templateData.plans.hideTitle || false,
            subtitle: templateData.plans.subtitle || "",
            updated_at: new Date(),
          },
        });
    }

    // Save Terms & Conditions section
    if (templateData.termsConditions) {
      await db
        .insert(newTemplateTermsConditionsTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.termsConditions.hideSection || false,
          title: templateData.termsConditions.title || "Termos e Condições",
        })
        .onConflictDoUpdate({
          target: newTemplateTermsConditionsTable.projectId,
          set: {
            hideSection: templateData.termsConditions.hideSection || false,
            title: templateData.termsConditions.title || "Termos e Condições",
            updated_at: new Date(),
          },
        });
    }

    // Save FAQ section
    if (templateData.faq) {
      await db
        .insert(newTemplateFaqTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.faq.hideSection || false,
        })
        .onConflictDoUpdate({
          target: newTemplateFaqTable.projectId,
          set: {
            hideSection: templateData.faq.hideSection || false,
            updated_at: new Date(),
          },
        });
    }

    // Save Footer section
    if (templateData.footer) {
      await db
        .insert(newTemplateFooterTable)
        .values({
          projectId: finalProjectId,
          callToAction: templateData.footer.callToAction || "Entre em contato conosco",
          validity: new Date(templateData.footer.validity || new Date()),
          email: templateData.footer.email || "contato@empresa.com",
          whatsapp: templateData.footer.whatsapp || "+55 11 99999-9999",
        })
        .onConflictDoUpdate({
          target: newTemplateFooterTable.projectId,
          set: {
            callToAction: templateData.footer.callToAction || "Entre em contato conosco",
            validity: new Date(templateData.footer.validity || new Date()),
            email: templateData.footer.email || "contato@empresa.com",
            whatsapp: templateData.footer.whatsapp || "+55 11 99999-9999",
            updated_at: new Date(),
          },
        });
    }

    return NextResponse.json({
      success: true,
      message: "Projeto New finalizado com sucesso",
      data: {
        ...savedProject[0],
        projectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${pageUrl}`,
      },
    });
  } catch (error) {
    console.error("Error finishing New project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}