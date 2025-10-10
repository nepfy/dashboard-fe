// Core project type (from simplified schema)
export interface Project {
  id: string;
  personId: string;
  projectName: string;
  projectSentDate: Date | string | null;
  projectValidUntil: Date | string | null;
  projectStatus:
    | "active"
    | "approved"
    | "negotiation"
    | "rejected"
    | "draft"
    | "expired"
    | "archived";
  projectVisualizationDate: Date | string | null;
  templateType: "flash" | "prime" | "essencial" | "grid" | null;
  mainColor: string | null;
  projectUrl: string | null;
  pagePassword: string | null;
  isPublished: boolean | null;
  isProposalGenerated: boolean | null;
  created_at: Date | string;
  updated_at: Date | string;
}

// Flash Template Types
export interface FlashTemplateData {
  introduction: {
    section: {
      id: string;
      projectId: string;
      name: string;
      email: string;
      buttonTitle: string;
      title: string;
      validity: Date | string;
      subtitle: string;
      hideSubtitle: boolean;
      services: Array<{
        id: string;
        introductionId: string;
        serviceName: string;
        hideService: boolean;
        sortOrder: number;
      }>;
    };
  };
  aboutUs: {
    id: string;
    projectId: string;
    hideSection: boolean;
    title: string;
    supportText: string;
    subtitle: string;
  };
  team: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      members: Array<{
        id: string;
        teamSectionId: string;
        name: string;
        role: string;
        photo: string | null;
        hidePhoto: boolean;
        sortOrder: number;
      }>;
    };
  };
  expertise: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      topics: Array<{
        id: string;
        expertiseId: string;
        title: string;
        description: string;
        hideTitleField: boolean;
        hideDescription: boolean;
        sortOrder: number;
      }>;
    };
  };
  results: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      list: Array<{
        id: string;
        resultsSectionId: string;
        client: string;
        instagram: string;
        investment: string;
        roi: string;
        photo: string | null;
        hidePhoto: boolean;
        sortOrder: number;
      }>;
    };
  };
  clients: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
    } | null;
    list: Array<{
      id: string;
      clientsSectionId: string;
      logo: string | null;
      hideLogo: boolean;
      name: string;
      hideClientName: boolean;
      sortOrder: number;
    }>;
  };
  steps: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      topics: Array<{
        id: string;
        stepsId: string;
        stepName: string;
        stepDescription: string;
        hideStepName: boolean;
        hideStepDescription: boolean;
        sortOrder: number;
      }>;
      marquee: Array<{
        id: string;
        stepsId: string;
        stepName: string;
        hideStepName: boolean;
        sortOrder: number;
      }>;
    };
  };
  cta: {
    id: string;
    projectId: string;
    hideSection: boolean;
    backgroundImage: string | null;
  } | null;
  testimonials: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      list: Array<{
        id: string;
        testimonialsSectionId: string;
        testimonial: string;
        name: string;
        role: string | null;
        photo: string | null;
        hidePhoto: boolean;
        sortOrder: number;
      }>;
    };
  };
  investment: {
    id: string;
    projectId: string;
    hideSection: boolean;
    title: string;
  };
  deliverables: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
    } | null;
    list: Array<{
      id: string;
      deliverablesSectionId: string;
      deliveryName: string;
      deliveryContent: string;
      hideDeliveryName: boolean;
      hideDeliveryContent: boolean;
      sortOrder: number;
    }>;
  };
  plans: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      projectScope: string;
      list: Array<{
        id: string;
        plansSectionId: string;
        title: string;
        description: string;
        price: string;
        planPeriod: string;
        buttonTitle: string;
        hideTitleField: boolean;
        hideDescription: boolean;
        hidePrice: boolean;
        hidePlanPeriod: boolean;
        hideButtonTitle: boolean;
        sortOrder: number;
        includedItems: Array<{
          id: string;
          planId: string;
          description: string;
          hideDescription: boolean;
          sortOrder: number;
        }>;
      }>;
    };
  };
  termsConditions: {
    section: {
      id: string;
      projectId: string;
      title: string;
    } | null;
    list: Array<{
      id: string;
      termsSectionId: string;
      title: string;
      description: string;
      hideTitleField: boolean;
      hideDescription: boolean;
      sortOrder: number;
    }>;
  };
  faq: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      list: Array<{
        id: string;
        faqSectionId: string;
        question: string;
        answer: string;
        hideQuestion: boolean;
        hideAnswer: boolean;
        sortOrder: number;
      }>;
    };
  };
  footer: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      thankYouMessage: string;
      ctaMessage: string;
      disclaimer: string;
      hideDisclaimer: boolean;
      validity: string;
      buttonTitle: string;
    };
  };
}

