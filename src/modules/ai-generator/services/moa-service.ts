import Together from "together-ai";

export interface MOAConfig {
  referenceModels: string[];
  aggregatorModel: string;
  maxRetries: number;
  temperature: number;
  maxTokens: number;
}

export interface MOAResult<T> {
  success: boolean;
  result?: T;
  error?: string;
  metadata: {
    attempts: number;
    generationTime: number;
    modelsUsed: string[];
  };
}

export class MOAService {
  private together: Together;
  private config: MOAConfig;

  constructor(together: Together, config?: Partial<MOAConfig>) {
    this.together = together;
    this.config = {
      referenceModels: [
        "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "Qwen/Qwen2.5-7B-Instruct-Turbo",
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
      ],
      aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      maxRetries: 3,
      temperature: 0.7,
      maxTokens: 2000,
      ...config,
    };
  }

  /**
   * Generate content using Mixture of Agents approach
   * 1. Generate multiple versions using different models
   * 2. Aggregate and refine using the best model
   */
  async generateWithMOA<T>(
    userPrompt: string,
    systemPrompt: string,
    expectedFormat: string,
    agentSystemPrompt?: string
  ): Promise<MOAResult<T>> {
    const startTime = Date.now();
    const attempts = 0;
    const modelsUsed: string[] = [];

    try {
      // Step 1: Generate multiple versions using reference models
      console.log("🔄 MoA Step 1: Generating multiple versions...");
      const referenceResults = await this.generateReferenceVersions(
        userPrompt,
        systemPrompt
      );

      modelsUsed.push(...this.config.referenceModels);

      // Step 2: Aggregate and refine using the best model
      console.log("🔄 MoA Step 2: Aggregating and refining...");
      const aggregatedResult = await this.aggregateAndRefine(
        userPrompt,
        referenceResults,
        expectedFormat,
        agentSystemPrompt
      );

      modelsUsed.push(this.config.aggregatorModel);

      // Step 3: Parse and validate the result
      const parsedResult = this.parseAndValidate<T>(aggregatedResult);

      return {
        success: true,
        result: parsedResult,
        metadata: {
          attempts: attempts + 1,
          generationTime: Date.now() - startTime,
          modelsUsed,
        },
      };
    } catch (error) {
      console.error("MoA Generation Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: {
          attempts: attempts + 1,
          generationTime: Date.now() - startTime,
          modelsUsed,
        },
      };
    }
  }

  /**
   * Generate multiple versions using reference models
   */
  private async generateReferenceVersions(
    userPrompt: string,
    systemPrompt: string
  ): Promise<string[]> {
    const promises = this.config.referenceModels.map(async (model) => {
      try {
        const response = await this.together.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
        });

        return response.choices[0]?.message?.content?.trim() || "";
      } catch (error) {
        console.warn(`Reference model ${model} failed:`, error);
        return "";
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result) => result.length > 0);
  }

  /**
   * Aggregate and refine using the best model
   */
  private async aggregateAndRefine(
    userPrompt: string,
    referenceResults: string[],
    expectedFormat: string,
    agentSystemPrompt?: string
  ): Promise<string> {
    const aggregatorSystemPrompt = this.buildAggregatorPrompt(
      expectedFormat,
      agentSystemPrompt
    );

    const aggregatedContent = referenceResults
      .map((result, index) => `${index + 1}. ${result}`)
      .join("\n\n");

    const response = await this.together.chat.completions.create({
      model: this.config.aggregatorModel,
      messages: [
        { role: "system", content: aggregatorSystemPrompt },
        {
          role: "user",
          content: `Original prompt: ${userPrompt}\n\nReference responses:\n${aggregatedContent}`,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent aggregation
      max_tokens: this.config.maxTokens,
    });

    return response.choices[0]?.message?.content?.trim() || "";
  }

  /**
   * Build the aggregator system prompt
   */
  private buildAggregatorPrompt(
    expectedFormat: string,
    agentSystemPrompt?: string
  ): string {
    let basePrompt = `Você é um especialista em agregação e refinamento de conteúdo. Você recebeu múltiplas respostas de diferentes modelos de IA para o mesmo prompt. Sua tarefa é sintetizar essas respostas em uma única resposta de alta qualidade que siga EXATAMENTE o formato especificado.

⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.
Se qualquer resposta de referência estiver em outro idioma, traduza e adapte para pt-BR.

REQUISITOS CRÍTICOS:
1. Analise todas as respostas fornecidas de forma crítica
2. Identifique os melhores elementos de cada resposta
3. Combine-os em uma resposta superior e coerente
4. Siga o formato EXATO especificado abaixo
5. Garanta que a resposta seja precisa, profissional e completa
6. TODO o conteúdo DEVE estar em português brasileiro (pt-BR)

FORMATO ESPERADO:
${expectedFormat}

REGRAS DE AGREGAÇÃO:
- Use as informações mais precisas e relevantes
- Combine os melhores estilos de escrita e abordagens
- Garanta consistência no tom e voz
- Mantenha a estrutura especificada exatamente
- Remova quaisquer contradições ou inconsistências
- Melhore clareza e profissionalismo
- SEMPRE use português brasileiro (pt-BR)`;

    if (agentSystemPrompt) {
      basePrompt += `\n\nREQUISITOS ESPECÍFICOS DO AGENTE:
${agentSystemPrompt}

Aplique esses requisitos específicos do agente ao refinar a resposta agregada.`;
    }

    basePrompt += `\n\nRetorne APENAS a resposta refinada final no formato exato especificado acima, EXCLUSIVAMENTE em português brasileiro (pt-BR).`;

    return basePrompt;
  }

  /**
   * Parse and validate the aggregated result
   */
  private parseAndValidate<T>(content: string): T {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(content);
      return parsed as T;
    } catch (jsonError) {
      // If not JSON, try to extract JSON from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed as T;
        } catch (extractError) {
          throw new Error(
            `Failed to parse JSON from aggregated content: ${extractError}`
          );
        }
      }

      throw new Error(
        `No valid JSON found in aggregated content: ${jsonError}`
      );
    }
  }

  /**
   * Generate content with retry logic using MoA
   */
  async generateWithRetry<T>(
    userPrompt: string,
    systemPrompt: string,
    expectedFormat: string,
    agentSystemPrompt?: string
  ): Promise<MOAResult<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`🔄 MoA Attempt ${attempt}/${this.config.maxRetries}`);

        const result = await this.generateWithMOA<T>(
          userPrompt,
          systemPrompt,
          expectedFormat,
          agentSystemPrompt
        );

        if (result.success) {
          return result;
        }

        lastError = new Error(result.error || "Unknown error");

        if (attempt < this.config.maxRetries) {
          console.log(`⏳ Waiting before retry...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`MoA Attempt ${attempt} failed:`, error);

        if (attempt < this.config.maxRetries) {
          console.log(`⏳ Waiting before retry...`);
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || "Max retries exceeded",
      metadata: {
        attempts: this.config.maxRetries,
        generationTime: 0,
        modelsUsed: [],
      },
    };
  }
}
