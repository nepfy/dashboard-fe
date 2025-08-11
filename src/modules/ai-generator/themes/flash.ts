import assert from "node:assert";
import Together from "together-ai";
import { getAgentByService, type AgentConfig } from "../agents";
import {
  getFlashAgentByService,
  type FlashAgentConfig,
} from "../templates/flash/agent";

// Initialize TogetherAI client with proper error handling
const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });

export interface FlashTemplateData {
  selectedService: string;
  companyInfo: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  selectedPlans: string[];
  planDetails: string;
  includeTerms: boolean;
  includeFAQ: boolean;
  templateType: "flash";
  mainColor?: string;
}

export interface FlashSection {
  id: string;
  name: string;
  content: string;
  editable: boolean;
  aiGenerated: boolean;
  characterLimit?: number;
  visible: boolean;
}

export interface FlashProposal {
  // Introduction Section
  introduction: {
    title: string; // 60 chars, AI-generated
    subtitle: string; // 100 chars, AI-generated
    services: string[]; // 4 max, 30 chars each, AI-generated
    validity: string; // Not editable
    buttonText: string; // 20 chars, no AI
  };

  // About Us Section
  aboutUs: {
    title: string; // 155 chars, AI-generated
    supportText: string; // 70 chars, AI-generated
    subtitle: string; // 250 chars, AI-generated
  };

  // Specialties Section
  specialties: {
    title: string; // 40 chars, AI-generated
    topics: Array<{
      title: string; // 50 chars
      description: string; // 100 chars
    }>; // 9 max
  };

  // Process Steps Section
  steps: {
    introduction: string; // 100 chars, AI-generated
    title: string; // Fixed, not editable
    topics: Array<{
      title: string; // 40 chars
      description: string; // 240 chars
    }>; // 5 max, AI-generated
  };

  // Investment Section
  investment: {
    title: string; // 85 chars, AI-generated
    deliverables: Array<{
      title: string; // 30 chars
      description: string; // 330 chars
    }>;
    plans: Array<{
      title: string; // 20 chars
      description: string; // 95 chars
      value: string; // 11 chars
      topics: string[]; // 6 max, 45 chars each
    }>; // 3 max, AI-generated
  };

  // Terms and Conditions (optional)
  terms?: Array<{
    title: string; // 30 chars
    description: string; // 180 chars
  }>;

  // FAQ (optional)
  faq?: Array<{
    question: string; // 100 chars
    answer: string; // 300 chars
  }>;

  // Footer
  footer: {
    thanks: string; // 30 chars, no AI
    followUp: string; // 35 chars, AI-generated
    disclaimer: string; // 330 chars, AI-generated
    validity: string; // Not editable
  };
}

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

  async execute(data: FlashTemplateData): Promise<FlashWorkflowResult> {
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
      console.error("FLASH Workflow Error:", error);
      throw error;
    }
  }

  async generateTemplateProposal(
    data: FlashTemplateData
  ): Promise<FlashWorkflowResult> {
    const startTime = Date.now();

    try {
      const proposal = await this.generateFlashProposal(data);
      const executionTime = Date.now() - startTime;

      return {
        finalProposal: proposal,
        sections: [
          {
            id: "template-generation",
            name: "Geração por Template",
            content: "Proposta gerada usando templates especializados FLASH",
            editable: true,
            aiGenerated: true,
            visible: true,
          },
        ],
        metadata: {
          totalSections: 1,
          executionTime,
          model: this.model,
          templateType: "flash",
          aiGenerated: true,
          fallbackUsed: this.fallbackUsed,
        },
      };
    } catch (error) {
      console.error("Flash Template Generation Error:", error);
      throw error;
    }
  }

  private async generateFlashProposal(
    data: FlashTemplateData
  ): Promise<FlashProposal> {
    // First try to get a flash-specific agent
    let agent = getFlashAgentByService(data.selectedService);

    // Fallback to generic agent if no flash-specific agent found
    if (!agent) {
      agent = getAgentByService(data.selectedService);
    }

    if (!agent) {
      throw new Error(`Agent not found for service: ${data.selectedService}`);
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

    return {
      introduction,
      aboutUs,
      specialties,
      steps,
      investment,
      ...(terms && { terms }),
      ...(faq && { faq }),
      footer: this.generateFooter(data, agent),
    };
  }

  private async generateIntroduction(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}
${
  "flashSpecific" in agent && agent.flashSpecific
    ? `- Metodologia FLASH: ${agent.flashSpecific.introductionStyle}`
    : ""
}

Crie uma seção de introdução para proposta FLASH. Retorne APENAS um objeto JSON com:

{
  "title": "Título focado no projeto (máximo 60 caracteres)",
  "subtitle": "Subtítulo personalizado para ${
    data.clientName
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

IMPORTANTE: Responda APENAS com o JSON, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return {
          title: `${agent.sector} para ${data.projectName}`,
          subtitle: `Proposta personalizada para ${data.clientName}`,
          services: agent.commonServices.slice(0, 4),
          validity: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("pt-BR"),
          buttonText: "Iniciar Projeto",
        };
      }

      return {
        title: parsed.title || `${agent.sector} para ${data.projectName}`,
        subtitle:
          parsed.subtitle || `Proposta personalizada para ${data.clientName}`,
        services: parsed.services || agent.commonServices.slice(0, 4),
        validity: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("pt-BR"),
        buttonText: "Iniciar Projeto",
      };
    } catch (error) {
      console.error("Introduction Generation Error:", error);
      throw error;
    }
  }

  private async generateAboutUs(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}
