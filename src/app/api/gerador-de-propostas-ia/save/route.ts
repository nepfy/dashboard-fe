import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq } from "drizzle-orm";
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

export interface SaveAIProposalRequest {
  proposalData: Record<string, unknown>; // Dados da proposta gerada pela IA
  templateType: string;
  mainColor: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  companyInfo?: string;
  selectedService: string;
}

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({
      id: personUserTable.id,
    })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

export async function POST(request: NextRequest) {
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

    const body: SaveAIProposalRequest = await request.json();
    const {
      proposalData,
      templateType,
      mainColor,
      clientName,
      projectName,
      companyInfo,
      selectedService,
    } = body;

    // Get the user's person ID
    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Create project data from AI proposal
    const projectData = {
      personId: userId,
      projectName,
      clientName,
      projectStatus: "draft",
      templateType,
      mainColor,
      companyName: companyInfo || "Empresa especializada em soluções premium",
      services: selectedService,
      projectSentDate: new Date(),
      projectValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isProposalGenerated: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the main project
    const [savedProject] = await db
      .insert(projectsTable)
      .values(projectData)
      .returning();

    if (!savedProject) {
      return NextResponse.json(
        { success: false, error: "Falha ao salvar projeto" },
        { status: 500 }
      );
    }

    const projectId = savedProject.id;

    // Save related data based on the AI proposal structure
    try {
      // Save team members if they exist
      if (proposalData.teamMembers && Array.isArray(proposalData.teamMembers)) {
        const teamMembersToInsert = proposalData.teamMembers.map(
          (member: Record<string, unknown>, index: number) => ({
            projectId,
            name: (member.name as string) || "",
            role: (member.role as string) || "",
            photo: (member.photo as string) || null,
            sortOrder: index,
          })
        );

        if (teamMembersToInsert.length > 0) {
          await db.insert(projectTeamMembersTable).values(teamMembersToInsert);
        }
      }

      // Save expertise if it exists
      if (proposalData.expertise && Array.isArray(proposalData.expertise)) {
        const expertiseToInsert = proposalData.expertise.map(
          (item: Record<string, unknown>, index: number) => ({
            projectId,
            title: (item.title as string) || "",
            description: (item.description as string) || "",
            icon: (item.icon as string) || null,
            sortOrder: index,
          })
        );

        if (expertiseToInsert.length > 0) {
          await db.insert(projectExpertiseTable).values(expertiseToInsert);
        }
      }

      // Save results/case studies if they exist
      if (proposalData.results && Array.isArray(proposalData.results)) {
        const resultsToInsert = proposalData.results.map(
          (result: Record<string, unknown>, index: number) => ({
            projectId,
            client: (result.client as string) || "",
            subtitle: (result.subtitle as string) || "",
            investment: (result.investment as string) || null,
            roi: (result.roi as string) || null,
            photo: (result.photo as string) || null,
            sortOrder: index,
          })
        );

        if (resultsToInsert.length > 0) {
          await db.insert(projectResultsTable).values(resultsToInsert);
        }
      }

      // Save clients if they exist
      if (proposalData.clients && Array.isArray(proposalData.clients)) {
        const clientsToInsert = proposalData.clients.map(
          (client: Record<string, unknown>, index: number) => ({
            projectId,
            name: (client.name as string) || "",
            logo: (client.logo as string) || null,
            sortOrder: index,
          })
        );

        if (clientsToInsert.length > 0) {
          await db.insert(projectClientsTable).values(clientsToInsert);
        }
      }

      // Save process steps if they exist
      if (
        proposalData.processSteps &&
        Array.isArray(proposalData.processSteps)
      ) {
        const processStepsToInsert = proposalData.processSteps.map(
          (step: Record<string, unknown>, index: number) => ({
            projectId,
            stepCounter: (step.stepCounter as number) || index + 1,
            stepName: (step.stepName as string) || "",
            description: (step.description as string) || "",
            sortOrder: index,
          })
        );

        if (processStepsToInsert.length > 0) {
          await db
            .insert(projectProcessStepsTable)
            .values(processStepsToInsert);
        }
      }

      // Save testimonials if they exist
      if (
        proposalData.testimonials &&
        Array.isArray(proposalData.testimonials)
      ) {
        const testimonialsToInsert = proposalData.testimonials.map(
          (testimonial: Record<string, unknown>, index: number) => ({
            projectId,
            testimonial: (testimonial.testimonial as string) || "",
            name: (testimonial.name as string) || "",
            role: (testimonial.role as string) || "",
            photo: (testimonial.photo as string) || null,
            sortOrder: index,
          })
        );

        if (testimonialsToInsert.length > 0) {
          await db
            .insert(projectTestimonialsTable)
            .values(testimonialsToInsert);
        }
      }

      // Save services if they exist
      if (proposalData.services && Array.isArray(proposalData.services)) {
        const servicesToInsert = proposalData.services.map(
          (service: Record<string, unknown>, index: number) => ({
            projectId,
            title: (service.title as string) || "",
            description: (service.description as string) || "",
            sortOrder: index,
          })
        );

        if (servicesToInsert.length > 0) {
          await db.insert(projectServicesTable).values(servicesToInsert);
        }
      }

      // Save plans if they exist
      if (proposalData.plans && Array.isArray(proposalData.plans)) {
        const plansToInsert = proposalData.plans.map(
          (plan: Record<string, unknown>, index: number) => ({
            projectId,
            title: (plan.title as string) || "",
            description: (plan.description as string) || "",
            isBestOffer: (plan.isBestOffer as boolean) || false,
            price: (plan.price as number)?.toString() || null,
            pricePeriod: (plan.pricePeriod as string) || "one-time",
            ctaButtonTitle:
              (plan.ctaButtonTitle as string) || "Solicitar Orçamento",
            sortOrder: index,
          })
        );

        if (plansToInsert.length > 0) {
          const [savedPlans] = await db
            .insert(projectPlansTable)
            .values(plansToInsert)
            .returning();

          // Save plan details if they exist
          if (savedPlans && proposalData.plans) {
            for (let i = 0; i < proposalData.plans.length; i++) {
              const plan = proposalData.plans[i] as Record<string, unknown>;
              if (plan.planDetails && Array.isArray(plan.planDetails)) {
                const planDetailsToInsert = plan.planDetails.map(
                  (detail: Record<string, unknown>, detailIndex: number) => ({
                    planId: savedPlans.id,
                    description: (detail.description as string) || "",
                    sortOrder: detailIndex,
                  })
                );

                if (planDetailsToInsert.length > 0) {
                  await db
                    .insert(projectPlanDetailsTable)
                    .values(planDetailsToInsert);
                }
              }
            }
          }
        }
      }

      // Save terms and conditions if they exist
      if (proposalData.terms && Array.isArray(proposalData.terms)) {
        const termsToInsert = proposalData.terms.map(
          (term: Record<string, unknown>, index: number) => ({
            projectId,
            title: (term.title as string) || "",
            description: (term.description as string) || "",
            sortOrder: index,
          })
        );

        if (termsToInsert.length > 0) {
          await db.insert(projectTermsConditionsTable).values(termsToInsert);
        }
      }

      // Save FAQ if it exists
      if (proposalData.faq && Array.isArray(proposalData.faq)) {
        const faqToInsert = proposalData.faq.map(
          (item: Record<string, unknown>, index: number) => ({
            projectId,
            question: (item.question as string) || "",
            answer: (item.answer as string) || "",
            sortOrder: index,
          })
        );

        if (faqToInsert.length > 0) {
          await db.insert(projectFaqTable).values(faqToInsert);
        }
      }
    } catch (error) {
      console.error("Error saving related data:", error);
      // Continue even if some related data fails to save
    }

    return NextResponse.json({
      success: true,
      data: {
        id: projectId,
        projectName,
        message: "Proposta salva com sucesso!",
      },
    });
  } catch (error) {
    console.error("Error saving AI proposal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
