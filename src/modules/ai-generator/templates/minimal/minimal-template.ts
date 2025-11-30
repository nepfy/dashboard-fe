import {
  BaseTemplateData,
  BaseSection,
  baseTemplateConfig,
  validateCharacterLimit,
} from "../base/base-template";

export interface MinimalTemplateData extends BaseTemplateData {
  templateType: "minimal";
  minimalFeatures?: {
    cleanDesign: boolean;
    simpleInterface: boolean;
    focusedContent: boolean;
  };
}

export interface MinimalSection extends BaseSection {
  minimalSpecific?: {
    cleanDesign: boolean;
    simpleOptions: boolean;
  };
}

// Introduction Section
export interface MinimalIntroductionService {
  id: string;
  serviceName: string;
  hideItem?: boolean;
  sortOrder?: number;
}

export interface MinimalIntroductionSection {
  userName?: string;
  email?: string;
  title: string;
  hideSubtitle?: boolean;
  subtitle?: string;
  services?: MinimalIntroductionService[];
}

// About Us Section
export interface MinimalAboutUsItem {
  id: string;
  image?: string;
  caption?: string;
  hideImage?: boolean;
  hideCaption?: boolean;
  sortOrder?: number;
}

export interface MinimalAboutUsSection {
  hideSection?: boolean;
  title: string;
  subtitle?: string;
  hideSubtitle?: boolean;
  marqueeText?: string;
  hideMarquee?: boolean;
  items?: MinimalAboutUsItem[];
}

// Team Section
export interface MinimalTeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  hidePhoto?: boolean;
  hideMember?: boolean;
  sortOrder?: number;
}

export interface MinimalTeamSection {
  hideSection?: boolean;
  title: string;
  members?: MinimalTeamMember[];
}

// Expertise Section
export interface MinimalExpertiseTopic {
  id: string;
  icon?: string;
  title: string;
  description: string;
  hideItem?: boolean;
  hideTitleField?: boolean;
  hideDescription?: boolean;
  sortOrder?: number;
}

export interface MinimalExpertiseSection {
  hideSection?: boolean;
  title: string;
  hideIcon?: boolean;
  topics?: MinimalExpertiseTopic[];
}

// Results Section
export interface MinimalResultItem {
  id: string;
  client: string;
  instagram?: string;
  investment: string;
  roi: string;
  photo?: string;
  hidePhoto?: boolean;
  hideItem?: boolean;
  sortOrder?: number;
}

export interface MinimalResultsSection {
  hideSection?: boolean;
  title: string;
  items?: MinimalResultItem[];
}

// Testimonials Section
export interface MinimalTestimonialItem {
  id: string;
  name: string;
  role: string;
  testimonial: string;
  photo?: string;
  hidePhoto?: boolean;
  sortOrder?: number;
}

export interface MinimalTestimonialsSection {
  hideSection?: boolean;
  items?: MinimalTestimonialItem[];
}

export interface MinimalClientLogo {
  id: string;
  name: string;
  logo?: string;
  hideClient?: boolean;
  sortOrder?: number;
}

export interface MinimalClientsSection {
  hideSection?: boolean;
  title?: string;
  description?: string;
  paragraphs?: string[];
  items?: MinimalClientLogo[];
}

// Steps Section
export interface MinimalStepTopic {
  id: string;
  title: string;
  description: string;
  hideItem?: boolean;
  hideStepName?: boolean;
  hideStepDescription?: boolean;
  sortOrder?: number;
}

export interface MinimalStepsSection {
  hideSection?: boolean;
  topics?: MinimalStepTopic[];
}

// Escope Section
export interface MinimalEscopeSection {
  hideSection?: boolean;
}

// Investment Section
export interface MinimalInvestmentSection {
  hideSection?: boolean;
  title: string;
  projectScope?: string;
  hideProjectScope?: boolean;
}

// Plans Section
export interface MinimalPlanIncludedItem {
  id: string;
  description: string;
  hideItem?: boolean;
  sortOrder?: number;
}

export interface MinimalPlanItem {
  id: string;
  title: string;
  description: string;
  value: number;
  hidePrice?: boolean;
  planPeriod?: string;
  hidePlanPeriod?: boolean;
  recommended?: boolean;
  hideItem?: boolean;
  hideTitleField?: boolean;
  hideDescription?: boolean;
  hideButtonTitle?: boolean;
  buttonTitle?: string;
  buttonWhereToOpen?: string;
  buttonPhone?: string;
  buttonHref?: string;
  sortOrder?: number;
  includedItems?: MinimalPlanIncludedItem[];
}

export interface MinimalPlansSection {
  hideSection?: boolean;
  plansItems?: MinimalPlanItem[];
}

// FAQ Section
export interface MinimalFAQItem {
  id: string;
  question: string;
  answer: string;
  hideItem?: boolean;
  hideQuestion?: boolean;
  hideAnswer?: boolean;
  sortOrder?: number;
}

export interface MinimalFAQSection {
  hideSection?: boolean;
  items?: MinimalFAQItem[];
}

