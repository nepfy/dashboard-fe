import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  primeTemplateIntroductionTable,
  primeTemplateIntroductionMarqueeTable,
  primeTemplateAboutUsTable,
  primeTemplateTeamTable,
  primeTemplateTeamMembersTable,
  primeTemplateExpertiseTable,
  primeTemplateExpertiseTopicsTable,
  primeTemplateResultsTable,
  primeTemplateResultsListTable,
  primeTemplateClientsTable,
  primeTemplateClientsListTable,
  primeTemplateCtaTable,
  primeTemplateStepsTable,
  primeTemplateStepsTopicsTable,
  primeTemplateTestimonialsTable,
  primeTemplateTestimonialsListTable,
  primeTemplateInvestmentTable,
  primeTemplateDeliverablesTable,
  primeTemplateDeliverablesListTable,
  primeTemplatePlansTable,
  primeTemplatePlansListTable,
  primeTemplatePlansIncludedItemsTable,
  primeTemplateTermsConditionsTable,
  primeTemplateTermsConditionsListTable,
  primeTemplateFaqTable,
  primeTemplateFaqListTable,
  primeTemplateFooterTable,
} from "#/lib/db/schema/templates/prime";

async function getUserIdFromEmail(emailAddress: string): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: projectId } = await params;

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Get the main project
    const project = await db
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

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto Prime não encontrado" },
        { status: 404 }
      );
    }

    // Get main section data first
    const [
      introduction,
      aboutUs,
      team,
      expertise,
      results,
      clients,
      cta,
      steps,
      testimonials,
      investment,
      deliverables,
      plans,
      termsConditions,
      faq,
      footer,
    ] = await Promise.all([
      // Main sections with projectId
      db.select().from(primeTemplateIntroductionTable).where(eq(primeTemplateIntroductionTable.projectId, projectId)),
      db.select().from(primeTemplateAboutUsTable).where(eq(primeTemplateAboutUsTable.projectId, projectId)),
      db.select().from(primeTemplateTeamTable).where(eq(primeTemplateTeamTable.projectId, projectId)),
      db.select().from(primeTemplateExpertiseTable).where(eq(primeTemplateExpertiseTable.projectId, projectId)),
      db.select().from(primeTemplateResultsTable).where(eq(primeTemplateResultsTable.projectId, projectId)),
      db.select().from(primeTemplateClientsTable).where(eq(primeTemplateClientsTable.projectId, projectId)),
      db.select().from(primeTemplateCtaTable).where(eq(primeTemplateCtaTable.projectId, projectId)),
      db.select().from(primeTemplateStepsTable).where(eq(primeTemplateStepsTable.projectId, projectId)),
      db.select().from(primeTemplateTestimonialsTable).where(eq(primeTemplateTestimonialsTable.projectId, projectId)),
      db.select().from(primeTemplateInvestmentTable).where(eq(primeTemplateInvestmentTable.projectId, projectId)),
      db.select().from(primeTemplateDeliverablesTable).where(eq(primeTemplateDeliverablesTable.projectId, projectId)),
      db.select().from(primeTemplatePlansTable).where(eq(primeTemplatePlansTable.projectId, projectId)),
      db.select().from(primeTemplateTermsConditionsTable).where(eq(primeTemplateTermsConditionsTable.projectId, projectId)),
      db.select().from(primeTemplateFaqTable).where(eq(primeTemplateFaqTable.projectId, projectId)),
      db.select().from(primeTemplateFooterTable).where(eq(primeTemplateFooterTable.projectId, projectId)),
    ]);

    // Get sub-tables data based on parent IDs
    const [
      introductionMarquee,
      teamMembers,
      expertiseTopics,
      resultsList,
      clientsList,
      stepsTopics,
      testimonialsList,
      deliverablesList,
      plansList,
      termsConditionsList,
      faqList,
    ] = await Promise.all([
      // Sub-tables with foreign key relationships
      introduction[0] ? db.select().from(primeTemplateIntroductionMarqueeTable).where(eq(primeTemplateIntroductionMarqueeTable.introductionId, introduction[0].id)) : [],
      team[0] ? db.select().from(primeTemplateTeamMembersTable).where(eq(primeTemplateTeamMembersTable.teamSectionId, team[0].id)) : [],
      expertise[0] ? db.select().from(primeTemplateExpertiseTopicsTable).where(eq(primeTemplateExpertiseTopicsTable.expertiseId, expertise[0].id)) : [],
      results[0] ? db.select().from(primeTemplateResultsListTable).where(eq(primeTemplateResultsListTable.resultsSectionId, results[0].id)) : [],
      clients[0] ? db.select().from(primeTemplateClientsListTable).where(eq(primeTemplateClientsListTable.clientsSectionId, clients[0].id)) : [],
      steps[0] ? db.select().from(primeTemplateStepsTopicsTable).where(eq(primeTemplateStepsTopicsTable.stepsId, steps[0].id)) : [],
      testimonials[0] ? db.select().from(primeTemplateTestimonialsListTable).where(eq(primeTemplateTestimonialsListTable.testimonialsSectionId, testimonials[0].id)) : [],
      deliverables[0] ? db.select().from(primeTemplateDeliverablesListTable).where(eq(primeTemplateDeliverablesListTable.deliverablesSectionId, deliverables[0].id)) : [],
      plans[0] ? db.select().from(primeTemplatePlansListTable).where(eq(primeTemplatePlansListTable.plansSectionId, plans[0].id)) : [],
      termsConditions[0] ? db.select().from(primeTemplateTermsConditionsListTable).where(eq(primeTemplateTermsConditionsListTable.termsSectionId, termsConditions[0].id)) : [],
      faq[0] ? db.select().from(primeTemplateFaqListTable).where(eq(primeTemplateFaqListTable.faqSectionId, faq[0].id)) : [],
    ]);

    // Get plan items for each individual plan
    const plansIncludedItems = plansList.length > 0 ? await Promise.all(
      plansList.map(plan => 
        db.select().from(primeTemplatePlansIncludedItemsTable).where(eq(primeTemplatePlansIncludedItemsTable.planId, plan.id))
      )
    ).then(results => results.flat()) : [];

    // Build the response with properly nested data
    const primeProjectData = {
      project: project[0],
      template: {
        introduction: {
          section: introduction[0] || null,
          marquee: introductionMarquee || [],
        },
        aboutUs: aboutUs[0] || null,
        team: {
          section: team[0] || null,
          members: teamMembers || [],
        },
        expertise: {
          section: expertise[0] || null,
          topics: expertiseTopics || [],
        },
        results: {
          section: results[0] || null,
          list: resultsList || [],
        },
        clients: {
          section: clients[0] || null,
          list: clientsList || [],
        },
        cta: cta[0] || null,
        steps: {
          section: steps[0] || null,
          topics: stepsTopics || [],
        },
        testimonials: {
          section: testimonials[0] || null,
          list: testimonialsList || [],
        },
        investment: investment[0] || null,
        deliverables: {
          section: deliverables[0] || null,
          list: deliverablesList || [],
        },
        plans: {
          section: plans[0] || null,
          list: plansList || [],
          includedItems: plansIncludedItems || [],
        },
        termsConditions: {
          section: termsConditions[0] || null,
          list: termsConditionsList || [],
        },
        faq: {
          section: faq[0] || null,
          list: faqList || [],
        },
        footer: footer[0] || null,
      },
    };

    return NextResponse.json({
      success: true,
      data: primeProjectData,
    });
  } catch (error) {
    console.error("Error fetching Prime project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}