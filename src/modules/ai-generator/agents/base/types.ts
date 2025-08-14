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
  | "marketing"
  | "design"
  | "development"
  | "architecture"
  | "photography"
  | "medical";

export type TemplateType = "prime" | "flash" | "novo";
