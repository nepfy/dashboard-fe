import {
  BaseTemplateData,
  BaseProposal,
  BaseSection,
  baseTemplateConfig,
} from "../base/base-template";

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
    userName?: string;
    email: string;
    title: string; // exactly 60 chars, AI-generated
    subtitle: string; // exactly 100 chars, AI-generated
    services: string[]; // exactly 4, each 30 chars, AI-generated
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
    title: string; // exactly 55 chars, AI-generated
    members: Array<{
      id?: string;
      name: string;
      role: string;
      image?: string;
      hideMember?: boolean;
      sortOrder?: number;
    }>;
  };

  // Specialties Section
  specialties: {
    title: string; // exactly 140 chars, AI-generated
    topics: Array<{
      title: string; // exactly 50 chars
      description: string; // exactly 100 chars
    }>; // 6-9 topics
  };

  // Process Steps Section
  steps: {
    introduction: string; // exactly 100 chars, AI-generated
    title: string; // Fixed, not editable
    topics: Array<{
      title: string; // exactly 40 chars
      description: string; // exactly 240 chars
    }>; // exactly 5, AI-generated
  };

  // Project Scope Section
  scope: {
    content: string; // exactly 350 chars
  };

  // Investment Section
  investment: {
    title: string; // exactly 85 chars, AI-generated
    deliverables: Array<{
      title: string; // up to 30 chars
      description: string; // up to 330 chars
    }>;
    plans: Array<{
      id?: string;
      title: string; // exactly 20 chars
      description: string; // exactly 95 chars
      hideTitleField?: boolean;
      hideDescription?: boolean;
      hidePrice?: boolean;
      hidePlanPeriod?: boolean;
      hideButtonTitle?: boolean;
      buttonTitle: string;
      value: string; // format R$X.XXX (<= 11 chars)
      planPeriod: string;
      recommended: boolean;
      sortOrder?: number;
      includedItems: Array<{
        item: string;
        hideItem?: boolean;
        sortOrder?: number;
      }>;
    }>; // 3 max, AI-generated
  };

  // Terms and Conditions (optional)
  terms?: Array<{
    title: string; // 30 chars
    description: string; // 180 chars
  }>;

  // FAQ (mandatory)
  faq: Array<{
    question: string; // exactly 100 chars
    answer: string; // exactly 300 chars
  }>; // exactly 10

  // Footer
  footer: {
    callToAction: string; // exactly 35 chars, AI-generated
    disclaimer: string; // exactly 330 chars, AI-generated
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
    "Preview instantâneo",
  ],
  limitations: [
    "Funcionalidades limitadas",
    "Personalização básica",
    "Recursos reduzidos",
  ],
  recommendedFor: [
    "Propostas urgentes",
    "Projetos simples",
    "Prazos curtos",
    "Testes rápidos",
  ],
  notRecommendedFor: [
    "Propostas complexas",
    "Projetos de alto valor",
    "Necessidades de personalização avançada",
  ],
};

// Flash-specific utility functions
export function validateFlashCharacterLimits(
  proposal: Partial<FlashProposal>
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
    validations.teamTitle = proposal.team.title.length === 55;
  }

  if (proposal.specialties?.title) {
    validations.specialtiesTitle = proposal.specialties.title.length === 140;
  }

  if (proposal.steps?.introduction) {
    validations.stepsIntroduction = proposal.steps.introduction.length === 100;
  }

  if (proposal.scope?.content) {
    validations.scopeContent = proposal.scope.content.length === 350;
  }

  if (proposal.investment?.title) {
    validations.investmentTitle = proposal.investment.title.length === 85;
  }

  if (proposal.footer?.callToAction) {
    validations.footerCallToAction = proposal.footer.callToAction.length === 35;
  }

  if (proposal.footer?.disclaimer) {
    validations.footerDisclaimer = proposal.footer.disclaimer.length === 330;
  }

  return validations;
}

export function getFlashTemplateDefaults(): Partial<FlashProposal> {
  return {
    introduction: {
      userName: "", // Will be populated from userData
      email: "", // Will be populated from userData
      title: "",
      subtitle: "",
      services: [],
      validity: "15 dias",
      buttonText: "Solicitar Proposta",
    },
    aboutUs: {
      title: "",
      supportText: "",
      subtitle: "",
    },
    team: {
      title: "",
      members: [],
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
      disclaimer: "",
    },
  };
}

// Flash-specific rapid generation functions
export function generateFlashProposalOutline(): Partial<FlashProposal> {
  return {
    introduction: {
      userName: "",
      email: "",
      title: "Ative crescimento com decisões colaborativas e seguras",
      subtitle:
        "Integramos estratégia, execução e análise para multiplicar lucro, consolidar presença e fortalecer resultados",
      services: [
        "Campanhas que aceleram vendas",
        "Gestão integrada de canais",
        "Conteúdo que cria valor",
        "Análises para decisões",
      ],
      validity: "15 dias",
      buttonText: "Aprovar Agora",
    },
    aboutUs: {
      title:
        "Construímos parcerias duradouras que elevam ideias a resultados consistentes, fortalecendo valor, crescimento e lucro sustentável",
      supportText: "Confiança diária que aproxima decisões",
      subtitle:
        "Transformamos contextos complexos em jornadas lucrativas ao combinar estratégia, criatividade e execução ajustada ao ritmo do seu negócio",
    },
    team: {
      title: "Crescemos lado a lado fortalecendo evoluções constantes",
      members: [],
    },
    specialties: {
      title:
        "Dominamos estratégias integradas que unem dados, criatividade e execução para acelerar lucro comprovado",
      topics: [],
    },
    steps: {
      introduction:
        "Guiamos cada etapa com clareza para acelerar resultados sem perder consistência",
      title: "Nosso Processo",
      topics: [],
    },
    scope: {
      content:
        "A proposta integra diagnósticos precisos e execuções orquestradas para destravar crescimento rentável, conectando planejamento, campanhas e otimizações contínuas, garantindo entregas alinhadas ao investimento e à visão estratégica do projeto",
    },
    investment: {
      title:
        "Investir agora garante crescimento escalável, previsível e centrado em lucro real",
      deliverables: [],
      plans: [],
    },
    faq: [],
    footer: {
      callToAction: "Impulsione resultados com nossa equipe",
      disclaimer:
        "Estamos prontos para orientar cada decisão com proximidade, clareza e dedicação diária, garantindo ajustes ágeis e suporte completo para que cada etapa avance com segurança e confiança",
    },
  };
}
