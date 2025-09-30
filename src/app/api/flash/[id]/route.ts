import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  flashTemplateIntroductionTable,
  flashTemplateIntroductionServicesTable,
  flashTemplateAboutUsTable,
  flashTemplateTeamTable,
  flashTemplateTeamMembersTable,
  flashTemplateExpertiseTable,
  flashTemplateExpertiseTopicsTable,
  flashTemplateResultsTable,
  flashTemplateResultsListTable,
  flashTemplateClientsTable,
  flashTemplateClientsListTable,
  flashTemplateStepsTable,
  flashTemplateStepsTopicsTable,
  flashTemplateStepsMarqueeTable,
  flashTemplateCtaTable,
  flashTemplateTestimonialsTable,
  flashTemplateTestimonialsListTable,
  flashTemplateInvestmentTable,
  flashTemplateDeliverablesTable,
  flashTemplateDeliverablesListTable,
  flashTemplatePlansTable,
  flashTemplatePlansListTable,
  flashTemplatePlansIncludedItemsTable,
  flashTemplateTermsConditionsTable,
  flashTemplateTermsConditionsListTable,
  flashTemplateFaqTable,
  flashTemplateFaqListTable,
  flashTemplateFooterTable,
  flashTemplateFooterMarqueeTable,
} from "#/lib/db/schema/templates/flash";

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
          eq(projectsTable.templateType, "flash")
        )
      )
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto Flash não encontrado" },
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
      steps,
      cta,
      testimonials,
      investment,
      deliverables,
      plans,
      termsConditions,
      faq,
      footer,
    ] = await Promise.all([
      // Main sections with projectId
      db.select().from(flashTemplateIntroductionTable).where(eq(flashTemplateIntroductionTable.projectId, projectId)),
      db.select().from(flashTemplateAboutUsTable).where(eq(flashTemplateAboutUsTable.projectId, projectId)),
      db.select().from(flashTemplateTeamTable).where(eq(flashTemplateTeamTable.projectId, projectId)),
      db.select().from(flashTemplateExpertiseTable).where(eq(flashTemplateExpertiseTable.projectId, projectId)),
      db.select().from(flashTemplateResultsTable).where(eq(flashTemplateResultsTable.projectId, projectId)),
      db.select().from(flashTemplateClientsTable).where(eq(flashTemplateClientsTable.projectId, projectId)),
      db.select().from(flashTemplateStepsTable).where(eq(flashTemplateStepsTable.projectId, projectId)),
      db.select().from(flashTemplateCtaTable).where(eq(flashTemplateCtaTable.projectId, projectId)),
      db.select().from(flashTemplateTestimonialsTable).where(eq(flashTemplateTestimonialsTable.projectId, projectId)),
      db.select().from(flashTemplateInvestmentTable).where(eq(flashTemplateInvestmentTable.projectId, projectId)),
      db.select().from(flashTemplateDeliverablesTable).where(eq(flashTemplateDeliverablesTable.projectId, projectId)),
      db.select().from(flashTemplatePlansTable).where(eq(flashTemplatePlansTable.projectId, projectId)),
      db.select().from(flashTemplateTermsConditionsTable).where(eq(flashTemplateTermsConditionsTable.projectId, projectId)),
      db.select().from(flashTemplateFaqTable).where(eq(flashTemplateFaqTable.projectId, projectId)),
      db.select().from(flashTemplateFooterTable).where(eq(flashTemplateFooterTable.projectId, projectId)),
    ]);

    // Get sub-tables data based on parent IDs
    const [
      introductionServices,
      teamMembers,
      expertiseTopics,
      resultsList,
      clientsList,
      stepsTopics,
      stepsMarquee,
      testimonialsList,
      deliverablesList,
      plansList,
      termsConditionsList,
      faqList,
      footerMarquee,
    ] = await Promise.all([
      // Sub-tables with foreign key relationships
      introduction[0] ? db.select().from(flashTemplateIntroductionServicesTable).where(eq(flashTemplateIntroductionServicesTable.introductionId, introduction[0].id)) : [],
      team[0] ? db.select().from(flashTemplateTeamMembersTable).where(eq(flashTemplateTeamMembersTable.teamSectionId, team[0].id)) : [],
      expertise[0] ? db.select().from(flashTemplateExpertiseTopicsTable).where(eq(flashTemplateExpertiseTopicsTable.expertiseId, expertise[0].id)) : [],
      results[0] ? db.select().from(flashTemplateResultsListTable).where(eq(flashTemplateResultsListTable.resultsSectionId, results[0].id)) : [],
      clients[0] ? db.select().from(flashTemplateClientsListTable).where(eq(flashTemplateClientsListTable.clientsSectionId, clients[0].id)) : [],
      steps[0] ? db.select().from(flashTemplateStepsTopicsTable).where(eq(flashTemplateStepsTopicsTable.stepsId, steps[0].id)) : [],
      steps[0] ? db.select().from(flashTemplateStepsMarqueeTable).where(eq(flashTemplateStepsMarqueeTable.stepsId, steps[0].id)) : [],
      testimonials[0] ? db.select().from(flashTemplateTestimonialsListTable).where(eq(flashTemplateTestimonialsListTable.testimonialsSectionId, testimonials[0].id)) : [],
      deliverables[0] ? db.select().from(flashTemplateDeliverablesListTable).where(eq(flashTemplateDeliverablesListTable.deliverablesSectionId, deliverables[0].id)) : [],
      plans[0] ? db.select().from(flashTemplatePlansListTable).where(eq(flashTemplatePlansListTable.plansSectionId, plans[0].id)) : [],
      termsConditions[0] ? db.select().from(flashTemplateTermsConditionsListTable).where(eq(flashTemplateTermsConditionsListTable.termsSectionId, termsConditions[0].id)) : [],
      faq[0] ? db.select().from(flashTemplateFaqListTable).where(eq(flashTemplateFaqListTable.faqSectionId, faq[0].id)) : [],
      footer[0] ? db.select().from(flashTemplateFooterMarqueeTable).where(eq(flashTemplateFooterMarqueeTable.footerId, footer[0].id)) : [],
    ]);

    // Get plan items for each individual plan
    const plansIncludedItems = plansList.length > 0 ? await Promise.all(
      plansList.map(plan => 
        db.select().from(flashTemplatePlansIncludedItemsTable).where(eq(flashTemplatePlansIncludedItemsTable.planId, plan.id))
      )
    ).then(results => results.flat()) : [];

    // Build the response with properly nested data
    const flashProjectData = {
      project: project[0],
      template: {
        introduction: {
          section: introduction[0] || null,
          services: introductionServices || [],
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
        steps: {
          section: steps[0] || null,
          topics: stepsTopics || [],
          marquee: stepsMarquee || [],
        },
        cta: cta[0] || null,
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
        footer: {
          section: footer[0] || null,
          marquee: footerMarquee || [],
        },
      },
    };

    return NextResponse.json({
      success: true,
      data: flashProjectData,
    });
  } catch (error) {
    console.error("Error fetching Flash project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}