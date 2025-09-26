/**
 * Text validation and correction utilities for AI-generated content
 * Ensures compliance with character limits and content quality standards
 */

export interface CharacterLimit {
  field: string;
  limit: number;
  description?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedText?: string;
}

/**
 * Validate and correct character limits for text fields
 */
export function validateCharacterLimit(
  text: string,
  limit: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!text || typeof text !== "string") {
    errors.push(`${fieldName} is empty or invalid`);
    return { isValid: false, errors, warnings };
  }

  if (text.length > limit) {
    errors.push(
      `${fieldName} exceeds limit of ${limit} characters (${text.length})`
    );
  }

  // Check for meta instructions that shouldn't appear in output
  const metaPatterns = [
    /\(máximo \d+ caracteres?\)/gi,
    /\(max \d+ chars?\)/gi,
    /\(até \d+ caracteres?\)/gi,
    /\(limite \d+\)/gi,
    /\(máx\. \d+\)/gi,
    /\(max \d+\)/gi,
  ];

  for (const pattern of metaPatterns) {
    if (pattern.test(text)) {
      warnings.push(
        `${fieldName} contains meta instructions that should be removed`
      );
      break;
    }
  }

  // Check for template name leakage
  const templateNamePatterns = [
    /metodologia flash/gi,
    /metodologia prime/gi,
    /template flash/gi,
    /template prime/gi,
    /processo flash/gi,
    /processo prime/gi,
  ];

  for (const pattern of templateNamePatterns) {
    if (pattern.test(text)) {
      warnings.push(
        `${fieldName} contains template name that should be removed`
      );
      break;
    }
  }

  // Check for Portuguese language errors
  const commonErrors = [
    { pattern: /fidais/gi, correction: "fieis" },
    { pattern: /fieis/gi, correction: "fiéis" },
    { pattern: /nao/gi, correction: "não" },
    { pattern: /voce/gi, correction: "você" },
    { pattern: /vem/gi, correction: "vêm" },
  ];

  for (const error of commonErrors) {
    if (error.pattern.test(text)) {
      warnings.push(`${fieldName} contains Portuguese language errors`);
      break;
    }
  }

  let correctedText = text;

  // Auto-correct common issues
  if (text.length > limit) {
    correctedText = text.substring(0, limit - 3) + "...";
  }

  // Remove meta instructions
  for (const pattern of metaPatterns) {
    correctedText = correctedText.replace(pattern, "");
  }

  // Fix template name leakage
  correctedText = correctedText.replace(
    /metodologia flash/gi,
    "metodologia ágil"
  );
  correctedText = correctedText.replace(
    /metodologia prime/gi,
    "metodologia premium"
  );
  correctedText = correctedText.replace(
    /template flash/gi,
    "processo otimizado"
  );
  correctedText = correctedText.replace(/template prime/gi, "processo premium");
  correctedText = correctedText.replace(
    /processo flash/gi,
    "processo otimizado"
  );
  correctedText = correctedText.replace(/processo prime/gi, "processo premium");

  // Fix Portuguese errors
  correctedText = correctedText.replace(/fidais/gi, "fiéis");
  correctedText = correctedText.replace(/fieis/gi, "fiéis");
  correctedText = correctedText.replace(/\bnao\b/gi, "não");
  correctedText = correctedText.replace(/\bvoce\b/gi, "você");
  correctedText = correctedText.replace(/\bvem\b/gi, "vêm");

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    correctedText: correctedText !== text ? correctedText : undefined,
  };
}

/**
 * Validate and correct an array of text items
 */
export function validateTextArray(
  items: string[],
  limit: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const correctedItems: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const itemResult = validateCharacterLimit(
      items[i],
      limit,
      `${fieldName}[${i}]`
    );
    errors.push(...itemResult.errors);
    warnings.push(...itemResult.warnings);
    correctedItems.push(itemResult.correctedText || items[i]);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    correctedText: correctedItems.join(", "),
  };
}

/**
 * Validate project name case handling
 */
export function validateProjectNameCase(projectName: string): string {
  if (!projectName || typeof projectName !== "string") {
    return projectName;
  }

  // Convert from ALL CAPS to proper case
  if (projectName === projectName.toUpperCase() && projectName.length > 1) {
    return projectName
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return projectName;
}

/**
 * Validate topic quantity compliance
 */
export function validateTopicQuantity(
  topics: unknown[],
  expectedMin: number,
  expectedMax: number,
  fieldName: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(topics)) {
    errors.push(`${fieldName} is not an array`);
    return { isValid: false, errors, warnings };
  }

  if (topics.length < expectedMin) {
    errors.push(
      `${fieldName} has ${topics.length} items, minimum required is ${expectedMin}`
    );
  }

  if (topics.length > expectedMax) {
    warnings.push(
      `${fieldName} has ${topics.length} items, maximum recommended is ${expectedMax}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Clean AI response from meta instructions and unwanted content
 */
export function cleanAIResponse(text: string): string {
  if (!text || typeof text !== "string") {
    return text;
  }

  let cleaned = text;

  // Remove meta instructions
  const metaPatterns = [
    /\(máximo \d+ caracteres?\)/gi,
    /\(max \d+ chars?\)/gi,
    /\(até \d+ caracteres?\)/gi,
    /\(limite \d+\)/gi,
    /\(máx\. \d+\)/gi,
    /\(max \d+\)/gi,
    /\(chars?\)/gi,
    /\(caracteres?\)/gi,
  ];

  for (const pattern of metaPatterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Remove template name leakage
  cleaned = cleaned.replace(/metodologia flash/gi, "metodologia ágil");
  cleaned = cleaned.replace(/metodologia prime/gi, "metodologia premium");
  cleaned = cleaned.replace(/template flash/gi, "processo otimizado");
  cleaned = cleaned.replace(/template prime/gi, "processo premium");
  cleaned = cleaned.replace(/processo flash/gi, "processo otimizado");
  cleaned = cleaned.replace(/processo prime/gi, "processo premium");

  // Fix Portuguese errors
  cleaned = cleaned.replace(/fidais/gi, "fiéis");
  cleaned = cleaned.replace(/fieis/gi, "fiéis");
  cleaned = cleaned.replace(/\bnao\b/gi, "não");
  cleaned = cleaned.replace(/\bvoce\b/gi, "você");
  cleaned = cleaned.replace(/\bvem\b/gi, "vêm");

  return cleaned.trim();
}

/**
 * Ensure proper voice and tone compliance
 */
export function ensureProperVoice(text: string): string {
  if (!text || typeof text !== "string") {
    return text;
  }

  let corrected = text;

  // Ensure second person usage where appropriate
  corrected = corrected.replace(/nossa empresa/gi, "sua empresa");
  corrected = corrected.replace(/nossa equipe/gi, "sua equipe");
  corrected = corrected.replace(/nossos serviços/gi, "seus serviços");

  // This is a simple implementation - in practice, you'd want more sophisticated logic
  return corrected;
}
