import { cache } from "react";
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
} from "#/lib/db/schema/templates/flash";
import {
  primeTemplateIntroductionTable,
  primeTemplateAboutUsTable,
  primeTemplateTeamTable,
  primeTemplateTeamMembersTable,
  primeTemplateExpertiseTable,
  primeTemplateExpertiseTopicsTable,
  primeTemplateResultsTable,
  primeTemplateResultsListTable,
  primeTemplateClientsTable,
  primeTemplateClientsListTable,
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
} from "#/lib/db/schema/templates/prime";
import type {
  CompleteProjectData,
  ProjectPlan,
  ProjectTeamMember,
  ProjectExpertise,
  ProjectResult,
  ProjectClient,
  ProjectProcessStep,
  ProjectTestimonial,
  ProjectService,
  ProjectTermsCondition,
  ProjectFaq,
} from "#/app/project/types/project";

// Type for Flash template data (matching actual database schema)
interface FlashTemplateDataLoaded {
  introduction:
    | {
        id: string;
        name: string;
        email: string;
        buttonTitle: string;
        title: string;
        validity: Date | string;
        subtitle: string | null;
        hideSubtitle: boolean | null;
      }
    | undefined;
  introServices: Array<{
    id: string;
    serviceName: string;
    sortOrder: number | null;
  }>;
  aboutUs:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
        supportText: string | null;
        subtitle: string | null;
      }
    | undefined;
  team:
    | {
        id: string;
        hideSection: boolean | null;
        title: string;
      }
    | undefined;
  teamMembers: Array<{
    id: string;
    memberName: string;
    memberRole: string;
    memberPhoto: string;
    hideMemberPhoto: boolean | null;
    sortOrder: number | null;
  }>;
  expertise:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  expertiseTopics: Array<{
    id: string;
    title: string;
    description: string;
    sortOrder: number | null;
  }>;
  results:
    | {
        id: string;
        title: string | null;
        hideSection: boolean | null;
      }
    | undefined;
  resultsList: Array<{
    id: string;
    name: string;
    instagram: string;
    invested: string;
    returnValue: string;
    photo: string;
    hidePhoto: boolean | null;
    sortOrder: number | null;
  }>;
  clients:
    | {
        id: string;
        hideSection: boolean | null;
      }
    | undefined;
  clientsList: Array<{
    id: string;
    logo: string;
    hideLogo: boolean | null;
    name: string;
    hideName: boolean | null;
    sortOrder: number | null;
  }>;
  steps:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  stepsTopics: Array<{
    id: string;
    stepName: string;
    stepDescription: string;
    sortOrder: number | null;
  }>;
  testimonials:
    | {
        id: string;
        hideSection: boolean | null;
      }
    | undefined;
  testimonialsList: Array<{
    id: string;
    testimonial: string;
    name: string;
    role: string;
    photo: string;
    hidePhoto: boolean | null;
    sortOrder: number | null;
  }>;
  investment:
    | {
        id: string;
        hideSection: boolean | null;
        title: string;
      }
    | undefined;
  deliverables:
    | {
        id: string;
        hideSection: boolean | null;
        title: string;
      }
    | undefined;
  deliverablesList: Array<{
    id: string;
    deliveryName: string;
    deliveryContent: string;
    sortOrder: number | null;
  }>;
  plans: ProjectPlan[];
  termsSection:
    | {
        id: string;
        title: string;
      }
    | undefined;
  termsList: Array<{
    id: string;
    title: string;
    description: string;
    sortOrder: number | null;
  }>;
  faqSection:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  faqList: Array<{
    id: string;
    question: string;
    answer: string;
    sortOrder: number | null;
  }>;
}

