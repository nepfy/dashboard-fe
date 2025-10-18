import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { FlashProposal } from "../templates/flash/flash-template";
import { BaseThemeData } from "./base-theme";
import { generateJSONRetryPrompt } from "./json-utils";
import { MOAService } from "../services/moa-service";

function ensureCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export interface FlashThemeData extends BaseThemeData {
  templateType: "flash";
  mainColor: string;
}

export class FlashTheme {
  private sections: FlashSection[] = [];
  private moaService: MOAService;

  constructor(private together: Together) {
    this.moaService = new MOAService(together, {
      referenceModels: [
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "deepseek-ai/DeepSeek-V3.1",
        "Qwen/Qwen2.5-7B-Instruct-Turbo",
      ],
      aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      maxRetries: 2,
      temperature: 0.7,
      maxTokens: 2000,
    });
  }

  async generateFlashProposal(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashProposal> {
    console.log("Debug - generateFlashProposal called with:", data);

    const [
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      results,
      testimonials,
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
      this.generateResults(data, agent),
      this.generateTestimonials(data, agent),
      data.includeTerms
        ? this.generateTerms(data, agent)
        : Promise.resolve(undefined),
      data.includeFAQ
        ? this.generateFAQ(data, agent)
        : Promise.resolve(this.getFallbackFAQ()),
    ]);

    // Collect sections for metadata
    this.sections = [];

    return {
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      results,
      testimonials,
      ...(terms ? { terms: [terms] } : {}),
      faq: faq || [],
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
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Crie uma introdução impactante e personalizada para este projeto específico seguindo rigorosamente os limites de caracteres.

Retorne APENAS um JSON válido com:
{
  "title": "Frase imperativa, inclusiva e direta com exatamente 60 caracteres",
  "subtitle": "Frase que reforça benefício, transformação e lucro com exatamente 100 caracteres",
  "services": [
    "Serviço 1 com exatamente 30 caracteres",
    "Serviço 2 com exatamente 30 caracteres", 
    "Serviço 3 com exatamente 30 caracteres",
    "Serviço 4 com exatamente 30 caracteres"
  ],
  "validity": "31/10/2025",
  "buttonText": "Iniciar Projeto"
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 60 caracteres
- subtitle: EXATAMENTE 100 caracteres  
- services: EXATAMENTE 4 itens, cada um com EXATAMENTE 30 caracteres
- Use linguagem imperativa e inclusiva
- Foque em benefícios, transformação e lucro
- NÃO mencione o nome do cliente nos textos
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "title": "string (exactly 60 characters)",
  "subtitle": "string (exactly 100 characters)",
  "services": ["string (30 chars)", "string (30 chars)", "string (30 chars)", "string (30 chars)"],
  "validity": "string",
  "buttonText": "string"
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashIntroductionSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Introduction generated successfully");
        return {
          userName: data.userName,
          email: data.userEmail || "",
          title: moaResult.result.title,
          subtitle: moaResult.result.subtitle,
          services: moaResult.result.services,
          validity: moaResult.result.validity,
          buttonText: moaResult.result.buttonText,
        };
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashIntroductionSection;

      return {
        userName: data.userName,
        email: data.userEmail || "",
        title: parsed.title,
        subtitle: parsed.subtitle,
        services: parsed.services,
        validity: parsed.validity,
        buttonText: parsed.buttonText,
      };
    } catch (error) {
      console.error("Flash Introduction Generation Error:", error);
      throw error;
    }
  }

  private async generateAboutUs(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashAboutUsSection> {
    const userPrompt = `Crie uma seção "Sobre Nós" única e personalizada para nossa empresa no projeto ${
      data.projectName
    } de ${data.clientName}.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON válido com:
{
  "title": "Título que mostra transformação, valor e benefício com exatamente 155 caracteres",
  "supportText": "Texto de apoio com exatamente 70 caracteres",
  "subtitle": "Subtítulo detalhado com exatamente 250 caracteres"
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 155 caracteres
- supportText: EXATAMENTE 70 caracteres
- subtitle: EXATAMENTE 250 caracteres
- Foque em transformação, impacto e lucro
- Use linguagem natural, próxima e confiante
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "title": "string (exactly 155 characters)",
  "supportText": "string (exactly 70 characters)",
  "subtitle": "string (exactly 250 characters)"
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashAboutUsSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA AboutUs generated successfully");
        return moaResult.result;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashAboutUsSection;

      return {
        title: parsed.title,
        supportText: parsed.supportText,
        subtitle: parsed.subtitle,
      };
    } catch (error) {
      console.error("Flash About Us Generation Error:", error);
      throw error;
    }
  }

  private async generateTeam(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTeamSection> {
    const userPrompt = `Responda APENAS com JSON válido. Crie o título da seção "Time" (máximo 60 caracteres):
- Linguagem: Português brasileiro
- Tom: Empático, moderno, acessível, profissional e impactante
- Foco: Mostrar dedicação, proximidade e confiança
- Use primeira pessoa do plural

Retorne APENAS:
{
  "title": "Título que mostra dedicação, proximidade e confiança"
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashTeamSection;

      return {
        title: parsed.title,
        members: [
          {
            id: crypto.randomUUID(),
            name: "John Doe",
            role: "CEO",
            image: "/images/templates/flash/placeholder.png",
            hideMember: false,
            sortOrder: 0,
          },
          {
            id: crypto.randomUUID(),
            name: "Jane Doe",
            role: "CTO",
            image: "/images/templates/flash/placeholder2.png",
            hideMember: false,
            sortOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            name: "John Doe",
            role: "CFO",
            image: "/images/templates/flash/placeholder.png",
            hideMember: false,
            sortOrder: 0,
          },
        ],
      };
    } catch (error) {
      console.error("Flash Team Generation Error:", error);
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

    const userPrompt = `Gere APENAS um JSON válido para especialidades.

PROJETO: ${normalizedProjectName} - ${data.projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Aplicamos estratégias que unem tecnologia, análise e execução, garantindo performance digital e resultados reais.",
  "topics": [
    {
      "id": ${crypto.randomUUID()},
      "icon": "DiamondIcon",
      "title": "Desenvolvimento web responsivo",
      "description": "Sites otimizados que convertem visitantes em clientes com performance superior."
    },
    {
      "id": ${crypto.randomUUID()},
      "icon": "DiamondIcon",
      "title": "Sistemas de agendamento",
      "description": "Plataformas personalizadas que automatizam e organizam seus agendamentos."
    },
    {
      "id": ${crypto.randomUUID()},
      "icon": "DiamondIcon",
      "title": "Integrações avançadas",
      "description": "Conectamos ferramentas para criar fluxos de trabalho mais eficientes."
    },
    { 
      "id": ${crypto.randomUUID()},
      "icon": "DiamondIcon",
      "title": "Otimização de performance",
      "description": "Aceleramos carregamento e melhoramos experiência do usuário."
    },
    {
      "id": ${crypto.randomUUID()},
      "icon": "DiamondIcon",
      "title": "Segurança e proteção",
      "description": "Implementamos medidas robustas para proteger dados e operações."
    },
    {
      "id": ${crypto.randomUUID()},
      "icon": "DiamondIcon",
      "title": "Suporte técnico especializado",
      "description": "Equipe dedicada para garantir funcionamento perfeito e contínuo."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 6 tópicos
- Cada tópico deve ter title e description
- Use linguagem profissional e focada em resultados
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "title": "string (max 140 characters)",
  "topics": [
    {
      "id": "string",
      "icon": "string",
      "title": "string (max 50 characters)",
      "description": "string (max 100 characters)"
    }
  ]
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashSpecialtiesSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Specialties generated successfully");

        ensureCondition(
          Array.isArray(moaResult.result.topics) &&
            moaResult.result.topics.length >= 6 &&
            moaResult.result.topics.length <= 9,
          "specialties.topics must contain between 6 and 9 items"
        );

        return moaResult.result;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashSpecialtiesSection>(
        userPrompt,
        agent.systemPrompt
      );

      ensureCondition(
        Array.isArray(parsed.topics) &&
          parsed.topics.length >= 6 &&
          parsed.topics.length <= 9,
        "specialties.topics must contain between 6 and 9 items"
      );

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
    const userPrompt = `Gere APENAS um JSON válido para etapas do processo.

    PROJETO: ${data.projectName} - ${data.projectDescription}

    COPIE EXATAMENTE ESTE FORMATO:

    {
      "title": "Nosso processo",
      "introduction": "Desenvolvemos soluções inovadoras com foco em resultados e impacto contínuo.",
      "topics": [
        {
          "id": ${crypto.randomUUID()},
          "title": "Análise e planejamento estratégico",
          "description": "Identificamos as necessidades da sua marca para criar uma estratégia personalizada que maximize resultados e garanta o sucesso do seu projeto digital."
        },
        {
          "id": ${crypto.randomUUID()},
          "title": "Elaboração de layout e design",
          "description": "Criamos layouts atraentes e funcionais que refletem a imagem da sua marca e apresentam seu negócio de forma clara e profissional."
        },
        {
          "id": ${crypto.randomUUID()},
          "title": "Desenvolvimento da funcionalidade",
          "description": "Implementamos todas as funcionalidades necessárias para que seu site funcione perfeitamente e atenda às suas necessidades específicas."
        },
        {
          "id": ${crypto.randomUUID()},
          "title": "Testes e otimização da experiência",
          "description": "Realizamos testes rigorosos para garantir que o site seja fácil de navegar, intuitivo e performe bem em todos os dispositivos."
        },
        {
          "id": ${crypto.randomUUID()},
          "title": "Deploy finalizado e entrega completa",
          "description": "Implementamos seu projeto com segurança, configuramos os sistemas necessários para funcionar de forma integrada e eficiente."
        }
      ],
      "marquee": [
        {
          "id": ${crypto.randomUUID()},
          "text": "Nosso processo",
          "hideItem": false,
          "sortOrder": 0
        },
        {
          "id": ${crypto.randomUUID()},
          "text": "Estratégia",
          "hideItem": false,
          "sortOrder": 1
        },
        {
          "id": ${crypto.randomUUID()},
          "text": "Design",
          "hideItem": false,
          "sortOrder": 2
        },
      ]
    }

    REGRAS OBRIGATÓRIAS:
    - EXATAMENTE 5 etapas
    - Cada etapa deve ter title e description
    - Use linguagem profissional e focada em processo
    - Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
      "title": "string (max 50 characters)",
      "introduction": "string (max 200 characters)",
      "topics": [
        {
          id: "string",
          "title": "string (max 40 characters)",
          "description": "string (max 240 characters)"
        }
      ]
    }`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashStepsSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Steps generated successfully");

        ensureCondition(
          Array.isArray(moaResult.result.topics) &&
            moaResult.result.topics.length === 5,
          "steps.topics must contain exactly 5 items"
        );

        return moaResult.result;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashStepsSection>(
        userPrompt,
        agent.systemPrompt
      );

      ensureCondition(
        Array.isArray(parsed.topics) && parsed.topics.length === 5,
        "steps.topics must contain exactly 5 items"
      );

      return parsed;
    } catch (error) {
      console.error("Flash Steps Generation Error:", error);
      throw error;
    }
  }

  private async generateScope(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashScopeSection> {
    const userPrompt = `Gere APENAS um JSON válido para o escopo do projeto.

    PROJETO: ${data.projectName} - ${data.projectDescription}

    COPIE EXATAMENTE ESTE FORMATO:

    {
      "content": "Nosso projeto integra soluções digitais estratégicas que ampliam resultados e fortalecem a presença online. Desenvolvemos sistemas robustos que entregam performance, conversão e crescimento sustentável para seu negócio."
    }

    REGRAS OBRIGATÓRIAS:
    - content: Máximo 350 caracteres
    - Foque em benefícios do investimento e entregas
    - Use linguagem profissional e focada em resultados
    - Responda APENAS com o JSON válido.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<FlashScopeSection>(
        userPrompt,
        agent.systemPrompt
      );

      return parsed;
    } catch (error) {
      console.error("Flash Scope Generation Error:", error);
      throw error;
    }
  }

  private async generateInvestment(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashInvestmentSection> {
    const userPrompt = `Gere APENAS um JSON válido para investimento.

    PROJETO: ${data.projectName} - ${data.projectDescription}
    PLANOS: ${
      data.selectedPlans?.join(", ") || "Plano Essencial, Plano Executivo"
    }

    COPIE EXATAMENTE ESTE FORMATO:

    {
      "title": "Planejamento para gerar impacto digital, valor e reconhecimento duradouro",
      "deliverables": [
        {
          "title": "Site institucional completo",
          "description": "Desenvolvimento de site responsivo com design profissional, otimizado para conversão e performance, personalizado para seu negócio."
        },
        {
          "title": "Sistema de gestão integrado",
          "description": "Plataforma personalizada para gestão de conteúdo e funcionalidades com painel administrativo intuitivo e seguro."
        }
      ],
      "plansItems": [
        {
          "id": "uuid-1",
          "title": "Plano Essencial",
          "description": "Impulsione resultados com soluções digitais que ampliam performance e conversão",
          "value": 4000,
          "hideTitleField": false,
          "hideDescription": false,
          "hidePrice": false,
          "hidePlanPeriod": false,
          "hideButtonTitle": false,
          "buttonTitle": "Assinar",
          "planPeriod": "Mensal",
          "recommended": false,
          "sortOrder": 0,
          "includedItems": [
            {
              "id": "uuid-1-1",
              "description": "Site responsivo completo",
              "hideItem": false,
              "sortOrder": 0
            },
            {
              "id": "uuid-1-2",
              "description": "Sistema de gestão",
              "hideItem": false,
              "sortOrder": 1
            },
            {
              "id": "uuid-1-3",
              "description": "Otimização SEO básica",
              "hideItem": false,
              "sortOrder": 2
            }
          ]
        },
        {
          "id": "uuid-2",
          "title": "Plano Executivo", 
          "description": "Acelere crescimento com integrações avançadas e automações inteligentes",
          "value": "7200",
          "hideTitleField": false,
          "hideDescription": false,
          "hidePrice": false,
          "hidePlanPeriod": false,
          "hideButtonTitle": false,
          "buttonTitle": "Assinar",
          "planPeriod": "Anual",
          "recommended": false,
          "sortOrder": 1,
          "includedItems": [
            {
              "id": "uuid-2-1",
              "description": "Tudo do Essencial",
              "hideItem": false,
              "sortOrder": 0
            },
            {
              "id": "uuid-2-2",
              "description": "Integrações avançadas",
              "hideItem": false,
              "sortOrder": 1
            },
            {
              "id": "uuid-2-3",
              "description": "Automações personalizadas",
              "hideItem": false,
              "sortOrder": 2
            }
          ]
        },
        {
          "id": "uuid-3",
          "title": "Plano Premium",
          "description": "Transforme seu negócio com soluções digitais avançadas e personalizadas",
          "value": 8000,
          "hideTitleField": false,
          "hideDescription": false,
          "hidePrice": false,
          "hidePlanPeriod": false,
          "hideButtonTitle": false,
          "buttonTitle": "Assinar",
          "planPeriod": "Único",
          "recommended": false,
          "sortOrder": 0,
          "includedItems": [
            {
              "id": "uuid-3-1",
              "description": "Tudo do Plano Executivo",
              "hideItem": false,
              "sortOrder": 0
            },
            {
              "id": "uuid-3-2",
              "description": "Integrações avançadas",
              "hideItem": false,
              "sortOrder": 1
            },
            {
              "id": "uuid-3-3",
              "description": "Automações personalizadas",
              "hideItem": false,
              "sortOrder": 2
            }
          ]
        }
      ]
    }

    REGRAS CRÍTICAS:
    - EXATAMENTE 3 planos
    - Cada plano deve ter title, description, value, includedItems
    - includedItems: 3 a 6 itens por plano
    - Use valores realistas em reais
    - O campo value deve ser um número
    - O campo includedItems deve ser um array de objetos com id, description, hideItem e sortOrder
    - O campo hideItem deve ser um booleano
    - O campo sortOrder deve ser um número
    - O campo id deve ser uma string
    - O campo description deve ser uma string
    - Retorne APENAS o JSON válido
    - NÃO inclua texto explicativo antes ou depois
    - Use APENAS aspas duplas (") para strings
    - NÃO use vírgulas no final de arrays ou objetos
    - Valores numéricos sem aspas (value: 4000, não "4000")
    - Nomes de propriedades exatamente como especificado
    - O JSON deve começar com { e terminar com }
    - Use IDs únicos simples como "uuid-1", "uuid-2", etc.

    IMPORTANTE: 
    - Use as informações específicas do projeto: ${data.projectDescription}
    - Personalize para o cliente: ${data.clientName}
    - NÃO mencione "metodologia FLASH" ou termos genéricos
    - Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    const expectedFormat = `{
      "title": "string",
      "deliverables": [
        {
          "title": "string",
          "description": "string"
        }
      ],
      "plansItems": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "value": number,
          "hideTitleField": boolean,
          "hideDescription": boolean,
          "hidePrice": boolean,
          "hidePlanPeriod": boolean,
          "hideButtonTitle": boolean,
          "buttonTitle": "string",
          "planPeriod": "string",
          "recommended": boolean,
          "sortOrder": number,
          "includedItems": [
            {
              "id": "string",
              "description": "string",
              "hideItem": boolean,
              "sortOrder": number
            }
          ]
        }
      ]
    }`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashInvestmentSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Investment generated successfully");

        // Generate proper UUIDs for the investment items
        const investmentWithUUIDs = {
          ...moaResult.result,
          plansItems: moaResult.result.plansItems.map((plan) => ({
            ...plan,
            id: crypto.randomUUID(),
            includedItems: plan.includedItems.map((item) => ({
              ...item,
              id: crypto.randomUUID(),
            })),
          })),
        };

        return investmentWithUUIDs;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashInvestmentSection>(
        userPrompt,
        agent.systemPrompt
      );

      ensureCondition(
        Array.isArray(parsed.plansItems) && parsed.plansItems.length > 0,
        "investment.plans must include at least one item"
      );

      // Generate proper UUIDs for the investment items
      const investmentWithUUIDs = {
        ...parsed,
        plansItems: parsed.plansItems.map((plan) => ({
          ...plan,
          id: crypto.randomUUID(),
          includedItems: plan.includedItems.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        })),
      };

      return investmentWithUUIDs;
    } catch (error) {
      console.error("Flash Investment Generation Error:", error);
      throw error;
    }
  }

  private async generateResults(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashResultsSection> {
    const userPrompt = `Gere APENAS um JSON válido para resultados.

  PROJETO: ${data.projectName} - ${data.projectDescription}
  COPIE EXATAMENTE ESTE FORMATO:

  {
    "title": "Resultados que transformam negócios",
    "items": [
      {
        "id": "uuid-1",
        "client": "Cliente 1",
        "instagram": "cliente1",
        "investment": "1500",
        "roi": "2500",
        "photo": "/images/templates/flash/placeholder3.png",
        "hidePhoto": false,
        "sortOrder": 0
      },
      {
        "id": "uuid-2",
        "client": "Cliente 2",
        "instagram": "cliente2",
        "investment": "2000",
        "roi": "3000",
        "photo": "/images/templates/flash/placeholder4.png",
        "hidePhoto": false,
        "sortOrder": 1
      },
      {
        "id": "uuid-3",
        "client": "Cliente 3",
        "instagram": "cliente3",
        "investment": "2500",
        "roi": "4000",
        "photo": "/images/templates/flash/placeholder5.png",
        "hidePhoto": false,
        "sortOrder": 2
      }
    ]
  }

  REGRAS OBRIGATÓRIAS:
  - title: Título da seção de resultados
  - items: Array de objetos com id, client, instagram, investment, roi, photo, hidePhoto e sortOrder
  - Use linguagem clara e profissional
  - O campo photo deve usar essa URL: /images/templates/flash/placeholder3.png
  - Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "title": "string",
  "items": [
    {
      "id": "string",
      "client": "string",
      "instagram": "string",
      "investment": "string",
      "roi": "string",
      "photo": "string",
      "hidePhoto": boolean,
      "sortOrder": number
    }
  ]
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashResultsSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Results generated successfully");

        // Generate proper UUIDs for the result items
        const resultsWithUUIDs = {
          ...moaResult.result,
          items: moaResult.result.items.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        };

        return resultsWithUUIDs;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashResultsSection>(
        userPrompt,
        agent.systemPrompt
      );

      // Generate proper UUIDs for the result items
      const resultsWithUUIDs = {
        ...parsed,
        items: parsed.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
      };

      return resultsWithUUIDs;
    } catch (error) {
      console.error("Flash Results Generation Error:", error);
      throw error;
    }
  }

  private async generateTestimonials(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTestimonialsSection> {
    const userPrompt = `Gere APENAS um JSON válido para depoimentos.
    
    PROJETO: ${data.projectName} - ${data.projectDescription}
    
    COPIE EXATAMENTE ESTE FORMATO:
    {
      "title": "Depoimentos",
      "items": [
        {
          "id": "uuid-1",
          "name": "John Doe",
          "role": "CEO",
          "testimonial": "Exemplo de depoimento para mostrar o resultado do projeto e o que foi alcançado com durante o desenvolvimento. Bem como os pontos fortes do projeto.",
          "photo": "/images/templates/flash/placeholder.png",
          "hidePhoto": false,
          "sortOrder": 0
        },
        {
          "id": "uuid-2",
          "name": "Jane Doe",
          "role": "CTO",
          "testimonial": "Exemplo de depoimento para mostrar o resultado do projeto desenvolvido pela empresa bem como os pontos fortes do projeto.",
          "photo": "/images/templates/flash/placeholder2.png",
          "hidePhoto": false,
          "sortOrder": 1
        }
      ]
    }
      
    REGRAS CRÍTICAS:
    - Retorne APENAS o JSON válido
    - NÃO inclua texto explicativo antes ou depois
    - NÃO use "Aqui está" ou qualquer texto introdutório
    - Use APENAS aspas duplas (") para strings
    - NÃO use vírgulas no final de arrays ou objetos
    - Nomes de propriedades exatamente como especificado
    - O campo photo deve usar essa URL: /images/templates/flash/placeholder.png
    - O JSON deve começar com { e terminar com }

    IMPORTANTE: 
    - Use as informações específicas do projeto: ${data.projectDescription}
    - Personalize para o cliente: ${data.clientName}
    - NÃO mencione "metodologia FLASH" ou termos genéricos
    - Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    const expectedFormat = `{
  "title": "string",
  "items": [
    {
      "id": "string",
      "name": "string",
      "role": "string",
      "testimonial": "string",
      "photo": "string",
      "hidePhoto": boolean,
      "sortOrder": number
    }
  ]
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashTestimonialsSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Testimonials generated successfully");

        // Generate proper UUIDs for the testimonial items
        const testimonialsWithUUIDs = {
          ...moaResult.result,
          items: moaResult.result.items.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        };

        return testimonialsWithUUIDs;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashTestimonialsSection>(
        userPrompt,
        agent.systemPrompt
      );

      // Generate proper UUIDs for the testimonial items
      const testimonialsWithUUIDs = {
        ...parsed,
        items: parsed.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
      };

      return testimonialsWithUUIDs;
    } catch (error) {
      console.error("Flash Testimonials Generation Error:", error);
      throw error;
    }
  }

  private async generateTerms(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTermsSection> {
    const userPrompt = `Gere APENAS um JSON válido para termos e condições.

PROJETO: ${data.projectName} - ${data.projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Termos e Condições",
  "description": "Estes termos regem a prestação de serviços de desenvolvimento web e design. O projeto será desenvolvido conforme especificações acordadas, com prazo de entrega de 30 dias úteis. Incluímos 2 revisões gratuitas e suporte técnico por 30 dias após a entrega. Pagamento: 50% na assinatura do contrato e 50% na entrega final."
}

REGRAS OBRIGATÓRIAS:
- description: Máximo 500 caracteres
- Inclua informações essenciais sobre prazo, pagamento e suporte
- Use linguagem clara e profissional
- Responda APENAS com o JSON válido.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<FlashTermsSection>(
        userPrompt,
        agent.systemPrompt
      );

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
    const userPrompt = `Gere APENAS um JSON válido para perguntas frequentes.

PROJETO: ${data.projectName} - ${data.projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "faq": [
    {
      "id": "uuid-1",
      "question": "Como vocês garantem que o projeto será entregue no prazo?",
      "answer": "Utilizamos metodologias ágeis e planejamento detalhado para garantir entregas pontuais. Nossa equipe trabalha com cronogramas realistas e comunicação constante."
    },
    {
      "id": "uuid-2",
      "question": "Posso solicitar alterações durante o desenvolvimento?",
      "answer": "Sim, incluímos ciclos de revisão e ajustes para garantir que o resultado final atenda perfeitamente às suas expectativas e necessidades."
    },
    {
      "id": "uuid-3",
      "question": "Qual é o prazo médio para entrega do projeto?",
      "answer": "O prazo médio é de 30 dias úteis, variando conforme a complexidade do projeto. Sempre informamos o cronograma detalhado antes do início."
    },
    {
      "id": "uuid-4",
      "question": "Vocês oferecem suporte após a entrega?",
      "answer": "Sim, incluímos suporte técnico gratuito por 30 dias após a entrega, além de manutenção e atualizações conforme necessário."
    },
    {
      "id": "uuid-5",
      "question": "Como funciona o processo de pagamento?",
      "answer": "O pagamento é dividido em duas parcelas: 50% na assinatura do contrato e 50% na entrega final do projeto."
    },
    {
      "id": "uuid-6",
      "question": "Posso ver o progresso do projeto durante o desenvolvimento?",
      "answer": "Sim, mantemos comunicação constante e fornecemos relatórios de progresso regulares para que você acompanhe cada etapa."
    },
    {
      "id": "uuid-7",
      "question": "Vocês trabalham com projetos de qualquer tamanho?",
      "answer": "Sim, atendemos desde pequenos sites institucionais até grandes plataformas complexas, sempre adaptando nossa abordagem às suas necessidades."
    },
    {
      "id": "uuid-8",
      "question": "Qual é a garantia oferecida?",
      "answer": "Oferecemos garantia de 90 dias para correção de bugs e ajustes necessários, além do suporte técnico incluído no projeto."
    },
    {
      "id": "uuid-9",
      "question": "Posso solicitar funcionalidades adicionais depois?",
      "answer": "Sim, podemos desenvolver funcionalidades adicionais conforme suas necessidades, com orçamento e prazo específicos para cada nova demanda."
    },
    {
      "id": "uuid-10",
      "question": "Como vocês garantem a segurança do projeto?",
      "answer": "Implementamos as melhores práticas de segurança, incluindo certificados SSL, backups regulares e monitoramento contínuo para proteger seus dados."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 10 perguntas e respostas
- Cada pergunta deve ter question e answer
- Use linguagem clara e profissional
- Foque em dúvidas comuns sobre desenvolvimento web
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "faq": [
    {
      "id": "string",
      "question": "string",
      "answer": "string"
    }
  ]
}`;

    try {
      const moaResult = await this.moaService.generateWithRetry<{
        faq: FlashFAQSection;
      }>(userPrompt, agent.systemPrompt, expectedFormat, agent.systemPrompt);

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA FAQ generated successfully");

        // Generate proper UUIDs for the FAQ items
        const faqWithUUIDs = moaResult.result.faq.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        }));

        return faqWithUUIDs;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as { faq: FlashFAQSection };

      if (!Array.isArray(parsed.faq) || parsed.faq.length === 0) {
        console.warn("Flash FAQ: No valid FAQ items found, using fallback");
        return this.getFallbackFAQ();
      }

      // Generate proper UUIDs for the FAQ items
      const faqWithUUIDs = parsed.faq.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      }));

      return faqWithUUIDs;
    } catch (error) {
      console.error("Flash FAQ Generation Error:", error);
      return this.getFallbackFAQ();
    }
  }

  private generateFooter(data: FlashThemeData): FlashFooterSection {
    console.log("Flash footer generated for", data.projectName);
    return {
      callToAction: "Transforme sua presença digital conosco",
      disclaimer:
        "Estamos à disposição para apoiar cada etapa do seu projeto. Conte com nossa equipe para garantir sucesso, impacto e crescimento contínuo, com atenção e dedicação personalizada.",
    } as FlashFooterSection;
  }

  private getFallbackFAQ(): FlashFAQSection {
    return [
      {
        id: crypto.randomUUID(),
        question: "Como vocês garantem que o projeto será entregue no prazo?",
        answer:
          "Utilizamos metodologias ágeis e planejamento detalhado para garantir entregas pontuais. Nossa equipe trabalha com cronogramas realistas e comunicação constante.",
      },
      {
        id: crypto.randomUUID(),
        question: "Posso solicitar alterações durante o desenvolvimento?",
        answer:
          "Sim, incluímos ciclos de revisão e ajustes para garantir que o resultado final atenda perfeitamente às suas expectativas e necessidades.",
      },
      {
        id: crypto.randomUUID(),
        question: "Qual é o prazo médio para entrega do projeto?",
        answer:
          "O prazo médio é de 30 dias úteis, variando conforme a complexidade do projeto. Sempre informamos o cronograma detalhado antes do início.",
      },
      {
        id: crypto.randomUUID(),
        question: "Vocês oferecem suporte após a entrega?",
        answer:
          "Sim, incluímos suporte técnico gratuito por 30 dias após a entrega, além de manutenção e atualizações conforme necessário.",
      },
      {
        id: crypto.randomUUID(),
        question: "Como funciona o processo de pagamento?",
        answer:
          "O pagamento é dividido em duas parcelas: 50% na assinatura do contrato e 50% na entrega final do projeto.",
      },
      {
        id: crypto.randomUUID(),
        question: "Posso ver o progresso do projeto durante o desenvolvimento?",
        answer:
          "Sim, mantemos comunicação constante e fornecemos relatórios de progresso regulares para que você acompanhe cada etapa.",
      },
      {
        id: crypto.randomUUID(),
        question: "Vocês trabalham com projetos de qualquer tamanho?",
        answer:
          "Sim, atendemos desde pequenos sites institucionais até grandes plataformas complexas, sempre adaptando nossa abordagem às suas necessidades.",
      },
      {
        id: crypto.randomUUID(),
        question: "Qual é a garantia oferecida?",
        answer:
          "Oferecemos garantia de 90 dias para correção de bugs e ajustes necessários, além do suporte técnico incluído no projeto.",
      },
      {
        id: crypto.randomUUID(),
        question: "Posso solicitar funcionalidades adicionais depois?",
        answer:
          "Sim, podemos desenvolver funcionalidades adicionais conforme suas necessidades, com orçamento e prazo específicos para cada nova demanda.",
      },
      {
        id: crypto.randomUUID(),
        question: "Como vocês garantem a segurança do projeto?",
        answer:
          "Implementamos as melhores práticas de segurança, incluindo certificados SSL, backups regulares e monitoramento contínuo para proteger seus dados.",
      },
    ];
  }

  private async runLLM(
    userPrompt: string,
    systemPrompt: string
  ): Promise<string> {
    console.log("🔍 Flash LLM Debug:");
    console.log(
      "- System Prompt (primeiros 100 chars):",
      systemPrompt.substring(0, 100)
    );
    console.log(
      "- User Prompt (primeiros 100 chars):",
      userPrompt.substring(0, 100)
    );

    const response = await this.together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
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
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content?.trim();
    console.log(
      "- Response (primeiros 100 chars):",
      content?.substring(0, 100)
    );

    if (!content) {
      throw new Error("No response from LLM");
    }

    return content;
  }

  private async runLLMWithJSONRetry<T>(
    userPrompt: string,
    systemPrompt: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔍 Flash LLM Debug (Attempt ${attempt}):`);
        console.log(
          "- System Prompt (primeiros 100 chars):",
          systemPrompt.substring(0, 100)
        );
        console.log(
          "- User Prompt (primeiros 100 chars):",
          userPrompt.substring(0, 100)
        );

        const response = await this.together.chat.completions.create({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
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
          temperature: 0.7,
          max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content?.trim();
        console.log(
          "- Response (primeiros 100 chars):",
          content?.substring(0, 100)
        );

        if (!content) {
          throw new Error("No response from LLM");
        }

        // Try to parse JSON directly
        try {
          return JSON.parse(content) as T;
        } catch (parseError) {
          console.error(
            `Flash JSON Parse Error (Attempt ${attempt}):`,
            parseError
          );
          lastError = parseError as Error;

          if (attempt < maxRetries) {
            console.log(
              `🔄 Retrying JSON parsing (Attempt ${
                attempt + 1
              }/${maxRetries})...`
            );

            // Generate a retry prompt with more specific instructions
            const retryPrompt = generateJSONRetryPrompt(
              userPrompt,
              (parseError as Error).message,
              content
            );

            const retryResponse = await this.together.chat.completions.create({
              model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a JSON repair specialist. Fix malformed JSON to make it valid and properly formatted. Return only the corrected JSON.",
                },
                {
                  role: "user",
                  content: retryPrompt,
                },
              ],
              temperature: 0.1,
              max_tokens: 2000,
            });

            const retryContent =
              retryResponse.choices[0]?.message?.content?.trim();
            if (retryContent) {
              try {
                return JSON.parse(retryContent) as T;
              } catch (retryParseError) {
                console.error(
                  `Flash Retry JSON Parse Error (Attempt ${attempt}):`,
                  retryParseError
                );
                lastError = retryParseError as Error;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Flash LLM Error (Attempt ${attempt}):`, error);
        lastError = error as Error;

        if (attempt < maxRetries) {
          console.log(
            `🔄 Retrying LLM call (Attempt ${attempt + 1}/${maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }

    throw new Error(
      `Flash LLM failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  async execute(data: FlashThemeData): Promise<FlashProposal> {
    console.log("Debug - Flash theme execute called with:", data);

    const agent = await getAgentByServiceAndTemplate(
      data.selectedService,
      data.templateType
    );

    if (!agent) {
      throw new Error(
        `No agent found for service: ${data.selectedService} and template: ${data.templateType}`
      );
    }

    console.log("Debug - Agent found:", agent.name);

    try {
      const proposal = await this.generateFlashProposal(data, agent);
      console.log("Debug - Flash proposal generated successfully");
      return proposal;
    } catch (error) {
      console.error("Flash Template Workflow Error:", error);
      throw error;
    }
  }
}

// Type definitions
export interface FlashIntroductionSection {
  userName?: string;
  email: string;
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
  members: Array<{
    id?: string;
    name: string;
    role: string;
    image?: string;
    hideMember?: boolean;
    sortOrder?: number;
  }>;
}

export interface FlashSpecialtiesSection {
  title: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
}

export interface FlashStepsSection {
  title: string;
  introduction: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
  marquee: Array<{
    id?: string;
    text: string;
    hideItem?: boolean;
    sortOrder?: number;
  }>;
}

export interface FlashScopeSection {
  content: string;
}

export interface FlashInvestmentSection {
  title: string;
  deliverables: Array<{
    title: string;
    description: string;
  }>;
  plansItems: Array<{
    id?: string;
    hideTitleField?: boolean;
    hideDescription?: boolean;
    hidePrice?: boolean;
    hidePlanPeriod?: boolean;
    hideButtonTitle?: boolean;
    buttonTitle: string;
    planPeriod: string;
    recommended: boolean;
    sortOrder?: number;
    title: string;
    description: string;
    value: string;
    includedItems: Array<{
      id?: string;
      description: string;
      hideItem?: boolean;
      sortOrder?: number;
    }>;
  }>;
}

export interface FlashResultsSection {
  title: string;
  items: Array<{
    id: string;
    client: string;
    instagram: string;
    investment: string;
    roi: string;
    photo: string;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export interface FlashTestimonialsSection {
  title: string;
  items: Array<{
    id: string;
    name: string;
    role: string;
    testimonial: string;
    photo: string;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export interface FlashTermsSection {
  title: string;
  description: string;
}

export type FlashFAQSection = Array<{
  id: string;
  question: string;
  answer: string;
}>;

export interface FlashFooterSection {
  callToAction: string;
  disclaimer: string;
}

export interface FlashSection {
  type: string;
  content: Record<string, unknown>;
}

export interface FlashWorkflowResult {
  success: boolean;
  proposal?: FlashProposal;
  error?: string;
  metadata?: {
    sections: FlashSection[];
    generationTime: number;
  };
}

export class FlashTemplateWorkflow {
  private agent: BaseAgentConfig | null = null;
  private model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";

  async execute(data: FlashThemeData): Promise<FlashWorkflowResult> {
    const startTime = Date.now();

    try {
      console.log("🚀 Starting Flash workflow execution...");
      const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
      const flashTheme = new FlashTheme(together);
      const proposal = await flashTheme.execute(data);

      console.log(
        "✅ Flash workflow completed successfully in",
        Date.now() - startTime,
        "ms"
      );
      return {
        success: true,
        proposal,
        metadata: {
          sections: flashTheme["sections"] || [],
          generationTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error("❌ Flash Template Workflow Error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        duration: Date.now() - startTime,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: {
          sections: [],
          generationTime: Date.now() - startTime,
        },
      };
    }
  }
}
