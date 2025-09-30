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

    // Get all Prime template data
    const [
      introduction,
      introductionMarquee,
      aboutUs,
      team,
      teamMembers,
      expertise,
      expertiseTopics,
      results,
      resultsList,
      clients,
      clientsList,
      cta,
      steps,
      stepsTopics,
      testimonials,
      testimonialsList,
      investment,
      deliverables,
      deliverablesList,
      plans,
      plansList,
      plansIncludedItems,
      termsConditions,
      termsConditionsList,
      faq,
      faqList,
      footer,
    ] = await Promise.all([
      // Introduction
      db.select().from(primeTemplateIntroductionTable).where(eq(primeTemplateIntroductionTable.projectId, projectId)),
      db.select().from(primeTemplateIntroductionMarqueeTable),
      
      // About Us
      db.select().from(primeTemplateAboutUsTable).where(eq(primeTemplateAboutUsTable.projectId, projectId)),
      
      // Team
      db.select().from(primeTemplateTeamTable).where(eq(primeTemplateTeamTable.projectId, projectId)),
      db.select().from(primeTemplateTeamMembersTable),
      
      // Expertise
      db.select().from(primeTemplateExpertiseTable).where(eq(primeTemplateExpertiseTable.projectId, projectId)),
      db.select().from(primeTemplateExpertiseTopicsTable),
      
      // Results
      db.select().from(primeTemplateResultsTable).where(eq(primeTemplateResultsTable.projectId, projectId)),
      db.select().from(primeTemplateResultsListTable),
      
      // Clients
      db.select().from(primeTemplateClientsTable).where(eq(primeTemplateClientsTable.projectId, projectId)),
      db.select().from(primeTemplateClientsListTable),
      
      // CTA
      db.select().from(primeTemplateCtaTable).where(eq(primeTemplateCtaTable.projectId, projectId)),
      
      // Steps
      db.select().from(primeTemplateStepsTable).where(eq(primeTemplateStepsTable.projectId, projectId)),
      db.select().from(primeTemplateStepsTopicsTable),
      
      // Testimonials
      db.select().from(primeTemplateTestimonialsTable).where(eq(primeTemplateTestimonialsTable.projectId, projectId)),
      db.select().from(primeTemplateTestimonialsListTable),
      
      // Investment
      db.select().from(primeTemplateInvestmentTable).where(eq(primeTemplateInvestmentTable.projectId, projectId)),
      
      // Deliverables
      db.select().from(primeTemplateDeliverablesTable).where(eq(primeTemplateDeliverablesTable.projectId, projectId)),
      db.select().from(primeTemplateDeliverablesListTable),
      
      // Plans
      db.select().from(primeTemplatePlansTable).where(eq(primeTemplatePlansTable.projectId, projectId)),
      db.select().from(primeTemplatePlansListTable),
      db.select().from(primeTemplatePlansIncludedItemsTable),
      
      // Terms & Conditions
      db.select().from(primeTemplateTermsConditionsTable).where(eq(primeTemplateTermsConditionsTable.projectId, projectId)),
      db.select().from(primeTemplateTermsConditionsListTable),
      
      // FAQ
      db.select().from(primeTemplateFaqTable).where(eq(primeTemplateFaqTable.projectId, projectId)),
      db.select().from(primeTemplateFaqListTable),
      
      // Footer
      db.select().from(primeTemplateFooterTable).where(eq(primeTemplateFooterTable.projectId, projectId)),
    ]);

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