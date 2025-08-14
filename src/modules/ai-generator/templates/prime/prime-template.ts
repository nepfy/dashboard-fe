import {
  BaseTemplateData,
  BaseProposal,
  BaseSection,
  baseTemplateConfig,
} from "../base/base-template";
import { TemplateType } from "../../agents/base/types";

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
    title: string; // 60 chars, AI-generated
    subtitle: string; // 100 chars, AI-generated
    services: string[]; // 4 max, 30 chars each, AI-generated
    validity: string; // Not editable
    buttonText: string; // 20 chars, no AI
  };

  // About Us Section
  aboutUs: {
    title: string; // 155 chars, AI-generated
    supportText: string; // 70 chars, AI-generated
    subtitle: string; // 250 chars, AI-generated
  };

  // Specialties Section
  specialties: {
    title: string; // 40 chars, AI-generated
    topics: Array<{
      title: string; // 50 chars
      description: string; // 100 chars
    }>; // 9 max
  };

  // Process Steps Section
  steps: {
    introduction: string; // 100 chars, AI-generated
    title: string; // Fixed, not editable
    topics: Array<{
      title: string; // 40 chars
      description: string; // 240 chars
    }>; // 5 max, AI-generated
  };

  // Investment Section
  investment: {
    title: string; // 85 chars, AI-generated
    deliverables: Array<{
      title: string; // 30 chars
      description: string; // 330 chars
    }>;
    plans: Array<{
      title: string; // 20 chars
      description: string; // 95 chars
      value: string; // 11 chars
      topics: string[]; // 6 max, 45 chars each
    }>; // 3 max, AI-generated
  };

  // Terms and Conditions (optional)
  terms?: Array<{
    title: string; // 30 chars
    description: string; // 180 chars
  }>;

  // FAQ (optional)
  faq?: Array<{
    question: string; // 100 chars
    answer: string; // 280 chars
  }>;

  // Footer
  footer: {
    callToAction: string; // 80 chars, AI-generated
    contactInfo: string; // 120 chars, editable
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
    validations.introductionTitle = proposal.introduction.title.length <= 60;
  }

  if (proposal.introduction?.subtitle) {
    validations.introductionSubtitle =
      proposal.introduction.subtitle.length <= 100;
  }

  if (proposal.aboutUs?.title) {
    validations.aboutUsTitle = proposal.aboutUs.title.length <= 155;
  }

  if (proposal.aboutUs?.supportText) {
    validations.aboutUsSupportText = proposal.aboutUs.supportText.length <= 70;
  }

  if (proposal.aboutUs?.subtitle) {
    validations.aboutUsSubtitle = proposal.aboutUs.subtitle.length <= 250;
  }

  if (proposal.specialties?.title) {
    validations.specialtiesTitle = proposal.specialties.title.length <= 40;
  }

  if (proposal.steps?.introduction) {
    validations.stepsIntroduction = proposal.steps.introduction.length <= 100;
  }

  if (proposal.investment?.title) {
    validations.investmentTitle = proposal.investment.title.length <= 85;
  }

  if (proposal.footer?.callToAction) {
    validations.footerCallToAction = proposal.footer.callToAction.length <= 80;
  }

  if (proposal.footer?.contactInfo) {
    validations.footerContactInfo = proposal.footer.contactInfo.length <= 120;
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
    specialties: {
      title: "Nossas Especialidades",
      topics: [],
    },
    steps: {
      introduction: "",
      title: "Nosso Processo",
      topics: [],
    },
    investment: {
      title: "",
      deliverables: [],
      plans: [],
    },
    footer: {
      callToAction: "",
      contactInfo: "",
    },
  };
}
