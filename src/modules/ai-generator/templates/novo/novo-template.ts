import {
  BaseTemplateData,
  BaseProposal,
  BaseSection,
  baseTemplateConfig,
} from "../base/base-template";

export interface NovoTemplateData extends BaseTemplateData {
  templateType: "novo";
  novoFeatures?: {
    innovativeDesign: boolean;
    modernInterface: boolean;
    advancedFeatures: boolean;
  };
}

export interface NovoSection extends BaseSection {
  novoSpecific?: {
    innovativeDesign: boolean;
    modernOptions: boolean;
  };
}

export interface NovoProposal extends BaseProposal {
  // TODO: Define Novo-specific proposal structure
  // This will be implemented when the Novo template is ready
  novo: true;
}

export const novoTemplateConfig = {
  ...baseTemplateConfig,
  name: "Novo Template",
  description:
    "Template inovador com design moderno e funcionalidades avançadas (em desenvolvimento)",
  features: [
    ...baseTemplateConfig.features,
    "Design inovador",
    "Interface moderna",
    "Funcionalidades avançadas",
    "Personalização completa",
    "Integrações avançadas",
    "Experiência premium",
  ],
  limitations: [
    "Em desenvolvimento",
    "Não disponível ainda",
    "Recursos limitados",
  ],
  recommendedFor: [
    "Projetos futuros",
    "Clientes inovadores",
    "Aplicações modernas",
  ],
  notRecommendedFor: [
    "Uso em produção",
    "Projetos atuais",
    "Aplicações estáveis",
  ],
};

// Placeholder functions for future implementation
export function validateNovoCharacterLimits(): Record<string, boolean> {
  // TODO: Implement when Novo template is ready
  return {};
}

export function getNovoTemplateDefaults(): Partial<NovoProposal> {
  // TODO: Implement when Novo template is ready
  return {};
}

export function generateNovoProposalOutline(): Partial<NovoProposal> {
  // TODO: Implement when Novo template is ready
  return {};
}