// Type for Prime template data (matching actual database schema)
interface PrimeTemplateDataLoaded {
  introduction:
    | {
        id: string;
        name: string;
        validity: Date | string;
        email: string;
        title: string;
        subtitle: string;
        buttonTitle: string;
      }
    | undefined;
  aboutUs:
    | {
        id: string;
        hideSection: boolean | null;
        title: string;
        paragraph1: string | null;
        paragraph2: string | null;
      }
    | undefined;
  team:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  teamMembers: Array<{
    id: string;
    memberName: string;
    memberRole: string;
    memberPhoto: string;
    hideMemberPhoto: boolean | null;
    sortOrder: number | null;
  }>;
  expertise:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  expertiseTopics: Array<{
    id: string;
    title: string;
    description: string;
    sortOrder: number | null;
  }>;
  results:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  resultsList: Array<{
    id: string;
    name: string;
    instagram: string;
    invested: string;
    returnValue: string;
    photo: string;
    hidePhoto: boolean | null;
    sortOrder: number | null;
  }>;
  clients:
    | {
        id: string;
        hideSection: boolean | null;
      }
    | undefined;
  clientsList: Array<{
    id: string;
    logo: string;
    hideLogo: boolean | null;
    name: string;
    hideName: boolean | null;
    sortOrder: number | null;
  }>;
  steps:
    | {
        id: string;
        hideSection: boolean | null;
        title: string | null;
      }
    | undefined;
  stepsTopics: Array<{
    id: string;
    stepName: string;
    stepDescription: string;
    sortOrder: number | null;
  }>;
  testimonials:
    | {
        id: string;
        hideSection: boolean | null;
      }
    | undefined;
  testimonialsList: Array<{
    id: string;
    testimonial: string;
    name: string;
    role: string;
    photo: string;
    hidePhoto: boolean | null;
    sortOrder: number | null;
  }>;
  investment:
    | {
        id: string;
        hideSection: boolean | null;
        title: string;
      }
    | undefined;
  deliverables:
    | {
        id: string;
        title: string;
      }
    | undefined;
  deliverablesList: Array<{
    id: string;
    deliveryName: string;
    deliveryContent: string;
    sortOrder: number | null;
  }>;
  plans: ProjectPlan[];
  termsSection:
    | {
        id: string;
        hideSection: boolean | null;
        title: string;
      }
    | undefined;
  termsList: Array<{
    id: string;
    title: string;
    description: string;
    sortOrder: number | null;
  }>;
  faqSection:
    | {
        id: string;
        hideSection: boolean | null;
        subtitle: string | null;
      }
    | undefined;
  faqList: Array<{
    id: string;
    question: string;
    answer: string;
    sortOrder: number | null;
  }>;
}

/**
 * Load Flash template data
 */
