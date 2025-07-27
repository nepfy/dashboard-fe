export interface ProjectTeamMember {
  id: string;
  name: string;
  role: string | null;

  photo: string | null;
  sortOrder: number | null;
}

export interface ProjectExpertise {
  id: string;
  icon: string | null;
  title: string;
  description: string | null;
  sortOrder: number | null;
  hideExpertiseIcon?: boolean | null;
}

export interface ProjectResult {
  id: string;
  photo: string | null;
  hidePhoto?: boolean | null;
  client: string | null;
  subtitle: string | null;
  investment: string | null;
  roi: string | null;
  sortOrder: number | null;
}

export interface ProjectClient {
  id: string;
  logo: string | null;
  hideLogo: boolean | null;
  name: string;
  hideClientName: boolean | null;
  sortOrder: number | null;
}

export interface ProjectProcessStep {
  id: string;
  stepCounter: number;
  stepName: string;
  description: string | null;
  sortOrder: number | null;
}

export interface ProjectTestimonial {
  id: string;
  testimonial: string;
  name: string;
  role: string | null;
  photo: string | null;
  hidePhoto?: boolean | null;
  sortOrder: number | null;
}

export interface ProjectService {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number | null;
}

export interface ProjectPlanDetail {
  id: string;
  description: string;
  sortOrder: number | null;
}

export interface ProjectPlan {
  id: string;
  title: string;
  description: string | null;
  isBestOffer: boolean | null;
  price: string | null;
  pricePeriod: string | null;
  ctaButtonTitle: string | null;
  sortOrder: number | null;
  planDetails: ProjectPlanDetail[];
}

export interface ProjectTermsCondition {
  id: string;
  title: string;
  description: string;
  sortOrder: number | null;
}

export interface ProjectFaq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number | null;
}

export interface CompleteProjectData {
  id: string;
  projectName: string;
  hideClientName: boolean | null;
  clientName: string;
  hideClientPhoto: boolean | null;
  clientPhoto: string | null;
  projectSentDate: Date | null;
  projectValidUntil: Date | null;
  projectStatus: string;
  projectVisualizationDate: Date | null;
  templateType: string | null;
  mainColor: string | null;
  companyName: string | null;
  companyEmail: string | null;
  ctaButtonTitle: string | null;
  pageTitle: string | null;
  pageSubtitle: string | null;
  hidePageSubtitle: boolean | null;
  services: string | null;
  hideServices: boolean | null;
  hideAboutUsSection: boolean | null;
  hideAboutUsTitle: boolean | null;
  aboutUsTitle: string | null;
  hideAboutUsSubtitle1: boolean | null;
  hideAboutUsSubtitle2: boolean | null;
  aboutUsSubtitle1: string | null;
  aboutUsSubtitle2: string | null;
  hideAboutYourTeamSection: boolean | null;
  ourTeamSubtitle: string | null;
  hideExpertiseSection: boolean | null;
  expertiseSubtitle: string | null;
  hideResultsSection: boolean | null;
  resultsSubtitle: string | null;
  hideClientsSection: boolean | null;
  clientSubtitle: string | null;
  hideProcessSection: boolean | null;
  hideProcessSubtitle: boolean | null;
  processSubtitle: string | null;
  hideCTASection: boolean | null;
  ctaBackgroundImage: string | null;
  hideTestimonialsSection: boolean | null;
  hideInvestmentSection: boolean | null;
  investmentTitle: string | null;
  hideIncludedServicesSection: boolean | null;
  hidePlansSection: boolean | null;
  hideTermsSection: boolean | null;
  hideFaqSection: boolean | null;
  hideFaqSubtitle: boolean | null;
  faqSubtitle: string | null;
  hideFinalMessageSection: boolean | null;
  hideFinalMessageSubtitle: boolean | null;
  endMessageTitle: string | null;
  endMessageTitle2: string | null;
  endMessageDescription: string | null;
  projectUrl: string | null;
  pagePassword: string | null;
  isPublished: boolean | null;
  isProposalGenerated: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  userName: string | null;

  teamMembers: ProjectTeamMember[];
  expertise: ProjectExpertise[];
  results: ProjectResult[];
  clients: ProjectClient[];
  processSteps: ProjectProcessStep[];
  testimonials: ProjectTestimonial[];
  includedServices: ProjectService[];
  plans: ProjectPlan[];
  termsConditions: ProjectTermsCondition[];
  faq: ProjectFaq[];
}
