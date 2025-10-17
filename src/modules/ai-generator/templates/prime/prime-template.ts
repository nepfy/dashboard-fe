import {
  BaseTemplateData,
  BaseProposal,
  BaseSection,
  baseTemplateConfig,
} from "../base/base-template";

export interface PrimeTemplateData extends BaseTemplateData {
  templateType: "prime";
  primeFeatures?: {
    premiumStyling: boolean;
    advancedCustomization: boolean;
    prioritySupport: boolean;
  };
}

export interface PrimeSection extends BaseSection {
  primeSpecific?: {
    premiumStyling: boolean;
    advancedOptions: boolean;
  };
}

export interface PrimeProposal extends BaseProposal {
  // Introduction Section
  introduction: {
    title: string; // exactly 60 chars, AI-generated
    subtitle: string; // exactly 100 chars, AI-generated
    services: string[]; // exactly 4, 30 chars each, AI-generated
    validity: string; // Not editable
    buttonText: string; // 20 chars, no AI
  };

  // About Us Section
  aboutUs: {
    title: string; // exactly 155 chars, AI-generated
    supportText: string; // exactly 70 chars, AI-generated
    subtitle: string; // exactly 250 chars, AI-generated
  };

  // Team Section
  team: {
    title: string; // exactly 60 chars, AI-generated
    subtitle: string; // exactly 120 chars, AI-generated
  };

  // Specialties Section
  specialties: {
    title: string; // exactly 180 chars, AI-generated
    topics: Array<{
      title: string; // exactly 60 chars
      description: string; // exactly 140 chars
    }>; // 9 topics
  };

  // Process Steps Section
  steps: {
    introduction: string; // exactly 120 chars, AI-generated
    title: string; // exactly 50 chars, not editable
    topics: Array<{
      title: string; // exactly 45 chars
      description: string; // exactly 260 chars
    }>; // 6 topics
  };

  // Project Scope Section
  scope: {
    content: string; // exactly 400 chars
  };

  // Investment Section
  investment: {
    title: string; // exactly 95 chars, AI-generated
    deliverables: Array<{
      title: string; // exactly 35 chars
      description: string; // exactly 350 chars
    }>;
    plans: Array<{
      id?: string;
      hideTitleField?: boolean;
      hideDescription?: boolean;
      hidePrice?: boolean;
      hidePlanPeriod?: boolean;
      hideButtonTitle?: boolean;
      buttonTitle: string;
      planPeriod: string;
      recommended: boolean;
      sortOrder?: number;
      title: string; // exactly 25 chars
      description: string; // exactly 110 chars
      value: string; // format R$X.XXX (<= 11 chars)
      includedItems: Array<{
        item: string;
        hideItem?: boolean;
        sortOrder?: number;
      }>;
    }>; // 3 plans
  };

  // Terms and Conditions (optional)
  terms?: Array<{
    title: string; // exactly 35 chars
    description: string; // exactly 200 chars
  }>;

  // FAQ (mandatory)
  faq: Array<{
    question: string; // exactly 120 chars
    answer: string; // exactly 320 chars
  }>; // 8 items

  // Footer
  footer: {
    callToAction: string; // exactly 60 chars, AI-generated
    contactInfo: string; // exactly 150 chars, editable
  };
}

export const primeTemplateConfig = {
  ...baseTemplateConfig,
  name: "Prime Template",
  description:
    "Template premium com funcionalidades avançadas e personalização superior",
  features: [
    ...baseTemplateConfig.features,
    "Estilização premium",
    "Personalização avançada",
    "Suporte prioritário",
    "Seções exclusivas",
    "Validação rigorosa de caracteres",
    "Preview em alta qualidade",
  ],
  limitations: [
    "Complexidade aumentada",
    "Tempo de configuração maior",
    "Requer mais recursos",
  ],
  recommendedFor: [
    "Propostas de alto valor",
    "Projetos complexos",
    "Clientes premium",
    "Apresentações executivas",
  ],
  notRecommendedFor: [
    "Propostas simples",
    "Projetos com prazo muito curto",
    "Orçamentos limitados",
  ],
};

