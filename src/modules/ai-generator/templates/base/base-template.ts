import { ServiceType, TemplateType } from "../../agents/base/types";

export interface BaseTemplateData {
  selectedService: ServiceType;
  companyInfo: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  selectedPlans: string[];
  planDetails: string;
  includeTerms: boolean;
  includeFAQ: boolean;
  templateType: TemplateType;
  mainColor?: string;
}

export interface BaseSection {
  id: string;
  name: string;
  content: string;
  editable: boolean;
  aiGenerated: boolean;
  characterLimit?: number;
  visible: boolean;
}

export interface BaseProposal {
  // Common sections that all templates share
  introduction: {
    title: string;
    subtitle: string;
    services: string[];
    validity: string;
    buttonText: string;
  };

  aboutUs: {
    title: string;
    supportText: string;
    subtitle: string;
  };

  specialties: {
    title: string;
    topics: Array<{
      title: string;
      description: string;
    }>;
  };

  investment: {
    title: string;
    deliverables: Array<{
      title: string;
      description: string;
    }>;
    plansItems: Array<{
      id?: string;
      hideTitleField?: boolean;
      hideDescription?: boolean;
      hidePrice?: boolean;
      hidePlanPeriod?: boolean;
      hideButtonTitle?: boolean;
      buttonTitle: string;
      planPeriod: string;
      recommended: boolean;
      sortOrder?: number;
      title: string;
      description: string;
      value: string;
      includedItems: Array<{
        description: string;
        hideItem?: boolean;
        sortOrder?: number;
      }>;
    }>;
  };

  // Optional sections
  terms?: Array<{
    title: string;
    description: string;
  }>;

  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BaseTemplateConfig {
  name: string;
  description: string;
  features: string[];
  limitations: string[];
  recommendedFor: string[];
  notRecommendedFor: string[];
}

export const baseTemplateConfig: BaseTemplateConfig = {
  name: "Base Template",
  description:
    "Template base com funcionalidades essenciais para propostas comerciais",
  features: [
    "Estrutura básica de proposta",
    "Seções personalizáveis",
    "Suporte a múltiplos planos",
    "Geração de conteúdo com IA",
    "Validação de caracteres",
    "Preview em tempo real",
  ],
  limitations: [
    "Funcionalidades avançadas limitadas",
    "Personalização visual básica",
    "Integrações limitadas",
  ],
  recommendedFor: [
    "Propostas simples",
    "Testes de conceito",
    "Projetos com orçamento limitado",
  ],
  notRecommendedFor: [
    "Propostas complexas",
    "Projetos de alto valor",
    "Necessidades de personalização avançada",
  ],
};

// Common utility functions for templates
export function validateCharacterLimit(text: string, limit: number): boolean {
  return text.length <= limit;
}

export function truncateText(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit - 3) + "...";
}

export function generateSectionId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function calculateRemainingCharacters(
  text: string,
  limit: number
): number {
  return Math.max(0, limit - text.length);
}

export function isTextValid(text: string, limit: number): boolean {
  return text.length > 0 && text.length <= limit;
}
