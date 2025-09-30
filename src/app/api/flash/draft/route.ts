import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  flashTemplateIntroductionTable,
  flashTemplateIntroductionServicesTable,
  flashTemplateAboutUsTable,
} from "#/lib/db/schema/templates/flash";

interface FlashTemplateData {
  introduction?: {
    name: string;
    email: string;
    buttonTitle: string;
    title: string;
    validity: string;
    subtitle?: string;
    hideSubtitle?: boolean;
    services?: string[];
  };
  aboutUs?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    supportText?: string;
    hideSupportText?: boolean;
    subtitle?: string;
    hideSubtitle?: boolean;
  };
  team?: {
    hideSection?: boolean;
    title: string;
    members?: Array<{
      memberPhoto: string;
      hideMemberPhoto?: boolean;
      memberName: string;
      hideMemberName?: boolean;
      memberRole: string;
      hideMemberRole?: boolean;
      sortOrder?: number;
    }>;
  };
  expertise?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    topics?: Array<{
      title: string;
      hideTitleField?: boolean;
      description: string;
      hideDescription?: boolean;
      sortOrder?: number;
    }>;
  };
  results?: {
    hideSection?: boolean;
    list?: Array<{
      photo: string;
      hidePhoto?: boolean;
      name: string;
      hideName?: boolean;
      instagram: string;
      hideInstagram?: boolean;
      invested: string;
      hideInvested?: boolean;
      returnValue: string;
      hideReturn?: boolean;
      sortOrder?: number;
    }>;
  };
  clients?: {
    hideSection?: boolean;
    list?: Array<{
      logo: string;
      hideLogo?: boolean;
      name: string;
      hideName?: boolean;
      sortOrder?: number;
    }>;
  };
  steps?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    topics?: Array<{
      stepName: string;
      hideStepName?: boolean;
      stepDescription: string;
      hideStepDescription?: boolean;
      sortOrder?: number;
    }>;
    marquee?: Array<{
      serviceName: string;
      hideService?: boolean;
      sortOrder?: number;
    }>;
  };
  cta?: {
    hideSection?: boolean;
    title: string;
    buttonTitle: string;
    backgroundImage: string;
  };
  testimonials?: {
    hideSection?: boolean;
    list?: Array<{
      photo: string;
      hidePhoto?: boolean;
      testimonial: string;
      hideTestimonial?: boolean;
      name: string;
      hideName?: boolean;
      role: string;
      hideRole?: boolean;
      sortOrder?: number;
    }>;
  };
  investment?: {
    hideSection?: boolean;
    title: string;
  };
  deliverables?: {
    hideSection?: boolean;
    title: string;
    list?: Array<{
      deliveryName: string;
      hideDeliveryName?: boolean;
      deliveryContent: string;
      hideDeliveryContent?: boolean;
      sortOrder?: number;
    }>;
  };
  plans?: {
    hideSection?: boolean;
    list?: Array<{
      title: string;
      hideTitleField?: boolean;
      description: string;
      hideDescription?: boolean;
      price?: string;
      hidePrice?: boolean;
      planPeriod: string;
      hidePlanPeriod?: boolean;
      buttonTitle: string;
      hideButtonTitle?: boolean;
      sortOrder?: number;
      includedItems?: Array<{
        description: string;
        hideDescription?: boolean;
        sortOrder?: number;
      }>;
    }>;
  };
  termsConditions?: {
    title: string;
    list?: Array<{
      title: string;
      hideTitleField?: boolean;
      description: string;
      hideDescription?: boolean;
      sortOrder?: number;
    }>;
  };
  faq?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    list?: Array<{
      question: string;
      hideQuestion?: boolean;
      answer: string;
      hideAnswer?: boolean;
      sortOrder?: number;
    }>;
  };
  footer?: {
    hideSection?: boolean;
    thankYouMessage: string;
    ctaMessage: string;
    disclaimer?: string;
    hideDisclaimer?: boolean;
    validity: string;
    marquee?: Array<{
      buttonTitle: string;
      sortOrder?: number;
    }>;
  };
}

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
    const { projectData, templateData, projectId }: { 
      projectData: Record<string, unknown>; 
      templateData: FlashTemplateData; 
      projectId?: string;
    } = body;

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
      projectName: (projectData.projectName as string) || `Rascunho Flash ${new Date().toLocaleDateString()}`,
      clientName: (projectData.clientName as string) || "Cliente não informado",
      templateType: "flash" as const,
      projectStatus: "draft" as const,
      mainColor: (projectData.mainColor as string) || "#3B82F6",
      companyName: projectData.companyName as string,
      companyEmail: projectData.companyEmail as string,
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
            eq(projectsTable.templateType, "flash")
          )
        )
        .limit(1);

      if (existingProject.length === 0) {
        return NextResponse.json(
          { success: false, error: "Projeto Flash não encontrado" },
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
            eq(projectsTable.templateType, "flash")
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
        { success: false, error: "Falha ao salvar rascunho Flash" },
        { status: 500 }
      );
    }

    const finalProjectId = savedProject[0].id;

    // Save template-specific data
    if (templateData.introduction) {
      const introData = templateData.introduction;
      
      // Save/update introduction
      await db
        .insert(flashTemplateIntroductionTable)
        .values({
          projectId: finalProjectId,
          name: introData.name,
          email: introData.email,
          buttonTitle: introData.buttonTitle,
          title: introData.title,
          validity: new Date(introData.validity),
          subtitle: introData.subtitle,
          hideSubtitle: introData.hideSubtitle || false,
        })
        .onConflictDoUpdate({
          target: flashTemplateIntroductionTable.projectId,
          set: {
            name: introData.name,
            email: introData.email,
            buttonTitle: introData.buttonTitle,
            title: introData.title,
            validity: new Date(introData.validity),
            subtitle: introData.subtitle,
            hideSubtitle: introData.hideSubtitle || false,
            updated_at: new Date(),
          },
        });

      // Save services if provided
      if (introData.services && Array.isArray(introData.services)) {
        // Get introduction ID
        const introResult = await db
          .select()
          .from(flashTemplateIntroductionTable)
          .where(eq(flashTemplateIntroductionTable.projectId, finalProjectId));

        if (introResult.length > 0) {
          const introId = introResult[0].id;

          // Delete existing services
          await db
            .delete(flashTemplateIntroductionServicesTable)
            .where(eq(flashTemplateIntroductionServicesTable.introductionId, introId));

          // Insert new services
          if (introData.services.length > 0) {
            const servicesToInsert = introData.services.map((service, index) => ({
              introductionId: introId,
              serviceName: service,
              hideService: false,
              sortOrder: index,
            }));

            await db.insert(flashTemplateIntroductionServicesTable).values(servicesToInsert);
          }
        }
      }
    }

    // Save About Us section
    if (templateData.aboutUs) {
      await db
        .insert(flashTemplateAboutUsTable)
        .values({
          projectId: finalProjectId,
          hideSection: templateData.aboutUs.hideSection || false,
          title: templateData.aboutUs.title,
          hideTitle: templateData.aboutUs.hideTitle || false,
          supportText: templateData.aboutUs.supportText,
          hideSupportText: templateData.aboutUs.hideSupportText || false,
          subtitle: templateData.aboutUs.subtitle,
          hideSubtitle: templateData.aboutUs.hideSubtitle || false,
        })
        .onConflictDoUpdate({
          target: flashTemplateAboutUsTable.projectId,
          set: {
            hideSection: templateData.aboutUs.hideSection || false,
            title: templateData.aboutUs.title,
            hideTitle: templateData.aboutUs.hideTitle || false,
            supportText: templateData.aboutUs.supportText,
            hideSupportText: templateData.aboutUs.hideSupportText || false,
            subtitle: templateData.aboutUs.subtitle,
            hideSubtitle: templateData.aboutUs.hideSubtitle || false,
            updated_at: new Date(),
          },
        });
    }

    // Continue with other sections as needed...
    // (Team, Expertise, Results, etc. - following the same pattern)

    return NextResponse.json({
      success: true,
      message: "Rascunho Flash salvo com sucesso",
      data: savedProject[0],
    });
  } catch (error) {
    console.error("Error saving Flash draft:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}