- Empresa: ${data.companyInfo}
${
  "flashSpecific" in agent && agent.flashSpecific
    ? `- Foco FLASH: ${agent.flashSpecific.aboutUsFocus}`
    : ""
}

Crie uma seção "Sobre Nós" para proposta FLASH. Retorne APENAS um objeto JSON com:

{
  "title": "Título destacando expertise em ${
    agent.sector
  } (máximo 155 caracteres)",
  "supportText": "Frase motivacional sobre transformação de ideias (máximo 70 caracteres)",
  "subtitle": "Apresentação da empresa ${
    data.companyInfo ? "baseada em: " + data.companyInfo : ""
  } (máximo 250 caracteres)"
}

IMPORTANTE: Responda APENAS com o JSON, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return {
          title: `${agent.name} - Especialistas em ${agent.sector}`,
          supportText: "Transformamos ideias em realidade com excelência",
          subtitle: data.companyInfo,
        };
      }

      return {
        title:
          parsed.title || `${agent.name} - Especialistas em ${agent.sector}`,
        supportText:
          parsed.supportText ||
          "Transformamos ideias em realidade com excelência",
        subtitle: parsed.subtitle || data.companyInfo,
      };
    } catch (error) {
      console.error("AboutUs Generation Error:", error);
      throw error;
    }
  }

  private async generateSpecialties(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}
${
  "flashSpecific" in agent && agent.flashSpecific
    ? `- Abordagem FLASH: ${agent.flashSpecific.specialtiesApproach}`
    : ""
}

Crie uma seção de especialidades para proposta FLASH. Retorne APENAS um objeto JSON com:

{
  "title": "Especialidades em ${agent.sector} (máximo 40 caracteres)",
  "topics": [
    {
      "title": "${
        agent.expertise[0] || "Especialidade 1"
      } (máximo 50 caracteres)",
      "description": "Descrição da especialidade com foco em resultados (máximo 100 caracteres)"
    },
    {
      "title": "${
        agent.expertise[1] || "Especialidade 2"
      } (máximo 50 caracteres)",
      "description": "Descrição da especialidade com foco em resultados (máximo 100 caracteres)"
    },
    {
      "title": "${
        agent.expertise[2] || "Especialidade 3"
      } (máximo 50 caracteres)",
      "description": "Descrição da especialidade com foco em resultados (máximo 100 caracteres)"
    }
  ]
}

IMPORTANTE: Responda APENAS com o JSON, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return {
          title: `Nossas Especialidades em ${agent.sector}`,
          topics: this.generateSpecialtiesFromAgent(agent),
        };
      }

      return {
        title: parsed.title || `Nossas Especialidades em ${agent.sector}`,
        topics: parsed.topics || this.generateSpecialtiesFromAgent(agent),
      };
    } catch (error) {
      console.error("Specialties Generation Error:", error);
      throw error;
    }
  }

  private async generateSteps(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}
