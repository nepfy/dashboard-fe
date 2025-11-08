/**
 * AI Generator - Central Export Module
 * 
 * Este arquivo centraliza todos os exports principais do módulo ai-generator,
 * facilitando imports e mantendo uma API pública consistente.
 */

// ============================================================================
// AGENTS
// ============================================================================

export {
  getAgentByServiceAndTemplate,
  getAgentsByTemplate,
  getAvailableTemplates,
  getAvailableServices,
  isTemplateAvailable,
  isServiceAvailable,
  getAgentByService, // Legacy
  checkMigrationStatus,
} from "./agents";

export {
  getAgentByServiceAndTemplate as dbGetAgent,
  getAgentsByTemplate as dbGetAgents,
  upsertAgent,
  upsertAgentTemplate,
  type DatabaseAgentConfig,
} from "./agents/database-agents";

export type {
  BaseAgentConfig,
  PrimeAgentConfig,
  FlashAgentConfig,
  AgentConfig,
  ServiceType,
  TemplateType,
} from "./agents/base/types";

export type {
  TemplateConfig,
  TemplateFieldConstraint,
  TemplateSectionConfig,
  TemplateCollectionConstraint,
  TemplateStructureItem,
  ConstraintMode,
} from "./agents/base/template-constraints";

// ============================================================================
// TEMPLATES
// ============================================================================

// Flash Template
export {
  FlashProposal,
  FlashTemplateData,
  flashTemplateConfig,
  validateFlashCharacterLimits,
  getFlashTemplateDefaults,
  generateFlashProposalOutline,
} from "./templates/flash";

export { flashTemplateConfigV1 } from "./templates/flash/constraints";

export {
  FLASH_SERVICE_TYPES,
  FLASH_SERVICE_DESCRIPTIONS,
  FLASH_SERVICE_ICONS,
  type FlashServiceType,
} from "./templates/flash/constants";

// Base Template
export {
  BaseTemplateData,
  BaseProposal,
  BaseSection,
  baseTemplateConfig,
  validateCharacterLimit,
  truncateText,
  generateSectionId,
  calculateRemainingCharacters,
  isTextValid,
} from "./templates/base/base-template";

// ============================================================================
// THEMES (Geração)
// ============================================================================

export {
  FlashTheme,
  FlashTemplateWorkflow,
  type FlashThemeData,
  type FlashIntroductionSection,
  type FlashAboutUsSection,
  type FlashTeamSection,
  type FlashSpecialtiesSection,
  type FlashStepsSection,
  type FlashScopeSection,
  type FlashInvestmentSection,
  type FlashResultsSection,
  type FlashTestimonialsSection,
  type FlashTermsSection,
  type FlashFAQSection,
  type FlashFooterSection,
  type FlashWorkflowResult,
} from "./themes/flash";

export {
  BaseThemeData,
  BaseThemeConfig,
  baseThemeConfig,
  generateThemeCSS,
  validateThemeData,
  getThemeDefaults,
} from "./themes/base-theme";

// ============================================================================
// SERVICES
// ============================================================================

export {
  MOAService,
  type MOAConfig,
  type MOAResult,
} from "./services/moa-service";

// ============================================================================
// CONFIG
// ============================================================================

export {
  templateConfigManager,
  defaultTemplateConfigs,
  TemplateConfigManager,
} from "./config/template-prompts";

// ============================================================================
// UTILITIES
// ============================================================================

export {
  // Type guards
  ensureCondition,
  ensureString,
  ensureArray,
  
  // Character length validation
  ensureExactLength,
  ensureMaxLength,
  validateLengthWithWarning,
  validateMaxLengthWithWarning,
  
  // Array length validation
  ensureExactArrayLength,
  ensureLengthBetween,
  
  // Regex validation
  ensureMatchesRegex,
  
  // JSON parsing
  safeJSONParse,
  generateJSONRetryPrompt,
  type JSONParseResult,
  
  // Utility functions
  ensureItemsHaveIds,
  sanitizeString,
  truncateString,
  countCharacters,
} from "./utils/validation";

export {
  generateDefaultCompanyInfo,
  generateDefaultPlans,
  generateDefaultPlanDetails,
  generatePlanOptionsByCount,
  serviceMapping,
  flashServiceMapping,
  primeServiceMapping,
} from "./utils";

// ============================================================================
// WORKFLOWS
// ============================================================================

export {
  ProposalWorkflow,
  type WorkflowStep,
  type ProposalWorkflowData,
  type WorkflowResult,
} from "../../lib/ai/parallel-workflow";

// ============================================================================
// DEPRECATED (mantidos para compatibilidade)
// ============================================================================

/**
 * @deprecated Use utils/validation instead
 */
export {
  ensureCondition as deprecatedEnsureCondition,
  ensureString as deprecatedEnsureString,
  ensureExactLength as deprecatedEnsureExactLength,
  ensureMaxLength as deprecatedEnsureMaxLength,
} from "./themes/validators";

/**
 * @deprecated Use utils/validation instead
 */
export {
  safeJSONParse as deprecatedSafeJSONParse,
  generateJSONRetryPrompt as deprecatedGenerateJSONRetryPrompt,
} from "./themes/json-utils";

