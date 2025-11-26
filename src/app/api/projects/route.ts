import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, desc, count, isNotNull, and, inArray, ne } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import { proposalAcceptancesTable } from "#/lib/db/schema/proposal-adjustments";
import type { ProposalData } from "#/types/proposal-data";

const VALID_STATUSES = [
  "active",
  "approved",
  "negotiation",
  "rejected",
  "draft",
  "expired",
  "archived",
] as const;

/**
 * Helper function to extract numeric value from a price string
 * Examples: "R$ 3.500,00 mensal" -> 3500, "R$ 10.000" -> 10000
 */
function extractNumericValue(priceString: string): number {
  if (!priceString) return 0;
  
  // Remove currency symbols, spaces, and text, keep only numbers, dots and commas
  const cleanString = priceString
    .replace(/[R$\s]/g, "")
    .split(/\s/)[0]; // Take only the first part before any text like "mensal"
  
  // Handle Brazilian format (1.000,00)
  const normalized = cleanString
    .replace(/\./g, "") // Remove thousand separators
    .replace(/,/g, "."); // Replace decimal comma with dot
  
  const value = parseFloat(normalized);
  return isNaN(value) ? 0 : value;
}

/**
 * Calculate total revenue from sent projects
 * Prioritizes recommended plan, otherwise uses first plan as estimate
 */
function calculateSentProjectsRevenue(projects: { proposalData: unknown }[]): number {
  let total = 0;
  
  for (const project of projects) {
    const proposalData = project.proposalData as ProposalData | null;
    if (!proposalData?.plans?.plansItems?.length) continue;
    
    // Try to find recommended plan first
    const recommendedPlan = proposalData.plans.plansItems.find(
      (plan) => plan.recommended
    );
    const planToUse = recommendedPlan || proposalData.plans.plansItems[0];
    
    if (planToUse?.value) {
      total += extractNumericValue(planToUse.value);
    }
  }
  
  return total;
}

/**
 * Calculate total revenue from approved projects using accepted plan values
 */
function calculateApprovedProjectsRevenue(
  acceptances: { chosenPlanValue: string | null }[]
): number {
  let total = 0;
  
  for (const acceptance of acceptances) {
    if (acceptance.chosenPlanValue) {
      total += extractNumericValue(acceptance.chosenPlanValue);
    }
  }
  
  return total;
}

/**
 * Format currency value to Brazilian Real format
 */
function formatCurrency(value: number): string {
  if (value === 0) return "Não calculado";
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

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

    // Fetch sent projects with proposalData to calculate revenue
    const sentProjects = await db
      .select({
        proposalData: projectsTable.proposalData,
      })
      .from(projectsTable)
      .where(
        and(
          eq(projectsTable.personId, userId),
          isNotNull(projectsTable.projectSentDate),
          ne(projectsTable.projectStatus, "archived")
        )
      );

    // Fetch approved projects acceptances to calculate revenue
    const approvedAcceptances = await db
      .select({
        chosenPlanValue: proposalAcceptancesTable.chosenPlanValue,
      })
      .from(proposalAcceptancesTable)
      .innerJoin(
        projectsTable,
        eq(proposalAcceptancesTable.projectId, projectsTable.id)
      )
      .where(
        and(
          eq(projectsTable.personId, userId),
          eq(projectsTable.projectStatus, "approved")
        )
      );

    // Calculate revenues
    const sentProjectsRevenue = calculateSentProjectsRevenue(sentProjects);
    const approvedProjectsRevenue = calculateApprovedProjectsRevenue(
      approvedAcceptances
    );

    // Format revenues
    const sentProjectsRevenueFormatted = formatCurrency(sentProjectsRevenue);
    const approvedProjectsRevenueFormatted = formatCurrency(
      approvedProjectsRevenue
    );

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
        archivedProjectsCount,
        sentProjectsRevenue: sentProjectsRevenueFormatted,
        approvedProjectsRevenue: approvedProjectsRevenueFormatted,
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

    // Prepare update data
    const updateData: Record<string, unknown> = {
      projectStatus: status,
      updated_at: new Date(),
    };

    // If status is being set to 'sent', save the sent date
    if (status === "sent") {
      updateData.projectSentDate = new Date();
    }

    const updatedProject = await db
      .update(projectsTable)
      .set(updateData)
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

    // Prepare update data
    const updateData: Record<string, unknown> = {
      projectStatus: status,
      updated_at: new Date(),
    };

    // If status is being set to 'sent', save the sent date
    if (status === "sent") {
      updateData.projectSentDate = new Date();
    }

    const updatedProjects = await db
      .update(projectsTable)
      .set(updateData)
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

    // Fetch source projects
    const sourceProjects = await db
      .select()
      .from(projectsTable)
      .where(
        and(
          inArray(projectsTable.id, projectIds),
          eq(projectsTable.personId, userId)
        )
      );

    if (sourceProjects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nenhum projeto encontrado para duplicar",
        },
        { status: 404 }
      );
    }

    // Create duplicate projects
    const duplicatedProjects = await Promise.all(
      sourceProjects.map(async (sourceProject) => {
        // Deep clone proposalData to avoid reference sharing
        const clonedProposalData = sourceProject.proposalData
          ? (JSON.parse(
              JSON.stringify(sourceProject.proposalData)
            ) as typeof sourceProject.proposalData)
          : null;

        // Clone buttonConfig
        const clonedButtonConfig = sourceProject.buttonConfig
          ? (JSON.parse(
              JSON.stringify(sourceProject.buttonConfig)
            ) as typeof sourceProject.buttonConfig)
          : null;

        // Create duplicate with reset fields
        const [duplicatedProject] = await db
          .insert(projectsTable)
          .values({
            personId: sourceProject.personId,
            clientName: sourceProject.clientName,
            projectName: sourceProject.projectName,
            templateType: sourceProject.templateType,
            mainColor: sourceProject.mainColor,
            projectValidUntil: sourceProject.projectValidUntil,
            isProposalGenerated: sourceProject.isProposalGenerated,
            proposalData: clonedProposalData as unknown as Record<
              string,
              unknown
            >,
            buttonConfig: clonedButtonConfig as unknown as Record<
              string,
              unknown
            >,
            // Reset fields for draft status
            projectStatus: "draft",
            projectSentDate: null,
            projectVisualizationDate: null,
            projectUrl: null,
            pagePassword: null,
            isPublished: false,
          })
          .returning();

        return duplicatedProject;
      })
    );

    return NextResponse.json({
      success: true,
      message: `${duplicatedProjects.length} projeto(s) duplicado(s) com sucesso`,
      data: duplicatedProjects,
      duplicatedCount: duplicatedProjects.length,
    });
  } catch (error) {
    console.error("Error duplicating projects:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