${
  "flashSpecific" in agent && agent.flashSpecific
    ? `- Ênfase FLASH: ${agent.flashSpecific.processEmphasis}`
    : ""
}

TAREFA: Crie uma seção de passos do processo para proposta FLASH incluindo:

1. **Introduction**: Máximo 100 caracteres
2. **Title**: "Como Trabalhamos" (fixo)
3. **Topics**: Máximo 5 passos, cada um com:
   - Título: máximo 40 caracteres
   - Descrição: máximo 240 caracteres

Use a estrutura do agente: ${agent.proposalStructure.join(" → ")}.

Formato JSON:
{
  "introduction": "string (100 chars max)",
  "topics": [
    {
      "title": "string (40 chars max)",
      "description": "string (240 chars max)"
    }
  ]
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return {
          introduction:
            "Nosso processo estruturado garante qualidade e eficiência",
          title: "Como Trabalhamos",
          topics: this.generateStepsFromAgent(agent),
        };
      }

      return {
        introduction:
          parsed.introduction ||
          "Nosso processo estruturado garante qualidade e eficiência",
        title: "Como Trabalhamos",
        topics: parsed.topics || this.generateStepsFromAgent(agent),
      };
    } catch (error) {
      console.error("Steps Generation Error:", error);
      throw error;
    }
  }

  private async generateInvestment(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Planos: ${data.selectedPlans.join(", ")}
- Detalhes: ${data.planDetails}
- Setor: ${agent.sector}
${
  "flashSpecific" in agent && agent.flashSpecific
    ? `- Estratégia FLASH: ${agent.flashSpecific.investmentStrategy}`
    : ""
}

TAREFA: Crie uma seção de investimento para proposta FLASH incluindo:

1. **Title**: Máximo 85 caracteres
2. **Deliverables**: 4 entregáveis principais
3. **Plans**: ${data.selectedPlans.length} planos com preços realistas

Use o modelo de precificação: ${agent.pricingModel}.
Serviços: ${agent.commonServices.join(", ")}.

Formato JSON:
{
  "title": "string (85 chars max)",
  "deliverables": [
    {
      "title": "string (30 chars max)",
      "description": "string (330 chars max)"
    }
  ],
  "plans": [
    {
      "title": "string (20 chars max)",
      "description": "string (95 chars max)",
      "value": "string (11 chars max)",
      "topics": ["string (45 chars max)", "string (45 chars max)", "string (45 chars max)"]
    }
  ]
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return {
          title: `Investimento Personalizado para ${data.projectName}`,
          deliverables: this.generateDeliverablesFromAgent(
            agent,
            data.projectDescription
          ),
          plans: this.generatePlansFromAgent(
            agent,
            data.selectedPlans,
            data.planDetails
          ),
        };
      }

      return {
        title:
          parsed.title || `Investimento Personalizado para ${data.projectName}`,
        deliverables:
          parsed.deliverables ||
          this.generateDeliverablesFromAgent(agent, data.projectDescription),
        plans:
          parsed.plans ||
          this.generatePlansFromAgent(
            agent,
            data.selectedPlans,
            data.planDetails
          ),
      };
    } catch (error) {
      console.error("Investment Generation Error:", error);
      throw error;
    }
  }

  private async generateTerms(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}

TAREFA: Crie termos e condições para proposta FLASH incluindo:

Máximo 8 termos, cada um com:
- Título: máximo 30 caracteres
- Descrição: máximo 180 caracteres

Use linguagem clara e específica do setor ${agent.sector}.