async function loadFlashTemplateData(
  projectId: string
): Promise<FlashTemplateDataLoaded> {
  const [introduction] = await db
    .select()
    .from(flashTemplateIntroductionTable)
    .where(eq(flashTemplateIntroductionTable.projectId, projectId));

  const [aboutUs] = await db
    .select()
    .from(flashTemplateAboutUsTable)
    .where(eq(flashTemplateAboutUsTable.projectId, projectId));

  const [team] = await db
    .select()
    .from(flashTemplateTeamTable)
    .where(eq(flashTemplateTeamTable.projectId, projectId));

  const [expertise] = await db
    .select()
    .from(flashTemplateExpertiseTable)
    .where(eq(flashTemplateExpertiseTable.projectId, projectId));

  const [results] = await db
    .select()
    .from(flashTemplateResultsTable)
    .where(eq(flashTemplateResultsTable.projectId, projectId));

  const [clients] = await db
    .select()
    .from(flashTemplateClientsTable)
    .where(eq(flashTemplateClientsTable.projectId, projectId));

  const [steps] = await db
    .select()
    .from(flashTemplateStepsTable)
    .where(eq(flashTemplateStepsTable.projectId, projectId));

  const [testimonials] = await db
    .select()
    .from(flashTemplateTestimonialsTable)
    .where(eq(flashTemplateTestimonialsTable.projectId, projectId));

  const [investment] = await db
    .select()
    .from(flashTemplateInvestmentTable)
    .where(eq(flashTemplateInvestmentTable.projectId, projectId));

  const [deliverables] = await db
    .select()
    .from(flashTemplateDeliverablesTable)
    .where(eq(flashTemplateDeliverablesTable.projectId, projectId));

  const [plansSection] = await db
    .select()
    .from(flashTemplatePlansTable)
    .where(eq(flashTemplatePlansTable.projectId, projectId));

  const [termsSection] = await db
    .select()
    .from(flashTemplateTermsConditionsTable)
    .where(eq(flashTemplateTermsConditionsTable.projectId, projectId));

  const [faqSection] = await db
    .select()
    .from(flashTemplateFaqTable)
    .where(eq(flashTemplateFaqTable.projectId, projectId));

  // Load child tables
  const [
    introServices,
    teamMembers,
    expertiseTopics,
    resultsList,
    clientsList,
    stepsTopics,
    testimonialsList,
    deliverablesList,
    plansList,
    termsList,
    faqList,
  ] = await Promise.all([
    introduction
      ? db
          .select()
          .from(flashTemplateIntroductionServicesTable)
          .where(
            eq(
              flashTemplateIntroductionServicesTable.introductionId,
              introduction.id
            )
          )
      : [],
    team
      ? db
          .select()
          .from(flashTemplateTeamMembersTable)
          .where(eq(flashTemplateTeamMembersTable.teamSectionId, team.id))
          .orderBy(flashTemplateTeamMembersTable.sortOrder)
      : [],
    expertise
      ? db
          .select()
          .from(flashTemplateExpertiseTopicsTable)
          .where(
            eq(flashTemplateExpertiseTopicsTable.expertiseId, expertise.id)
          )
          .orderBy(flashTemplateExpertiseTopicsTable.sortOrder)
      : [],
    results
      ? db
          .select()
          .from(flashTemplateResultsListTable)
          .where(eq(flashTemplateResultsListTable.resultsSectionId, results.id))
          .orderBy(flashTemplateResultsListTable.sortOrder)
      : [],
    clients
      ? db
          .select()
          .from(flashTemplateClientsListTable)
          .where(eq(flashTemplateClientsListTable.clientsSectionId, clients.id))
          .orderBy(flashTemplateClientsListTable.sortOrder)
      : [],
    steps
      ? db
          .select()
          .from(flashTemplateStepsTopicsTable)
          .where(eq(flashTemplateStepsTopicsTable.stepsId, steps.id))
          .orderBy(flashTemplateStepsTopicsTable.sortOrder)
      : [],
    testimonials
      ? db
          .select()
          .from(flashTemplateTestimonialsListTable)
          .where(
            eq(
              flashTemplateTestimonialsListTable.testimonialsSectionId,
              testimonials.id
            )
          )
          .orderBy(flashTemplateTestimonialsListTable.sortOrder)
      : [],
    deliverables
      ? db
          .select()
          .from(flashTemplateDeliverablesListTable)
          .where(
            eq(
              flashTemplateDeliverablesListTable.deliverablesSectionId,
              deliverables.id
            )
          )
          .orderBy(flashTemplateDeliverablesListTable.sortOrder)
      : [],
    plansSection
      ? db
          .select()
          .from(flashTemplatePlansListTable)
          .where(
            eq(flashTemplatePlansListTable.plansSectionId, plansSection.id)
          )
          .orderBy(flashTemplatePlansListTable.sortOrder)
      : [],
    termsSection
      ? db
          .select()
          .from(flashTemplateTermsConditionsListTable)
          .where(
            eq(
              flashTemplateTermsConditionsListTable.termsSectionId,
              termsSection.id
            )
          )
          .orderBy(flashTemplateTermsConditionsListTable.sortOrder)
      : [],
    faqSection
      ? db
          .select()
          .from(flashTemplateFaqListTable)
          .where(eq(flashTemplateFaqListTable.faqSectionId, faqSection.id))
          .orderBy(flashTemplateFaqListTable.sortOrder)
      : [],
  ]);

  // Load plan details
  const plansWithDetails = await Promise.all(
    plansList.map(async (plan) => {
      const details = await db
        .select()
        .from(flashTemplatePlansIncludedItemsTable)
        .where(eq(flashTemplatePlansIncludedItemsTable.planId, plan.id))
        .orderBy(flashTemplatePlansIncludedItemsTable.sortOrder);

      return {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        isBestOffer: false,
        price: plan.price,
        pricePeriod: plan.planPeriod,
        ctaButtonTitle: plan.buttonTitle,
        sortOrder: plan.sortOrder,
        planDetails: details.map((d) => ({
          id: d.id,
          description: d.description,
          sortOrder: d.sortOrder,
        })),
      };
    })
  );

  return {
    introduction,
    introServices,
    aboutUs,
    team,
    teamMembers,
    expertise,
    expertiseTopics,
    results,
    resultsList,
    clients,
    clientsList,
    steps,
    stepsTopics,
    testimonials,
    testimonialsList,
    investment,
    deliverables,
    deliverablesList,
    plans: plansWithDetails,
    termsSection,
    termsList,
    faqSection,
    faqList,
  };
}

