// JSON validation instructions to automatically append to systemPrompts
export const JSON_VALIDATION_INSTRUCTIONS = `

INSTRUÇÕES CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- NÃO use aspas simples (')
- NÃO use quebras de linha dentro das strings
- NÃO use vírgulas no final de arrays ou objetos
- Escape aspas dentro de strings com \\"
- Nomes de propriedades exatamente como especificado
- Retorne APENAS JSON válido, sem explicações ou texto adicional

EXEMPLO DE JSON VÁLIDO:
{
  "title": "Título da seção",
  "content": "Conteúdo da seção",
  "topics": [
    {
      "title": "Tópico 1",
      "description": "Descrição do tópico"
    }
  ]
}

SEMPRE gere JSON válido seguindo exatamente o formato solicitado.`;

/**
 * Appends JSON validation instructions to any systemPrompt
 * @param systemPrompt - The original systemPrompt
 * @returns systemPrompt with JSON validation instructions appended
 */
export function appendJsonInstructions(systemPrompt: string): string {
  // Check if JSON instructions are already present
  if (systemPrompt.includes("INSTRUÇÕES CRÍTICAS PARA JSON VÁLIDO")) {
    return systemPrompt;
  }
  
  return systemPrompt + JSON_VALIDATION_INSTRUCTIONS;
}

/**
 * Creates a complete systemPrompt with JSON instructions for any agent
 * @param basePrompt - The base systemPrompt from database
 * @returns Complete systemPrompt with JSON validation
 */
export function createCompleteSystemPrompt(basePrompt: string): string {
  return appendJsonInstructions(basePrompt);
}
