// src/app/api/projects/[id]/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: projectId } = await params;

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

    const project = await db
      .select()
      .from(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.personId, userId))
      )
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto não encontrado" },
        { status: 404 }
      );
    }

    // Get team members
    const teamMembers = await db
      .select()
      .from(projectTeamMembersTable)
      .where(eq(projectTeamMembersTable.projectId, projectId))
      .orderBy(projectTeamMembersTable.sortOrder);

    // Get expertise
    const expertise = await db
      .select()
      .from(projectExpertiseTable)
      .where(eq(projectExpertiseTable.projectId, projectId))
      .orderBy(projectExpertiseTable.sortOrder);

    // Get results
    const results = await db
      .select()
      .from(projectResultsTable)
      .where(eq(projectResultsTable.projectId, projectId))
      .orderBy(projectResultsTable.sortOrder);

    // Get clients
    const clients = await db
      .select()
      .from(projectClientsTable)
      .where(eq(projectClientsTable.projectId, projectId))
      .orderBy(projectClientsTable.sortOrder);

    // Get process steps
    const processSteps = await db
      .select()
      .from(projectProcessStepsTable)
      .where(eq(projectProcessStepsTable.projectId, projectId))
      .orderBy(projectProcessStepsTable.sortOrder);

    // Get testimonials
    const testimonials = await db
      .select()
      .from(projectTestimonialsTable)
      .where(eq(projectTestimonialsTable.projectId, projectId))
      .orderBy(projectTestimonialsTable.sortOrder);

    // Get included services
    const includedServices = await db
      .select()
      .from(projectServicesTable)
      .where(eq(projectServicesTable.projectId, projectId))
      .orderBy(projectServicesTable.sortOrder);

    // Get plans with their details
    const plansWithDetails = await db
      .select({
        id: projectPlansTable.id,
        title: projectPlansTable.title,
        description: projectPlansTable.description,
        isBestOffer: projectPlansTable.isBestOffer,
        price: projectPlansTable.price,
        pricePeriod: projectPlansTable.pricePeriod,
        ctaButtonTitle: projectPlansTable.ctaButtonTitle,
        sortOrder: projectPlansTable.sortOrder,
        // Plan details
        planDetailId: projectPlanDetailsTable.id,
        planDetailDescription: projectPlanDetailsTable.description,
        planDetailSortOrder: projectPlanDetailsTable.sortOrder,
      })
      .from(projectPlansTable)
      .leftJoin(
        projectPlanDetailsTable,
        eq(projectPlansTable.id, projectPlanDetailsTable.planId)
      )
      .where(eq(projectPlansTable.projectId, projectId))
      .orderBy(projectPlansTable.sortOrder, projectPlanDetailsTable.sortOrder);

    // Transform the flat result into nested structure
    const plansMap = new Map();
    plansWithDetails.forEach((row) => {
      if (!plansMap.has(row.id)) {
        plansMap.set(row.id, {
          id: row.id,
          title: row.title,
          description: row.description,
          isBestOffer: row.isBestOffer,
          price: row.price,
          pricePeriod: row.pricePeriod,
          ctaButtonTitle: row.ctaButtonTitle,
          sortOrder: row.sortOrder,
          planDetails: [],
        });
      }

      // Add plan detail if it exists
      if (row.planDetailId) {
        plansMap.get(row.id).planDetails.push({
          id: row.planDetailId,
          description: row.planDetailDescription,
          sortOrder: row.planDetailSortOrder,
        });
      }
    });

    const plans = Array.from(plansMap.values());

    // Get terms conditions
    const termsConditions = await db
      .select()
      .from(projectTermsConditionsTable)
      .where(eq(projectTermsConditionsTable.projectId, projectId))
      .orderBy(projectTermsConditionsTable.sortOrder);

    // Get FAQ
    const faq = await db
      .select()
      .from(projectFaqTable)
      .where(eq(projectFaqTable.projectId, projectId))
      .orderBy(projectFaqTable.sortOrder);

    // Combine project data with relations
    const projectWithRelations = {
      ...project[0],
      teamMembers: teamMembers || [],
      expertise: expertise || [],
      results: results || [],
      clients: clients || [],
      processSteps: processSteps || [],
      testimonials: testimonials || [],
      includedServices: includedServices || [],
      plans: plans || [],
      termsConditions: termsConditions || [],
      faq: faq || [],
    };

    return NextResponse.json({
      success: true,
      data: projectWithRelations,
    });
  } catch (error) {
    console.error("Error loading project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