Formato JSON:
{
  "terms": [
    {
      "title": "string (30 chars max)",
      "description": "string (180 chars max)"
    }
  ]
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return this.generateTermsFromAgent(agent);
      }

      return parsed.terms || this.generateTermsFromAgent(agent);
    } catch (error) {
      console.error("Terms Generation Error:", error);
      throw error;
    }
  }

  private async generateFAQ(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    const userPrompt = `DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${agent.sector}

TAREFA: Crie perguntas frequentes para proposta FLASH incluindo:

Máximo 6 perguntas, cada uma com:
- Pergunta: máximo 100 caracteres
- Resposta: máximo 300 caracteres

Use serviços comuns: ${agent.commonServices.join(", ")}.

Formato JSON:
{
  "faq": [
    {
      "question": "string (100 chars max)",
      "answer": "string (300 chars max)"
    }
  ]
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        // Fallback to default values if JSON parsing fails
        return this.generateFAQFromAgent(agent);
      }

      return parsed.faq || this.generateFAQFromAgent(agent);
    } catch (error) {
      console.error("FAQ Generation Error:", error);
      throw error;
    }
  }

  private generateFooter(
    data: FlashTemplateData,
    agent: AgentConfig | FlashAgentConfig
  ) {
    return {
      thanks: "Obrigado pela confiança!",
      followUp: "Vamos conversar sobre seu projeto?",
      disclaimer: `Esta proposta foi elaborada especialmente para ${data.clientName} e o projeto ${data.projectName}. Estamos à disposição para esclarecer dúvidas, ajustar detalhes ou discutir alternativas que melhor atendam às suas necessidades. Entre em contato conosco para iniciarmos esta parceria de sucesso.`,
      validity: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("pt-BR"),
    };
  }

  private async runLLM(
    userPrompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const messages: { role: "system" | "user"; content: string }[] = [];

    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }

    messages.push({ role: "user", content: userPrompt });

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.3, // Lower temperature for more consistent JSON output
        max_tokens: 1500, // Reduced for faster responses
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      });

      const content = response.choices[0].message?.content;
      assert(typeof content === "string");

      // Extract JSON from the response if it's wrapped in text
      return this.extractJSONFromResponse(content);
    } catch (error: any) {
      if (error.status === 429) {
        // Rate limit exceeded - wait and retry once
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

        const retryResponse = await client.chat.completions.create({
          model: this.model,
          messages,
          temperature: 0.3,
          max_tokens: 1500,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        });

        const retryContent = retryResponse.choices[0].message?.content;
        assert(typeof retryContent === "string");
        return this.extractJSONFromResponse(retryContent);
      }
      throw error;
    }
  }

  private extractJSONFromResponse(response: string): string {
    // Try to find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    // If no JSON found, return the original response
    return response;
  }

  private generateSpecialtiesFromAgent(agent: AgentConfig | FlashAgentConfig) {
    return agent.expertise.slice(0, 9).map((expertise: string) => ({
      title: expertise,
      description: `Especialização em ${expertise.toLowerCase()} com foco em resultados mensuráveis e qualidade profissional`,
    }));
  }

  private generateStepsFromAgent(agent: AgentConfig | FlashAgentConfig) {
    return agent.proposalStructure.slice(0, 5).map((step: string) => ({
      title: step,
      description: `${step}: Etapa fundamental do nosso processo especializado em ${agent.sector.toLowerCase()}, garantindo qualidade e eficiência em cada detalhe do projeto`,
    }));
  }

  private generateDeliverablesFromAgent(
    agent: AgentConfig | FlashAgentConfig,
    projectDescription: string
  ) {
    return agent.commonServices.slice(0, 4).map((service: string) => ({
      title: service,
      description: `${service} desenvolvido com expertise em ${agent.sector.toLowerCase()}, incluindo todas as especificações técnicas e melhores práticas do mercado para garantir resultados superiores`,
    }));
  }

  private generatePlansFromAgent(
    agent: AgentConfig | FlashAgentConfig,
    selectedPlans: string[],
    planDetails: string
  ) {
    const pricingMap = {
      "monthly-retainer": { basic: "R$ 2.500/mês", premium: "R$ 4.500/mês" },
      "project-based": { basic: "R$ 3.500", premium: "R$ 6.500" },
      "hourly-or-project": { basic: "R$ 4.000", premium: "R$ 7.500" },
      "project-percentage": { basic: "R$ 5.000", premium: "R$ 9.000" },
      "session-based": { basic: "R$ 1.500", premium: "R$ 2.800" },
      "consultation-based": { basic: "R$ 300", premium: "R$ 500" },
    };

    const pricing =
      pricingMap[agent.pricingModel as keyof typeof pricingMap] ||
      pricingMap["project-based"];

    return [
      {
        title: "Básico",
        description: "Ideal para começar com qualidade profissional",
        value: pricing.basic,
        topics: agent.commonServices
          .slice(0, 3)
          .concat(["Suporte básico", "Entrega padrão"]),
      },
      {
        title: "Premium",
        description: "Solução completa com todos os benefícios",
        value: pricing.premium,
        topics: agent.commonServices
          .slice(0, 4)
          .concat(["Suporte prioritário", "Consultoria especializada"]),
      },
    ];
  }

  private generateTermsFromAgent(agent: AgentConfig | FlashAgentConfig) {
    const pricingTerms = {
      "monthly-retainer":
        "Pagamento mensal recorrente com fidelidade mínima de 6 meses",
      "project-based": "50% na aprovação e 50% na entrega final do projeto",
      "hourly-or-project":
        "Pagamento conforme horas trabalhadas ou valor fixo do projeto",
      "session-based": "Pagamento integral antes da realização da sessão",
      "consultation-based": "Pagamento no ato da consulta ou procedimento",
    };

    return [
      {
        title: "Prazo de Execução",
        description: `Projeto executado conforme cronograma especializado em ${agent.sector}, com início após aprovação e documentação necessária`,
      },
      {
        title: "Forma de Pagamento",
        description:
          pricingTerms[agent.pricingModel as keyof typeof pricingTerms] ||
          "Condições de pagamento conforme acordo",
      },
      {
        title: "Escopo dos Serviços",
        description: `Serviços incluem: ${agent.commonServices
          .slice(0, 3)
          .join(", ")} conforme especificações técnicas do setor`,
      },
      {
        title: "Propriedade e Direitos",
        description: `Direitos transferidos conforme padrões do setor ${agent.sector} após pagamento integral e entrega aprovada`,
      },
    ];
  }

  private generateFAQFromAgent(agent: AgentConfig | FlashAgentConfig) {
    const faqTemplates = {
      marketing: [
        {
          question: "Quanto tempo leva para ver resultados nas campanhas?",
          answer: `Resultados iniciais aparecem entre 30-60 dias. Campanhas pagas mostram resultados mais rápidos, enquanto ${
            agent.keyTerms.includes("SEO") ? "SEO" : "estratégias orgânicas"
          } requerem mais tempo para maturação completa.`,
        },
        {
          question: "Como vocês medem o ROI das campanhas?",
          answer: `Utilizamos métricas como ${agent.keyTerms
            .slice(0, 4)
            .join(
              ", "
            )} para acompanhar performance e garantir retorno sobre investimento mensurável.`,
        },
      ],
      design: [
        {
          question: "Quantas revisões estão incluídas no projeto?",
          answer:
            "Incluímos até 3 rodadas de revisões sem custo adicional. Nosso processo colaborativo com briefing detalhado minimiza necessidade de alterações.",
        },
        {
          question: "Qual o prazo para desenvolvimento da identidade visual?",
          answer: `Projetos de ${agent.sector.toLowerCase()} levam entre 15-30 dias úteis, seguindo nossa metodologia: ${agent.proposalStructure
            .slice(0, 3)
            .join(" → ")}.`,
        },
      ],
    };

    const serviceFaq =
      faqTemplates[agent.selectedService as keyof typeof faqTemplates];

    if (serviceFaq) {
      return serviceFaq;
    }

    return [
      {
        question: `Qual o prazo para projetos de ${agent.sector}?`,
        answer: `Prazos variam conforme complexidade, mas seguimos nossa metodologia estruturada: ${agent.proposalStructure
          .slice(0, 3)
          .join(" → ")}, garantindo qualidade e pontualidade.`,
      },
      {
        question: "Como funciona o acompanhamento do projeto?",
        answer: `Oferecemos acompanhamento especializado em ${agent.sector.toLowerCase()} com relatórios regulares e comunicação direta durante todo o processo.`,
      },
      {
        question: "Que tipo de suporte oferecem após a entrega?",
        answer: `Incluímos 30 dias de suporte especializado em ${agent.sector.toLowerCase()} para ajustes, dúvidas e orientações sobre os entregáveis.`,
      },
    ];
  }
}
