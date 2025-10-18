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
      userName: proposal.introduction.userName,
      email: proposal.introduction.email,
      buttonTitle: proposal.introduction.buttonText,
      title: proposal.introduction.title,
      validity: requestData.validUntil || new Date().toISOString(),
      subtitle: proposal.introduction.subtitle,
      hideSubtitle: false,
      services:
        proposal.introduction.services?.map((service, index) => ({
          id: crypto.randomUUID(),
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
      members:
        proposal.team.members?.map((member, index) => ({
          id: crypto.randomUUID(),
          name: member.name,
          role: member.role,
          image: member.image,
          hideMember: false,
          sortOrder: index,
        })) || [],
    },
    expertise: {
      hideSection: false,
      title: proposal.specialties.title,
      hideTitle: false,
      topics:
        proposal.specialties.topics?.map((topic, index) => ({
          id: crypto.randomUUID(),
          icon: "DiamondIcon",
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
          id: crypto.randomUUID(),
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
      marquee: proposal.steps.marquee?.map((item) => ({
        id: crypto.randomUUID(),
        text: item.text,
        hideItem: false,
        sortOrder: item.sortOrder,
      })),
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
      items: proposal.testimonials.items?.map((item) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        testimonial: item.testimonial,
        photo: item.photo,
        hidePhoto: false,
        sortOrder: item.sortOrder,
      })),
    },
    investment: {
      hideSection: false,
      title: proposal.investment.title,
      projectScope: proposal.scope.content,
      hideTitle: false,
    },

    results: {
      hideSection: false,
      title: proposal.results.title,
      hideTitle: false,
      items: proposal.results.items?.map((item) => ({
        id: item.id,
        client: item.client,
        instagram: item.instagram,
        investment: item.investment,
        roi: item.roi,
        photo: item.photo,
        hidePhoto: false,
        sortOrder: item.sortOrder,
      })),
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
      plansItems: proposal.investment.plansItems?.map((plan) => ({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        value: plan.value,
        planPeriod: plan.planPeriod,
        recommended: false,
        buttonTitle: plan.buttonTitle,
        hideTitleField: false,
        hideDescription: false,
        hidePrice: false,
        hidePlanPeriod: false,
        hideButtonTitle: false,
        sortOrder: plan.sortOrder,
        includedItems: plan.includedItems?.map((item) => ({
          id: item.id,
          description: item.description,
          hideItem: false,
          sortOrder: item.sortOrder,
        })),
      })),
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
          id: crypto.randomUUID(),
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
    userName: string;
    userEmail: string;
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
      userName: requestData.userName,
      email: requestData.userEmail,
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
      marquee:
        proposal.steps.marquee?.map((item, index) => ({
          id: crypto.randomUUID(),
          text: item.text,
          hideItem: false,
          sortOrder: index,
        })) || [],
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
      plansItems: proposal.investment.plansItems?.map((plan) => ({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        value: plan.value,
        planPeriod: plan.planPeriod,
        recommended: false,
        buttonTitle: plan.buttonTitle,
        hideTitleField: false,
        hideDescription: false,
        hidePrice: false,
        hidePlanPeriod: false,
        hideButtonTitle: false,
        sortOrder: plan.sortOrder,
        includedItems: plan.includedItems?.map((item) => ({
          id: item.id,
          description: item.description,
          hideItem: false,
          sortOrder: item.sortOrder,
        })),
      })),
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
    userName: string;
    userEmail: string;
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
    userName: string;
    userEmail: string;
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
