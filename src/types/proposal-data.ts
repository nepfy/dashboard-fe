// Unified Proposal Data Type
// This replaces the 29+ separate database tables with a single JSON field

export interface ProposalData {
  // Introduction Section
  introduction?: {
    userName?: string;
    email: string;
    buttonTitle: string;
    title: string;
    validity: string;
    subtitle?: string;
    hideSubtitle?: boolean;
    services?: Array<{
      id?: string;
      serviceName: string;
      hideService?: boolean;
      sortOrder?: number;
    }>;
  };

  // About Us Section
  aboutUs?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    supportText?: string;
    hideSupportText?: boolean;
    subtitle?: string;
    hideSubtitle?: boolean;
  };

  // Team Section
  team?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    members?: Array<{
      name: string;
      role: string;
      image?: string;
      hideMember?: boolean;
      sortOrder?: number;
    }>;
  };

  // Expertise/Specialties Section
  expertise?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    topics?: Array<{
      title: string;
      description: string;
      icon?: string;
      hideTopic?: boolean;
      sortOrder?: number;
    }>;
  };

  // Steps Section
  steps?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    introduction?: string;
    hideIntroduction?: boolean;
    topics?: Array<{
      title: string;
      description: string;
      hideTopic?: boolean;
      sortOrder?: number;
    }>;
    marquee?: Array<{
      text: string;
      hideItem?: boolean;
      sortOrder?: number;
    }>;
  };

  // Investment Section
  investment?: {
    hideSection?: boolean;
    title?: string;
    projectScope?: string;
    hideProjectScope?: boolean;
    hideTitle?: boolean;
  };

  // Deliverables Section
  deliverables?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    items?: Array<{
      title: string;
      description: string;
      icon?: string;
      hideItem?: boolean;
      sortOrder?: number;
    }>;
  };

  // Plans Section
  plans?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    plansItems?: Array<{
      id?: string;
      title: string;
      description: string;
      value: string;
      planPeriod: string;
      recommended?: boolean;
      hideTitleField?: boolean;
      hideDescription?: boolean;
      hidePrice?: boolean;
      hidePlanPeriod?: boolean;
      hideButtonTitle?: boolean;
      sortOrder?: number;
      buttonTitle: string;
      includedItems?: Array<{
        id?: string;
        description: string;
        hideItem?: boolean;
        sortOrder?: number;
      }>;
    }>;
  };

  // Results Section
  results?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    items?: Array<{
      id: string;
      client: string;
      instagram: string;
      investment: string;
      roi: string;
      photo: string | null;
      hidePhoto: boolean;
      sortOrder: number;
    }>;
  };

  // Clients Section
  clients?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    description?: string;
    paragraphs?: string[];
    items?: Array<{
      id?: string;
      name: string;
      logo?: string;
      hideClient?: boolean;
      sortOrder?: number;
    }>;
  };

  // CTA (Call to Action) Section
  cta?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    description?: string;
    hideDescription?: boolean;
    buttonText?: string;
    buttonLink?: string;
  };

  // Testimonials Section
  testimonials?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    items?: Array<{
      name: string;
      role: string;
      company?: string;
      testimonial: string;
      image?: string;
      hideTestimonial?: boolean;
      sortOrder?: number;
    }>;
  };

  // Terms & Conditions Section
  termsConditions?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    items?: Array<{
      term: string;
      hideTerm?: boolean;
      sortOrder?: number;
    }>;
  };

  // FAQ Section
  faq?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    items?: Array<{
      question: string;
      answer: string;
      hideQuestion?: boolean;
      sortOrder?: number;
    }>;
  };

  // Footer Section
  footer?: {
    hideSection?: boolean;
    callToAction?: string;
    disclaimer?: string;
    hideCallToAction?: boolean;
    hideDisclaimer?: boolean;
    email?: string;
    phone?: string;
    marquee?: Array<{
      text: string;
      hideItem?: boolean;
      sortOrder?: number;
    }>;
  };
}

// Helper type for partial updates
export type PartialProposalData = Partial<ProposalData>;

// Type guard to check if proposal data is valid
export function isValidProposalData(data: unknown): data is ProposalData {
  if (!data || typeof data !== "object") return false;
  // Add more specific validation as needed
  return true;
}
