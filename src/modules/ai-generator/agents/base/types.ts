import { TemplateConfig } from "./template-config";

export interface BaseAgentConfig {
  id: string;
  name: string;
  sector: string;
  systemPrompt: string;
  expertise: string[];
  commonServices: string[];
  pricingModel: string;
  proposalStructure: string[];
  keyTerms: string[];
  templateConfig?: TemplateConfig;
}

export interface PrimeAgentConfig extends BaseAgentConfig {
  primeSpecific: {
    introductionStyle: string;
    aboutUsFocus: string;
    specialtiesApproach: string;
    processEmphasis: string;
    investmentStrategy: string;
  };
}

export interface FlashAgentConfig extends BaseAgentConfig {
  flashSpecific: {
    introductionStyle: string;
    aboutUsFocus: string;
    specialtiesApproach: string;
    processEmphasis: string;
    investmentStrategy: string;
  };
}

export type AgentConfig = BaseAgentConfig | PrimeAgentConfig | FlashAgentConfig;

export type ServiceType =
  | "marketing-digital"
  | "design"
  | "development"
  | "architecture"
  | "photography"
  | "agencias-consultoria";

export type TemplateType = "prime" | "flash" | "grid" | "base" | "novo";
