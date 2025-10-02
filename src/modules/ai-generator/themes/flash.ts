import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { FlashProposal } from "../templates/flash/flash-template";
import { BaseThemeData } from "./base-theme";
import { validateMaxLengthWithWarning } from "./validators";
import { generateJSONRetryPrompt } from "./json-utils";

function ensureCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
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
      data.includeFAQ
        ? this.generateFAQ(data, agent)
        : Promise.resolve(this.getFallbackFAQ()),
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

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        155,
        "aboutUs.title"
      );
      const supportTextValidation = validateMaxLengthWithWarning(
        parsed.supportText,
        70,
        "aboutUs.supportText"
      );
      const subtitleValidation = validateMaxLengthWithWarning(
        parsed.subtitle,
        250,
        "aboutUs.subtitle"
      );

      if (titleValidation.warning) {
        console.warn("Flash AboutUs Title Warning:", titleValidation.warning);
      }
      if (supportTextValidation.warning) {
        console.warn(
          "Flash AboutUs SupportText Warning:",
          supportTextValidation.warning
        );
      }
      if (subtitleValidation.warning) {
        console.warn(
          "Flash AboutUs Subtitle Warning:",
          subtitleValidation.warning
        );
      }

      return {
        ...parsed,
        title: titleValidation.value,
        supportText: supportTextValidation.value,
        subtitle: subtitleValidation.value,
      };
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

    const userPrompt = `Gere APENAS um JSON válido para especialidades.

PROJETO: ${normalizedProjectName} - ${data.projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Aplicamos estratégias que unem tecnologia, análise e execução, garantindo performance digital e resultados reais.",
  "topics": [
    {
      "title": "Desenvolvimento web responsivo",
      "description": "Sites otimizados que convertem visitantes em clientes com performance superior."
    },
    {
      "title": "Sistemas de agendamento",
      "description": "Plataformas personalizadas que automatizam e organizam seus agendamentos."
    },
    {
      "title": "Integrações avançadas",
      "description": "Conectamos ferramentas para criar fluxos de trabalho mais eficientes."
    },
    {
      "title": "Otimização de performance",
      "description": "Aceleramos carregamento e melhoramos experiência do usuário."
    },
    {
      "title": "Segurança e proteção",
      "description": "Implementamos medidas robustas para proteger dados e operações."
    },
    {
      "title": "Suporte técnico contínuo",
      "description": "Acompanhamento especializado para garantir funcionamento perfeito."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- Use APENAS aspas duplas (")
- NÃO use aspas simples (')
- NÃO use quebras de linha dentro das strings
- Gere entre 6 e 9 especialidades
- Personalize para: ${data.projectDescription}
- NÃO cite cliente ou empresa

Retorne APENAS o JSON acima, substituindo apenas o conteúdo entre aspas.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<FlashSpecialtiesSection>(
        userPrompt,
        agent.systemPrompt
      );

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        140,
        "specialties.title"
      );

      if (titleValidation.warning) {
        console.warn(
          "Flash Specialties Title Warning:",
          titleValidation.warning
        );
      }

      ensureCondition(
        Array.isArray(parsed.topics) &&
          parsed.topics.length >= 6 &&
          parsed.topics.length <= 9,
        "specialties.topics must contain between 6 and 9 items"
      );
      parsed.topics.forEach((topic, index) => {
        const topicTitleValidation = validateMaxLengthWithWarning(
          topic.title,
          50,
          `specialties.topics[${index}].title`
        );
        const topicDescValidation = validateMaxLengthWithWarning(
          topic.description,
          100,
          `specialties.topics[${index}].description`
        );

        if (topicTitleValidation.warning) {
          console.warn(
            `Flash Specialties Topic ${index} Title Warning:`,
            topicTitleValidation.warning
          );
        }
        if (topicDescValidation.warning) {
          console.warn(
            `Flash Specialties Topic ${index} Description Warning:`,
            topicDescValidation.warning
          );
        }
      });

      return {
        ...parsed,
        title: titleValidation.value,
        topics: parsed.topics.map((topic, index) => {
          const topicTitleValidation = validateMaxLengthWithWarning(
            topic.title,
            50,
            `specialties.topics[${index}].title`
          );
          const topicDescValidation = validateMaxLengthWithWarning(
            topic.description,
            100,
            `specialties.topics[${index}].description`
          );

          return {
            ...topic,
            title: topicTitleValidation.value,
            description: topicDescValidation.value,
          };
        }),
      };
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

    const userPrompt = `Gere APENAS um JSON válido para etapas do processo.

