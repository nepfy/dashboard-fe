/**
 * Utility functions for handling JSON parsing and validation
 */

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
        rawResponse: jsonString
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      
      if (attempt < maxRetries) {
        // Try to fix common JSON issues
        jsonString = attemptFixJSON(jsonString);
      }
    }
  }

  return {
    success: false,
    error: lastError,
    rawResponse
  };
}

/**
 * Clean JSON string by removing common issues
 */
function cleanJSONString(jsonString: string): string {
  return jsonString
    // Remove any text before the first {
    .replace(/^[^{]*/, "")
    // Remove any text after the last }
    .replace(/[^}]*$/, "")
    // Fix common quote issues
    .replace(/'/g, '"')
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    // Fix unescaped quotes in strings
    .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}\\"${p2}\\"${p3}"`;
    })
    .trim();
}

/**
 * Attempt to fix common JSON issues
 */
function attemptFixJSON(jsonString: string): string {
  let fixed = jsonString;
  
  // Remove any text before the first { or [
  const firstBrace = Math.min(
    fixed.indexOf('{') === -1 ? Infinity : fixed.indexOf('{'),
    fixed.indexOf('[') === -1 ? Infinity : fixed.indexOf('[')
  );
  
  if (firstBrace !== Infinity && firstBrace > 0) {
    fixed = fixed.substring(firstBrace);
  }
  
  // Remove any text after the last } or ]
  const lastBrace = Math.max(
    fixed.lastIndexOf('}'),
    fixed.lastIndexOf(']')
  );
  
  if (lastBrace !== -1 && lastBrace < fixed.length - 1) {
    fixed = fixed.substring(0, lastBrace + 1);
  }
  
  // Fix common issues
  fixed = fixed
    // Fix single quotes to double quotes
    .replace(/'/g, '"')
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    // Fix unescaped quotes in string values
    .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}\\"${p2}\\"${p3}"`;
    });
  
  return fixed;
}

/**
 * Generate a retry prompt for JSON parsing errors
 */
export function generateJSONRetryPrompt(
  originalPrompt: string,
  error: string,
  rawResponse: string
): string {
  return `${originalPrompt}

ERRO DE JSON: A resposta anterior não é um JSON válido.
Erro: ${error}

Resposta inválida recebida:
${rawResponse.substring(0, 500)}...

INSTRUÇÕES:
1. Responda APENAS com JSON válido
2. Use aspas duplas para strings
3. Não use vírgulas no final de arrays/objetos
4. Escape aspas dentro de strings com \"
5. Verifique se todos os nomes de propriedades estão entre aspas

Retorne o JSON corrigido:`;
}
