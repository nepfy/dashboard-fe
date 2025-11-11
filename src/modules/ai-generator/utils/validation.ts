/**
 * Consolidated validation utilities for AI Generator
 * 
 * This module provides all validation functions for:
 * - Character limits (exact and max)
 * - Array lengths
 * - JSON parsing and validation
 * - String sanitization
 */

import { z } from "zod";

// ============================================================================
// TYPE GUARDS AND BASIC VALIDATION
// ============================================================================

/**
 * Ensures a condition is true, otherwise throws an error
 */
export function ensureCondition(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Ensures value is a string
 */
export function ensureString(value: unknown, field: string): string {
  return z
    .string({ invalid_type_error: `${field} must be a string` })
    .parse(value);
}

/**
 * Ensures value is an array
 */
export function ensureArray<T>(value: unknown, field: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${field} must be an array`);
  }
  return value as T[];
}

// ============================================================================
// CHARACTER LENGTH VALIDATION
// ============================================================================

/**
 * Ensures string has exact length (strict)
 * Throws error if length doesn't match
 */
export function ensureExactLength(
  value: unknown,
  expected: number,
  field: string
): string {
  const str = ensureString(value, field);
  ensureCondition(
    str.length === expected,
    `${field} must have exactly ${expected} characters. Received ${str.length}.`
  );
  return str;
}

/**
 * Ensures string has max length (inclusive)
 * Throws error if length exceeds max
 */
export function ensureMaxLength(
  value: unknown,
  max: number,
  field: string
): string {
  const str = ensureString(value, field);
  ensureCondition(
    str.length > 0 && str.length <= max,
    `${field} must have between 1 and ${max} characters. Received ${str.length}.`
  );
  return str;
}

/**
 * Validates exact length but returns warning instead of throwing
 * Useful for soft validation
 */
export function validateLengthWithWarning(
  value: unknown,
  expected: number,
  field: string
): { value: string; warning?: string } {
  const str = ensureString(value, field);
  if (str.length !== expected) {
    return {
      value: str,
      warning: `${field} should have exactly ${expected} characters but has ${str.length}.`,
    };
  }
  return { value: str };
}

/**
 * Validates max length but returns warning instead of throwing
 * Useful for soft validation
 */
export function validateMaxLengthWithWarning(
  value: unknown,
  maxLength: number,
  field: string
): { value: string; warning?: string } {
  const str = ensureString(value, field);
  if (str.length > maxLength) {
    return {
      value: str,
      warning: `${field} exceeded maximum length of ${maxLength} characters (had ${str.length}). Regenerate the content keeping the limit in mind.`,
    };
  }
  return { value: str };
}

// ============================================================================
// ARRAY LENGTH VALIDATION
// ============================================================================

/**
 * Ensures array has exact number of items
 */
export function ensureExactArrayLength<T>(
  value: T[],
  expected: number,
  field: string
): void {
  ensureCondition(
    value.length === expected,
    `${field} must contain exactly ${expected} items. Received ${value.length}.`
  );
}

/**
 * Ensures array length is within range (inclusive)
 */
export function ensureLengthBetween<T>(
  value: T[],
  min: number,
  max: number,
  field: string
): void {
  ensureCondition(
    value.length >= min && value.length <= max,
    `${field} must contain between ${min} and ${max} items. Received ${value.length}.`
  );
}

// ============================================================================
// REGEX AND PATTERN VALIDATION
// ============================================================================

/**
 * Ensures string matches regex pattern
 */
export function ensureMatchesRegex(
  value: unknown,
  regex: RegExp,
  field: string
): string {
  const str = ensureString(value, field);
  ensureCondition(regex.test(str), `${field} is invalid`);
  return str;
}

// ============================================================================
// JSON PARSING AND VALIDATION
// ============================================================================

export interface JSONParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  rawResponse?: string;
}

/**
 * Safely parse JSON with error handling and retry logic
 */
export function safeJSONParse<T>(
  jsonString: string,
  maxRetries: number = 2
): JSONParseResult<T> {
  let lastError: string = "";
  const rawResponse = jsonString;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Clean the JSON string
      const cleanedJSON = cleanJSONString(jsonString);
      const parsed = JSON.parse(cleanedJSON);

      return {
        success: true,
        data: parsed,
        rawResponse: jsonString,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < maxRetries) {
        // Try to fix common JSON issues
        jsonString = attemptFixJSON(jsonString);
      } else {
        // Last attempt: try to extract FAQ array specifically
        if (
          jsonString.includes('"question"') &&
          jsonString.includes('"answer"')
        ) {
          const faqExtracted = extractFAQFromMalformedJSON(jsonString);
          if (faqExtracted) {
            return {
              success: true,
              data: faqExtracted as T,
              rawResponse: jsonString,
            };
          }
        }
      }
    }
  }

  return {
    success: false,
    error: lastError,
    rawResponse,
  };
}

/**
 * Clean JSON string by removing common issues
 */
function cleanJSONString(jsonString: string): string {
  let cleaned = jsonString;

  // Remove any text before the first { or [
  const firstBrace = Math.min(
    cleaned.indexOf("{") === -1 ? Infinity : cleaned.indexOf("{"),
    cleaned.indexOf("[") === -1 ? Infinity : cleaned.indexOf("[")
  );

  if (firstBrace !== Infinity && firstBrace > 0) {
    cleaned = cleaned.substring(firstBrace);
  }

  // Remove any text after the last } or ]
  const lastBrace = Math.max(
    cleaned.lastIndexOf("}"),
    cleaned.lastIndexOf("]")
  );

  if (lastBrace !== -1 && lastBrace < cleaned.length - 1) {
    cleaned = cleaned.substring(0, lastBrace + 1);
  }

  // Fix multiple JSON objects (take the first complete one)
  const openBraces = (cleaned.match(/\{/g) || []).length;
  const closeBraces = (cleaned.match(/\}/g) || []).length;

  if (openBraces > closeBraces) {
    // Find the first complete object
    let braceCount = 0;
    let endIndex = -1;
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") braceCount++;
      if (cleaned[i] === "}") braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
    if (endIndex !== -1) {
      cleaned = cleaned.substring(0, endIndex + 1);
    }
  }

  // Fix common issues
  cleaned = cleaned
    .replace(/^[^{]*/, "")
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, "$1")
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    .replace(/"question"\s+"answer"/g, '"question":"answer"')
    .replace(/"([^"]+)"\s+"([^"]+)"\s*:/g, '"$1":"$2",')
    .replace(/\}\s*\{\s*"/g, '},{"')
    .replace(/\}[^}]*$/, "}")
    .replace(/^[^{]*/, "")
    .trim();

  return cleaned;
}

/**
 * Attempt to fix common JSON issues
 */
function attemptFixJSON(jsonString: string): string {
  let fixed = jsonString;

  // Remove any text before the first { or [
  const firstBrace = Math.min(
    fixed.indexOf("{") === -1 ? Infinity : fixed.indexOf("{"),
    fixed.indexOf("[") === -1 ? Infinity : fixed.indexOf("[")
  );

  if (firstBrace !== Infinity && firstBrace > 0) {
    fixed = fixed.substring(firstBrace);
  }

  // Remove any text after the last } or ]
  const lastBrace = Math.max(fixed.lastIndexOf("}"), fixed.lastIndexOf("]"));

  if (lastBrace !== -1 && lastBrace < fixed.length - 1) {
    fixed = fixed.substring(0, lastBrace + 1);
  }

  // Fix common issues
  fixed = fixed
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, "$1")
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    .replace(/\}\s*\{\s*"/g, '},{"')
    .trim();

  return fixed;
}

/**
 * Extract FAQ array from malformed JSON
 */
function extractFAQFromMalformedJSON(
  jsonString: string
): Array<{ question: string; answer: string }> | null {
  try {
    // Find all question-answer pairs using regex
    const questionAnswerRegex =
      /"question"\s*:\s*"([^"]+)"\s*,\s*"answer"\s*:\s*"([^"]+)"/g;
    const matches = [];
    let match;

    while ((match = questionAnswerRegex.exec(jsonString)) !== null) {
      matches.push({
        question: match[1],
        answer: match[2],
      });
    }

    if (matches.length >= 5) {
      return matches;
    }

    return null;
  } catch (error) {
    console.error("Error extracting FAQ from malformed JSON:", error);
    return null;
  }
}

/**
 * Generate a retry prompt for JSON parsing errors
 */
export function generateJSONRetryPrompt(
  originalPrompt: string,
  error: string,
  rawResponse: string
): string {
  return `🚨 ERRO CRÍTICO DE JSON - RESPOSTA REJEITADA:

ERRO ESPECÍFICO: ${error}
RESPOSTA ANTERIOR (INVÁLIDA): ${rawResponse.substring(0, 500)}...

🔧 CORREÇÕES OBRIGATÓRIAS:
1. RETORNE APENAS JSON VÁLIDO - NADA MAIS
2. Use APENAS aspas duplas (") - NUNCA aspas simples (')
3. NÃO use quebras de linha dentro das strings
4. NÃO use vírgulas no final de arrays ou objetos
5. Escape aspas dentro de strings com \\"
6. Nomes de propriedades exatamente como especificado
7. O JSON deve começar com { e terminar com }

EXEMPLO DE JSON VÁLIDO:
{
  "title": "Título da seção",
  "content": "Conteúdo da seção"
}

⚠️ ATENÇÃO: Se você não retornar JSON válido, a resposta será rejeitada novamente.

PROMPT ORIGINAL:
${originalPrompt}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Ensures all items in array have unique IDs
 */
export function ensureItemsHaveIds<T extends Record<string, unknown>>(
  items: T | T[]
): (T & { id: string })[] {
  // If items is not an array, convert it to an array with single item
  const itemsArray = Array.isArray(items) ? items : [items];

  return itemsArray.map((item) => ({
    ...item,
    id: (item.id as string | undefined) || crypto.randomUUID(),
  }));
}

/**
 * Sanitize string by removing or escaping problematic characters
 */
export function sanitizeString(value: string): string {
  return value
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control characters
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Truncate string to max length with ellipsis
 */
export function truncateString(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }
  return value.substring(0, maxLength - 3) + "...";
}

/**
 * Count actual characters (excluding control characters)
 */
export function countCharacters(value: string): number {
  return sanitizeString(value).length;
}