PROJETO: ${normalizedProjectName} - ${data.projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "introduction": "Desenvolvemos soluções inovadoras com foco em resultados e impacto contínuo",
  "title": "Nosso Processo",
  "topics": [
    {
      "title": "Análise e planejamento estratégico",
      "description": "Mapeamos necessidades e objetivos para criar uma estratégia personalizada que maximize resultados e garanta o sucesso do seu projeto digital."
    },
    {
      "title": "Desenvolvimento e implementação",
      "description": "Construímos soluções robustas e escaláveis, utilizando tecnologias modernas para entregar performance e funcionalidades excepcionais."
    },
    {
      "title": "Testes e otimização",
      "description": "Realizamos testes rigorosos e otimizações contínuas para garantir que sua solução funcione perfeitamente em todos os dispositivos."
    },
    {
      "title": "Deploy e configuração",
      "description": "Implementamos sua solução com segurança e configuramos todos os sistemas para funcionar de forma integrada e eficiente."
    },
    {
      "title": "Suporte e acompanhamento",
      "description": "Oferecemos suporte contínuo e monitoramento para garantir que sua solução continue performando e gerando resultados consistentes."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- Use APENAS aspas duplas (")
- NÃO use aspas simples (')
- NÃO use quebras de linha dentro das strings
- Gere exatamente 5 etapas
- Personalize para: ${data.projectDescription}
- NÃO cite cliente ou empresa

Retorne APENAS o JSON acima, substituindo apenas o conteúdo entre aspas.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<FlashStepsSection>(
        userPrompt,
        agent.systemPrompt
      );

      const introValidation = validateMaxLengthWithWarning(
        parsed.introduction,
        200,
        "steps.introduction"
      );
      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        50,
        "steps.title"
      );

      if (introValidation.warning) {
        console.warn(
          "Flash Steps Introduction Warning:",
          introValidation.warning
        );
      }
      if (titleValidation.warning) {
        console.warn("Flash Steps Title Warning:", titleValidation.warning);
      }
      ensureCondition(
        Array.isArray(parsed.topics) && parsed.topics.length === 5,
        "steps.topics must contain exactly 5 items"
      );
      parsed.topics.forEach((topic, index) => {
        const topicTitleValidation = validateMaxLengthWithWarning(
          topic.title,
          40,
          `steps.topics[${index}].title`
        );
        const topicDescValidation = validateMaxLengthWithWarning(
          topic.description,
          240,
          `steps.topics[${index}].description`
        );

        if (topicTitleValidation.warning) {
          console.warn(
            `Flash Steps Topic ${index} Title Warning:`,
            topicTitleValidation.warning
          );
        }
        if (topicDescValidation.warning) {
          console.warn(
            `Flash Steps Topic ${index} Description Warning:`,
            topicDescValidation.warning
          );
        }
      });

      return {
        ...parsed,
        introduction: introValidation.value,
        title: titleValidation.value,
        topics: parsed.topics.map((topic, index) => {
          const topicTitleValidation = validateMaxLengthWithWarning(
            topic.title,
            40,
            `steps.topics[${index}].title`
          );
          const topicDescValidation = validateMaxLengthWithWarning(
            topic.description,
            240,
            `steps.topics[${index}].description`
          );

          return {
            ...topic,
            title: topicTitleValidation.value,
            description: topicDescValidation.value,
          };
        }),
      };
    } catch (error) {
      console.error("Flash Steps Generation Error:", error);
      throw error;
    }
  }

  private async generateInvestment(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashInvestmentSection> {
    const userPrompt = `Gere APENAS um JSON válido para investimento.

PROJETO: ${data.projectName} - ${data.projectDescription}
PLANOS: ${data.selectedPlans.join(", ")}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Investimento em soluções digitais robustas para crescimento sustentável",
  "deliverables": [
    {
      "title": "Site institucional",
      "description": "Desenvolvimento completo de site responsivo com sistema de agendamento integrado, otimizado para conversão e performance."
    },
    {
      "title": "Sistema de agendamento",
      "description": "Plataforma personalizada para gestão de agendamentos com notificações automáticas e integração com calendários."
    }
  ],
  "plans": [
    {
      "title": "Plano Essencial",
      "description": "Impulsione resultados com soluções digitais que ampliam performance e conversão",
      "value": "R$ 4.500",
      "topics": ["Site responsivo", "Sistema de agendamento", "Otimização SEO", "Suporte técnico"]
    },
    {
      "title": "Plano Executivo",
      "description": "Acelere crescimento com integrações avançadas e automações inteligentes",
      "value": "R$ 7.200",
      "topics": ["Tudo do Essencial", "Integrações avançadas", "Automações", "Relatórios detalhados"]
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- Use APENAS aspas duplas (")
- NÃO use aspas simples (')
- NÃO use quebras de linha dentro das strings
- NÃO use vírgulas no final de arrays ou objetos
- Valores monetários no formato "R$ X.XXX"
- Personalize para: ${data.projectName}
- Use os planos: ${data.selectedPlans.join(", ")}

Retorne APENAS o JSON acima, substituindo apenas o conteúdo entre aspas.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<FlashInvestmentSection>(
        userPrompt,
        agent.systemPrompt
      );

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        150,
        "investment.title"
      );

      if (titleValidation.warning) {
        console.warn(
          "Flash Investment Title Warning:",
          titleValidation.warning
        );
      }
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
        const planTitleValidation = validateMaxLengthWithWarning(
          plan.title,
          20,
          `investment.plans[${index}].title`
        );
        const planDescValidation = validateMaxLengthWithWarning(
          plan.description,
          95,
          `investment.plans[${index}].description`
        );

        if (planTitleValidation.warning) {
          console.warn(
            `Flash Investment Plan ${index} Title Warning:`,
            planTitleValidation.warning
          );
        }
        if (planDescValidation.warning) {
          console.warn(
            `Flash Investment Plan ${index} Description Warning:`,
            planDescValidation.warning
          );
        }

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
        plan.topics.forEach((topic, topicIndex) => {
          const topicValidation = validateMaxLengthWithWarning(
            topic,
            45,
            `investment.plans[${index}].topics[${topicIndex}]`
          );
          if (topicValidation.warning) {
            console.warn(
              `Flash Investment Plan ${index} Topic ${topicIndex} Warning:`,
              topicValidation.warning
            );
          }
        });
      });

      return {
        ...parsed,
        title: titleValidation.value,
        plans: parsed.plans.map((plan, index) => {
          const planTitleValidation = validateMaxLengthWithWarning(
            plan.title,
            20,
            `investment.plans[${index}].title`
          );
          const planDescValidation = validateMaxLengthWithWarning(
            plan.description,
            95,
            `investment.plans[${index}].description`
          );

          return {
            ...plan,
            title: planTitleValidation.value,
            description: planDescValidation.value,
            topics: plan.topics.map((topic, topicIndex) => {
              const topicValidation = validateMaxLengthWithWarning(
                topic,
                45,
                `investment.plans[${index}].topics[${topicIndex}]`
              );
              return topicValidation.value;
            }),
          };
        }),
      };
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
    const userPrompt = `Gere APENAS um JSON válido para perguntas frequentes.

PROJETO: ${data.projectName} - ${data.projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

[
  {
    "question": "Como vocês garantem que o projeto será entregue no prazo?",
    "answer": "Utilizamos metodologias ágeis e planejamento detalhado para garantir entregas pontuais. Nossa equipe trabalha com cronogramas realistas e comunicação constante."
  },
  {
    "question": "Posso solicitar alterações durante o desenvolvimento?",
    "answer": "Sim, incluímos ciclos de revisão e ajustes para garantir que o resultado final atenda perfeitamente às suas expectativas e necessidades."
  },
  {
    "question": "Qual é o processo de acompanhamento do projeto?",
    "answer": "Mantemos comunicação regular através de reuniões semanais, relatórios de progresso e acesso a plataforma de acompanhamento em tempo real."
  },
  {
    "question": "Vocês oferecem suporte após a entrega?",
    "answer": "Sim, incluímos período de suporte pós-entrega para garantir que tudo funcione perfeitamente e você tenha total tranquilidade."
  },
  {
    "question": "Como é definido o investimento do projeto?",
    "answer": "O investimento é baseado na complexidade, prazo e recursos necessários. Apresentamos propostas transparentes sem custos ocultos."
  },
  {
    "question": "Qual é o prazo médio para desenvolvimento?",
    "answer": "O prazo varia conforme a complexidade, mas geralmente entre 4 a 8 semanas para projetos completos, sempre respeitando suas necessidades."
  },
  {
    "question": "Vocês trabalham com empresas de qualquer porte?",
    "answer": "Sim, atendemos desde startups até grandes corporações, adaptando nossa abordagem para cada perfil e necessidade específica."
  },
  {
    "question": "Como garantem a qualidade do trabalho?",
    "answer": "Seguimos rigorosos padrões de qualidade, testes extensivos e revisões constantes para entregar sempre o melhor resultado possível."
  },
  {
    "question": "Posso acompanhar o progresso do projeto?",
    "answer": "Sim, você terá acesso total ao progresso através de nossa plataforma de acompanhamento e reuniões regulares de alinhamento."
  },
  {
    "question": "O que acontece se eu não ficar satisfeito?",
    "answer": "Nosso compromisso é sua satisfação total. Trabalhamos até que você esteja completamente satisfeito com o resultado entregue."
  }
]

REGRAS OBRIGATÓRIAS:
- Use APENAS aspas duplas (")
- NÃO use aspas simples (')
- NÃO use quebras de linha dentro das strings
- Gere exatamente 10 itens
- Personalize para: ${data.projectDescription}
- NÃO cite cliente ou empresa

Retorne APENAS o JSON acima, substituindo apenas o conteúdo entre aspas.`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      let parsed: FlashFAQSection;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return this.getFallbackFAQ();
      }

      // Validate that we have an array with FAQ items
      if (!Array.isArray(parsed) || parsed.length === 0) {
        console.warn("FAQ response is not a valid array, using fallback");
        return this.getFallbackFAQ();
      }

      return parsed;
    } catch (error) {
      console.error("Flash FAQ Generation Error:", error);
      this.fallbackUsed = true;
      return this.getFallbackFAQ();
    }
  }

  private async generateTeam(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTeamSection> {
    const userPrompt = `Responda APENAS com JSON válido.

Crie o título da seção "Time" (máximo 60 caracteres):
- Linguagem inclusiva, calorosa e confiante
- Foque em parceria, proximidade e evolução
- Proibido mencionar cliente, empresa ou metodologia
- Seja conciso e impactante

EXEMPLO:
"Nós crescemos junto com você, lado a lado sempre"

Retorne:
{
  "title": "Seu título para a seção Time"
}`;

    try {
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as FlashTeamSection;

      // Validate with max length warning instead of throwing error
      const validation = validateMaxLengthWithWarning(
        parsed.title,
        60,
        "team.title"
      );

      if (validation.warning) {
        console.warn("Flash Team Generation Warning:", validation.warning);
      }

      return { title: validation.value };
    } catch (error) {
      console.error("Flash Team Generation Error:", error);
      // Return a fallback instead of throwing
      return {
        title: "Nós crescemos junto com você, lado a lado sempre",
      };
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
  "content": "Nosso projeto integra soluções digitais que ampliam resultados e fortalecem a presença online. Desenvolvemos sistemas robustos que entregam performance, conversão e crescimento sustentável para seu negócio."
}

REGRAS OBRIGATÓRIAS:
- Use APENAS aspas duplas (") 
- NÃO use aspas simples (')
- NÃO use quebras de linha dentro das strings
- Máximo 350 caracteres no content
- NÃO cite cliente ou empresa
- Personalize para: ${data.projectDescription}

Retorne APENAS o JSON acima, substituindo apenas o conteúdo entre aspas.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<FlashScopeSection>(
        userPrompt,
        agent.systemPrompt
      );

      // Validate with max length warning instead of throwing error
      const validation = validateMaxLengthWithWarning(
        parsed.content,
        350,
        "scope.content"
      );

      if (validation.warning) {
        console.warn("Flash Scope Generation Warning:", validation.warning);
      }

      return { content: validation.value };
    } catch (error) {
      console.error("Flash Scope Generation Error:", error);
      // Return a fallback instead of throwing
      return {
        content:
          "Nosso projeto reúne estratégias digitais que aumentam sua autoridade e ampliam suas oportunidades de crescimento. Através de campanhas inteligentes, conteúdos direcionados e automações otimizadas, entregamos resultados sólidos, aceleramos a conquista de clientes e fortalecemos o posicionamento no mercado de forma sustentável.",
      };
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
        question: "Como vocês garantem que o projeto será entregue no prazo?",
        answer:
          "Utilizamos metodologias ágeis e planejamento detalhado para garantir entregas pontuais. Nossa equipe trabalha com cronogramas realistas e comunicação constante.",
      },
      {
        question: "Posso solicitar alterações durante o desenvolvimento?",
        answer:
          "Sim, incluímos ciclos de revisão e ajustes para garantir que o resultado final atenda perfeitamente às suas expectativas e necessidades.",
      },
      {
        question: "Qual é o processo de acompanhamento do projeto?",
        answer:
          "Mantemos comunicação regular através de reuniões semanais, relatórios de progresso e acesso a plataforma de acompanhamento em tempo real.",
      },
      {
        question: "Vocês oferecem suporte após a entrega?",
        answer:
          "Sim, incluímos período de suporte pós-entrega para garantir que tudo funcione perfeitamente e você tenha total tranquilidade.",
      },
      {
        question: "Como é definido o investimento do projeto?",
        answer:
          "O investimento é baseado na complexidade, prazo e recursos necessários. Apresentamos propostas transparentes sem custos ocultos.",
      },
      {
        question: "Qual é o prazo médio para desenvolvimento?",
        answer:
          "O prazo varia conforme a complexidade, mas geralmente entre 4 a 8 semanas para projetos completos, sempre respeitando suas necessidades.",
      },
      {
        question: "Vocês trabalham com empresas de qualquer porte?",
        answer:
          "Sim, atendemos desde startups até grandes corporações, adaptando nossa abordagem para cada perfil e necessidade específica.",
      },
      {
        question: "Como garantem a qualidade do trabalho?",
        answer:
          "Seguimos rigorosos padrões de qualidade, testes extensivos e revisões constantes para entregar sempre o melhor resultado possível.",
      },
      {
        question: "Posso acompanhar o progresso do projeto?",
        answer:
          "Sim, você terá acesso total ao progresso através de nossa plataforma de acompanhamento e reuniões regulares de alinhamento.",
      },
      {
        question: "O que acontece se eu não ficar satisfeito?",
        answer:
          "Nosso compromisso é sua satisfação total. Trabalhamos até que você esteja completamente satisfeito com o resultado entregue.",
      },
    ];
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

  private async runLLMWithJSONRetry<T>(
    userPrompt: string,
    systemPrompt: string,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: string = "";
    const lastResponse: string = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.runLLM(
          attempt === 0
            ? userPrompt
            : generateJSONRetryPrompt(userPrompt, lastError, lastResponse),
          systemPrompt
        );

        return JSON.parse(response) as T;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }

    throw new Error(
      `Failed to parse JSON after ${
        maxRetries + 1
      } attempts. Last error: ${lastError}`
    );
  }
}