// Prime-specific utility functions
export function validatePrimeCharacterLimits(
  proposal: Partial<PrimeProposal>
): Record<string, boolean> {
  const validations: Record<string, boolean> = {};

  if (proposal.introduction?.title) {
    validations.introductionTitle = proposal.introduction.title.length === 60;
  }

  if (proposal.introduction?.subtitle) {
    validations.introductionSubtitle =
      proposal.introduction.subtitle.length === 100;
  }

  if (proposal.introduction?.services) {
    validations.introductionServices =
      proposal.introduction.services.length === 4 &&
      proposal.introduction.services.every((service) => service.length === 30);
  }

  if (proposal.aboutUs?.title) {
    validations.aboutUsTitle = proposal.aboutUs.title.length === 155;
  }

  if (proposal.aboutUs?.supportText) {
    validations.aboutUsSupportText = proposal.aboutUs.supportText.length === 70;
  }

  if (proposal.aboutUs?.subtitle) {
    validations.aboutUsSubtitle = proposal.aboutUs.subtitle.length === 250;
  }

  if (proposal.team?.title) {
    validations.teamTitle = proposal.team.title.length === 60;
  }

  if (proposal.team?.subtitle) {
    validations.teamSubtitle = proposal.team.subtitle.length === 120;
  }

  if (proposal.specialties?.title) {
    validations.specialtiesTitle = proposal.specialties.title.length === 180;
  }

  if (proposal.specialties?.topics) {
    validations.specialtiesTopics =
      proposal.specialties.topics.length === 9 &&
      proposal.specialties.topics.every(
        (topic) => topic.title.length === 60 && topic.description.length === 140
      );
  }

  if (proposal.steps?.introduction) {
    validations.stepsIntroduction = proposal.steps.introduction.length === 120;
  }

  if (proposal.steps?.title) {
    validations.stepsTitle = proposal.steps.title.length === 50;
  }

  if (proposal.steps?.topics) {
    validations.stepsTopics =
      proposal.steps.topics.length === 6 &&
      proposal.steps.topics.every(
        (topic) => topic.title.length === 45 && topic.description.length === 260
      );
  }

  if (proposal.scope?.content) {
    validations.scopeContent = proposal.scope.content.length === 400;
  }

  if (proposal.investment?.title) {
    validations.investmentTitle = proposal.investment.title.length === 95;
  }

  if (proposal.investment?.deliverables) {
    validations.investmentDeliverables = proposal.investment.deliverables.every(
      (deliverable) =>
        deliverable.title.length === 35 &&
        deliverable.description.length === 350
    );
  }

  if (proposal.investment?.plans) {
    validations.investmentPlans =
      proposal.investment.plans.length === 3 &&
      proposal.investment.plans.every(
        (plan) =>
          plan.title.length === 25 &&
          plan.description.length === 110 &&
          plan.value.length <= 11 &&
          plan.includedItems.length >= 4 &&
          plan.includedItems.length <= 6 &&
          plan.includedItems.every((item) => item.item.length <= 50)
      );
  }

  if (proposal.terms) {
    validations.terms = proposal.terms.every(
      (term) => term.title.length === 35 && term.description.length === 200
    );
  }

  if (proposal.faq) {
    validations.faq =
      proposal.faq.length === 8 &&
      proposal.faq.every(
        (item) => item.question.length === 120 && item.answer.length === 320
      );
  }

  if (proposal.footer?.callToAction) {
    validations.footerCallToAction = proposal.footer.callToAction.length === 60;
  }

  if (proposal.footer?.contactInfo) {
    validations.footerContactInfo = proposal.footer.contactInfo.length === 150;
  }

  return validations;
}

export function getPrimeTemplateDefaults(): Partial<PrimeProposal> {
  return {
    introduction: {
      title: "",
      subtitle: "",
      services: [],
      validity: "30 dias",
      buttonText: "Solicitar Proposta",
    },
    aboutUs: {
      title: "",
      supportText: "",
      subtitle: "",
    },
    team: {
      title: "",
      subtitle: "",
    },
    specialties: {
      title: "Nossas Especialidades",
      topics: [],
    },
    steps: {
      introduction: "",
      title: "Nosso Processo",
      topics: [],
    },
    scope: {
      content: "",
    },
    investment: {
      title: "",
      deliverables: [],
      plans: [],
    },
    faq: [],
    footer: {
      callToAction: "",
      contactInfo: "",
    },
  };
}
