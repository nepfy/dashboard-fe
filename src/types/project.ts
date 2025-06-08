// src/types/projects.ts

// Template types
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
  icon?: string | React.ReactElement;
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface Result {
  id: string;
  photo?: string;
  client?: string;
  subtitle?: string;
  investment?: string;
  roi?: string;
  sortOrder?: number;
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
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  additionalAddress?: string;
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
  services?: string;

  aboutUsTitle?: string;
  aboutUsSubtitle1?: string;
  aboutUsSubtitle2?: string;

  ourTeamSubtitle?: string;
  teamMembers?: TeamMember[];

  expertiseSubtitle?: string;
  expertise?: Expertise[];

  resultsSubtitle?: string;
  results?: Result[];

  clients?: Client[];

  processSubtitle?: string;
  processSteps?: ProcessStep[];

  ctaBackgroundImage?: string;

  testimonials?: Testimonial[];

  investmentTitle?: string;

  includedServices?: Service[];
  deliveryServices?: string[];

  plans?: Plan[];

  termsTitle?: string;
  termsConditions?: TermsCondition[];

  faq?: FAQ[];

  endMessageTitle?: string;
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
  pageSubtitle?: string;
  services?: string[];
}

export interface Step2Data {
  hideSection?: boolean;
  hideSubtitles?: boolean;
  aboutUsTitle?: string;
  aboutUsSubtitle1?: string;
  aboutUsSubtitle2?: string;
}

export interface Step3Data {
  hideSection?: boolean;
  ourTeamSubtitle?: string;
  teamMembers?: TeamMember[];
}

export interface Step4Data {
  hideSection?: boolean;
  expertiseSubtitle?: string;
  expertise?: Expertise[];
}

export interface Step5Data {
  hideSection?: boolean;
  resultsSubtitle?: string;
  results?: Result[];
}

export interface Step6Data {
  hideSection?: boolean;
  clients?: Client[];
}

export interface Step7Data {
  hideSection?: boolean;
  processSubtitle?: string;
  processSteps?: ProcessStep[];
}

export interface Step8Data {
  hideSection?: boolean;
  ctaBackgroundImage?: string;
  ctaBackgroundImageName?: string;
}

export interface Step9Data {
  hideSection?: boolean;
  testimonials?: Testimonial[];
}

export interface Step10Data {
  hideSection?: boolean;
  investmentTitle?: string;
}

export interface Step11Data {
  hideSection?: boolean;
  includedServices?: Service[];
  deliveryServices?: string[];
}

export interface Step12Data {
  hideSection?: boolean;
  plans?: Plan[];
}

export interface Step13Data {
  hideSection?: boolean;
  termsTitle?: string;
  termsConditions?: TermsCondition[];
}

export interface Step14Data {
  hideSection?: boolean;
  faq?: FAQ[];
}

export interface Step15Data {
  hideSection?: boolean;
  endMessageTitle?: string;
  endMessageDescription?: string;
}

export interface Step16Data {
  pageUrl?: string;
  pagePassword?: string;
  projectValidUntil?: Date | string;
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