// Footer Section
export interface MinimalFooterSection {
  callToAction?: string;
  hideCallToAction?: boolean;
  disclaimer?: string;
  hideDisclaimer?: boolean;
  email?: string;
  phone?: string;
}

// Complete Minimal Proposal
export interface MinimalProposal {
  introduction: MinimalIntroductionSection;
  aboutUs: MinimalAboutUsSection;
  team: MinimalTeamSection;
  expertise: MinimalExpertiseSection;
  results: MinimalResultsSection;
  testimonials: MinimalTestimonialsSection;
  clients: MinimalClientsSection;
  steps: MinimalStepsSection;
  escope: MinimalEscopeSection;
  investment: MinimalInvestmentSection;
  plans: MinimalPlansSection;
  faq: MinimalFAQSection;
  footer: MinimalFooterSection;
}

export const minimalTemplateConfig = {
  ...baseTemplateConfig,
  name: "Minimal Template",
  description:
    "Template minimalista com design limpo e funcionalidades essenciais",
  features: [
    ...baseTemplateConfig.features,
    "Design minimalista",
    "Interface limpa",
    "Funcionalidades essenciais",
    "Personalização simplificada",
    "Foco no conteúdo",
    "Experiência clean",
  ],
  limitations: [
    "Layout fixo minimalista",
    "Opções de customização focadas em essenciais",
  ],
  recommendedFor: [
    "Empresas que valorizam simplicidade",
    "Profissionais liberais",
    "Serviços B2B",
    "Consultorias",
  ],
  notRecommendedFor: [
    "Negócios que precisam de muita informação visual",
    "E-commerce com muitos produtos",
  ],
};

// Character limits for Minimal template
export const minimalCharacterLimits = {
  introduction: {
    userName: 50,
    email: 100,
    title: 120,
    subtitle: 200,
    serviceName: 50,
  },
  aboutUs: {
    title: 200,
  },
  team: {
    title: 100,
    memberName: 50,
    memberRole: 50,
  },
  expertise: {
    title: 100,
    topicTitle: 60,
    topicDescription: 250,
  },
  results: {
    title: 100,
    clientName: 50,
    instagram: 50,
  },
  testimonials: {
    name: 50,
    role: 50,
    testimonial: 400,
  },
  steps: {
    stepTitle: 50,
    stepDescription: 400,
  },
  investment: {
    title: 150,
    projectScope: 200,
  },
  plans: {
    planTitle: 50,
    planDescription: 150,
    itemDescription: 100,
    buttonTitle: 30,
  },
  faq: {
    question: 150,
    answer: 500,
  },
  footer: {
    callToAction: 100,
    disclaimer: 300,
  },
};

// Validate character limits for Minimal proposal
export function validateMinimalCharacterLimits(
  proposal: Partial<MinimalProposal>
): Record<string, boolean> {
  const validations: Record<string, boolean> = {};

  // Introduction
  if (proposal.introduction) {
    const intro = proposal.introduction;
    validations["introduction.userName"] = validateCharacterLimit(
      intro.userName || "",
      minimalCharacterLimits.introduction.userName
    );
    validations["introduction.email"] = validateCharacterLimit(
      intro.email || "",
      minimalCharacterLimits.introduction.email
    );
    validations["introduction.title"] = validateCharacterLimit(
      intro.title,
      minimalCharacterLimits.introduction.title
    );
    validations["introduction.subtitle"] = validateCharacterLimit(
      intro.subtitle || "",
      minimalCharacterLimits.introduction.subtitle
    );
  }

  // About Us
  if (proposal.aboutUs) {
    validations["aboutUs.title"] = validateCharacterLimit(
      proposal.aboutUs.title,
      minimalCharacterLimits.aboutUs.title
    );
  }

  // Team
  if (proposal.team) {
    validations["team.title"] = validateCharacterLimit(
      proposal.team.title,
      minimalCharacterLimits.team.title
    );
  }

  // Expertise
  if (proposal.expertise) {
    validations["expertise.title"] = validateCharacterLimit(
      proposal.expertise.title,
      minimalCharacterLimits.expertise.title
    );
  }

  // Results
  if (proposal.results) {
    validations["results.title"] = validateCharacterLimit(
      proposal.results.title,
      minimalCharacterLimits.results.title
    );
  }

  // Investment
  if (proposal.investment) {
    validations["investment.title"] = validateCharacterLimit(
      proposal.investment.title,
      minimalCharacterLimits.investment.title
    );
    validations["investment.projectScope"] = validateCharacterLimit(
      proposal.investment.projectScope || "",
      minimalCharacterLimits.investment.projectScope
    );
  }

  // Footer
  if (proposal.footer) {
    validations["footer.callToAction"] = validateCharacterLimit(
      proposal.footer.callToAction || "",
      minimalCharacterLimits.footer.callToAction
    );
    validations["footer.disclaimer"] = validateCharacterLimit(
      proposal.footer.disclaimer || "",
      minimalCharacterLimits.footer.disclaimer
    );
  }

  return validations;
}

