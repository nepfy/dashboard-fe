import assert from "node:assert";
import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { BaseThemeData } from "./base-theme";

// Initialize TogetherAI client with proper error handling
const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });

export interface PrimeThemeData extends BaseThemeData {
  templateType: "prime";
  primeFeatures?: {
    premiumStyling: boolean;
    advancedCustomization: boolean;
    prioritySupport: boolean;
  };
}

// Prime-specific section interface extends base section

export interface PrimeProposal {
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
    answer: string; // 200 chars
  }>;

  // Footer Section
  footer: {
    callToAction: string; // 80 chars, AI-generated
  };
}

export interface PrimeWorkflowResult {
  success: boolean;
  templateType: "prime";
  data: PrimeProposal;
  metadata: {
    service: string;
    agent: string;
    timestamp: string;
    generationType: string;
  };
}

export class PrimeTemplateWorkflow {
  private agent: BaseAgentConfig | null = null;
  private model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";

  async execute(data: PrimeThemeData): Promise<PrimeWorkflowResult> {
    // Get the appropriate agent using the new unified function
    this.agent = await getAgentByServiceAndTemplate(
      data.selectedService,
      "prime"
    );
    if (!this.agent) {
      throw new Error(
        `No agent found for service: ${data.selectedService} and template: prime`
      );
    }

    try {
      const proposal = await this.generateTemplateProposal(data);

      return {
        success: true,
        templateType: "prime",
        data: proposal,
        metadata: {
          service: data.selectedService,
          agent: this.agent.name,
          timestamp: new Date().toISOString(),
          generationType: "prime-workflow",
        },
      };
    } catch (error) {
      console.error("Prime Template Generation Error:", error);
      throw error;
    }
  }

  async generateTemplateProposal(data: PrimeThemeData): Promise<PrimeProposal> {
    // Get the appropriate agent using the new unified function
    this.agent = await getAgentByServiceAndTemplate(
      data.selectedService,
      "prime"
    );
    if (!this.agent) {
      throw new Error(
        `No agent found for service: ${data.selectedService} and template: prime`
      );
    }

    try {
      // Generate all sections using AI
      const [
        introduction,
        aboutUs,
        specialties,
        steps,
        investment,
        terms,
        faq,
        footer,
      ] = await Promise.all([
        this.generateIntroduction(data),
        this.generateAboutUs(data),
        this.generateSpecialties(data),
        this.generateProcessSteps(data),
        this.generateInvestment(data),
        data.includeTerms ? this.generateTerms(data) : undefined,
        data.includeFAQ ? this.generateFAQ(data) : undefined,
        this.generateFooter(data),
      ]);

      return {
        introduction,
        aboutUs,
        specialties,
        steps,
        investment,
        terms,
        faq,
        footer,
      };
    } catch (error) {
      console.error("Prime Template Proposal Generation Error:", error);
      throw error;
    }
  }

