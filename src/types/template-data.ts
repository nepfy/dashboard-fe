// Base interfaces for common patterns
export interface BaseSection {
  hideTitle?: boolean;
  hideSection?: boolean;
}

export interface SortableItem {
  sortOrder?: number;
}

export interface HideableItem {
  hideItem?: boolean;
}

// FAQ related interfaces
export interface FAQItem extends SortableItem {
  id: string;
  question: string;
  answer: string;
  hideQuestion?: boolean;
  hideAnswer?: boolean;
}

export interface FAQSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  items?: FAQItem[];
}

// Team related interfaces
export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  image?: string;
  hidePhoto?: boolean;
  hideMember?: boolean;
  sortOrder?: number;
}

export interface TeamSection extends BaseSection {
  title?: string;
  members?: TeamMember[];
}

// Plans related interfaces
export interface PlanIncludedItem extends HideableItem, SortableItem {
  item: string;
}

export interface PlanIncludedItem extends HideableItem, SortableItem {
  id: string;
  description: string;
  hideDescription: boolean;
}

export interface Plan extends HideableItem, SortableItem {
  id: string;
  title: string;
  description: string;
  value: string;
  planPeriod: string;
  recommended: boolean;
  buttonTitle: string;
  hideTitleField: boolean;
  hideDescription: boolean;
  hidePrice: boolean;
  hidePlanPeriod: boolean;
  hideButtonTitle: boolean;
  includedItems?: PlanIncludedItem[];
}

export interface PlansSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  plansItems?: Plan[];
}

export interface MarqueeItem extends HideableItem, SortableItem {
  id: string;
  text: string;
}

// Steps related interfaces
export interface StepTopic extends HideableItem, SortableItem {
  id?: string;
  title?: string;
  description?: string;
  hideStepDescription?: boolean;
  hideStepName?: boolean;
}

export interface StepsSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  topics?: StepTopic[];
  marquee?: MarqueeItem[];
  hideIntroduction?: boolean;
}

// Footer related interfaces
export interface FooterSection extends BaseSection {
  marquee?: string[];
  callToAction?: string;
  hideDisclaimer?: boolean;
  hideCallToAction?: boolean;
  disclaimer?: string;
  validity?: Date | string;
  buttonTitle?: string;
}

// About Us related interfaces
export interface AboutUsSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  subtitle?: string;
  supportText?: string;
  hideSubtitle?: boolean;
  hideSupportText?: boolean;
}

// Clients related interfaces
export interface Client {
  name: string;
  logo?: string;
  testimonial?: string;
  hideClient?: boolean;
  sortOrder: number;
}

export interface ClientsSection extends BaseSection {
  title?: string;
  items: Client[];
}

// Expertise related interfaces
export interface ExpertiseTopic extends HideableItem, SortableItem {
  id?: string;
  title?: string;
  description?: string;
  icon?: string;
  hideTitleField?: boolean;
  hideDescription?: boolean;
}

export interface ExpertiseSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  topics?: ExpertiseTopic[];
}

// Investment related interfaces
export interface InvestmentSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  projectScope?: string;
  hideProjectScope?: boolean;
}

// Results related interfaces
export interface Result extends HideableItem, SortableItem {
  id?: string;
  client?: string;
  instagram?: string;
  investment?: string;
  roi?: string;
  photo?: string | null;
  hidePhoto?: boolean;
}

export interface ResultSection extends HideableItem, SortableItem {
  hideSection?: boolean;
  title?: string;
  items?: Result[];
}

// Deliverables related interfaces
export interface DeliverableItem extends HideableItem, SortableItem {
  title: string;
  description: string;
}

export interface DeliverablesSection extends BaseSection {
  title: string;
  items: DeliverableItem[];
}

// Introduction related interfaces
export interface IntroductionService extends HideableItem, SortableItem {
  id: string;
  serviceName: string;
}

export interface IntroductionSection {
  mainColor?: string;
  userName?: string;
  email?: string;
  title?: string;
  services?: IntroductionService[];
  subtitle?: string;
  validity?: string;
  buttonTitle?: string;
  hideSubtitle?: boolean;
}

// Testimonials related interfaces
export interface Testimonial {
  id?: string;
  name?: string;
  role?: string;
  testimonial?: string;
  photo?: string;
  hidePhoto?: boolean;
  sortOrder?: number;
}

export interface TestimonialsSection extends BaseSection {
  hideSection?: boolean;
  title?: string;
  items?: Testimonial[];
}

// Terms and Conditions related interfaces
export interface TermsCondition extends HideableItem, SortableItem {
  term: string;
}

export interface TermsConditionsSection extends BaseSection {
  title: string;
  items: TermsCondition[];
}

// Main ProposalData interface
export interface ProposalData {
  faq: FAQSection;
  team: TeamSection;
  plans: PlansSection;
  steps: StepsSection;
  footer: FooterSection;
  aboutUs: AboutUsSection;
  clients: ClientsSection;
  expertise: ExpertiseSection;
  investment: InvestmentSection;
  results: ResultSection;
  deliverables: DeliverablesSection;
  introduction: IntroductionSection;
  testimonials: TestimonialsSection;
  termsConditions: TermsConditionsSection;
}

// Project status enum
export type ProjectStatus =
  | "draft"
  | "published"
  | "sent"
  | "accepted"
  | "rejected";

// Template type enum
export type TemplateType = "flash" | "prime" | "base";

// Main TemplateData interface
export interface TemplateData {
  id?: string;
  personId?: string;
  projectName: string;
  projectSentDate: string | null;
  projectValidUntil?: string;
  projectStatus?: ProjectStatus;
  projectVisualizationDate?: string | null;
  templateType: TemplateType;
  mainColor: string;
  projectUrl?: string;
  pagePassword?: string;
  isPublished?: boolean;
  isProposalGenerated?: boolean;
  proposalData?: ProposalData;
  userName?: string;
  companyName?: string;
  updated_at?: string;
  created_at?: string;
  deleted_at?: string | null;
}
