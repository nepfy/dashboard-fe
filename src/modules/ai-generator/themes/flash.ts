import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { FlashProposal } from "../templates/flash/flash-template";
import { BaseThemeData } from "./base-theme";

// Initialize TogetherAI client with proper error handling
const apiKey = process.env.TOGETHER_API_KEY;

if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });

export interface FlashThemeData extends BaseThemeData {
  templateType: "flash";
  flashFeatures?: {
    rapidDelivery: boolean;
    streamlinedProcess: boolean;
    quickCustomization: boolean;
  };
}

// Section types for better type safety
export interface FlashIntroductionSection {
  title: string;
  subtitle: string;
  services: string[];
  validity: string;
  buttonText: string;
}

export interface FlashAboutUsSection {
  title: string;
  supportText: string;
  subtitle: string;
}

export interface FlashSpecialtyTopic {
  title: string;
  description: string;
}

export interface FlashSpecialtiesSection {
  title: string;
  topics: FlashSpecialtyTopic[];
}

export interface FlashStepTopic {
  title: string;
  description: string;
}

export interface FlashStepsSection {
  introduction: string;
  title: string;
  topics: FlashStepTopic[];
}

export interface FlashDeliverable {
  title: string;
  description: string;
}

export interface FlashPlan {
  title: string;
  description: string;
  value: string;
  topics: string[];
}

export interface FlashInvestmentSection {
  title: string;
  deliverables: FlashDeliverable[];
  plans: FlashPlan[];
}

export interface FlashTerm {
  title: string;
  description: string;
}

export type FlashTermsSection = FlashTerm[];

export interface FlashFAQItem {
  question: string;
  answer: string;
}

export type FlashFAQSection = FlashFAQItem[];

export interface FlashFooterSection {
  thanks: string;
  followUp: string;
  disclaimer: string;
  validity: string;
  callToAction: string;
  contactInfo: string;
}

export type FlashSection =
  | FlashIntroductionSection
  | FlashAboutUsSection
  | FlashSpecialtiesSection
  | FlashStepsSection
  | FlashInvestmentSection
  | FlashTermsSection
  | FlashFAQSection
  | FlashFooterSection;

// Flash proposal interface extends base proposal
export interface FlashWorkflowResult {
  finalProposal: FlashProposal;
  sections: FlashSection[];
  metadata: {
    totalSections: number;
    executionTime: number;
    model: string;
    templateType: "flash";
    aiGenerated: boolean;
    fallbackUsed: boolean;
  };
}

export class FlashTemplateWorkflow {
  private model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";
  private sections: FlashSection[] = [];
  private fallbackUsed = false;

  async execute(data: FlashThemeData): Promise<FlashWorkflowResult> {
    const startTime = Date.now();

    try {
      const proposal = await this.generateFlashProposal(data);
      const executionTime = Date.now() - startTime;

      return {
        finalProposal: proposal,
        sections: this.sections,
        metadata: {
          totalSections: this.sections.length,
          executionTime,
          model: this.model,
          templateType: "flash",
          aiGenerated: true,
          fallbackUsed: this.fallbackUsed,
        },
      };
    } catch (error) {
      console.error("Flash Template Workflow Error:", error);
      throw error;
    }
  }

  private async generateFlashProposal(
    data: FlashThemeData
  ): Promise<FlashProposal> {
    console.log("Debug - generateFlashProposal called with:", data);

    // Get the appropriate agent
    const agent = await getAgentByServiceAndTemplate(
      data.selectedService,
      "flash"
    );
    console.log("Debug - Agent lookup result:", agent);

    if (!agent) {
      throw new Error(
        `No agent found for service: ${data.selectedService} and template: flash`
      );
    }

    // Generate all sections in parallel for better performance
    const [introduction, aboutUs, specialties, steps, investment, terms, faq] =
      await Promise.all([
        this.generateIntroduction(data, agent),
        this.generateAboutUs(data, agent),
        this.generateSpecialties(data, agent),
        this.generateSteps(data, agent),
        this.generateInvestment(data, agent),
        data.includeTerms
          ? this.generateTerms(data, agent)
          : Promise.resolve(undefined),
        data.includeFAQ
          ? this.generateFAQ(data, agent)
          : Promise.resolve(undefined),
      ]);

    // Collect sections for metadata
    this.sections = [
      introduction,
      aboutUs,
      specialties,
      steps,
      investment,
      ...(terms ? [terms] : []),
      ...(faq ? [faq] : []),
      this.generateFooter(data),
    ].filter(Boolean) as FlashSection[];

    return {
      introduction,
      aboutUs,
      specialties,
      steps,
      investment,
      ...(terms && { terms }),
      ...(faq && { faq }),
      footer: this.generateFooter(data),
    };
  }