  private async generateIntroduction(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { introductionStyle: string } })
          .primeSpecific.introductionStyle
      }`
    : ""
}

Crie uma seção de introdução para proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "title": "Título focado no projeto com qualidade premium (máximo 60 caracteres)",
  "subtitle": "Subtítulo personalizado para ${
    data.clientName
  } com foco em excelência (máximo 100 caracteres)",
  "services": ["${this.agent?.commonServices[0] || "Serviço Premium 1"}", "${
      this.agent?.commonServices[1] || "Serviço Premium 2"
    }", "${this.agent?.commonServices[2] || "Serviço Premium 3"}", "${
      this.agent?.commonServices[3] || "Serviço Premium 4"
    }"],
  "validity": "${new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("pt-BR")}",
  "buttonText": "Iniciar Projeto Premium"
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

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default values if JSON parsing fails
        return {
          title: `${this.agent?.sector} Premium para ${data.projectName}`,
          subtitle: `Proposta premium personalizada para ${data.clientName}`,
          services: this.agent?.commonServices.slice(0, 4) || [
            "Serviço Premium 1",
            "Serviço Premium 2",
            "Serviço Premium 3",
            "Serviço Premium 4",
          ],
          validity: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("pt-BR"),
          buttonText: "Iniciar Projeto Premium",
        };
      }

      return {
        title:
          parsed.title ||
          `${this.agent?.sector} Premium para ${data.projectName}`,
        subtitle:
          parsed.subtitle ||
          `Proposta premium personalizada para ${data.clientName}`,
        services: parsed.services ||
          this.agent?.commonServices.slice(0, 4) || [
            "Serviço Premium 1",
            "Serviço Premium 2",
            "Serviço Premium 3",
            "Serviço Premium 4",
          ],
        validity:
          parsed.validity ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
            "pt-BR"
          ),
        buttonText: parsed.buttonText || "Iniciar Projeto Premium",
      };
    } catch (error) {
      console.error("Error generating introduction:", error);
      // Fallback to default values
      return {
        title: `${this.agent?.sector} Premium para ${data.projectName}`,
        subtitle: `Proposta premium personalizada para ${data.clientName}`,
        services: this.agent?.commonServices.slice(0, 4) || [
          "Serviço Premium 1",
          "Serviço Premium 2",
          "Serviço Premium 3",
          "Serviço Premium 4",
        ],
        validity: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("pt-BR"),
        buttonText: "Iniciar Projeto Premium",
      };
    }
  }

  private async generateAboutUs(data: PrimeThemeData) {
    // Generate unique prompt variations to avoid repetitive responses
    const promptVariations = [
      `Elabore uma seção "Sobre Nós" premium e exclusiva para ${this.agent?.name} no projeto ${data.projectName} de ${data.clientName}.`,
      `Desenvolva uma apresentação sofisticada da ${this.agent?.name} focada na excelência do projeto ${data.projectName} para ${data.clientName}.`,
      `Crie uma seção "Sobre Nós" diferenciada destacando como ${this.agent?.name} eleva o projeto ${data.projectName} de ${data.clientName} a um novo patamar.`,
      `Construa uma apresentação premium da ${this.agent?.name} especificamente para o desafio ${data.projectName} de ${data.clientName}.`,
    ];

    const selectedVariation =
      promptVariations[Math.floor(Math.random() * promptVariations.length)];

    const userPrompt = `${selectedVariation}

CONTEXTO ESPECÍFICO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Empresa: ${this.agent?.name}
- Setor: ${this.agent?.sector}
- Expertise: ${this.agent?.expertise.join(", ")}
- Serviços: ${this.agent?.commonServices.join(", ")}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Foco PRIME: ${
        (this.agent as { primeSpecific: { aboutUsFocus: string } })
          .primeSpecific.aboutUsFocus
      }`
    : ""
}

OBJETIVO: Criar conteúdo premium, sofisticado e persuasivo que conecte ${
      this.agent?.name
    } com as necessidades específicas de ${data.clientName} no projeto ${
      data.projectName
    }.

Retorne APENAS um objeto JSON com:

{
  "title": "Título sofisticado sobre ${this.agent?.name} e ${
      data.projectName
    } (máximo 155 caracteres)",
  "supportText": "Frase de apoio premium única para ${
    data.clientName
  } (máximo 70 caracteres)",
  "subtitle": "Descrição detalhada da abordagem premium de ${
    this.agent?.name
  } para ${data.projectName} (máximo 250 caracteres)"
}

DIRETRIZES:
- Seja específico sobre ${data.projectName} e ${data.clientName}
- Use linguagem sofisticada e elegante
- Destaque qualidade premium e resultados excepcionais
- Evite frases genéricas como "somos especialistas" ou "nossa equipe"
- Crie conexão emocional e comercial de alto nível
- Responda APENAS com o JSON válido, sem explicações.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

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
        // Fallback to default values if JSON parsing fails
        return {
          title: `Somos especialistas em entregar soluções premium com atenção excepcional aos detalhes`,
          supportText: `Qualidade superior em cada projeto`,
          subtitle: `Nossa metodologia PRIME garante resultados excepcionais através de processos detalhados, materiais de alta qualidade e acabamentos superiores. Transformamos sua visão em realidade com excelência técnica e criatividade inovadora.`,
        };
      }

      return {
        title:
          parsed.title ||
          `Somos especialistas em entregar soluções premium com atenção excepcional aos detalhes`,
        supportText: parsed.supportText || `Qualidade superior em cada projeto`,
        subtitle:
          parsed.subtitle ||
          `Nossa metodologia PRIME garante resultados excepcionais através de processos detalhados, materiais de alta qualidade e acabamentos superiores. Transformamos sua visão em realidade com excelência técnica e criatividade inovadora.`,
      };
    } catch (error) {
      console.error("Error generating about us:", error);
      // Fallback to default values
      return {
        title: `Somos especialistas em entregar soluções premium com atenção excepcional aos detalhes`,
        supportText: `Qualidade superior em cada projeto`,
        subtitle: `Nossa metodologia PRIME garante resultados excepcionais através de processos detalhados, materiais de alta qualidade e acabamentos superiores. Transformamos sua visão em realidade com excelência técnica e criatividade inovadora.`,
      };
    }
  }

  private async generateSpecialties(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { specialtiesApproach: string } })
          .primeSpecific.specialtiesApproach
      }`
    : ""
}

