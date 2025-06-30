export type TemplateType = "flash" | "prime" | "essencial" | null;

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  sortOrder?: number;
}

export interface Expertise {
  id: string;
  hideExpertiseIcon?: boolean;
  icon?: string | React.ReactElement;
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface Result {
  id: string;
  client: string;
  subtitle: string;
  investment: string;
  roi: string;
  photo?: string;
  hidePhoto?: boolean;
  sortOrder: number;
}

export interface Client {
  id: string;
  logo?: string;
  name: string;
  sortOrder?: number;
}

export interface ProcessStep {
  id: string;
  stepCounter: number;
  stepName: string;
  description?: string;
  sortOrder?: number;
}

export interface Testimonial {
  id: string;
  testimonial: string;
  name: string;
  role?: string;
  photo?: string;
  hidePhoto?: boolean;
  sortOrder?: number;
}

export interface Service {
  id?: string;
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface PlanDetail {
  id?: string;
  description: string;
  sortOrder?: number;
}

export interface Plan {
  id?: string;
  title: string;
  description?: string;
  isBestOffer?: boolean;
  price?: number;
  pricePeriod?: "monthly" | "yearly" | "one-time";
  ctaButtonTitle?: string;
  planDetails?: PlanDetail[];
  sortOrder?: number;
}

export interface TermsCondition {
  id?: string;
  title?: string;
  description: string;
  sortOrder?: number;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface Project {
  id?: string;
  personId?: string;

  projectName?: string;
  clientName?: string;
  projectSentDate?: Date | string;
  projectValidUntil?: Date | string;
  projectStatus?:
    | "active"
    | "approved"
    | "negotiation"
    | "rejected"
    | "draft"
    | "expired"
    | "archived";
  projectVisualizationDate?: Date | string;

  templateType?: TemplateType;

  mainColor?: string;
  companyName?: string;
  companyEmail?: string;
  ctaButtonTitle?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  hidePageSubtitle?: boolean;
  services?: string;
  hideServices?: boolean;

  hideAboutUsSection?: boolean;
  aboutUsTitle?: string;
  aboutUsSubtitle1?: string;
  aboutUsSubtitle2?: string;

  hideAboutYourTeamSection?: boolean;
  ourTeamSubtitle?: string;
  teamMembers?: TeamMember[];

  hideExpertiseSection?: boolean;
  expertiseSubtitle?: string;
  expertise?: Expertise[];

  hideResultsSection?: boolean;
  results?: Result[];

  hideClientsSection?: boolean;
  hideLogoField?: boolean;
  clients?: Client[];

  hideProcessSection?: boolean;
  hideProcessSubtitle?: boolean;
  processSubtitle?: string;
  processSteps?: ProcessStep[];

  hideCTASection?: boolean;
  ctaBackgroundImage?: string;

  hideTestimonialsSection?: boolean;
  testimonials?: Testimonial[];

  hideInvestmentSection?: boolean;
  investmentTitle?: string;

  hideIncludedServicesSection?: boolean;
  includedServices?: Service[];

  hidePlansSection?: boolean;
  plans?: Plan[];

  hideTermsSection?: boolean;
  termsConditions?: TermsCondition[];

  hideFaqSection?: boolean;
  faq?: FAQ[];

  hideFinalMessage?: boolean;
  hideFinalMessageSubtitle?: boolean;
  endMessageTitle?: string;
  endMessageTitle2?: string;
  endMessageDescription?: string;

  projectUrl?: string;
  pagePassword?: string;

  isPublished?: boolean;
  isProposalGenerated?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Step1Data {
  templateType?: TemplateType;
  mainColor?: string;
  clientName?: string;
  projectName?: string;
  companyName?: string;
  companyEmail?: string;
  ctaButtonTitle?: string;
  pageTitle?: string;
  hidePageSubtitle?: boolean;
  pageSubtitle?: string;
  hideServices?: boolean;
  services?: string[];
}

export interface Step2Data {
  hideAboutUsSection?: boolean;
  hideAboutUsTitle?: boolean;
  hideSubtitles1?: boolean;
  hideSubtitles2?: boolean;
  aboutUsTitle?: string;
  aboutUsSubtitle1?: string;
  aboutUsSubtitle2?: string;
}

export interface Step3Data {
  hideAboutYourTeamSection?: boolean;
  ourTeamSubtitle?: string;
  teamMembers?: TeamMember[];
}

export interface Step4Data {
  hideExpertiseSection?: boolean;
  expertiseSubtitle?: string;
  expertise?: Expertise[];
}

export interface Step5Data {
  hideYourResultsSection?: boolean;
  results?: Result[];
}

export interface Step6Data {
  hideClientsSection?: boolean;
  hideLogoField?: boolean;
  clients?: Client[];
}

export interface Step7Data {
  hideProcessSection?: boolean;
  hideProcessSubtitle?: boolean;
  processSubtitle?: string;
  processSteps?: ProcessStep[];
}

export interface Step8Data {
  hideCTASection?: boolean;
  ctaBackgroundImage?: string;
  ctaBackgroundImageName?: string;
}

export interface Step9Data {
  hideTestimonialsSection?: boolean;
  testimonials?: Testimonial[];
}

export interface Step10Data {
  hideInvestmentSection?: boolean;
  investmentTitle?: string;
}

export interface Step11Data {
  hideIncludedServicesSection?: boolean;
  includedServices?: Service[];
}

export interface Step12Data {
  hidePlansSection?: boolean;
  plans?: Plan[];
}

export interface Step13Data {
  hideTermsSection?: boolean;
  termsConditions?: TermsCondition[];
}

export interface Step14Data {
  hideFaqSection?: boolean;
  faq?: FAQ[];
}

export interface Step15Data {
  hideFinalMessage?: boolean;
  hideFinalMessageSubtitle?: boolean;
  endMessageTitle?: string;
  endMessageTitle2?: string;
  endMessageDescription?: string;
  projectValidUntil?: Date | string;
}

export interface Step16Data {
  pageUrl?: string;
  pagePassword?: string;
}

export interface ProposalFormData {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
  step5?: Step5Data;
  step6?: Step6Data;
  step7?: Step7Data;
  step8?: Step8Data;
  step9?: Step9Data;
  step10?: Step10Data;
  step11?: Step11Data;
  step12?: Step12Data;
  step13?: Step13Data;
  step14?: Step14Data;
  step15?: Step15Data;
  step16?: Step16Data;
}

export interface CreateProposalResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

export interface UpdateProposalResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

export interface GetProposalResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

export interface ListProposalsResponse {
  success: boolean;
  data?: Project[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  error?: string;
}
