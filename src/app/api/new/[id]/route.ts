import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  newTemplateIntroductionTable,
  newTemplateIntroductionPhotosTable,
  newTemplateAboutUsTable,
  newTemplateAboutUsTeamTable,
  newTemplateAboutUsMarqueeTable,
  newTemplateClientsTable,
  newTemplateClientsListTable,
  newTemplateExpertiseTable,
  newTemplateExpertiseTopicsTable,
  newTemplatePlansTable,
  newTemplatePlansListTable,
  newTemplateTermsConditionsTable,
  newTemplateTermsConditionsListTable,
  newTemplateFaqTable,
  newTemplateFaqListTable,
  newTemplateFooterTable,
  newTemplateFooterMarqueeTable,
} from "#/lib/db/schema/templates/new";

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
          eq(projectsTable.templateType, "new")
        )
      )
      .limit(1);

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: "Projeto New não encontrado" },
        { status: 404 }
      );
    }

    // Get main section data first
    const [
      introduction,
      aboutUs,
      clients,
      expertise,
      plans,
      termsConditions,
      faq,
      footer,
    ] = await Promise.all([
      // Main sections with projectId
      db.select().from(newTemplateIntroductionTable).where(eq(newTemplateIntroductionTable.projectId, projectId)),
      db.select().from(newTemplateAboutUsTable).where(eq(newTemplateAboutUsTable.projectId, projectId)),
      db.select().from(newTemplateClientsTable).where(eq(newTemplateClientsTable.projectId, projectId)),
      db.select().from(newTemplateExpertiseTable).where(eq(newTemplateExpertiseTable.projectId, projectId)),
      db.select().from(newTemplatePlansTable).where(eq(newTemplatePlansTable.projectId, projectId)),
      db.select().from(newTemplateTermsConditionsTable).where(eq(newTemplateTermsConditionsTable.projectId, projectId)),
      db.select().from(newTemplateFaqTable).where(eq(newTemplateFaqTable.projectId, projectId)),
      db.select().from(newTemplateFooterTable).where(eq(newTemplateFooterTable.projectId, projectId)),
    ]);

    // Get sub-tables data based on parent IDs
    const [
      introductionPhotos,
      aboutUsTeam,
      aboutUsMarquee,
      clientsList,
      expertiseTopics,
      plansList,
      plansIncludedItems,
      termsConditionsList,
      faqList,
      footerMarquee,
    ] = await Promise.all([
      // Sub-tables with foreign key relationships
      introduction[0] ? db.select().from(newTemplateIntroductionPhotosTable).where(eq(newTemplateIntroductionPhotosTable.introductionId, introduction[0].id)) : [],
      aboutUs[0] ? db.select().from(newTemplateAboutUsTeamTable).where(eq(newTemplateAboutUsTeamTable.aboutUsId, aboutUs[0].id)) : [],
      aboutUs[0] ? db.select().from(newTemplateAboutUsMarqueeTable).where(eq(newTemplateAboutUsMarqueeTable.aboutUsId, aboutUs[0].id)) : [],
      clients[0] ? db.select().from(newTemplateClientsListTable).where(eq(newTemplateClientsListTable.clientsSectionId, clients[0].id)) : [],
      expertise[0] ? db.select().from(newTemplateExpertiseTopicsTable).where(eq(newTemplateExpertiseTopicsTable.expertiseId, expertise[0].id)) : [],
      plans[0] ? db.select().from(newTemplatePlansListTable).where(eq(newTemplatePlansListTable.plansSectionId, plans[0].id)) : [],
      // TODO: Need to get plan items for each individual plan, not the plans section
      [],
      termsConditions[0] ? db.select().from(newTemplateTermsConditionsListTable).where(eq(newTemplateTermsConditionsListTable.termsSectionId, termsConditions[0].id)) : [],
      faq[0] ? db.select().from(newTemplateFaqListTable).where(eq(newTemplateFaqListTable.faqSectionId, faq[0].id)) : [],
      footer[0] ? db.select().from(newTemplateFooterMarqueeTable).where(eq(newTemplateFooterMarqueeTable.footerId, footer[0].id)) : [],
    ]);

    // Build the response with properly nested data
    const newProjectData = {
      project: project[0],
      template: {
        introduction: {
          section: introduction[0] || null,
          photos: introductionPhotos || [],
        },
        aboutUs: {
          section: aboutUs[0] || null,
          team: aboutUsTeam || [],
          marquee: aboutUsMarquee || [],
        },
        clients: {
          section: clients[0] || null,
          list: clientsList || [],
        },
        expertise: {
          section: expertise[0] || null,
          topics: expertiseTopics || [],
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
      data: newProjectData,
    });
  } catch (error) {
    console.error("Error fetching New project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}