Crie uma seção de especialidades para proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "title": "Título da seção de especialidades (máximo 40 caracteres)",
  "specialties": [
    {
      "title": "Nome da especialidade (máximo 50 caracteres)",
      "description": "Descrição da especialidade (máximo 100 caracteres)"
    }
  ]
}

Gere até 9 especialidades baseadas no setor ${
      this.agent?.sector
    } com foco em qualidade premium e atenção aos detalhes.

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default values if JSON parsing fails
        return {
          title: "Especialidades Premium",
          topics: this.generateSpecialtiesFromAgent(),
        };
      }

      return {
        title: parsed.title || "Especialidades Premium",
        topics: parsed.specialties || this.generateSpecialtiesFromAgent(),
      };
    } catch (error) {
      console.error("Error generating specialties:", error);
      // Fallback to default values
      return {
        title: "Especialidades Premium",
        topics: this.generateSpecialtiesFromAgent(),
      };
    }
  }

  private async generateProcessSteps(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { processEmphasis: string } })
          .primeSpecific.processEmphasis
      }`
    : ""
}

Crie uma seção de processo para proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "introduction": "Introdução sobre a metodologia PRIME (máximo 100 caracteres)",
  "title": "Título da seção de processo (máximo 40 caracteres)",
  "steps": [
    {
      "title": "Nome da etapa (máximo 40 caracteres)",
      "description": "Descrição da etapa (máximo 240 caracteres)"
    }
  ]
}

Gere até 5 etapas baseadas no setor ${
      this.agent?.sector
    } com foco em qualidade premium e atenção aos detalhes.

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default values if JSON parsing fails
        return {
          introduction:
            "Nossa metodologia PRIME garante excelência em cada etapa",
          title: "Nosso Processo Premium",
          topics: this.generateStepsFromAgent(),
        };
      }

      return {
        introduction:
          parsed.introduction ||
          "Nossa metodologia PRIME garante excelência em cada etapa",
        title: parsed.title || "Nosso Processo Premium",
        topics: parsed.steps || this.generateStepsFromAgent(),
      };
    } catch (error) {
      console.error("Error generating process steps:", error);
      // Fallback to default values
      return {
        introduction:
          "Nossa metodologia PRIME garante excelência em cada etapa",
        title: "Nosso Processo Premium",
        topics: this.generateStepsFromAgent(),
      };
    }
  }

  private async generateInvestment(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
- Planos Selecionados: ${data.selectedPlans.join(", ")}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { investmentStrategy: string } })
          .primeSpecific.investmentStrategy
      }`
    : ""
}

Crie uma seção de investimento para proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "title": "Título da seção de investimento (máximo 85 caracteres)",
  "deliverables": [
    {
      "title": "Nome do entregável (máximo 30 caracteres)",
      "description": "Descrição do entregável (máximo 330 caracteres)"
    }
  ],
  "plans": [
    {
      "title": "Nome do plano (máximo 20 caracteres)",
      "description": "Descrição do plano (máximo 95 caracteres)",
      "value": "Valor do plano (máximo 11 caracteres)",
      "topics": ["Tópico 1", "Tópico 2", "Tópico 3", "Tópico 4"]
    }
  ]
}

