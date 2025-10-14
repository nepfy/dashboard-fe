// Unified Proposal Data Type
// This replaces the 29+ separate database tables with a single JSON field

export interface ProposalData {
  // Introduction Section
  introduction?: {
    name: string;
    email: string;
    buttonTitle: string;
    title: string;
    validity: string;
    subtitle?: string;
    hideSubtitle?: boolean;
    services?: Array<{
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
    items?: Array<{
      title: string;
      description: string;
      value: string;
      recommended?: boolean;
      hidePlan?: boolean;
      sortOrder?: number;
      includedItems?: Array<{
        item: string;
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
      title: string;
      description: string;
      metric?: string;
      hideResult?: boolean;
      sortOrder?: number;
    }>;
  };

  // Clients Section
  clients?: {
    hideSection?: boolean;
    title?: string;
    hideTitle?: boolean;
    items?: Array<{
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