// Get default values for Minimal template
export function getMinimalTemplateDefaults(): Partial<MinimalProposal> {
  return {
    introduction: {
      title: "Soluções inteligentes para transformar seu negócio",
      subtitle:
        "Desenvolvemos estratégias focadas em resultados reais e crescimento sustentável",
      hideSubtitle: false,
      services: [],
    },
    aboutUs: {
      hideSection: false,
      title:
        "Nossa missão é criar soluções que conectam empresas aos seus clientes",
    },
    team: {
      hideSection: false,
      title: "Conheça o time",
      members: [],
    },
    expertise: {
      hideSection: false,
      title: "Expertise e Soluções",
      hideIcon: false,
      topics: [],
    },
    results: {
      hideSection: false,
      title: "Resultados que falam por si",
      items: [],
    },
    testimonials: {
      hideSection: false,
      items: [],
    },
    clients: {
      hideSection: false,
      title: "Marcas que já confiaram",
      description:
        "Estratégia, posicionamento e conteúdo com foco em resultados reais.",
      paragraphs: [
        "Na União Co., cuidamos dos bastidores da sua presença online com o mesmo cuidado que você dedica aos seus clientes. Garantimos consistência, clareza e uma pitada de criatividade estratégica.",
        "Unimos estratégia, design e performance para transformar sua comunicação em um ativo poderoso de atração e relacionamento.",
      ],
      items: [
        { id: "1", name: "Ino", sortOrder: 1 },
        { id: "2", name: "Circle", sortOrder: 2 },
        { id: "3", name: "Acme", sortOrder: 3 },
        { id: "4", name: "Nova", sortOrder: 4 },
      ],
    },
    steps: {
      hideSection: false,
      topics: [],
    },
    escope: {
      hideSection: false,
    },
    investment: {
      hideSection: false,
      title: "Investimento inteligente para resultados duradouros",
      hideProjectScope: false,
    },
    plans: {
      hideSection: false,
      plansItems: [],
    },
    faq: {
      hideSection: false,
      items: [],
    },
    footer: {
      hideCallToAction: false,
      hideDisclaimer: false,
      email: "",
      phone: "",
    },
  };
}

// Generate a structured outline for Minimal proposal
export function generateMinimalProposalOutline(): Partial<MinimalProposal> {
  return {
    introduction: {
      title: "[Título principal da proposta]",
      subtitle: "[Subtítulo explicativo]",
      hideSubtitle: false,
      services: [
        {
          id: "1",
          serviceName: "[Nome do serviço 1]",
          sortOrder: 1,
        },
        {
          id: "2",
          serviceName: "[Nome do serviço 2]",
          sortOrder: 2,
        },
      ],
    },
    aboutUs: {
      hideSection: false,
      title: "[Sobre a empresa e missão]",
    },
    team: {
      hideSection: false,
      title: "Nosso Time",
      members: [
        {
          id: "1",
          name: "[Nome do membro]",
          role: "[Cargo/função]",
          sortOrder: 1,
        },
      ],
    },
    expertise: {
      hideSection: false,
      title: "Nossa Expertise",
      hideIcon: false,
      topics: [
        {
          id: "1",
          icon: "StarIcon",
          title: "[Área de expertise]",
          description: "[Descrição da expertise]",
          sortOrder: 1,
        },
      ],
    },
    results: {
      hideSection: false,
      title: "Resultados Comprovados",
      items: [
        {
          id: "1",
          client: "[Nome do cliente]",
          instagram: "[usuário]",
          investment: "0.00",
          roi: "0.00",
          sortOrder: 1,
        },
      ],
    },
    testimonials: {
      hideSection: false,
      items: [
        {
          id: "1",
          name: "[Nome do cliente]",
          role: "[Cargo]",
          testimonial: "[Depoimento]",
          sortOrder: 1,
        },
      ],
    },
    clients: {
      hideSection: false,
      title: "[Empresas que já confiam]",
      description: "[Resumo da proposta de valor]",
      paragraphs: ["[Parágrafo 1]", "[Parágrafo 2]"],
      items: [
        {
          id: "1",
          name: "[Nome da marca]",
          sortOrder: 1,
        },
      ],
    },
    steps: {
      hideSection: false,
      topics: [
        {
          id: "1",
          title: "[Nome da etapa]",
          description: "[Descrição da etapa]",
          sortOrder: 1,
        },
      ],
    },
    escope: {
      hideSection: false,
    },
    investment: {
      hideSection: false,
      title: "Investimento",
      projectScope: "[Escopo do projeto]",
      hideProjectScope: false,
    },
    plans: {
      hideSection: false,
      plansItems: [
        {
          id: "1",
          title: "[Nome do plano]",
          description: "[Descrição do plano]",
          value: 0,
          planPeriod: "mensal",
          recommended: false,
          sortOrder: 1,
          includedItems: [
            {
              id: "1",
              description: "[Item incluído]",
              sortOrder: 1,
            },
          ],
        },
      ],
    },
    faq: {
      hideSection: false,
      items: [
        {
          id: "1",
          question: "[Pergunta]",
          answer: "[Resposta]",
          sortOrder: 1,
        },
      ],
    },
    footer: {
      callToAction: "[Chamada para ação]",
      disclaimer: "[Aviso legal]",
      hideCallToAction: false,
      hideDisclaimer: false,
    },
  };
}
