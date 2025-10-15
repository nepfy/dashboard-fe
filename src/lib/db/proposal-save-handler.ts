/**
 * Unified Proposal Save Handler
 * Replaces the old template-save-handlers.ts with 300+ lines
 * Now just ~50 lines using the proposalData field
 */

import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema/projects";
import { eq } from "drizzle-orm";
import type { ProposalData } from "#/types/proposal-data";
import type { FlashWorkflowResult } from "#/modules/ai-generator/themes/flash";
import type { PrimeWorkflowResult } from "#/modules/ai-generator/themes/prime";

/**
 * Convert Flash AI result to unified ProposalData format
 */
function convertFlashToProposalData(
  aiResult: FlashWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
): ProposalData {
  if (!aiResult.success || !aiResult.proposal) {
    throw new Error("Flash AI result is not successful");
  }

  const proposal = aiResult.proposal;

  return {
    introduction: {
      name: "Flash Template",
      email: requestData.originalPageUrl || "",
      buttonTitle: proposal.introduction.buttonText,
      title: proposal.introduction.title,
      validity: requestData.validUntil || new Date().toISOString(),
      subtitle: proposal.introduction.subtitle,
      hideSubtitle: false,
      services:
        proposal.introduction.services?.map((service, index) => ({
          serviceName: service,
          hideService: false,
          sortOrder: index,
        })) || [],
    },
    aboutUs: {
      hideSection: false,
      title: proposal.aboutUs.title,
      hideTitle: false,
      supportText: proposal.aboutUs.supportText,
      hideSupportText: false,
      subtitle: proposal.aboutUs.subtitle,
      hideSubtitle: false,
    },
    team: {
      hideSection: false,
      title: proposal.team.title,
      hideTitle: false,
      members: [],
    },
    expertise: {
      hideSection: false,
      title: proposal.specialties.title,
      hideTitle: false,
      topics:
        proposal.specialties.topics?.map((topic, index) => ({
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
    },
    steps: {
      hideSection: false,
      title: proposal.steps.title,
      hideTitle: false,
      introduction: undefined,
      hideIntroduction: false,
      topics:
        proposal.steps.topics?.map((topic, index) => ({
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
      marquee: [],
    },
    clients: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items: [],
    },
    testimonials: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items: [],
    },
    investment: {
      hideSection: false,
      title: proposal.investment.title,
      hideTitle: false,
    },
    deliverables: {
      hideSection: false,
      title: "Entregáveis",
      hideTitle: false,
      items:
        proposal.investment.deliverables?.map((deliverable, index) => ({
          title: deliverable.title,
          description: deliverable.description,
          hideItem: false,
          sortOrder: index,
        })) || [],
    },
    plans: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items:
        proposal.investment.plans?.map((plan, index) => ({
          title: plan.title,
          description: plan.description,
          value: plan.value,
          recommended: false,
          hidePlan: false,
          sortOrder: index,
          includedItems:
            plan.topics?.map((topic, topicIndex) => ({
              item: topic,
              hideItem: false,
              sortOrder: topicIndex,
            })) || [],
        })) || [],
    },
    termsConditions: {
      hideSection: false,
      title: proposal.terms?.[0]?.title || "Termos e Condições",
      hideTitle: false,
      items:
        proposal.terms?.map((term, index) => ({
          term: `${term.title}: ${term.description}`,
          hideTerm: false,
          sortOrder: index,
        })) || [],
    },
    faq: {
      hideSection: false,
      title: "Perguntas Frequentes",
      hideTitle: false,
      items:
        proposal.faq?.map((item, index) => ({
          question: item.question,
          answer: item.answer,
          hideQuestion: false,
          sortOrder: index,
        })) || [],
    },
    footer: {
      hideSection: false,
      callToAction: proposal.footer.callToAction,
      disclaimer: proposal.footer.disclaimer,
      hideCallToAction: false,
      hideDisclaimer: false,
      marquee: [],
    },
  };
}

/**
 * Convert Prime AI result to unified ProposalData format
 */
function convertPrimeToProposalData(
  aiResult: PrimeWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
): ProposalData {
  if (!aiResult.success || !aiResult.data) {
    throw new Error("Prime AI result is not successful");
  }

  const proposal = aiResult.data;

  return {
    introduction: {
      name: "Prime Template",
      email: requestData.originalPageUrl || "",
      buttonTitle: proposal.introduction.buttonText,
      title: proposal.introduction.title,
      validity: requestData.validUntil || new Date().toISOString(),
      subtitle: proposal.introduction.subtitle,
      hideSubtitle: false,
      services:
        proposal.introduction.services?.map((service, index) => ({
          serviceName: service,
          hideService: false,
          sortOrder: index,
        })) || [],
    },
    aboutUs: {
      hideSection: false,
      title: proposal.aboutUs.title,
      hideTitle: false,
      supportText: proposal.aboutUs.supportText,
      hideSupportText: false,
      subtitle: proposal.aboutUs.subtitle,
      hideSubtitle: false,
    },
    team: {
      hideSection: false,
      title: proposal.team.title,
      hideTitle: false,
      members: [],
    },
    expertise: {
      hideSection: false,
      title: proposal.specialties.title,
      hideTitle: false,
      topics:
        proposal.specialties.topics?.map((topic, index) => ({
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
    },
    steps: {
      hideSection: false,
      title: proposal.steps.title,
      hideTitle: false,
      introduction: proposal.steps.introduction,
      hideIntroduction: false,
      topics:
        proposal.steps.topics?.map((topic, index) => ({
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
      marquee: [],
    },
    results: {
      hideSection: false,
      title: "Resultados",
      hideTitle: false,
      items: [],
    },
    clients: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items: [],
    },
    cta: {
      hideSection: false,
      title: "Entre em contato",
      hideTitle: false,
      description: undefined,
      hideDescription: false,
      buttonText: "Falar com especialista",
      buttonLink: undefined,
    },
    testimonials: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items: [],
    },
    investment: {
      hideSection: false,
      title: proposal.investment.title,
      hideTitle: false,
    },
    deliverables: {
      hideSection: false,
      title: "Entregáveis",
      hideTitle: false,
      items:
        proposal.investment.deliverables?.map((deliverable, index) => ({
          title: deliverable.title,
          description: deliverable.description,
          hideItem: false,
          sortOrder: index,
        })) || [],
    },
    plans: {
      hideSection: false,
      title: "Planos",
      hideTitle: false,
      items:
        proposal.investment.plans?.map((plan, index) => ({
          title: plan.title,
          description: plan.description,
          value: plan.value,
          recommended: false,
          hidePlan: false,
          sortOrder: index,
          includedItems:
            plan.topics?.map((topic, topicIndex) => ({
              item: topic,
              hideItem: false,
              sortOrder: topicIndex,
            })) || [],
        })) || [],
    },
    termsConditions: {
      hideSection: false,
      title: proposal.terms?.[0]?.title || "Termos e Condições",
      hideTitle: false,
      items:
        proposal.terms?.map((term, index) => ({
          term: `${term.title}: ${term.description}`,
          hideTerm: false,
          sortOrder: index,
        })) || [],
    },
    faq: {
      hideSection: false,
      title: "Perguntas Frequentes",
      hideTitle: false,
      items:
        proposal.faq?.map((item, index) => ({
          question: item.question,
          answer: item.answer,
          hideQuestion: false,
          sortOrder: index,
        })) || [],
    },
    footer: {
      hideSection: false,
      callToAction: proposal.footer.callToAction,
      disclaimer: proposal.footer.contactInfo,
      hideCallToAction: false,
      hideDisclaimer: false,
      marquee: [],
    },
  };
}

/**
 * Save Flash template data using unified ProposalData
 */
export async function saveFlashTemplateData(
  projectId: string,
  aiResult: FlashWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
) {
  const proposalData = convertFlashToProposalData(aiResult, requestData);

  await db
    .update(projectsTable)
    .set({
      proposalData: proposalData as unknown as Record<string, unknown>,
      updated_at: new Date(),
    })
    .where(eq(projectsTable.id, projectId));

  console.log("✅ Flash template data saved successfully to proposalData");
}

/**
 * Save Prime template data using unified ProposalData
 */
export async function savePrimeTemplateData(
  projectId: string,
  aiResult: PrimeWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
) {
  const proposalData = convertPrimeToProposalData(aiResult, requestData);

  await db
    .update(projectsTable)
    .set({
      proposalData: proposalData as unknown as Record<string, unknown>,
      updated_at: new Date(),
    })
    .where(eq(projectsTable.id, projectId));

  console.log("✅ Prime template data saved successfully to proposalData");
}
