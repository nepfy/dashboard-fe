// JSON validation instructions to automatically append to systemPrompts
export const JSON_VALIDATION_INSTRUCTIONS = `

🚨 INSTRUÇÕES CRÍTICAS - OBRIGATÓRIO SEGUIR:

1. RETORNE APENAS JSON VÁLIDO - NADA MAIS
2. Use APENAS aspas duplas (") - NUNCA aspas simples (')
3. NÃO use quebras de linha dentro das strings
4. NÃO use vírgulas no final de arrays ou objetos
5. Escape aspas dentro de strings com \\"
6. Nomes de propriedades exatamente como especificado
7. NÃO inclua explicações, comentários ou texto adicional
8. O JSON deve começar com { e terminar com }

EXEMPLO CORRETO:
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

⚠️ IMPORTANTE: Se você não retornar JSON válido, a resposta será rejeitada.`;

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
