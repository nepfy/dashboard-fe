import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, desc, count, isNotNull, and, inArray, ne } from "drizzle-orm";
import {
  projectsTable,
  projectTeamMembersTable,
  projectExpertiseTable,
  projectResultsTable,
  projectClientsTable,
  projectProcessStepsTable,
  projectTestimonialsTable,
  projectServicesTable,
  projectPlansTable,
  projectPlanDetailsTable,
  projectTermsConditionsTable,
  projectFaqTable,
} from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

const VALID_STATUSES = [
  "active",
  "approved",
  "negotiation",
  "rejected",
  "draft",
  "expired",
  "archived",
] as const;

export async function GET(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

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

    // Count total projects (excluding archived)
    const totalCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          ne(projectsTable.projectStatus, "archived") // Exclude archived projects
        )
      );

    // Count sent projects (excluding archived)
    const sentProjectsCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          isNotNull(projectsTable.projectSentDate),
          ne(projectsTable.projectStatus, "archived") // Exclude archived projects
        )
      );

    // Count approved projects (excluding archived)
    const approvedProjectsCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          eq(projectsTable.projectStatus, "approved")
        )
      );

    // Count archived projects
    const archivedProjectsCountResult = await db
      .select({ count: count() })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          eq(projectsTable.projectStatus, "archived")
        )
      );

    const totalCount = totalCountResult[0]?.count || 0;
    const sentProjectsCount = sentProjectsCountResult[0]?.count || 0;
    const approvedProjectsCount = approvedProjectsCountResult[0]?.count || 0;
    const archivedProjectsCount = archivedProjectsCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch projects (excluding archived)
    const projects = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          ne(projectsTable.projectStatus, "archived") // Exclude archived projects
        )
      )
      .orderBy(desc(projectsTable.created_at))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      statistics: {
        sentProjectsCount,
        approvedProjectsCount,
        archivedProjectsCount, // Add archived count to statistics
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `${error}` },
      { status: 500 }
    );
  }
}

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