/**
 * Load Prime template data
 */
async function loadPrimeTemplateData(
  projectId: string
): Promise<PrimeTemplateDataLoaded> {
  const [introduction] = await db
    .select()
    .from(primeTemplateIntroductionTable)
    .where(eq(primeTemplateIntroductionTable.projectId, projectId));

  const [aboutUs] = await db
    .select()
    .from(primeTemplateAboutUsTable)
    .where(eq(primeTemplateAboutUsTable.projectId, projectId));

  const [team] = await db
    .select()
    .from(primeTemplateTeamTable)
    .where(eq(primeTemplateTeamTable.projectId, projectId));

  const [expertise] = await db
    .select()
    .from(primeTemplateExpertiseTable)
    .where(eq(primeTemplateExpertiseTable.projectId, projectId));

  const [results] = await db
    .select()
    .from(primeTemplateResultsTable)
    .where(eq(primeTemplateResultsTable.projectId, projectId));

  const [clients] = await db
    .select()
    .from(primeTemplateClientsTable)
    .where(eq(primeTemplateClientsTable.projectId, projectId));

  const [steps] = await db
    .select()
    .from(primeTemplateStepsTable)
    .where(eq(primeTemplateStepsTable.projectId, projectId));

  const [testimonials] = await db
    .select()
    .from(primeTemplateTestimonialsTable)
    .where(eq(primeTemplateTestimonialsTable.projectId, projectId));

  const [investment] = await db
    .select()
    .from(primeTemplateInvestmentTable)
    .where(eq(primeTemplateInvestmentTable.projectId, projectId));

  const [deliverables] = await db
    .select()
    .from(primeTemplateDeliverablesTable)
    .where(eq(primeTemplateDeliverablesTable.projectId, projectId));

  const [plansSection] = await db
    .select()
    .from(primeTemplatePlansTable)
    .where(eq(primeTemplatePlansTable.projectId, projectId));

  const [termsSection] = await db
    .select()
    .from(primeTemplateTermsConditionsTable)
    .where(eq(primeTemplateTermsConditionsTable.projectId, projectId));

  const [faqSection] = await db
    .select()
    .from(primeTemplateFaqTable)
    .where(eq(primeTemplateFaqTable.projectId, projectId));

  // Load child tables
  const [
    teamMembers,
    expertiseTopics,
    resultsList,
    clientsList,
    stepsTopics,
    testimonialsList,
    deliverablesList,
    plansList,
    termsList,
    faqList,
  ] = await Promise.all([
    team
      ? db
          .select()
          .from(primeTemplateTeamMembersTable)
          .where(eq(primeTemplateTeamMembersTable.teamSectionId, team.id))
          .orderBy(primeTemplateTeamMembersTable.sortOrder)
      : [],
    expertise
      ? db
          .select()
          .from(primeTemplateExpertiseTopicsTable)
          .where(
            eq(primeTemplateExpertiseTopicsTable.expertiseId, expertise.id)
          )
          .orderBy(primeTemplateExpertiseTopicsTable.sortOrder)
      : [],
    results
      ? db
          .select()
          .from(primeTemplateResultsListTable)
          .where(eq(primeTemplateResultsListTable.resultsSectionId, results.id))
          .orderBy(primeTemplateResultsListTable.sortOrder)
      : [],
    clients
      ? db
          .select()
          .from(primeTemplateClientsListTable)
          .where(eq(primeTemplateClientsListTable.clientsSectionId, clients.id))
          .orderBy(primeTemplateClientsListTable.sortOrder)
      : [],
    steps
      ? db
          .select()
          .from(primeTemplateStepsTopicsTable)
          .where(eq(primeTemplateStepsTopicsTable.stepsId, steps.id))
          .orderBy(primeTemplateStepsTopicsTable.sortOrder)
      : [],
    testimonials
      ? db
          .select()
          .from(primeTemplateTestimonialsListTable)
          .where(
            eq(
              primeTemplateTestimonialsListTable.testimonialsSectionId,
              testimonials.id
            )
          )
          .orderBy(primeTemplateTestimonialsListTable.sortOrder)
      : [],
    deliverables
      ? db
          .select()
          .from(primeTemplateDeliverablesListTable)
          .where(
            eq(
              primeTemplateDeliverablesListTable.deliverablesSectionId,
              deliverables.id
            )
          )
          .orderBy(primeTemplateDeliverablesListTable.sortOrder)
      : [],
    plansSection
      ? db
          .select()
          .from(primeTemplatePlansListTable)
          .where(
            eq(primeTemplatePlansListTable.plansSectionId, plansSection.id)
          )
          .orderBy(primeTemplatePlansListTable.sortOrder)
      : [],
    termsSection
      ? db
          .select()
          .from(primeTemplateTermsConditionsListTable)
          .where(
            eq(
              primeTemplateTermsConditionsListTable.termsSectionId,
              termsSection.id
            )
          )
          .orderBy(primeTemplateTermsConditionsListTable.sortOrder)
      : [],
    faqSection
      ? db
          .select()
          .from(primeTemplateFaqListTable)
          .where(eq(primeTemplateFaqListTable.faqSectionId, faqSection.id))
          .orderBy(primeTemplateFaqListTable.sortOrder)
      : [],
  ]);

  // Load plan details
  const plansWithDetails = await Promise.all(
    plansList.map(async (plan) => {
      const details = await db
        .select()
        .from(primeTemplatePlansIncludedItemsTable)
        .where(eq(primeTemplatePlansIncludedItemsTable.planId, plan.id))
        .orderBy(primeTemplatePlansIncludedItemsTable.sortOrder);

      return {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        isBestOffer: false,
        price: plan.price,
        pricePeriod: plan.planPeriod,
        ctaButtonTitle: plan.buttonTitle,
        sortOrder: plan.sortOrder,
        planDetails: details.map((d) => ({
          id: d.id,
          description: d.description,
          sortOrder: d.sortOrder,
        })),
      };
    })
  );

  return {
    introduction,
    aboutUs,
    team,
    teamMembers,
    expertise,
    expertiseTopics,
    results,
    resultsList,
    clients,
    clientsList,
    steps,
    stepsTopics,
    testimonials,
    testimonialsList,
    investment,
    deliverables,
    deliverablesList,
    plans: plansWithDetails,
    termsSection,
    termsList,
    faqSection,
    faqList,
  };
}

