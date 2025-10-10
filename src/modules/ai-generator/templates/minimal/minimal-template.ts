import {
  BaseTemplateData,
  BaseProposal,
  BaseSection,
  baseTemplateConfig,
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

export interface MinimalProposal extends BaseProposal {
  // TODO: Define Minimal-specific proposal structure
  // This will be implemented when the Minimal template is ready
  minimal: true;
}

export const minimalTemplateConfig = {
  ...baseTemplateConfig,
  name: "Minimal Template",
  description:
    "Template minimalista com design limpo e funcionalidades essenciais (em desenvolvimento)",
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
    "Em desenvolvimento",
    "Não disponível ainda",
    "Recursos limitados",
  ],
  recommendedFor: [
    "Projetos futuros",
    "Clientes minimalistas",
    "Aplicações simples",
  ],
  notRecommendedFor: [
    "Uso em produção",
    "Projetos atuais",
    "Aplicações complexas",
  ],
};

// Placeholder functions for future implementation
export function validateMinimalCharacterLimits(): Record<string, boolean> {
  // TODO: Implement when Minimal template is ready
  return {};
}

export function getMinimalTemplateDefaults(): Partial<MinimalProposal> {
  // TODO: Implement when Minimal template is ready
  return {};
}

export function generateMinimalProposalOutline(): Partial<MinimalProposal> {
  // TODO: Implement when Minimal template is ready
  return {};
}