Gere até 3 entregáveis e até 3 planos baseados no setor ${
      this.agent?.sector
    } com foco em qualidade premium e atenção aos detalhes.

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default values if JSON parsing fails
        return {
          title: "Investimento em Qualidade Premium e Resultados Excepcionais",
          deliverables: this.generateDeliverablesFromAgent(),
          plans: this.generatePlansFromAgent(),
        };
      }

      return {
        title:
          parsed.title ||
          "Investimento em Qualidade Premium e Resultados Excepcionais",
        deliverables:
          parsed.deliverables || this.generateDeliverablesFromAgent(),
        plans: parsed.plans || this.generatePlansFromAgent(),
      };
    } catch (error) {
      console.error("Error generating investment:", error);
      // Fallback to default values
      return {
        title: "Investimento em Qualidade Premium e Resultados Excepcionais",
        deliverables: this.generateDeliverablesFromAgent(),
        plans: this.generatePlansFromAgent(),
      };
    }
  }

  private async generateTerms(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { processEmphasis: string } })
          .primeSpecific.processEmphasis
      }`
    : ""
}

Crie termos e condições para proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "terms": [
    {
      "title": "Nome do termo (máximo 30 caracteres)",
      "description": "Descrição do termo (máximo 180 caracteres)"
    }
  ]
}

Gere até 5 termos baseados no setor ${
      this.agent?.sector
    } com foco em qualidade premium e atenção aos detalhes.

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default values if JSON parsing fails
        return [
          {
            title: "Qualidade Premium",
            description:
              "Compromisso com padrões excepcionais e resultados superiores",
          },
          {
            title: "Atenção aos Detalhes",
            description:
              "Cuidado meticuloso em cada elemento e processo do projeto",
          },
          {
            title: "Prazo de Entrega",
            description:
              "Cronograma detalhado respeitado com qualidade premium",
          },
          {
            title: "Suporte Contínuo",
            description:
              "Acompanhamento personalizado e ajustes conforme necessário",
          },
          {
            title: "Garantia de Satisfação",
            description: "Compromisso com resultados que superam expectativas",
          },
        ];
      }

      return (
        parsed.terms || [
          {
            title: "Qualidade Premium",
            description:
              "Compromisso com padrões excepcionais e resultados superiores",
          },
          {
            title: "Atenção aos Detalhes",
            description:
              "Cuidado meticuloso em cada elemento e processo do projeto",
          },
          {
            title: "Prazo de Entrega",
            description:
              "Cronograma detalhado respeitado com qualidade premium",
          },
          {
            title: "Suporte Contínuo",
            description:
              "Acompanhamento personalizado e ajustes conforme necessário",
          },
          {
            title: "Garantia de Satisfação",
            description: "Compromisso com resultados que superam expectativas",
          },
        ]
      );
    } catch (error) {
      console.error("Error generating terms:", error);
      // Fallback to default values
      return [
        {
          title: "Qualidade Premium",
          description:
            "Compromisso com padrões excepcionais e resultados superiores",
        },
        {
          title: "Atenção aos Detalhes",
          description:
            "Cuidado meticuloso em cada elemento e processo do projeto",
        },
        {
          title: "Prazo de Entrega",
          description: "Cronograma detalhado respeitado com qualidade premium",
        },
        {
          title: "Suporte Contínuo",
          description:
            "Acompanhamento personalizado e ajustes conforme necessário",
        },
        {
          title: "Garantia de Satisfação",
          description: "Compromisso com resultados que superam expectativas",
        },
      ];
    }
    // The following return is unreachable, but left for completeness.
    return [
      {
        title: "Qualidade Premium",
        description:
          "Compromisso com padrões excepcionais e resultados superiores",
      },
      {
        title: "Atenção aos Detalhes",
        description:
          "Cuidado meticuloso em cada elemento e processo do projeto",
      },
      {
        title: "Prazo de Entrega",
        description: "Cronograma detalhado e respeitado com qualidade premium",
      },
      {
        title: "Suporte Contínuo",
        description:
          "Acompanhamento personalizado e ajustes conforme necessário",
      },
      {
        title: "Garantia de Satisfação",
        description: "Compromisso com resultados que superam expectativas",
      },
    ];
  }

  private async generateFAQ(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { processEmphasis: string } })
          .primeSpecific.processEmphasis
      }`
    : ""
}

Crie perguntas frequentes para proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "faq": [
    {
      "question": "Pergunta frequente (máximo 100 caracteres)",
      "answer": "Resposta da pergunta (máximo 200 caracteres)"
    }
  ]
}