  private async generateIntroduction(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashIntroductionSection> {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}

Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

Crie uma introdução impactante e personalizada para este projeto específico. 

Retorne APENAS um JSON válido com:
{
  "title": "Título focado no projeto de ${
    data.clientName
  } (máximo 60 caracteres)",
  "subtitle": "Subtítulo personalizado baseado no ${
    data.projectName
  } (máximo 100 caracteres)",
  "services": ["${agent.commonServices[0] || "Serviço 1"}", "${
      agent.commonServices[1] || "Serviço 2"
    }", "${agent.commonServices[2] || "Serviço 3"}", "${
      agent.commonServices[3] || "Serviço 4"
    }"],
  "validity": "${new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("pt-BR")}",
  "buttonText": "Iniciar Projeto"
}

Foque na linguagem natural e envolvente, evite jargões técnicos desnecessários.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashIntroductionSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return {
          title: `${agent.sector} Flash para ${data.projectName}`,
          subtitle: `Proposta flash personalizada para ${data.clientName}`,
          services: agent.commonServices.slice(0, 4) || [
            "Serviço 1",
            "Serviço 2",
            "Serviço 3",
            "Serviço 4",
          ],
          validity: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("pt-BR"),
          buttonText: "Iniciar Projeto Flash",
        };
      }

      return parsed;
    } catch (error) {
      console.error("Flash Introduction Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private async generateAboutUs(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashAboutUsSection> {
    // Generate unique prompt variations to avoid repetitive responses
    const promptVariations = [
      `Crie uma seção "Sobre Nós" única e personalizada para ${data.companyInfo} no projeto ${data.projectName} de ${data.clientName}.`,
      `Desenvolva uma apresentação exclusiva da ${data.companyInfo} focada no projeto ${data.projectName} para ${data.clientName}.`,
      `Elabore uma seção "Sobre Nós" diferenciada destacando como ${data.companyInfo} pode transformar o projeto ${data.projectName} de ${data.clientName}.`,
      `Construa uma apresentação personalizada da ${data.companyInfo} especificamente para o desafio ${data.projectName} de ${data.clientName}.`,
    ];

    const selectedVariation =
      promptVariations[Math.floor(Math.random() * promptVariations.length)];

    const userPrompt = `${selectedVariation}

Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

CONTEXTO ESPECÍFICO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}
- Expertise: ${agent.expertise.join(", ")}
- Serviços: ${agent.commonServices.join(", ")}

OBJETIVO: Criar conteúdo único, específico e persuasivo que conecte ${
      data.companyInfo
    } com as necessidades reais de ${data.clientName} no projeto ${
      data.projectName
    }.

Retorne APENAS um objeto JSON com:

{
  "title": "Título específico sobre ${data.companyInfo} e ${
      data.projectName
    } (máximo 155 caracteres)",
  "supportText": "Frase de apoio única para ${
    data.clientName
  } (máximo 70 caracteres)",
  "subtitle": "Descrição detalhada de como ${data.companyInfo} resolve ${
      data.projectName
    } para ${data.clientName} (máximo 250 caracteres)"
}

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

DIRETRIZES:
- Seja específico sobre ${data.projectName} e ${data.clientName}
- Evite frases genéricas como "somos especialistas" ou "nossa equipe"
- Use linguagem natural e persuasiva
- Destaque benefícios concretos e resultados mensuráveis
- Crie conexão emocional e comercial
- Responda APENAS com o JSON válido, sem explicações.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashAboutUsSection;

      try {
        parsed = JSON.parse(response);

        // Validate and trim character limits
        if (parsed.title && parsed.title.length > 155) {
          parsed.title = parsed.title.substring(0, 152) + "...";
        }
        if (parsed.supportText && parsed.supportText.length > 70) {
          parsed.supportText = parsed.supportText.substring(0, 67) + "...";
        }
        if (parsed.subtitle && parsed.subtitle.length > 250) {
          parsed.subtitle = parsed.subtitle.substring(0, 247) + "...";
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          title: `Especialistas em ${agent.sector} com Metodologia Flash`,
          supportText: "Entrega rápida e eficiente",
          subtitle: `Equipe experiente focada em resultados rápidos e eficientes para ${data.clientName}`,
        };
      }

      return parsed;
    } catch (error) {
      console.error("Flash About Us Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private async generateSpecialties(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashSpecialtiesSection> {
    const userPrompt = `PROJETO ESPECÍFICO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}

Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

Retorne JSON com:
{
  "title": "Título das especialidades para ${data.projectName} (40 chars)",
  "topics": [
    {
      "title": "Especialidade específica (50 chars)",
      "description": "Como ajuda o projeto ${data.projectName} (100 chars)"
    }
  ]
}

Foque em benefícios reais e linguagem natural, evite termos genéricos.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashSpecialtiesSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          title: "Especialidades Flash",
          topics: [
            {
              title: "Entrega Rápida",
              description: "Resultados em tempo recorde com qualidade superior",
            },
            {
              title: "Processo Otimizado",
              description: "Metodologia ágil para máxima eficiência",
            },
          ],
        };
      }

      return parsed;
    } catch (error) {
      console.error("Flash Specialties Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private async generateSteps(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashStepsSection> {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição do Projeto: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}

Crie uma seção "Processo" personalizada para o projeto ${data.projectName} de ${data.clientName}. Retorne APENAS um objeto JSON com:

{
  "introduction": "Introdução ao processo específico para ${data.projectName} (máximo 100 caracteres)",
  "title": "Nosso Processo",
  "topics": [
    {
      "title": "Etapa 1 específica para ${data.clientName} (máximo 40 caracteres)",
      "description": "Descrição da etapa 1 aplicada ao projeto ${data.projectName} (máximo 240 caracteres)"
    },
    {
      "title": "Etapa 2 específica para ${data.clientName} (máximo 40 caracteres)",
      "description": "Descrição da etapa 2 aplicada ao projeto ${data.projectName} (máximo 240 caracteres)"
    }
  ]
}

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: 
- Use as informações específicas do projeto: ${data.projectDescription}
- Personalize para o cliente: ${data.clientName}
- NÃO mencione "metodologia FLASH" ou termos genéricos
- Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashStepsSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          introduction: "Processo otimizado para máxima eficiência",
          title: "Nosso Processo Flash",
          topics: [
            {
              title: "Briefing Rápido",
              description:
                "Coleta de informações essenciais em tempo recorde para entender suas necessidades",
            },
            {
              title: "Execução Ágil",
              description:
                "Desenvolvimento e implementação com metodologias ágeis para entrega rápida",
            },
          ],
        };
      }

      return parsed;
    } catch (error) {
      console.error("Flash Steps Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private async generateInvestment(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashInvestmentSection> {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição do Projeto: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}
- Planos Selecionados: ${data.selectedPlans.join(", ")}

Crie uma seção "Investimento" personalizada para o projeto ${
      data.projectName
    } de ${data.clientName}. Retorne APENAS um objeto JSON com:

{
  "title": "Título da seção de investimento para ${
    data.projectName
  } (máximo 85 caracteres)",
  "deliverables": [
    {
      "title": "Entrega 1 específica para ${
        data.clientName
      } (máximo 30 caracteres)",
      "description": "Descrição da entrega 1 aplicada ao projeto ${
        data.projectName
      } (máximo 330 caracteres)"
    }
  ],
  "plans": [
    {
      "title": "Plano 1 para ${data.clientName} (máximo 20 caracteres)",
      "description": "Descrição do plano específico para ${
        data.projectName
      } (máximo 95 caracteres)",
      "value": "R$ 999",
      "topics": ["Benefício 1 específico", "Benefício 2 específico", "Benefício 3 específico"]
    }
  ]
}

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: 
- Use as informações específicas do projeto: ${data.projectDescription}
- Personalize para o cliente: ${data.clientName}
- Use os planos selecionados: ${data.selectedPlans.join(", ")}
- NÃO mencione "metodologia FLASH" ou termos genéricos
- Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashInvestmentSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          title: "Investimento Flash - Resultados Rápidos",
          deliverables: [
            {
              title: "Projeto Completo",
              description:
                "Solução completa entregue no prazo estabelecido com qualidade superior e metodologia Flash",
            },
          ],
          plans: [
            {
              title: "Flash Básico",
              description:
                "Solução essencial com entrega rápida e qualidade garantida",
              value: "R$ 999",
              topics: [
                "Entrega em 7 dias",
                "Suporte básico",
                "Revisões limitadas",
              ],
            },
          ],
        };
      }

      return parsed;
    } catch (error) {
      console.error("Flash Investment Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private async generateTerms(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTermsSection> {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição do Projeto: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}

Crie termos e condições personalizados para o projeto ${data.projectName} de ${data.clientName}. Retorne APENAS um array JSON com:

[
  {
    "title": "Prazo de Entrega para ${data.projectName} (máximo 30 caracteres)",
    "description": "Descrição do prazo específico para ${data.clientName} (máximo 180 caracteres)"
  },
  {
    "title": "Forma de Pagamento (máximo 30 caracteres)",
    "description": "Descrição do pagamento específico para ${data.projectName} (máximo 180 caracteres)"
  }
]

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: 
- Use as informações específicas do projeto: ${data.projectDescription}
- Personalize para o cliente: ${data.clientName}
- NÃO mencione "metodologia FLASH" ou termos genéricos
- Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashTermsSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return [
          {
            title: "Prazo de Entrega",
            description:
              "Entrega em até 15 dias úteis após aprovação e pagamento inicial",
          },
          {
            title: "Forma de Pagamento",
            description: "50% na aprovação e 50% na entrega final",
          },
        ];
      }

      return parsed;
    } catch (error) {
      console.error("Flash Terms Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private async generateFAQ(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashFAQSection> {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição do Projeto: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}

Crie perguntas frequentes personalizadas para o projeto ${data.projectName} de ${data.clientName}. Retorne APENAS um array JSON com:

[
  {
    "question": "Pergunta 1 específica para ${data.projectName} (máximo 100 caracteres)",
    "answer": "Resposta 1 personalizada para ${data.clientName} (máximo 280 caracteres)"
  },
  {
    "question": "Pergunta 2 específica para ${data.projectName} (máximo 100 caracteres)",
    "answer": "Resposta 2 personalizada para ${data.clientName} (máximo 280 caracteres)"
  }
]

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: 
- Use as informações específicas do projeto: ${data.projectDescription}
- Personalize para o cliente: ${data.clientName}
- NÃO mencione "metodologia FLASH" ou termos genéricos
- Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashFAQSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return [
          {
            question: "Qual é o prazo de entrega?",
            answer:
              "Com nossa metodologia Flash, entregamos em até 15 dias úteis após aprovação e pagamento inicial",
          },
          {
            question: "Como funciona o processo Flash?",
            answer:
              "Utilizamos metodologias ágeis e processos otimizados para máxima eficiência sem comprometer a qualidade",
          },
        ];
      }

      return parsed;
    } catch (error) {
      console.error("Flash FAQ Generation Error:", error);
      this.fallbackUsed = true;
      throw error;
    }
  }

  private generateFooter(data: FlashThemeData): FlashFooterSection {
    return {
      thanks: "Obrigado pela confiança!",
      followUp: "Vamos começar agora?",
      disclaimer: `Esta proposta é válida por 15 dias a partir da data de emissão. Entre em contato para esclarecer dúvidas ou solicitar ajustes. Nossa equipe está pronta para transformar sua visão em realidade com o projeto ${data.projectName} para ${data.clientName}.`,
      validity: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("pt-BR"),
      callToAction: "Iniciar Projeto",
      contactInfo: "Entre em contato para mais detalhes",
    };
  }

  private async runLLM(
    userPrompt: string,
    systemPrompt: string
  ): Promise<string> {
    try {
      // Log para debug - verificar se o system prompt está sendo aplicado
      console.log("🔍 Flash LLM Debug:");
      console.log(
        "- System Prompt (primeiros 100 chars):",
        systemPrompt.substring(0, 100) + "..."
      );
      console.log(
        "- User Prompt (primeiros 100 chars):",
        userPrompt.substring(0, 100) + "..."
      );

      const response = await client.chat.completions.create({
        model: this.model,
        max_tokens: 1500,
        temperature: 0.9, // High creativity for natural language
        top_p: 0.95, // High diversity
        frequency_penalty: 0.4, // Reduce repetitive phrases
        presence_penalty: 0.3, // Encourage topic diversity
        stop: ["```", "```json", "```JSON", "\n\n\n"],
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      });

      const result = response.choices[0]?.message?.content || "";
      console.log(
        "- Response (primeiros 100 chars):",
        result.substring(0, 100) + "..."
      );

      return result;
    } catch (error) {
      console.error("LLM API Error:", error);
      throw new Error("Failed to generate content with AI");
    }
  }
}