/**
 * Unified function to fetch project data with different levels of detail
 * Cached to prevent duplicate calls in the same request
 */
export const getProjectData = cache(
  async (
    userName: string,
    projectUrl: string
  ): Promise<CompleteProjectData | null> => {
    try {
      // Get core project data
      const projectWithUser = await db
        .select({
          id: projectsTable.id,
          projectName: projectsTable.projectName,
          projectSentDate: projectsTable.projectSentDate,
          projectValidUntil: projectsTable.projectValidUntil,
          projectStatus: projectsTable.projectStatus,
          projectVisualizationDate: projectsTable.projectVisualizationDate,
          templateType: projectsTable.templateType,
          mainColor: projectsTable.mainColor,
          projectUrl: projectsTable.projectUrl,
          pagePassword: projectsTable.pagePassword,
          isPublished: projectsTable.isPublished,
          isProposalGenerated: projectsTable.isProposalGenerated,
          createdAt: projectsTable.created_at,
          updatedAt: projectsTable.updated_at,
          userName: personUserTable.userName,
          userPhone: personUserTable.phone,
        })
        .from(projectsTable)
        .innerJoin(
          personUserTable,
          eq(projectsTable.personId, personUserTable.id)
        )
        .where(
          and(
            eq(personUserTable.userName, userName),
            eq(projectsTable.projectUrl, projectUrl)
          )
        )
        .limit(1);

      if (!projectWithUser[0]) {
        return null;
      }

      const project = projectWithUser[0];

      // Load template-specific data based on templateType
      if (project.templateType === "flash") {
        const templateData = await loadFlashTemplateData(project.id);

        // Map Flash template data to CompleteProjectData format
        const completeProjectData: CompleteProjectData = {
          id: project.id,
          projectName: project.projectName,
          hideClientName: false,
          clientName: templateData.introduction?.name || "",
          hideClientPhoto: true,
          clientPhoto: null,
          projectSentDate: project.projectSentDate,
          projectValidUntil: project.projectValidUntil,
          projectStatus: project.projectStatus,
          projectVisualizationDate: project.projectVisualizationDate,
          templateType: project.templateType,
          mainColor: project.mainColor,
          companyName: null,
          companyEmail: templateData.introduction?.email || null,
          ctaButtonTitle: templateData.introduction?.buttonTitle || null,
          pageTitle: templateData.introduction?.title || null,
          pageSubtitle: templateData.introduction?.subtitle || null,
          hidePageSubtitle: false,
          services:
            templateData.introServices.map((s) => s.serviceName).join(",") ||
            null,
          hideServices: false,
          hideAboutUsSection: templateData.aboutUs?.hideSection || false,
          hideAboutUsTitle: false,
          aboutUsTitle: templateData.aboutUs?.title || null,
          hideAboutUsSubtitle1: false,
          hideAboutUsSubtitle2: false,
          aboutUsSubtitle1: templateData.aboutUs?.supportText || null,
          aboutUsSubtitle2: templateData.aboutUs?.subtitle || null,
          hideAboutYourTeamSection: templateData.team?.hideSection || false,
          ourTeamSubtitle: templateData.team?.title || null,
          hideExpertiseSection: templateData.expertise?.hideSection || false,
          expertiseSubtitle: templateData.expertise?.title || null,
          hideResultsSection: templateData.results?.hideSection || false,
          resultsSubtitle: templateData.results?.title || null,
          hideClientsSection: templateData.clients?.hideSection || false,
          clientSubtitle: null,
          hideProcessSection: templateData.steps?.hideSection || false,
          hideProcessSubtitle: false,
          processSubtitle: templateData.steps?.title || null,
          hideCTASection: false,
          ctaBackgroundImage: null,
          hideTestimonialsSection:
            templateData.testimonials?.hideSection || false,
          hideInvestmentSection: templateData.investment?.hideSection || false,
          investmentTitle: templateData.investment?.title || null,
          hideIncludedServicesSection:
            templateData.deliverables?.hideSection || false,
          hidePlansSection: false,
          hideTermsSection: false,
          hideFaqSection: templateData.faqSection?.hideSection || false,
          hideFaqSubtitle: false,
          faqSubtitle: templateData.faqSection?.title || null,
          hideFinalMessageSection: false,
          hideFinalMessageSubtitle: false,
          endMessageTitle: null,
          endMessageTitle2: null,
          endMessageDescription: null,
          projectUrl: project.projectUrl,
          pagePassword: project.pagePassword,
          isPublished: project.isPublished,
          isProposalGenerated: project.isProposalGenerated,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          userName: project.userName,
          userPhone: project.userPhone,
          // Map arrays
          teamMembers: templateData.teamMembers.map(
            (m): ProjectTeamMember => ({
              id: m.id,
              name: m.memberName,
              role: m.memberRole,
              photo: m.memberPhoto,
              sortOrder: m.sortOrder,
            })
          ),
          expertise: templateData.expertiseTopics.map(
            (e): ProjectExpertise => ({
              id: e.id,
              icon: null,
              title: e.title,
              description: e.description,
              sortOrder: e.sortOrder,
              hideExpertiseIcon: true,
            })
          ),
          results: templateData.resultsList.map(
            (r): ProjectResult => ({
              id: r.id,
              photo: r.photo,
              hidePhoto: r.hidePhoto,
              client: r.name,
              subtitle: r.instagram,
              investment: r.invested,
              roi: r.returnValue,
              sortOrder: r.sortOrder,
            })
          ),
          clients: templateData.clientsList.map(
            (c): ProjectClient => ({
              id: c.id,
              logo: c.logo,
              hideLogo: c.hideLogo,
              name: c.name,
              hideClientName: c.hideName,
              sortOrder: c.sortOrder,
            })
          ),
          processSteps: templateData.stepsTopics.map(
            (s, index): ProjectProcessStep => ({
              id: s.id,
              stepCounter: index + 1,
              stepName: s.stepName,
              description: s.stepDescription,
              sortOrder: s.sortOrder,
            })
          ),
          testimonials: templateData.testimonialsList.map(
            (t): ProjectTestimonial => ({
              id: t.id,
              testimonial: t.testimonial,
              name: t.name,
              role: t.role,
              photo: t.photo,
              hidePhoto: t.hidePhoto,
              sortOrder: t.sortOrder,
            })
          ),
          includedServices: templateData.deliverablesList.map(
            (d): ProjectService => ({
              id: d.id,
              title: d.deliveryName,
              description: d.deliveryContent,
              sortOrder: d.sortOrder,
            })
          ),
          plans: templateData.plans,
          termsConditions: templateData.termsList.map(
            (t): ProjectTermsCondition => ({
              id: t.id,
              title: t.title,
              description: t.description,
              sortOrder: t.sortOrder,
            })
          ),
          faq: templateData.faqList.map(
            (f): ProjectFaq => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
              sortOrder: f.sortOrder,
            })
          ),
        };

        return completeProjectData;
      } else if (project.templateType === "prime") {
        const templateData = await loadPrimeTemplateData(project.id);

        // Map Prime template data to CompleteProjectData format
        const completeProjectData: CompleteProjectData = {
          id: project.id,
          projectName: project.projectName,
          hideClientName: false,
          clientName: templateData.introduction?.name || "",
          hideClientPhoto: true,
          clientPhoto: null,
          projectSentDate: project.projectSentDate,
          projectValidUntil: project.projectValidUntil,
          projectStatus: project.projectStatus,
          projectVisualizationDate: project.projectVisualizationDate,
          templateType: project.templateType,
          mainColor: project.mainColor,
          companyName: null,
          companyEmail: templateData.introduction?.email || null,
          ctaButtonTitle: templateData.introduction?.buttonTitle || null,
          pageTitle: templateData.introduction?.title || null,
          pageSubtitle: templateData.introduction?.subtitle || null,
          hidePageSubtitle: false,
          services: null,
          hideServices: false,
          hideAboutUsSection: templateData.aboutUs?.hideSection || false,
          hideAboutUsTitle: false,
          aboutUsTitle: templateData.aboutUs?.title || null,
          hideAboutUsSubtitle1: false,
          hideAboutUsSubtitle2: false,
          aboutUsSubtitle1: templateData.aboutUs?.paragraph1 || null,
          aboutUsSubtitle2: templateData.aboutUs?.paragraph2 || null,
          hideAboutYourTeamSection: templateData.team?.hideSection || false,
          ourTeamSubtitle: templateData.team?.title || null,
          hideExpertiseSection: templateData.expertise?.hideSection || false,
          expertiseSubtitle: templateData.expertise?.title || null,
          hideResultsSection: templateData.results?.hideSection || false,
          resultsSubtitle: templateData.results?.title || null,
          hideClientsSection: templateData.clients?.hideSection || false,
          clientSubtitle: null,
          hideProcessSection: templateData.steps?.hideSection || false,
          hideProcessSubtitle: false,
          processSubtitle: templateData.steps?.title || null,
          hideCTASection: false,
          ctaBackgroundImage: null,
          hideTestimonialsSection:
            templateData.testimonials?.hideSection || false,
          hideInvestmentSection: templateData.investment?.hideSection || false,
          investmentTitle: templateData.investment?.title || null,
          hideIncludedServicesSection: false,
          hidePlansSection: false,
          hideTermsSection: templateData.termsSection?.hideSection || false,
          hideFaqSection: templateData.faqSection?.hideSection || false,
          hideFaqSubtitle: false,
          faqSubtitle: templateData.faqSection?.subtitle || null,
          hideFinalMessageSection: false,
          hideFinalMessageSubtitle: false,
          endMessageTitle: null,
          endMessageTitle2: null,
          endMessageDescription: null,
          projectUrl: project.projectUrl,
          pagePassword: project.pagePassword,
          isPublished: project.isPublished,
          isProposalGenerated: project.isProposalGenerated,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          userName: project.userName,
          userPhone: project.userPhone,
          // Map arrays
          teamMembers: templateData.teamMembers.map(
            (m): ProjectTeamMember => ({
              id: m.id,
              name: m.memberName,
              role: m.memberRole,
              photo: m.memberPhoto,
              sortOrder: m.sortOrder,
            })
          ),
          expertise: templateData.expertiseTopics.map(
            (e): ProjectExpertise => ({
              id: e.id,
              icon: null,
              title: e.title,
              description: e.description,
              sortOrder: e.sortOrder,
              hideExpertiseIcon: true,
            })
          ),
          results: templateData.resultsList.map(
            (r): ProjectResult => ({
              id: r.id,
              photo: r.photo,
              hidePhoto: r.hidePhoto,
              client: r.name,
              subtitle: r.instagram,
              investment: r.invested,
              roi: r.returnValue,
              sortOrder: r.sortOrder,
            })
          ),
          clients: templateData.clientsList.map(
            (c): ProjectClient => ({
              id: c.id,
              logo: c.logo,
              hideLogo: c.hideLogo,
              name: c.name,
              hideClientName: c.hideName,
              sortOrder: c.sortOrder,
            })
          ),
          processSteps: templateData.stepsTopics.map(
            (s, index): ProjectProcessStep => ({
              id: s.id,
              stepCounter: index + 1,
              stepName: s.stepName,
              description: s.stepDescription,
              sortOrder: s.sortOrder,
            })
          ),
          testimonials: templateData.testimonialsList.map(
            (t): ProjectTestimonial => ({
              id: t.id,
              testimonial: t.testimonial,
              name: t.name,
              role: t.role,
              photo: t.photo,
              hidePhoto: t.hidePhoto,
              sortOrder: t.sortOrder,
            })
          ),
          includedServices: templateData.deliverablesList.map(
            (d): ProjectService => ({
              id: d.id,
              title: d.deliveryName,
              description: d.deliveryContent,
              sortOrder: d.sortOrder,
            })
          ),
          plans: templateData.plans,
          termsConditions: templateData.termsList.map(
            (t): ProjectTermsCondition => ({
              id: t.id,
              title: t.title,
              description: t.description,
              sortOrder: t.sortOrder,
            })
          ),
          faq: templateData.faqList.map(
            (f): ProjectFaq => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
              sortOrder: f.sortOrder,
            })
          ),
        };

        return completeProjectData;
      } else {
        // Unsupported template type
        return null;
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      return null;
    }
  }
);