Gere até 5 perguntas frequentes baseadas no setor ${
      this.agent?.sector
    } com foco em qualidade premium e atenção aos detalhes.

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default values if JSON parsing fails
        return [
          {
            question: "O que diferencia a metodologia PRIME?",
            answer:
              "Foco em qualidade premium, atenção aos detalhes e resultados excepcionais que superam expectativas",
          },
          {
            question: "Como garantem a qualidade superior?",
            answer:
              "Processos detalhados, materiais de alta qualidade e acabamentos superiores em cada etapa do projeto",
          },
          {
            question: "Qual o prazo de entrega?",
            answer:
              "Cronograma detalhado respeitado com qualidade premium e atenção aos detalhes",
          },
          {
            question: "Oferecem suporte contínuo?",
            answer:
              "Acompanhamento personalizado e ajustes conforme necessário para garantir satisfação total",
          },
          {
            question: "Qual a garantia de satisfação?",
            answer:
              "Compromisso com resultados que superam expectativas e qualidade premium em todos os entregáveis",
          },
        ];
      }

      return (
        parsed.faq || [
          {
            question: "O que diferencia a metodologia PRIME?",
            answer:
              "Foco em qualidade premium, atenção aos detalhes e resultados excepcionais que superam expectativas",
          },
          {
            question: "Como garantem a qualidade superior?",
            answer:
              "Processos detalhados, materiais de alta qualidade e acabamentos superiores em cada etapa do projeto",
          },
          {
            question: "Qual o prazo de entrega?",
            answer:
              "Cronograma detalhado respeitado com qualidade premium e atenção aos detalhes",
          },
          {
            question: "Oferecem suporte contínuo?",
            answer:
              "Acompanhamento personalizado e ajustes conforme necessário para garantir satisfação total",
          },
          {
            question: "Qual a garantia de satisfação?",
            answer:
              "Compromisso com resultados que superam expectativas e qualidade premium em todos os entregáveis",
          },
        ]
      );
    } catch (error) {
      console.error("Error generating FAQ:", error);
      // Fallback to default values
      return [
        {
          question: "O que diferencia a metodologia PRIME?",
          answer:
            "Foco em qualidade premium, atenção aos detalhes e resultados excepcionais que superam expectativas",
        },
        {
          question: "Como garantem a qualidade superior?",
          answer:
            "Processos detalhados, materiais de alta qualidade e acabamentos superiores em cada etapa do projeto",
        },
        {
          question: "Qual o prazo de entrega?",
          answer:
            "Cronograma detalhado respeitado com qualidade premium e atenção aos detalhes",
        },
        {
          question: "Oferecem suporte contínuo?",
          answer:
            "Acompanhamento personalizado e ajustes conforme necessário para garantir satisfação total",
        },
        {
          question: "Qual a garantia de satisfação?",
          answer:
            "Compromisso com resultados que superam expectativas e qualidade premium em todos os entregáveis",
        },
      ];
    }
  }

  private async generateFooter(data: PrimeThemeData) {
    const userPrompt = `Você é um especialista em criação de propostas comerciais PRIME. Responda APENAS com JSON válido, sem texto adicional.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Setor: ${this.agent?.sector}
${
  this.agent && "primeSpecific" in this.agent && this.agent.primeSpecific
    ? `- Metodologia PRIME: ${
        (this.agent as { primeSpecific: { investmentStrategy: string } })
          .primeSpecific.investmentStrategy
      }`
    : ""
}

Crie um call-to-action para o footer da proposta PRIME. Retorne APENAS um objeto JSON com:

{
  "callToAction": "Texto do call-to-action (máximo 80 caracteres)"
}

O call-to-action deve enfatizar a metodologia PRIME: qualidade premium, atenção aos detalhes e resultados excepcionais.

REGRAS CRÍTICAS PARA JSON VÁLIDO:
- Use APENAS aspas duplas (") para strings
- Escape quebras de linha com \\n
- Escape aspas dentro de strings com \\"
- NÃO use vírgulas no final de arrays ou objetos
- NÃO inclua propriedades extras como "_id", "__v"
- Valores monetários: "R$ 1.999,90" (sem unicode)
- Nomes de propriedades exatamente como especificado
- Teste o JSON antes de retornar

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    try {
      const response = await this.runLLM(userPrompt, this.agent?.systemPrompt);
      let parsed;

      try {
        parsed = JSON.parse(response);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Response:", response);
        // Fallback to default value if JSON parsing fails
        return {
          callToAction:
            "Transforme sua visão em realidade com qualidade premium e resultados excepcionais",
        };
      }

      return {
        callToAction:
          parsed.callToAction ||
          "Transforme sua visão em realidade com qualidade premium e resultados excepcionais",
      };
    } catch (error) {
      console.error("Error generating footer:", error);
      // Fallback to default value
      return {
        callToAction:
          "Transforme sua visão em realidade com qualidade premium e resultados excepcionais",
      };
    }
  }

  // Helper methods for extracting content
  private extractServices(content: string): string[] {
    const services: string[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*/);
      if (match && services.length < 4) {
        const service = match[1].trim();
        if (service.length <= 30) {
          services.push(service);
        }
      }
    }

    return services.length > 0
      ? services
      : [
          "Design Premium",
          "Desenvolvimento Avançado",
          "Estratégia Personalizada",
          "Resultados Excepcionais",
        ];
  }

  private extractSpecialties(
    content: string
  ): Array<{ title: string; description: string }> {
    const specialties: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && specialties.length < 9) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 50 && description.length <= 100) {
          specialties.push({ title, description });
        }
      }
    }

    return specialties.length > 0
      ? specialties
      : [
          {
            title: "Design Exclusivo",
            description: "Criação de identidades visuais únicas e memoráveis",
          },
          {
            title: "Desenvolvimento Avançado",
            description: "Soluções técnicas robustas e escaláveis",
          },
          {
            title: "Estratégia Personalizada",
            description: "Abordagens customizadas para cada projeto",
          },
        ];
  }

  private extractProcessSteps(
    content: string
  ): Array<{ title: string; description: string }> {
    const steps: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && steps.length < 5) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 40 && description.length <= 240) {
          steps.push({ title, description });
        }
      }
    }

    return steps.length > 0
      ? steps
      : [
          {
            title: "Descoberta Premium",
            description:
              "Análise profunda das necessidades e objetivos do projeto",
          },
          {
            title: "Planejamento Estratégico",
            description: "Estratégia detalhada com foco em qualidade superior",
          },
          {
            title: "Execução Excepcional",
            description: "Desenvolvimento com atenção meticulosa aos detalhes",
          },
        ];
  }

  private extractDeliverables(
    content: string
  ): Array<{ title: string; description: string }> {
    const deliverables: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && deliverables.length < 3) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 30 && description.length <= 330) {
          deliverables.push({ title, description });
        }
      }
    }

    return deliverables.length > 0
      ? deliverables
      : [
          {
            title: "Solução Premium Completa",
            description:
              "Entrega integral com qualidade superior e atenção aos detalhes",
          },
          {
            title: "Suporte Contínuo",
            description:
              "Acompanhamento personalizado e ajustes conforme necessário",
          },
        ];
  }

  private extractPlans(content: string): Array<{
    title: string;
    description: string;
    value: string;
    topics: string[];
  }> {
    const plans: Array<{
      title: string;
      description: string;
      value: string;
      topics: string[];
    }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(
        /^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+?)\s*\((.+?)\)/
      );
      if (match && plans.length < 3) {
        const title = match[1].trim();
        const description = match[2].trim();
        const value = match[3].trim();

        if (
          title.length <= 20 &&
          description.length <= 95 &&
          value.length <= 11
        ) {
          plans.push({
            title,
            description,
            value,
            topics: [
              "Qualidade Premium",
              "Atenção aos Detalhes",
              "Resultados Excepcionais",
            ],
          });
        }
      }
    }

    return plans.length > 0
      ? plans
      : [
          {
            title: "Plano Essencial Premium",
            description: "Soluções básicas com qualidade superior",
            value: "R$ 2.890",
            topics: [
              "Qualidade Premium",
              "Atenção aos Detalhes",
              "Suporte Básico",
            ],
          },
        ];
  }

  private extractTerms(
    content: string
  ): Array<{ title: string; description: string }> {
    const terms: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && terms.length < 5) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 30 && description.length <= 180) {
          terms.push({ title, description });
        }
      }
    }

    return terms.length > 0
      ? terms
      : [
          {
            title: "Qualidade Premium",
            description: "Compromisso com padrões excepcionais",
          },
          {
            title: "Atenção aos Detalhes",
            description: "Cuidado meticuloso em cada elemento",
          },
        ];
  }

  private extractFAQ(
    content: string
  ): Array<{ question: string; answer: string }> {
    const faqs: Array<{ question: string; answer: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*Q:\s*(.+?)\*\*\s*A:\s*(.+)/);
      if (match && faqs.length < 5) {
        const question = match[1].trim();
        const answer = match[2].trim();
        if (question.length <= 100 && answer.length <= 200) {
          faqs.push({ question, answer });
        }
      }
    }

    return faqs.length > 0
      ? faqs
      : [
          {
            question: "O que diferencia a metodologia PRIME?",
            answer:
              "Foco em qualidade premium, atenção aos detalhes e resultados excepcionais",
          },
        ];
  }

  private async runLLM(
    userPrompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const messages: { role: "system" | "user"; content: string }[] = [];

    if (systemPrompt) {
      // Log para debug - verificar se o system prompt está sendo aplicado
      console.log("🔍 Prime LLM Debug:");
      console.log(
        "- System Prompt (primeiros 100 chars):",
        systemPrompt.substring(0, 100) + "..."
      );
      console.log(
        "- User Prompt (primeiros 100 chars):",
        userPrompt.substring(0, 100) + "..."
      );

      messages.push({
        role: "system",
        content: `${systemPrompt}\n\nIMPORTANTE: Seja criativo, específico e evite frases genéricas. Use português correto e linguagem natural.`,
      });
    }

    messages.push({ role: "user", content: userPrompt });

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7, // Increased for more creativity while maintaining structure
        max_tokens: 2000, // Balanced for comprehensive responses
        top_p: 0.95, // Increased for more diversity
        top_k: 40, // Reduced for more focused responses
        repetition_penalty: 1.2, // Increased to reduce repetition
        frequency_penalty: 0.3, // Increased to reduce repetitive phrases
        presence_penalty: 0.2, // Added to encourage new topics
        stop: ["```", "```json", "```JSON", "\n\n\n"],
      });

      const content = response.choices[0].message?.content;
      console.log(
        "- Response (primeiros 100 chars):",
        content?.substring(0, 100) + "..."
      );
      assert(typeof content === "string");

      // Extract JSON from the response if it's wrapped in text
      return this.extractJSONFromResponse(content);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("429")) {
        // Rate limit exceeded - wait and retry once
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

        const retryResponse = await client.chat.completions.create({
          model: this.model,
          messages,
          temperature: 0.3,
          max_tokens: 3000,
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

  private generateSpecialtiesFromAgent() {
    if (!this.agent) return [];

    return this.agent.expertise.slice(0, 9).map((expertise: string) => ({
      title: expertise,
      description: `Especialização premium em ${expertise.toLowerCase()} com foco em qualidade excepcional e resultados superiores`,
    }));
  }

  private generateStepsFromAgent() {
    if (!this.agent) return [];

    return this.agent.proposalStructure.slice(0, 5).map((step: string) => ({
      title: step,
      description: `${step}: Etapa fundamental do nosso processo premium especializado em ${this.agent?.sector.toLowerCase()}, garantindo qualidade excepcional e atenção aos detalhes em cada etapa do projeto`,
    }));
  }

  private generateDeliverablesFromAgent() {
    if (!this.agent) return [];

    return this.agent.commonServices.slice(0, 4).map((service: string) => ({
      title: service,
      description: `${service} desenvolvido com expertise premium em ${this.agent?.sector.toLowerCase()}, incluindo todas as especificações técnicas e melhores práticas do mercado para garantir resultados excepcionais`,
    }));
  }

  private generatePlansFromAgent() {
    if (!this.agent) return [];

    const pricingMap = {
      "monthly-retainer": { basic: "R$ 3.500/mês", premium: "R$ 6.500/mês" },
      "project-based": { basic: "R$ 4.500", premium: "R$ 8.500" },
      "hourly-or-project": { basic: "R$ 5.500", premium: "R$ 9.500" },
      "project-percentage": { basic: "R$ 6.500", premium: "R$ 11.000" },
      "session-based": { basic: "R$ 2.500", premium: "R$ 4.800" },
      "consultation-based": { basic: "R$ 500", premium: "R$ 800" },
    };

    const pricing =
      pricingMap[this.agent.pricingModel as keyof typeof pricingMap] ||
      pricingMap["project-based"];

    return [
      {
        title: "Plano Essencial Premium",
        description:
          "Soluções básicas com qualidade premium e atenção aos detalhes",
        value: pricing.basic,
        topics: [
          "Qualidade Premium",
          "Atenção aos Detalhes",
          "Suporte Básico",
          "Resultados Garantidos",
        ],
      },
      {
        title: "Plano Executivo Premium",
        description:
          "Soluções intermediárias com qualidade superior e acompanhamento personalizado",
        value: pricing.premium,
        topics: [
          "Qualidade Superior",
          "Acompanhamento Personalizado",
          "Suporte Premium",
          "Resultados Excepcionais",
        ],
      },
    ];
  }
}
