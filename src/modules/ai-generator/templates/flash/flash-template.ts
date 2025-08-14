import { BaseTemplateData, BaseProposal, BaseSection, baseTemplateConfig } from '../base/base-template';
import { TemplateType } from '../../agents/base/types';

export interface FlashTemplateData extends BaseTemplateData {
  templateType: "flash";
  flashFeatures?: {
    rapidDelivery: boolean;
    streamlinedProcess: boolean;
    quickCustomization: boolean;
  };
}

export interface FlashSection extends BaseSection {
  flashSpecific?: {
    rapidDelivery: boolean;
    streamlinedOptions: boolean;
  };
}

export interface FlashProposal extends BaseProposal {
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
  }>);

  // Footer
  footer: {
    callToAction: string; // 80 chars, AI-generated
    contactInfo: string; // 120 chars, editable
  };
}

export const flashTemplateConfig = {
  ...baseTemplateConfig,
  name: "Flash Template",
  description: "Template rápido e eficiente para propostas com entrega ágil",
  features: [
    ...baseTemplateConfig.features,
    "Entrega rápida",
    "Processo simplificado",
    "Customização ágil",
    "Seções otimizadas",
    "Validação eficiente",
    "Preview instantâneo"
  ],
  limitations: [
    "Funcionalidades limitadas",
    "Personalização básica",
    "Recursos reduzidos"
  ],
  recommendedFor: [
    "Propostas urgentes",
    "Projetos simples",
    "Prazos curtos",
    "Testes rápidos"
  ],
  notRecommendedFor: [
    "Propostas complexas",
    "Projetos de alto valor",
    "Necessidades de personalização avançada"
  ]
};

// Flash-specific utility functions
export function validateFlashCharacterLimits(proposal: Partial<FlashProposal>): Record<string, boolean> {
  const validations: Record<string, boolean> = {};

  if (proposal.introduction?.title) {
    validations.introductionTitle = proposal.introduction.title.length <= 60;
  }

  if (proposal.introduction?.subtitle) {
    validations.introductionSubtitle = proposal.introduction.subtitle.length <= 100;
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

export function getFlashTemplateDefaults(): Partial<FlashProposal> {
  return {
    introduction: {
      title: "",
      subtitle: "",
      services: [],
      validity: "15 dias",
      buttonText: "Solicitar Proposta"
    },
    aboutUs: {
      title: "",
      supportText: "",
      subtitle: ""
    },
    specialties: {
      title: "Nossas Especialidades",
      topics: []
    },
    steps: {
      introduction: "",
      title: "Nosso Processo",
      topics: []
    },
    investment: {
      title: "",
      deliverables: [],
      plans: []
    },
    footer: {
      callToAction: "",
      contactInfo: ""
    }
  };
}

// Flash-specific rapid generation functions
export function generateFlashProposalOutline(): Partial<FlashProposal> {
  return {
    introduction: {
      title: "Proposta Flash - Entrega Rápida",
      subtitle: "Solução eficiente para seu projeto",
      services: ["Desenvolvimento", "Design", "Marketing"],
      validity: "15 dias",
      buttonText: "Aprovar Agora"
    },
    aboutUs: {
      title: "Especialistas em Soluções Rápidas",
      supportText: "Suporte 24/7",
      subtitle: "Equipe experiente focada em resultados rápidos e eficientes"
    },
    specialties: {
      title: "Especialidades Flash",
      topics: [
        { title: "Entrega Rápida", description: "Resultados em tempo recorde" },
        { title: "Qualidade Garantida", description: "Padrões elevados mantidos" },
        { title: "Suporte Contínuo", description: "Acompanhamento completo" }
      ]
    },
    steps: {
      introduction: "Processo otimizado para máxima eficiência",
      title: "Processo Flash",
      topics: [
        { title: "Briefing Rápido", description: "Coleta de informações essenciais em tempo recorde" },
        { title: "Desenvolvimento Ágil", description: "Execução com metodologias ágeis e eficientes" },
        { title: "Entrega Express", description: "Resultado final entregue no prazo prometido" }
      ]
    },
    investment: {
      title: "Investimento Flash",
      deliverables: [
        { title: "Projeto Completo", description: "Solução completa entregue no prazo estabelecido" }
      ],
      plans: [
        { title: "Flash Básico", description: "Solução essencial com entrega rápida", value: "R$ 999", topics: ["Entrega em 7 dias", "Suporte básico", "Revisões limitadas"] },
        { title: "Flash Pro", description: "Solução completa com suporte premium", value: "R$ 1.999", topics: ["Entrega em 5 dias", "Suporte 24/7", "Revisões ilimitadas"] }
      ]
    },
    footer: {
      callToAction: "Aproveite a velocidade Flash!",
      contactInfo: "Entre em contato agora para começar seu projeto"
    }
  };
}