async function validateProjectOwnership(
  projectIds: string[],
  userId: string
): Promise<boolean> {
  const ownedProjects = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(
      and(
        inArray(projectsTable.id, projectIds),
        eq(projectsTable.personId, userId)
      )
    );

  return ownedProjects.length === projectIds.length;
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const { projectId, status } = body;

    if (!projectId || !status) {
      return NextResponse.json(
        { success: false, error: "ID do projeto e status são obrigatórios" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status inválido. Valores aceitos: ${VALID_STATUSES.join(
            ", "
          )}`,
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

    const isOwner = await validateProjectOwnership([projectId], userId);
    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado ou acesso negado" },
        { status: 404 }
      );
    }

    const updatedProject = await db
      .update(projectsTable)
      .set({
        projectStatus: status,
        updated_at: new Date(),
      })
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao atualizar o projeto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status do projeto atualizado com sucesso",
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

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { projectIds, status } = body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "Lista de IDs dos projetos é obrigatória" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status é obrigatório" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status inválido. Valores aceitos: ${VALID_STATUSES.join(
            ", "
          )}`,
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

    const isOwner = await validateProjectOwnership(projectIds, userId);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Um ou mais projetos não foram encontrados ou acesso negado",
        },
        { status: 404 }
      );
    }

    const updatedProjects = await db
      .update(projectsTable)
      .set({
        projectStatus: status,
        updated_at: new Date(),
      })
      .where(
        and(
          inArray(projectsTable.id, projectIds),
          eq(projectsTable.personId, userId)
        )
      )
      .returning();

    if (updatedProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao atualizar os projetos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${updatedProjects.length} projeto(s) atualizado(s) com sucesso`,
      data: updatedProjects,
      updatedCount: updatedProjects.length,
    });
  } catch (error) {
    console.error("Error updating projects:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { projectIds } = body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Lista de IDs dos projetos é obrigatória para duplicação",
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

    const isOwner = await validateProjectOwnership(projectIds, userId);
    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Um ou mais projetos não foram encontrados ou acesso negado",
        },
        { status: 404 }
      );
    }

    // Buscar projetos originais com todos os dados relacionados
    const originalProjects = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          inArray(projectsTable.id, projectIds),
          eq(projectsTable.personId, userId)
        )
      );

    if (originalProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Nenhum projeto encontrado para duplicar" },
        { status: 404 }
      );
    }

    // Duplicar projetos principais com TODOS os campos
    const duplicatedProjects = originalProjects.map((project) => ({
      // Campos básicos obrigatórios
      personId: project.personId,
      projectName: `${project.projectName} - Cópia`,
      clientName: project.clientName,
      projectValidUntil: project.projectValidUntil,
      projectStatus: "draft",

      // Resetar campos específicos de envio/visualização
      projectSentDate: null,
      projectVisualizationDate: null,

      // Campos de template e configuração
      templateType: project.templateType,
      mainColor: project.mainColor,
      companyName: project.companyName,
      companyEmail: project.companyEmail,
      ctaButtonTitle: project.ctaButtonTitle,
      pageTitle: project.pageTitle,
      pageSubtitle: project.pageSubtitle,
      hidePageSubtitle: project.hidePageSubtitle,
      services: project.services,
      hideServices: project.hideServices,

      // Seção Sobre Nós
      hideAboutUsSection: project.hideAboutUsSection,
      aboutUsTitle: project.aboutUsTitle,
      aboutUsSubtitle1: project.aboutUsSubtitle1,
      aboutUsSubtitle2: project.aboutUsSubtitle2,

      // Seção Equipe
      hideAboutYourTeamSection: project.hideAboutYourTeamSection,
      ourTeamSubtitle: project.ourTeamSubtitle,

      // Seção Expertise
      hideExpertiseSection: project.hideExpertiseSection,
      expertiseSubtitle: project.expertiseSubtitle,

      // Seção Resultados
      hideResultsSection: project.hideResultsSection,
      resultsSubtitle: project.resultsSubtitle,

      // Seção Clientes
      hideClientsSection: project.hideClientsSection,

      // Seção Processo
      hideProcessSection: project.hideProcessSection,
      hideProcessSubtitle: project.hideProcessSubtitle,
      processSubtitle: project.processSubtitle,

      // Seção CTA
      hideCTASection: project.hideCTASection,
      ctaBackgroundImage: project.ctaBackgroundImage,

      // Seção Depoimentos
      hideTestimonialsSection: project.hideTestimonialsSection,

      // Seção Investimento
      hideInvestmentSection: project.hideInvestmentSection,
      investmentTitle: project.investmentTitle,

      // Seção Serviços Inclusos
      hideIncludedServicesSection: project.hideIncludedServicesSection,

      // Seção Planos
      hidePlansSection: project.hidePlansSection,

      // Seção Termos
      hideTermsSection: project.hideTermsSection,

      // Seção FAQ
      hideFaqSection: project.hideFaqSection,

      // Seção Mensagem Final
      hideFinalMessageSection: project.hideFinalMessageSection,
      endMessageTitle: project.endMessageTitle,
      endMessageTitle2: project.endMessageTitle2,
      endMessageDescription: project.endMessageDescription,

      // Campos de publicação
      projectUrl: null,
      pagePassword: project.pagePassword,
      isPublished: false,
      isProposalGenerated: project.isProposalGenerated,

      // Timestamps
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Inserir projetos duplicados
    const insertedProjects = await db
      .insert(projectsTable)
      .values(duplicatedProjects)
      .returning();

    if (insertedProjects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao duplicar os projetos" },
        { status: 500 }
      );
    }

    // Agora duplicar todas as tabelas relacionadas
    for (let i = 0; i < originalProjects.length; i++) {
      const originalProjectId = originalProjects[i].id;
      const newProjectId = insertedProjects[i].id;

      try {
        // Duplicar membros da equipe
        const teamMembers = await db
          .select()
          .from(projectTeamMembersTable)
          .where(eq(projectTeamMembersTable.projectId, originalProjectId));

        if (teamMembers.length > 0) {
          const duplicatedTeamMembers = teamMembers.map((member) => ({
            projectId: newProjectId,
            name: member.name,
            role: member.role,
            photo: member.photo,
            sortOrder: member.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db
            .insert(projectTeamMembersTable)
            .values(duplicatedTeamMembers);
        }

        // Duplicar expertise
        const expertise = await db
          .select()
          .from(projectExpertiseTable)
          .where(eq(projectExpertiseTable.projectId, originalProjectId));

        if (expertise.length > 0) {
          const duplicatedExpertise = expertise.map((exp) => ({
            projectId: newProjectId,
            icon: exp.icon,
            title: exp.title,
            description: exp.description,
            sortOrder: exp.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db.insert(projectExpertiseTable).values(duplicatedExpertise);
        }

        // Duplicar resultados
        const results = await db
          .select()
          .from(projectResultsTable)
          .where(eq(projectResultsTable.projectId, originalProjectId));

        if (results.length > 0) {
          const duplicatedResults = results.map((result) => ({
            projectId: newProjectId,
            photo: result.photo,
            client: result.client,
            subtitle: result.subtitle,
            investment: result.investment,
            roi: result.roi,
            sortOrder: result.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db.insert(projectResultsTable).values(duplicatedResults);
        }

        // Duplicar clientes
        const clients = await db
          .select()
          .from(projectClientsTable)
          .where(eq(projectClientsTable.projectId, originalProjectId));

        if (clients.length > 0) {
          const duplicatedClients = clients.map((client) => ({
            projectId: newProjectId,
            logo: client.logo,
            name: client.name,
            hideLogo: client.hideLogo,
            hideClientName: client.hideClientName,
            sortOrder: client.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db.insert(projectClientsTable).values(duplicatedClients);
        }

        // Duplicar etapas do processo
        const processSteps = await db
          .select()
          .from(projectProcessStepsTable)
          .where(eq(projectProcessStepsTable.projectId, originalProjectId));

        if (processSteps.length > 0) {
          const duplicatedProcessSteps = processSteps.map((step) => ({
            projectId: newProjectId,
            stepCounter: step.stepCounter,
            stepName: step.stepName,
            description: step.description,
            sortOrder: step.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db
            .insert(projectProcessStepsTable)
            .values(duplicatedProcessSteps);
        }

        // Duplicar depoimentos
        const testimonials = await db
          .select()
          .from(projectTestimonialsTable)
          .where(eq(projectTestimonialsTable.projectId, originalProjectId));

        if (testimonials.length > 0) {
          const duplicatedTestimonials = testimonials.map((testimonial) => ({
            projectId: newProjectId,
            testimonial: testimonial.testimonial,
            name: testimonial.name,
            role: testimonial.role,
            photo: testimonial.photo,
            sortOrder: testimonial.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db
            .insert(projectTestimonialsTable)
            .values(duplicatedTestimonials);
        }

        // Duplicar serviços
        const services = await db
          .select()
          .from(projectServicesTable)
          .where(eq(projectServicesTable.projectId, originalProjectId));

        if (services.length > 0) {
          const duplicatedServices = services.map((service) => ({
            projectId: newProjectId,
            title: service.title,
            description: service.description,
            sortOrder: service.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db.insert(projectServicesTable).values(duplicatedServices);
        }

        // Duplicar planos e seus detalhes
        const plans = await db
          .select()
          .from(projectPlansTable)
          .where(eq(projectPlansTable.projectId, originalProjectId));

        if (plans.length > 0) {
          const duplicatedPlans = plans.map((plan) => ({
            projectId: newProjectId,
            title: plan.title,
            description: plan.description,
            isBestOffer: plan.isBestOffer,
            price: plan.price,
            pricePeriod: plan.pricePeriod,
            ctaButtonTitle: plan.ctaButtonTitle,
            sortOrder: plan.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));

          const insertedPlans = await db
            .insert(projectPlansTable)
            .values(duplicatedPlans)
            .returning();

          // Para cada plano inserido, duplicar seus detalhes
          for (let j = 0; j < plans.length; j++) {
            const originalPlanId = plans[j].id;
            const newPlanId = insertedPlans[j].id;

            const planDetails = await db
              .select()
              .from(projectPlanDetailsTable)
              .where(eq(projectPlanDetailsTable.planId, originalPlanId));

            if (planDetails.length > 0) {
              const duplicatedPlanDetails = planDetails.map((detail) => ({
                planId: newPlanId,
                description: detail.description,
                sortOrder: detail.sortOrder,
                created_at: new Date(),
                updated_at: new Date(),
              }));
              await db
                .insert(projectPlanDetailsTable)
                .values(duplicatedPlanDetails);
            }
          }
        }

        // Duplicar termos e condições
        const termsConditions = await db
          .select()
          .from(projectTermsConditionsTable)
          .where(eq(projectTermsConditionsTable.projectId, originalProjectId));

        if (termsConditions.length > 0) {
          const duplicatedTermsConditions = termsConditions.map((term) => ({
            projectId: newProjectId,
            title: term.title,
            description: term.description,
            sortOrder: term.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db
            .insert(projectTermsConditionsTable)
            .values(duplicatedTermsConditions);
        }

        // Duplicar FAQ
        const faq = await db
          .select()
          .from(projectFaqTable)
          .where(eq(projectFaqTable.projectId, originalProjectId));

        if (faq.length > 0) {
          const duplicatedFaq = faq.map((faqItem) => ({
            projectId: newProjectId,
            question: faqItem.question,
            answer: faqItem.answer,
            sortOrder: faqItem.sortOrder,
            created_at: new Date(),
            updated_at: new Date(),
          }));
          await db.insert(projectFaqTable).values(duplicatedFaq);
        }
      } catch (relatedDataError) {
        console.error(
          `Erro ao duplicar dados relacionados do projeto ${originalProjectId}:`,
          relatedDataError
        );
        // Continue com outros projetos mesmo se houver erro em um
      }
    }

    return NextResponse.json({
      success: true,
      message: `${insertedProjects.length} projeto(s) duplicado(s) com sucesso`,
      data: insertedProjects,
      duplicatedCount: insertedProjects.length,
    });
  } catch (error) {
    console.error("Error duplicating projects:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
