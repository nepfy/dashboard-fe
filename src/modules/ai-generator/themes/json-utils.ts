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

  // Fix common issues - more aggressive cleaning
  cleaned = cleaned
    // Remove any non-JSON text before the first {
    .replace(/^[^{]*/, "")
    // Fix single quotes to double quotes
    .replace(/'/g, '"')
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, "$1")
    // Fix missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    // Fix specific error: "question" "answer" -> "question":"answer"
    .replace(/"question"\s+"answer"/g, '"question":"answer"')
    // Fix missing colons after property names
    .replace(/"([^"]+)"\s+"([^"]+)"\s*:/g, '"$1":"$2",')
    // Fix unescaped quotes in string values - more comprehensive
    .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}\\"${p2}\\"${p3}"`;
    })
    // Fix quotes inside string values that break JSON
    .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}\\"${p2}\\"${p3}"`;
    })
    // Fix common structural issues
    .replace(
      /\{\s*"([^"]+)"\s*:\s*"([^"]+)"\s*\}\s*\{\s*"([^"]+)"\s*:/g,
      '{"$1":"$2","$3":'
    )
    // Fix missing commas between objects in arrays
    .replace(/\}\s*\{\s*"/g, '},{"')
    // Fix incomplete objects
    .replace(/\{\s*"([^"]+)"\s*:\s*"([^"]+)"\s*\}\s*$/g, '{"$1":"$2"}')
    // Fix malformed property names
    .replace(/"([^"]+)"\s*:\s*"([^"]+)"\s*"([^"]+)"\s*:/g, '"$1":"$2","$3":')
    // Fix missing colons
    .replace(/"([^"]+)"\s*"([^"]+)"\s*:/g, '"$1":"$2",')
    // Fix broken property names with spaces
    .replace(/"([^"]+)\s+([^"]+)"\s*:/g, '"$1$2":')
    // Fix specific FAQ pattern issues
    .replace(/"question"\s*"([^"]+)"\s*:/g, '"question":"$1",')
    .replace(/"answer"\s*"([^"]+)"\s*:/g, '"answer":"$1",')
    // Remove any text after the last }
    .replace(/\}[^}]*$/, "}")
    // Remove any text before the first {
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

  // Fix multiple JSON objects (take the first complete one)
  const openBraces = (fixed.match(/\{/g) || []).length;
  const closeBraces = (fixed.match(/\}/g) || []).length;

  if (openBraces > closeBraces) {
    // Find the first complete object
    let braceCount = 0;
    let endIndex = -1;
    for (let i = 0; i < fixed.length; i++) {
      if (fixed[i] === "{") braceCount++;
      if (fixed[i] === "}") braceCount--;
      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
    if (endIndex !== -1) {
      fixed = fixed.substring(0, endIndex + 1);
    }
  }

  // Fix common issues
  fixed = fixed
    // Fix single quotes to double quotes
    .replace(/'/g, '"')
    // Fix trailing commas
    .replace(/,(\s*[}\]])/g, "$1")
    // Fix missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
    // Fix unescaped quotes in string values
    .replace(/"([^"]*)"([^"]*)"([^"]*)"/g, (match, p1, p2, p3) => {
      return `"${p1}\\"${p2}\\"${p3}"`;
    })
    // Fix common structural issues
    .replace(
      /\{\s*"([^"]+)"\s*:\s*"([^"]+)"\s*\}\s*\{\s*"([^"]+)"\s*:/g,
      '{"$1":"$2","$3":'
    )
    // Fix missing commas between objects in arrays
    .replace(/\}\s*\{\s*"/g, '},{"')
    // Fix incomplete objects
    .replace(/\{\s*"([^"]+)"\s*:\s*"([^"]+)"\s*\}\s*$/g, '{"$1":"$2"}')
    // Fix malformed property names
    .replace(/"([^"]+)"\s*:\s*"([^"]+)"\s*"([^"]+)"\s*:/g, '"$1":"$2","$3":')
    // Fix missing colons
    .replace(/"([^"]+)"\s*"([^"]+)"\s*:/g, '"$1":"$2",')
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

    // If we found at least 5 FAQ items, return them
    if (matches.length >= 5) {
      return matches;
    }

    // Try alternative pattern with missing colons
    const altPattern = /"question"\s*"([^"]+)"\s*"answer"\s*"([^"]+)"/g;
    const altMatches = [];
    let altMatch;

    while ((altMatch = altPattern.exec(jsonString)) !== null) {
      altMatches.push({
        question: altMatch[1],
        answer: altMatch[2],
      });
    }

    if (altMatches.length >= 5) {
      return altMatches;
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
