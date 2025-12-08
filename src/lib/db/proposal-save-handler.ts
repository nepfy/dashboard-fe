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
import type { MinimalWorkflowResult } from "#/modules/ai-generator/themes/minimal";
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
          id: member.id,
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
          id: topic.id,
          icon: topic.icon,
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
          id: topic.id,
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
      marquee: proposal.steps.marquee?.map((item) => ({
        id: item.id,
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
      hideProjectScope: false,
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

/**
 * Convert Minimal AI result to unified ProposalData format
 */
function convertMinimalToProposalData(
  aiResult: MinimalWorkflowResult,
  requestData: {
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
): ProposalData {
  if (aiResult.status !== "success" || !aiResult.proposal) {
    throw new Error("Minimal AI result is not successful");
  }

  const proposal = aiResult.proposal;

  const requireString = (value: string | undefined | null, label: string) => {
    if (!value || !value.trim()) {
      throw new Error(`Minimal proposal missing required field: ${label}`);
    }
    return value;
  };

  const ensureArray = <T>(arr: T[] | undefined | null, label: string) => {
    if (!arr || arr.length === 0) {
      throw new Error(`Minimal proposal missing required list: ${label}`);
    }
    return arr;
  };

  return {
    introduction: {
      userName: requireString(
        proposal.introduction.userName,
        "introduction.userName"
      ),
      email: requireString(proposal.introduction.email, "introduction.email"),
      buttonTitle: "Solicitar Proposta",
      title: requireString(proposal.introduction.title, "introduction.title"),
      // Preencher subtitle para evitar placeholder na visualização
      subtitle:
        proposal.aboutUs?.subtitle ||
        proposal.aboutUs?.title ||
        proposal.introduction.title,
      validity: requestData.validUntil || new Date().toISOString(),
      services: ensureArray(
        proposal.introduction.services,
        "introduction.services"
      ).map((service, index) => ({
        id: requireString(service.id, `introduction.services[${index}].id`),
        serviceName: requireString(
          service.serviceName,
          `introduction.services[${index}].serviceName`
        ),
        hideService: service.hideItem || false,
        sortOrder: service.sortOrder || index,
      })),
    },
    aboutUs: {
      hideSection: proposal.aboutUs.hideSection || false,
      title: requireString(proposal.aboutUs.title, "aboutUs.title"),
      hideTitle: false,
      supportText: "",
      hideSupportText: true,
      subtitle: proposal.aboutUs.subtitle || "",
      hideSubtitle: proposal.aboutUs.hideSubtitle || false,
      marqueeText: proposal.aboutUs.marqueeText || "",
      hideMarquee: proposal.aboutUs.hideMarquee || false,
      items:
        proposal.aboutUs.items?.map((item, index) => ({
          id: requireString(item.id, `aboutUs.items[${index}].id`),
          image: item.image || "",
          caption: item.caption || "",
          hideImage: item.hideImage || false,
          hideCaption: item.hideCaption || false,
          sortOrder: item.sortOrder || index,
        })) || [],
    },
    team: {
      hideSection: proposal.team.hideSection || false,
      title: requireString(proposal.team.title, "team.title"),
      hideTitle: false,
      members: ensureArray(proposal.team.members, "team.members").map(
        (member, index) => ({
          id: requireString(member.id, `team.members[${index}].id`),
          name: requireString(member.name, `team.members[${index}].name`),
          role: requireString(member.role, `team.members[${index}].role`),
          image: member.image || "",
          hideMember: member.hideMember || false,
          sortOrder: member.sortOrder || index,
        })
      ),
    },
    expertise: {
      hideSection: proposal.expertise.hideSection || false,
      title: requireString(proposal.expertise.title, "expertise.title"),
      hideTitle: false,
      topics: ensureArray(proposal.expertise.topics, "expertise.topics").map(
        (topic, index) => ({
          id: requireString(topic.id, `expertise.topics[${index}].id`),
          icon: requireString(topic.icon, `expertise.topics[${index}].icon`),
          title: requireString(topic.title, `expertise.topics[${index}].title`),
          description: requireString(
            topic.description,
            `expertise.topics[${index}].description`
          ),
          hideTopic: topic.hideItem || false,
          sortOrder: topic.sortOrder || index,
        })
      ),
    },
    steps: {
      hideSection: proposal.steps.hideSection || false,
      title: "Nosso Processo",
      hideTitle: false,
      introduction: undefined,
      hideIntroduction: true,
      topics: ensureArray(proposal.steps.topics, "steps.topics").map(
        (topic, index) => ({
          id: requireString(topic.id, `steps.topics[${index}].id`),
          title: requireString(topic.title, `steps.topics[${index}].title`),
          description: requireString(
            topic.description,
            `steps.topics[${index}].description`
          ),
          hideTopic: topic.hideItem || false,
          sortOrder: topic.sortOrder || index,
        })
      ),
      marquee: [],
    },
    clients: {
      hideSection: proposal.clients.hideSection ?? false,
      title: requireString(proposal.clients.title, "clients.title"),
      hideTitle: proposal.clients.hideTitle ?? false,
      description: proposal.clients.description || "",
      paragraphs: ensureArray(
        proposal.clients.paragraphs,
        "clients.paragraphs"
      ).map((p, idx) => requireString(p, `clients.paragraphs[${idx}]`)),
      items: ensureArray(proposal.clients.items, "clients.items").map(
        (client, index) => ({
          id: requireString(client.id, `clients.items[${index}].id`),
          name: requireString(client.name, `clients.items[${index}].name`),
          logo: client.logo || "",
          hideClient:
            (client as { hideClient?: boolean }).hideClient ??
            (client as { hideItem?: boolean }).hideItem ??
            false,
          sortOrder: client.sortOrder ?? index,
        })
      ),
    },
    testimonials: {
      hideSection: proposal.testimonials.hideSection || false,
      title: undefined,
      hideTitle: true,
      items: ensureArray(proposal.testimonials.items, "testimonials.items").map(
        (item, index) => ({
          id: requireString(item.id, `testimonials.items[${index}].id`),
          name: requireString(item.name, `testimonials.items[${index}].name`),
          role: requireString(item.role, `testimonials.items[${index}].role`),
          testimonial: requireString(
            item.testimonial,
            `testimonials.items[${index}].testimonial`
          ),
          photo: item.photo || "",
          hidePhoto: item.hidePhoto || false,
          sortOrder: item.sortOrder || index,
        })
      ),
    },
    investment: {
      hideSection: proposal.investment.hideSection || false,
      title: requireString(proposal.investment.title, "investment.title"),
      projectScope: proposal.investment.projectScope || "",
      hideProjectScope: proposal.investment.hideProjectScope || false,
      hideTitle: false,
    },
    results: {
      hideSection: proposal.results.hideSection || false,
      title: requireString(proposal.results.title, "results.title"),
      hideTitle: false,
      items: ensureArray(proposal.results.items, "results.items").map(
        (item, index) => ({
          id: requireString(item.id, `results.items[${index}].id`),
          client: requireString(item.client, `results.items[${index}].client`),
          instagram: item.instagram || "",
          investment: requireString(
            item.investment,
            `results.items[${index}].investment`
          ),
          roi: requireString(item.roi, `results.items[${index}].roi`),
          photo: item.photo || "",
          hidePhoto: item.hidePhoto || false,
          sortOrder: item.sortOrder || index,
        })
      ),
    },
    deliverables: {
      hideSection: true,
      title: "",
      hideTitle: true,
      items: [],
    },
    plans: {
      hideSection: proposal.plans.hideSection || false,
      title: undefined,
      hideTitle: true,
      plansItems: ensureArray(
        proposal.plans.plansItems,
        "plans.plansItems"
      ).map((plan, index) => ({
        id: requireString(plan.id, `plans.plansItems[${index}].id`),
        title: requireString(plan.title, `plans.plansItems[${index}].title`),
        description: requireString(
          plan.description,
          `plans.plansItems[${index}].description`
        ),
        value: requireString(
          String(plan.value),
          `plans.plansItems[${index}].value`
        ),
        planPeriod: plan.planPeriod || "mensal",
        recommended: plan.recommended || false,
        buttonTitle: plan.buttonTitle || "Solicitar Proposta",
        buttonWhereToOpen: plan.buttonWhereToOpen || "link",
        buttonHref: plan.buttonHref || "",
        buttonPhone: plan.buttonPhone || "",
        hideTitleField: plan.hideTitleField || false,
        hideDescription: plan.hideDescription || false,
        hidePrice: plan.hidePrice || false,
        hidePlanPeriod: plan.hidePlanPeriod || false,
        hideButtonTitle: plan.hideButtonTitle || false,
        hideItem: plan.hideItem || false,
        sortOrder: plan.sortOrder || index,
        includedItems: ensureArray(
          plan.includedItems,
          `plans.plansItems[${index}].includedItems`
        ).map((item, itemIndex) => ({
          id: requireString(
            item.id,
            `plans.plansItems[${index}].includedItems[${itemIndex}].id`
          ),
          item: requireString(
            item.description,
            `plans.plansItems[${index}].includedItems[${itemIndex}].description`
          ),
          description: requireString(
            item.description,
            `plans.plansItems[${index}].includedItems[${itemIndex}].description`
          ),
          hideItem: item.hideItem || false,
          sortOrder: item.sortOrder || itemIndex,
          hideDescription: false,
        })),
      })),
    },
    faq: {
      hideSection: proposal.faq.hideSection || false,
      title: "Perguntas Frequentes",
      hideTitle: false,
      items: ensureArray(proposal.faq.items, "faq.items").map(
        (item, index) => ({
          id: requireString(item.id, `faq.items[${index}].id`),
          question: requireString(
            item.question,
            `faq.items[${index}].question`
          ),
          answer: requireString(item.answer, `faq.items[${index}].answer`),
          hideItem: item.hideItem || false,
          sortOrder: item.sortOrder || index,
        })
      ),
    },
    footer: {
      callToAction: requireString(
        proposal.footer.callToAction,
        "footer.callToAction"
      ),
      disclaimer: requireString(
        proposal.footer.disclaimer,
        "footer.disclaimer"
      ),
      hideCallToAction: proposal.footer.hideCallToAction || false,
      hideDisclaimer: proposal.footer.hideDisclaimer || false,
      marquee: [],
    },
  };
}

/**
 * Save Minimal template data using unified ProposalData
 */
export async function saveMinimalTemplateData(
  projectId: string,
  aiResult: MinimalWorkflowResult,
  requestData: {
    userName: string;
    userEmail: string;
    validUntil?: string;
    originalPageUrl?: string;
    pagePassword?: string;
  }
) {
  const proposalData = convertMinimalToProposalData(aiResult, requestData);

  await db
    .update(projectsTable)
    .set({
      proposalData: proposalData as unknown as Record<string, unknown>,
      updated_at: new Date(),
    })
    .where(eq(projectsTable.id, projectId));

  console.log("✅ Minimal template data saved successfully to proposalData");
}
