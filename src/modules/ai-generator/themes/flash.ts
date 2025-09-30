import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { FlashProposal } from "../templates/flash/flash-template";
import { BaseThemeData } from "./base-theme";

function ensureCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function ensureString(value: unknown, field: string): string {
  ensureCondition(typeof value === "string", `${field} must be a string`);
  return value as string;
}

function ensureExactLength(
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

export interface FlashTeamSection {
  title: string;
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

export interface FlashScopeSection {
  content: string;
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

export interface FlashFaqItem {
  question: string;
  answer: string;
}

export type FlashFAQSection = FlashFaqItem[];

export interface FlashFooterSection {
  callToAction: string;
  disclaimer: string;
}

export type FlashSection =
  | FlashIntroductionSection
  | FlashAboutUsSection
  | FlashTeamSection
  | FlashSpecialtiesSection
  | FlashStepsSection
  | FlashScopeSection
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
    const [
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      terms,
      faq,
    ] = await Promise.all([
      this.generateIntroduction(data, agent),
      this.generateAboutUs(data, agent),
      this.generateTeam(data, agent),
      this.generateSpecialties(data, agent),
      this.generateSteps(data, agent),
      this.generateScope(data, agent),
      this.generateInvestment(data, agent),
      data.includeTerms
        ? this.generateTerms(data, agent)
        : Promise.resolve(undefined),
      this.generateFAQ(data, agent),
    ]);

    // Collect sections for metadata
    this.sections = [
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      ...(terms ? [terms] : []),
      faq,
      this.generateFooter(data),
    ].filter(Boolean) as FlashSection[];

    return {
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      ...(terms && { terms }),
      faq,
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

Crie uma introdução impactante e personalizada para este projeto específico seguindo rigorosamente os limites de caracteres.

Retorne APENAS um JSON válido com:
{
  "title": "Frase imperativa, inclusiva e direta com exatamente 60 caracteres",
  "subtitle": "Frase sobre benefício, transformação e lucro com exatamente 100 caracteres",
  "services": [
    "Serviço 1 com exatamente 30 caracteres",
    "Serviço 2 com exatamente 30 caracteres",
    "Serviço 3 com exatamente 30 caracteres",
    "Serviço 4 com exatamente 30 caracteres"
  ],
  "validity": "${new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("pt-BR")}",
  "buttonText": "Iniciar Projeto"
}

REGRAS CRÍTICAS:
- Cada serviço deve ter exatamente 30 caracteres
- NÃO mencione cliente, nome da empresa ou template
- Use linguagem natural, ativa e positiva
- Mantenha coerência com o setor ${agent.sector}
- Responda APENAS com JSON válido.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashIntroductionSection;

      ensureExactLength(parsed.title, 60, "introduction.title");
      ensureExactLength(parsed.subtitle, 100, "introduction.subtitle");
      ensureCondition(
        Array.isArray(parsed.services) && parsed.services.length === 4,
        "introduction.services must contain exactly 4 items"
      );
      parsed.services.forEach((service, index) =>
        ensureExactLength(service, 30, `introduction.services[${index}]`)
      );
      ensureCondition(
        Boolean(parsed.validity),
        "introduction.validity missing"
      );
      ensureCondition(
        Boolean(parsed.buttonText),
        "introduction.buttonText missing"
      );

      return parsed;
    } catch (error) {
      console.error("Flash Introduction Generation Error:", error);
      throw error;
    }
  }

  private async generateAboutUs(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashAboutUsSection> {
    // Normalize project name to prevent CAPS leakage
    const { cleanProjectNameForProposal } = await import(
      "../utils/project-name-handler"
    );
    const normalizedProjectName = cleanProjectNameForProposal(data.projectName);

    // Generate unique prompt variations to avoid repetitive responses
    const promptVariations = [
      `Crie uma seção "Sobre Nós" única e personalizada para nossa empresa no projeto ${normalizedProjectName} de ${data.clientName}.`,
      `Desenvolva uma apresentação exclusiva da nossa empresa focada no projeto ${normalizedProjectName} para ${data.clientName}.`,
      `Elabore uma seção "Sobre Nós" diferenciada destacando como nossa empresa pode transformar o projeto ${normalizedProjectName} de ${data.clientName}.`,
      `Construa uma apresentação personalizada da nossa empresa especificamente para o desafio ${normalizedProjectName} de ${data.clientName}.`,
    ];

    const selectedVariation =
      promptVariations[Math.floor(Math.random() * promptVariations.length)];

    const userPrompt = `${selectedVariation}

Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

CONTEXTO ESPECÍFICO:
- Cliente: ${data.clientName}
- Projeto: ${normalizedProjectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}
- Expertise: ${agent.expertise.join(", ")}
- Serviços: ${agent.commonServices.join(", ")}

OBJETIVO: Criar conteúdo único, específico e persuasivo que conecte nossa empresa com as necessidades reais do cliente.

Retorne APENAS um objeto JSON com:
{
  "title": "Frase com transformação, valor e lucro, exatamente 155 caracteres",
  "supportText": "Frase de apoio que gera proximidade, exatamente 70 caracteres",
  "subtitle": "Descrição que evidencie impacto positivo sem citar cliente, exatamente 250 caracteres"
}

REGRAS CRÍTICAS:
- Proibido citar cliente ou empresa nominalmente
- Foque em transformação, impacto e lucro
- Use linguagem natural, próxima e confiante
- Responda APENAS com o JSON válido.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashAboutUsSection;

      ensureExactLength(parsed.title, 155, "aboutUs.title");
      ensureExactLength(parsed.supportText, 70, "aboutUs.supportText");
      ensureExactLength(parsed.subtitle, 250, "aboutUs.subtitle");

      return parsed;
    } catch (error) {
      console.error("Flash About Us Generation Error:", error);
      throw error;
    }
  }

  private async generateSpecialties(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashSpecialtiesSection> {
    // Normalize project name to prevent CAPS leakage
    const { cleanProjectNameForProposal } = await import(
      "../utils/project-name-handler"
    );
    const normalizedProjectName = cleanProjectNameForProposal(data.projectName);

    const userPrompt = `PROJETO ESPECÍFICO:
- Cliente: ${data.clientName}
- Projeto: ${normalizedProjectName}
- Descrição: ${data.projectDescription}
- Empresa: ${data.companyInfo}

Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

Retorne JSON com:
{
  "title": "Título com autoridade e resultados, exatamente 140 caracteres",
  "topics": [
    {
      "title": "Especialidade específica com exatamente 50 caracteres",
      "description": "Como ajuda o projeto com exatamente 100 caracteres"
    }
  ]
}

IMPORTANTE:
- Gere entre 6 e 9 especialidades
- Proibido citar cliente ou template
- Foque em resultados mensuráveis e autoridade
- Linguagem natural, ativa e humanizada
- Responda somente com JSON.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashSpecialtiesSection;

      ensureExactLength(parsed.title, 140, "specialties.title");
      ensureCondition(
        Array.isArray(parsed.topics) &&
          parsed.topics.length >= 6 &&
          parsed.topics.length <= 9,
        "specialties.topics must contain between 6 and 9 items"
      );
      parsed.topics.forEach((topic, index) => {
        ensureExactLength(
          topic.title,
          50,
          `specialties.topics[${index}].title`
        );
        ensureExactLength(
          topic.description,
          100,
          `specialties.topics[${index}].description`
        );
      });

      return parsed;
    } catch (error) {
      console.error("Flash Specialties Generation Error:", error);
      throw error;
    }
  }

  private async generateSteps(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashStepsSection> {
    // Normalize project name to prevent CAPS leakage
    const { cleanProjectNameForProposal } = await import(
      "../utils/project-name-handler"
    );
    const normalizedProjectName = cleanProjectNameForProposal(data.projectName);

    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${normalizedProjectName}
- Descrição do Projeto: ${data.projectDescription}
- Empresa: ${data.companyInfo}
- Setor: ${agent.sector}

Crie uma seção "Processo" personalizada para o projeto ${normalizedProjectName}. Retorne APENAS um objeto JSON com:

{
  "introduction": "Introdução com exatamente 100 caracteres",
  "title": "Nosso Processo",
  "topics": [
    {
      "title": "Etapa com exatamente 40 caracteres",
      "description": "Descrição com exatamente 240 caracteres"
    }
  ]
}

IMPORTANTE:
- Gere exatamente 5 etapas
- Proibido citar cliente, nome da empresa ou metodologia
- Foque em clareza, impacto e lucro
- Linguagem natural, ativa e próxima
- Responda apenas com JSON.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashStepsSection;

      ensureExactLength(parsed.introduction, 100, "steps.introduction");
      ensureExactLength(parsed.title, 12, "steps.title");
      ensureCondition(
        Array.isArray(parsed.topics) && parsed.topics.length === 5,
        "steps.topics must contain exactly 5 items"
      );
      parsed.topics.forEach((topic, index) => {
        ensureExactLength(topic.title, 40, `steps.topics[${index}].title`);
        ensureExactLength(
          topic.description,
          240,
          `steps.topics[${index}].description`
        );
      });

      return parsed;
    } catch (error) {
      console.error("Flash Steps Generation Error:", error);
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
  "title": "Título da seção de investimento com exatamente 85 caracteres",
  "deliverables": [
    {
      "title": "Entrega específica para ${
        data.projectName
      } (máximo 30 caracteres)",
      "description": "Descrição aplicada ao projeto com até 330 caracteres"
    }
  ],
  "plans": [
    {
      "title": "Plano com exatamente 20 caracteres",
      "description": "Descrição imperativa com call to action, exatamente 95 caracteres",
      "value": "R$X.XXX",
      "topics": ["Benefício com até 45 caracteres"]
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
      const parsed = JSON.parse(response) as FlashInvestmentSection;

      ensureExactLength(parsed.title, 85, "investment.title");
      ensureCondition(
        Array.isArray(parsed.deliverables) && parsed.deliverables.length > 0,
        "investment.deliverables must include at least one item"
      );
      parsed.deliverables.forEach((deliverable, index) => {
        ensureCondition(
          Boolean(deliverable.title),
          `investment.deliverables[${index}].title missing`
        );
        ensureCondition(
          Boolean(deliverable.description),
          `investment.deliverables[${index}].description missing`
        );
      });
      ensureCondition(
        Array.isArray(parsed.plans) && parsed.plans.length > 0,
        "investment.plans must include at least one item"
      );
      parsed.plans.forEach((plan, index) => {
        ensureExactLength(plan.title, 20, `investment.plans[${index}].title`);
        ensureExactLength(
          plan.description,
          95,
          `investment.plans[${index}].description`
        );
        ensureCondition(
          Boolean(plan.value),
          `investment.plans[${index}].value missing`
        );
        ensureCondition(
          Array.isArray(plan.topics) &&
            plan.topics.length >= 3 &&
            plan.topics.length <= 6,
          `investment.plans[${index}].topics must contain 3 to 6 items`
        );
        plan.topics.forEach((topic, topicIndex) =>
          ensureCondition(
            topic.length <= 45,
            `investment.plans[${index}].topics[${topicIndex}] must have up to 45 characters`
          )
        );
      });

      return parsed;
    } catch (error) {
      console.error("Flash Investment Generation Error:", error);
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
      const parsed = JSON.parse(response) as FlashTermsSection;

      return parsed;
    } catch (error) {
      console.error("Flash Terms Generation Error:", error);
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

Crie 10 perguntas frequentes personalizadas. Retorne APENAS um array JSON com:
[
  {
    "question": "Pergunta com exatamente 100 caracteres",
    "answer": "Resposta empática com exatamente 300 caracteres"
  }
]

REGRAS CRÍTICAS:
- Gere exatamente 10 itens
- Proibido citar cliente, empresa, metodologia ou template
- Linguagem acolhedora, segura e orientada a resultados
- Responda somente com JSON.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashFAQSection;

      ensureCondition(
        Array.isArray(parsed) && parsed.length === 10,
        "faq must contain exactly 10 items"
      );
      parsed.forEach((item, index) => {
        ensureExactLength(item.question, 100, `faq[${index}].question`);
        ensureExactLength(item.answer, 300, `faq[${index}].answer`);
      });

      return parsed;
    } catch (error) {
      console.error("Flash FAQ Generation Error:", error);
      throw error;
    }
  }

  private async generateTeam(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTeamSection> {
    const userPrompt = `Responda APENAS com JSON válido.

Crie o título da seção "Time" com exatamente 55 caracteres.
- Linguagem inclusiva, calorosa e confiante
- Foque em parceria, proximidade e evolução
- Proibido mencionar cliente, empresa ou metodologia

Retorne:
{
  "title": "Frase com exatamente 55 caracteres"
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashTeamSection;

      ensureExactLength(parsed.title, 55, "team.title");

      return parsed;
    } catch (error) {
      console.error("Flash Team Generation Error:", error);
      throw error;
    }
  }

  private async generateScope(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashScopeSection> {
    const userPrompt = `Responda somente com JSON válido.

Crie o conteúdo da seção "Escopo do Projeto" com exatamente 350 caracteres.
- Integre benefícios do investimento e entregas principais
- Proibido citar cliente, empresa ou metodologia
- Foque em transformação, crescimento e previsibilidade
- Linguagem natural, ativa e confiante

Retorne:
{
  "content": "Texto com exatamente 350 caracteres"
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashScopeSection;

      ensureExactLength(parsed.content, 350, "scope.content");

      return parsed;
    } catch (error) {
      console.error("Flash Scope Generation Error:", error);
      throw error;
    }
  }

  private generateFooter(data: FlashThemeData): FlashFooterSection {
    console.log("Flash footer generated for", data.projectName);
    return {
      callToAction: "",
      disclaimer: "",
    } as FlashFooterSection;
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
