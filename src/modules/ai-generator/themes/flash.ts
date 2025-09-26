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
      let parsed: FlashIntroductionSection;

      try {
        parsed = JSON.parse(response);
        parsed.title = parsed.title?.slice(0, 60) || "";
        parsed.subtitle = parsed.subtitle?.slice(0, 100) || "";
        parsed.services = (parsed.services || [])
          .slice(0, 4)
          .map((service: string) => service.slice(0, 30));
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          title: "Transformamos decisões em crescimento constante colaborativo",
          subtitle:
            "Integramos estratégia, execução e análise para multiplicar lucro, consolidar presença e fortalecer resultados mensuráveis",
          services: [
            "Campanhas com foco em lucro    ",
            "Gestão integrada de canais     ",
            "Conteúdo orientado a valor     ",
            "Análises estratégicas contínua",
          ],
          validity: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("pt-BR"),
          buttonText: "Iniciar Projeto",
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
      let parsed: FlashAboutUsSection;

      try {
        parsed = JSON.parse(response);

        if (parsed.title && parsed.title.length !== 155) {
          parsed.title = parsed.title
            .slice(0, 155)
            .padEnd(155, " ")
            .slice(0, 155);
        }
        if (parsed.supportText && parsed.supportText.length !== 70) {
          parsed.supportText = parsed.supportText
            .slice(0, 70)
            .padEnd(70, " ")
            .slice(0, 70);
        }
        if (parsed.subtitle && parsed.subtitle.length !== 250) {
          parsed.subtitle = parsed.subtitle
            .slice(0, 250)
            .padEnd(250, " ")
            .slice(0, 250);
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          title:
            "Construímos parcerias duradouras que elevam ideias a resultados consistentes, fortalecendo valor, confiança e lucro sustentável",
          supportText: "Confiança diária que aproxima decisões               ",
          subtitle:
            "Transformamos contextos complexos em jornadas lucrativas ao combinar estratégia, criatividade e execução ajustada ao ritmo do seu negócio, garantindo impacto contínuo e previsível",
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
      let parsed: FlashSpecialtiesSection;

      try {
        parsed = JSON.parse(response);
        parsed.title = parsed.title?.slice(0, 140) || "";
        parsed.topics = (parsed.topics || []).map(
          (topic: FlashSpecialtyTopic) => ({
            title: topic.title.slice(0, 50),
            description: topic.description.slice(0, 100),
          })
        );
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
      let parsed: FlashStepsSection;

      try {
        parsed = JSON.parse(response);
        parsed.introduction = parsed.introduction?.slice(0, 100) || "";
        parsed.topics = (parsed.topics || [])
          .slice(0, 5)
          .map((topic: FlashStepTopic) => ({
            title: topic.title.slice(0, 40),
            description: topic.description.slice(0, 240),
          }));
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          introduction:
            "Guiamos cada etapa com clareza para acelerar resultados sem perder consistência",
          title: "Nosso Processo",
          topics: [
            {
              title: "Descobrindo oportunidades",
              description:
                "Investigamos contexto, objetivos e metas para estruturar decisões orientadas a lucro e impacto sustentável.",
            },
            {
              title: "Desenhando estratégias",
              description:
                "Construímos um plano integrado com metas, prazos e métricas claras, alinhado aos resultados desejados.",
            },
            {
              title: "Executando com foco",
              description:
                "Ativamos iniciativas de alto impacto com monitoramento constante para garantir evolução contínua.",
            },
            {
              title: "Medindo resultados",
              description:
                "Avaliamos indicadores de lucro, engajamento e expansão para otimizar decisões e reforçar ganhos.",
            },
            {
              title: "Evoluindo continuamente",
              description:
                "Aprimoramos entregas com ciclos de melhoria que mantêm crescimento sustentável e previsível.",
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
      let parsed: FlashInvestmentSection;

      try {
        parsed = JSON.parse(response);
        parsed.title = parsed.title?.slice(0, 85) || "";
        parsed.deliverables = (parsed.deliverables || []).map(
          (deliverable: FlashDeliverable) => ({
            title: deliverable.title.slice(0, 30),
            description: deliverable.description.slice(0, 330),
          })
        );
        parsed.plans = (parsed.plans || []).map((plan: FlashPlan) => ({
          title: plan.title.slice(0, 20),
          description: plan.description.slice(0, 95),
          value: plan.value.slice(0, 11),
          topics: (plan.topics || []).map((topic: string) =>
            topic.slice(0, 45)
          ),
        }));
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return {
          title:
            "Investir agora garante crescimento escalável, previsível e centrado em lucro real com entregas mensuráveis",
          deliverables: [
            {
              title: "Projeto Completo",
              description:
                "Solução completa entregue no prazo estabelecido com qualidade superior e metodologia Flash",
            },
          ].map((deliverable) => ({
            title: deliverable.title.slice(0, 30),
            description: deliverable.description.slice(0, 330),
          })),
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
          ].map((plan) => ({
            title: plan.title.slice(0, 20),
            description: plan.description.slice(0, 95),
            value: plan.value.slice(0, 11),
            topics: plan.topics.map((topic) => topic.slice(0, 45)),
          })),
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
      let parsed: FlashFAQSection;

      try {
        parsed = JSON.parse(response);
        parsed = (parsed || []).slice(0, 10).map((faqItem: FlashFaqItem) => ({
          question: faqItem.question.slice(0, 100),
          answer: faqItem.answer.slice(0, 300),
        }));
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        this.fallbackUsed = true;
        return [
          {
            question:
              "Como garantimos que cada etapa avance com clareza e previsibilidade?",
            answer:
              "Mantemos acompanhamento diário, relatórios objetivos e ciclos de ajustes contínuos que asseguram confiança, rapidez nas decisões e evolução alinhada ao crescimento sustentável que você busca.",
          },
          {
            question:
              "Qual suporte oferecemos depois da implementação inicial?",
            answer:
              "Seguimos lado a lado com você, oferecendo abertura total para ajustes, novos testes e otimizações constantes, garantindo evolução consistente e segurança para ampliar resultados com tranquilidade.",
          },
        ].map((item) => ({
          question: item.question.slice(0, 100),
          answer: item.answer.slice(0, 300),
        }));
      }

      return parsed;
    } catch (error) {
      console.error("Flash FAQ Generation Error:", error);
      this.fallbackUsed = true;
      return [
        {
          question:
            "Como garantimos que cada etapa avance com clareza e previsibilidade?",
          answer:
            "Mantemos acompanhamento diário, relatórios objetivos e ciclos de ajustes contínuos que asseguram confiança, rapidez nas decisões e evolução alinhada ao crescimento sustentável que você busca.",
        },
        {
          question: "Qual suporte oferecemos depois da implementação inicial?",
          answer:
            "Seguimos lado a lado com você, oferecendo abertura total para ajustes, novos testes e otimizações constantes, garantindo evolução consistente e segurança para ampliar resultados com tranquilidade.",
        },
      ].map((item) => ({
        question: item.question.slice(0, 100),
        answer: item.answer.slice(0, 300),
      }));
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
      parsed.title = parsed.title?.slice(0, 55) || "";
      return parsed;
    } catch (error) {
      console.error("Flash Team Generation Error:", error);
      this.fallbackUsed = true;
      return {
        title: "Crescemos lado a lado fortalecendo evoluções constantes",
      };
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
      parsed.content = parsed.content?.slice(0, 350) || "";
      return parsed;
    } catch (error) {
      console.error("Flash Scope Generation Error:", error);
      this.fallbackUsed = true;
      return {
        content:
          "Integramos diagnóstico, estratégia, execução e otimização em fluxo contínuo, assegurando previsibilidade, crescimento sustentável e lucro consistente com entregas alinhadas ao investimento e à visão estratégica do projeto",
      };
    }
  }

  private generateFooter(data: FlashThemeData): FlashFooterSection {
    return {
      callToAction: "Transforme crescimento com nossa equipe agora",
      disclaimer:
        "Estamos aqui para acompanhar cada passo com atenção, empatia e velocidade, garantindo suporte contínuo, clareza em cada decisão e disponibilidade imediata para ajustes que mantenham o crescimento sustentável da sua empresa",
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