// Prime Template Types
export interface PrimeTemplateData {
  introduction: {
    section: {
      id: string;
      projectId: string;
      name: string;
      validity: Date | string;
      email: string;
      title: string;
      subtitle: string;
      buttonTitle: string;
      photo: string | null;
      hidePhoto: boolean;
      memberName: string | null;
      hideMemberName: boolean;
    };
    marquee: Array<{
      id: string;
      introductionId: string;
      serviceName: string;
      hideService: boolean;
      sortOrder: number;
    }>;
  };
  aboutUs: {
    id: string;
    projectId: string;
    hideSection: boolean;
    title: string;
    paragraph1: string;
    paragraph2: string;
    hideParagraph1: boolean;
    hideParagraph2: boolean;
  };
  team: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      hideTitle: boolean;
      members: Array<{
        id: string;
        teamSectionId: string;
        name: string;
        role: string;
        photo: string | null;
        hidePhoto: boolean;
        sortOrder: number;
      }>;
    };
  };
  expertise: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      topics: Array<{
        id: string;
        expertiseId: string;
        title: string;
        description: string;
        hideTitleField: boolean;
        hideDescription: boolean;
        sortOrder: number;
      }>;
    };
  };
  results: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      list: Array<{
        id: string;
        resultsSectionId: string;
        client: string;
        subtitle: string;
        investment: string;
        roi: string;
        photo: string | null;
        hidePhoto: boolean;
        sortOrder: number;
      }>;
    };
  };
  clients: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      list: Array<{
        id: string;
        clientsSectionId: string;
        logo: string | null;
        hideLogo: boolean;
        name: string;
        hideClientName: boolean;
        sortOrder: number;
      }>;
    };
  };
  cta: {
    id: string;
    projectId: string;
    hideSection: boolean;
    title: string;
    buttonTitle: string;
    backgroundImage: string;
  };
  steps: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      hideTitle: boolean;
      topics: Array<{
        id: string;
        stepsId: string;
        stepName: string;
        stepDescription: string;
        hideStepName: boolean;
        hideStepDescription: boolean;
        sortOrder: number;
      }>;
    };
  };
  testimonials: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      list: Array<{
        id: string;
        testimonialsSectionId: string;
        testimonial: string;
        name: string;
        role: string | null;
        photo: string | null;
        hidePhoto: boolean;
        sortOrder: number;
      }>;
    };
  };
  investment: {
    id: string;
    projectId: string;
    hideSection: boolean;
    title: string;
  };
  deliverables: {
    section: {
      id: string;
      projectId: string;
      title: string;
      list: Array<{
        id: string;
        deliverablesSectionId: string;
        deliveryName: string;
        deliveryContent: string;
        hideDeliveryName: boolean;
        hideDeliveryContent: boolean;
        sortOrder: number;
      }>;
    };
  };
  plans: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      list: Array<{
        id: string;
        plansSectionId: string;
        title: string;
        description: string;
        price: string;
        planPeriod: string;
        buttonTitle: string;
        hideTitleField: boolean;
        hideDescription: boolean;
        hidePrice: boolean;
        hidePlanPeriod: boolean;
        hideButtonTitle: boolean;
        sortOrder: number;
        includedItems: Array<{
          id: string;
          planId: string;
          description: string;
          hideDescription: boolean;
          sortOrder: number;
        }>;
      }>;
    };
  };
  termsConditions: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      title: string;
      list: Array<{
        id: string;
        termsSectionId: string;
        title: string;
        description: string;
        hideTitleField: boolean;
        hideDescription: boolean;
        sortOrder: number;
      }>;
    };
  };
  faq: {
    section: {
      id: string;
      projectId: string;
      hideSection: boolean;
      subtitle: string;
      hideSubtitle: boolean;
      list: Array<{
        id: string;
        faqSectionId: string;
        question: string;
        answer: string;
        hideQuestion: boolean;
        hideAnswer: boolean;
        sortOrder: number;
      }>;
    };
  };
  footer: {
    id: string;
    projectId: string;
    thankYouTitle: string;
    thankYouMessage: string;
    disclaimer: string;
    email: string;
    buttonTitle: string;
    validity: Date | string;
    hideThankYouTitle: boolean;
    hideThankYouMessage: boolean;
    hideDisclaimer: boolean;
  };
}

// Combined response types
export interface FlashProjectData {
  project: Project;
  template: FlashTemplateData;
}

export interface PrimeProjectData {
  project: Project;
  template: PrimeTemplateData;
}

// Union type for either template
export type TemplateProjectData = FlashProjectData | PrimeProjectData;

// API Response types
export interface TemplateDataResponse<
  T = FlashTemplateData | PrimeTemplateData
> {
  success: boolean;
  data: {
    project: Project;
    template: T;
  };
  error?: string;
}
