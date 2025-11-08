export interface TemplateConfig {
  id: string;
  name: string;
  type: "flash" | "prime" | "grid";
  status: "active" | "inactive";
  description: string;
  lastUpdated: string;

  // MoA Configuration
  moa: {
    enabled: boolean;
    referenceModels: string[];
    aggregatorModel: string;
    maxRetries: number;
    temperature: number;
    maxTokens: number;
  };

  // Section-specific prompts and rules
  sections: {
    introduction: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    aboutUs: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    team: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    specialties: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
      minTopics: number;
      maxTopics: number;
    };
    steps: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
      exactSteps: number;
    };
    scope: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    investment: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    terms: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    faq: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
      exactQuestions: number;
    };
    footer: {
      enabled: boolean;
      callToAction: string;
      disclaimer: string;
    };
  };

  // Agent-specific overrides
  agentOverrides: {
    [agentId: string]: {
      systemPrompt?: string;
      sectionOverrides?: {
        [sectionKey: string]: {
          prompt?: string;
          rules?: string[];
        };
      };
    };
  };
}

export const defaultTemplateConfigs: Record<string, TemplateConfig> = {
  flash: {
    id: "flash",
    name: "Flash",
    type: "flash",
    status: "active",
    description:
      "Template moderno e dinâmico com design limpo e foco na conversão",
    lastUpdated: "2024-01-15",

    moa: {
      enabled: true,
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
    },

    sections: {
      introduction: {
        enabled: true,
        prompt: `DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

Gere a introdução planejando cada frase para nascer dentro dos limites abaixo sem ultrapassar. NÃO corte texto depois de escrever; produza diretamente com a contagem final desejada. Use linguagem premium, sensorial e acolhedora, mantendo sofisticação sem soar artificial.

Retorne APENAS um JSON válido com:
{
  "title": "Frase imperativa, inclusiva e direta com no máximo 60 caracteres, em Title Case e transmitindo exclusividade imediata",
  "subtitle": "Frase sobre benefício, transformação e bem-estar com no máximo 100 caracteres, evocando cuidado artesanal e impacto concreto",
  "services": [
    "Serviço 1 com no máximo 30 caracteres",
    "Serviço 2 com no máximo 30 caracteres",
    "Serviço 3 com no máximo 30 caracteres",
    "Serviço 4 com no máximo 30 caracteres"
  ],
  "validity": "15 dias",
  "buttonText": "Solicitar Proposta"
}

REGRAS OBRIGATÓRIAS:
- NUNCA ultrapassar 60 caracteres no title; tom imperativo, inclusivo e sofisticado em Title Case
- NUNCA ultrapassar 100 caracteres no subtitle; reforçar transformação, impacto e bem-estar com linguagem sensorial premium
- services: EXATAMENTE 4 itens, cada um com NO MÁXIMO 30 caracteres
- validity: manter exatamente "15 dias"
- buttonText: manter exatamente "Solicitar Proposta"
- Produza o texto já com o tamanho correto, sem truncar ou cortar manualmente
- Utilize vocabulário preciso, elegante e humano; evite palavras genéricas como "melhor", "completo" ou "rápido"
- NÃO mencione o nome do cliente, mantenha linguagem humana e calorosa
- Responda APENAS com o JSON válido, sem comentários ou texto adicional.`,
        expectedFormat: `{
  "title": "string (maximum 60 characters, Title Case, premium tone)",
  "subtitle": "string (maximum 100 characters, sensory premium tone)",
  "services": [
    "string (maximum 30 characters)",
    "string (maximum 30 characters)",
    "string (maximum 30 characters)",
    "string (maximum 30 characters)"
  ],
  "validity": "15 dias",
  "buttonText": "Solicitar Proposta"
}`,
        rules: [
          "title: NUNCA ultrapassar 60 caracteres, imperativo, inclusivo e sofisticado",
          "subtitle: NUNCA ultrapassar 100 caracteres, linguagem sensorial premium",
          "services: EXATAMENTE 4 itens, cada um com NO MÁXIMO 30 caracteres",
          'validity: manter "15 dias"',
          'buttonText: manter "Solicitar Proposta"',
          "Planeje o tamanho antes de escrever; não cortar texto",
          "Não mencionar o nome do cliente nos textos",
        ],
      },

      aboutUs: {
        enabled: true,
        prompt: `Crie uma seção "Sobre Nós" única e personalizada para nossa empresa no projeto {projectName} de {clientName}.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

Retorne APENAS um JSON válido com cada campo respeitando o limite máximo solicitado. Não corte texto ao final; planeje o número de caracteres antes de escrever.
{
  "title": "Título que mostra transformação, valor e benefício com no máximo 155 caracteres",
  "supportText": "Texto de apoio com no máximo 70 caracteres",
  "subtitle": "Subtítulo detalhado com no máximo 250 caracteres"
}

REGRAS OBRIGATÓRIAS:
- NUNCA ultrapassar 155 caracteres no title
- NUNCA ultrapassar 70 caracteres no supportText
- NUNCA ultrapassar 250 caracteres no subtitle
- Antecipe o tamanho antes de escrever; não gere texto maior para depois cortar
- Foque em transformação, impacto, confiança e benefício contínuo com vocabulário premium, sensorial e autoral
- Use linguagem natural, próxima, calorosa, confiante e sofisticada
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (maximum 155 characters)",
  "supportText": "string (maximum 70 characters)",
  "subtitle": "string (maximum 250 characters)"
}`,
        rules: [
          "title: NUNCA ultrapassar 155 caracteres",
          "supportText: NUNCA ultrapassar 70 caracteres",
          "subtitle: NUNCA ultrapassar 250 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Foque em transformação, impacto, confiança e benefício contínuo com vocabulário premium",
          "Use linguagem natural, próxima, calorosa e confiante, mantendo sofisticação",
        ],
      },

      team: {
        enabled: true,
        prompt: `Responda APENAS com JSON válido. Gere o título da seção "Time" com no máximo 55 caracteres (ideal manter entre 50 e 55 sem ultrapassar):
- Linguagem: Português brasileiro
- Tom: Empático, moderno, acessível, profissional e impactante
- Foco: Mostrar dedicação, proximidade e confiança
- Use primeira pessoa do plural

Retorne APENAS:
{
  "title": "Título com no máximo 55 caracteres, mostrando dedicação, proximidade e confiança"
}

REGRAS OBRIGATÓRIAS:
- NUNCA ultrapassar 55 caracteres (planeje antes de escrever)
- Mostrar dedicação, proximidade e confiança
- Use primeira pessoa do plural
- Planeje a contagem antes de escrever; não corte texto ao final
- Utilize tom premium e sofisticado sem perder naturalidade`,
        expectedFormat: `{
  "title": "string (maximum 55 characters, premium tone)"
}`,
        rules: [
          "title: NUNCA ultrapassar 55 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Mostrar dedicação, proximidade e confiança",
          "Usar primeira pessoa do plural",
        ],
      },

      specialties: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Especialidades" cumprindo rigorosamente os limites máximos.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "title": "Frase com no máximo 140 caracteres demonstrando autoridade e resultados comprovados",
  "topics": [
    {
      "title": "Título com no máximo 50 caracteres",
      "description": "Descrição com no máximo 100 caracteres"
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- Gere entre 6 e 9 tópicos exclusivos
- NUNCA ultrapassar 140 caracteres no title
- topic.title: NUNCA ultrapassar 50 caracteres cada
- topic.description: NUNCA ultrapassar 100 caracteres cada
- Planeje o texto para nascer dentro do limite; não corte ou trunque
- Linguagem profissional, calorosa, sofisticada e orientada a impacto e bem-estar
- Responda APENAS com o JSON válido, sem comentários.`,
        expectedFormat: `{
  "title": "string (maximum 140 characters)",
  "topics": [
    {
      "title": "string (maximum 50 characters)",
      "description": "string (maximum 100 characters)"
    }
  ]
}`,
        rules: [
          "Título principal: NUNCA ultrapassar 140 caracteres",
          "Gerar entre 6 e 9 tópicos",
          "topic.title: NUNCA ultrapassar 50 caracteres",
          "topic.description: NUNCA ultrapassar 100 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Linguagem profissional, calorosa, sofisticada e orientada a resultados",
        ],
        minTopics: 6,
        maxTopics: 9,
      },

      steps: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Processo" respeitando os limites máximos.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "title": "Nosso Processo",
  "introduction": "Frase com no máximo 100 caracteres explicando o ritmo ágil, cuidadoso e sofisticado",
  "topics": [
    {
      "title": "Título da etapa com no máximo 40 caracteres",
      "description": "Descrição da etapa com no máximo 240 caracteres"
    }
  ],
  "marquee": [
    {
      "text": "Mensagem curta opcional"
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- Título fixo: "Nosso Processo"
- introduction: NUNCA ultrapassar 100 caracteres, tom premium e acolhedor
- topics: EXATAMENTE 5 itens
- topic.title: NUNCA ultrapassar 40 caracteres
- topic.description: NUNCA ultrapassar 240 caracteres
- Planeje a contagem antes de escrever; não corte texto
- Use linguagem profissional, transparente e acolhedora
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "Nosso Processo",
  "introduction": "string (maximum 100 characters)",
  "topics": [
    {
      "title": "string (maximum 40 characters)",
      "description": "string (maximum 240 characters)"
    }
  ],
  "marquee": [
    {
      "text": "string"
    }
  ]
}`,
        rules: [
          "title fixo: Nosso Processo",
          "introduction: NUNCA ultrapassar 100 caracteres com tom premium e acolhedor",
          "topics: EXATAMENTE 5 itens",
          "topic.title: NUNCA ultrapassar 40 caracteres",
          "topic.description: NUNCA ultrapassar 240 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Linguagem profissional, transparente e acolhedora",
        ],
        exactSteps: 5,
      },

      scope: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para o escopo do projeto, mantendo o texto dentro do limite máximo.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "content": "Parágrafo contínuo com no máximo 350 caracteres, destacando benefícios, entregas e narrativa premium"
}

REGRAS OBRIGATÓRIAS:
- NUNCA ultrapassar 350 caracteres no content (ideal manter entre 320 e 350 sem exceder)
- Foque em benefícios do investimento e entregas com narrativa premium e sensorial
- Use linguagem profissional, calorosa e focada em resultados tangíveis
- Planeje o texto para já nascer dentro do limite; não escreva para depois cortar
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "content": "string (maximum 350 characters, premium tone)"
}`,
        rules: [
          "content: NUNCA ultrapassar 350 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Foque em benefícios do investimento e entregas com narrativa premium",
          "Use linguagem profissional, calorosa e focada em resultados",
        ],
      },

      investment: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Investimento" obedecendo todos os limites máximos de caracteres.

PROJETO: {projectName} - {projectDescription}
PLANOS SELECIONADOS: {selectedPlans}

Retorne:
{
  "title": "Frase com no máximo 85 caracteres apresentando valor, impacto e personalização do orçamento",
  "deliverables": [
    {
      "title": "Título com no máximo 30 caracteres",
      "description": "Descrição com no máximo 360 caracteres, tom imperativo destacando impacto, transformação e bem-estar"
    }
  ],
  "plansItems": [
    {
      "title": "Título do plano com no máximo 20 caracteres",
      "description": "Descrição com no máximo 140 caracteres",
      "value": "Formato R$X.XXX (máximo 11 caracteres)",
      "planPeriod": "Mensal | Trimestral | Semestral | Anual | Único",
      "buttonTitle": "CTA curta (no máximo 25 caracteres)",
      "recommended": true,
      "hideTitleField": false,
      "hideDescription": false,
      "hidePrice": false,
      "hidePlanPeriod": false,
      "hideButtonTitle": false,
      "sortOrder": 0,
      "includedItems": [
        {
          "id": "string",
          "description": "Entrega com até 45 caracteres"
        }
      ]
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- title: NUNCA ultrapassar 85 caracteres
- deliverables: 2 a 5 itens; cada title no máximo 30 caracteres e description no máximo 360 caracteres
- plansItems: quantidade deve respeitar {selectedPlans} (mínimo 1, máximo 3)
- plan.title: NUNCA ultrapassar 20 caracteres
- plan.description: NUNCA ultrapassar 140 caracteres
- plan.value: string no formato R$X.XXX (máximo 11 caracteres, exemplo "R$8.500")
- plan.buttonTitle: CTA imperativa no máximo 25 caracteres
- plan.planPeriod: defina coerente com o plano (ex.: "Mensal", "Anual", "Único")
- plan.recommended: apenas um plano deve ser true (use o de maior valor)
- includedItems: 3 a 6 itens por plano, description no máximo 45 caracteres
- Gere IDs únicos para planos e itens; mantenha sortOrder sequencial a partir de 0
- Inclua os campos hideTitleField, hideDescription, hidePrice, hidePlanPeriod e hideButtonTitle como false
- Inclua hideItem e sortOrder em cada includedItem (hideItem false; sortOrder crescente)
- sortOrder: utilize números inteiros iniciando em 0 em ordem crescente
- Planeje o tamanho antes de escrever; não corte texto
- Linguagem sofisticada, sedutora e orientada a valor percebido
- Responda APENAS com o JSON válido, sem comentários.`,
        expectedFormat: `{
  "title": "string (maximum 85 characters)",
  "deliverables": [
    {
      "title": "string (maximum 30 characters)",
      "description": "string (maximum 360 characters)"
    }
  ],
  "plansItems": [
    {
      "id": "string",
      "title": "string (maximum 20 characters)",
      "description": "string (maximum 140 characters)",
      "value": "string (<= 11 characters, formato R$X.XXX)",
      "planPeriod": "string",
      "buttonTitle": "string (maximum 25 characters)",
      "recommended": boolean,
      "hideTitleField": boolean,
      "hideDescription": boolean,
      "hidePrice": boolean,
      "hidePlanPeriod": boolean,
      "hideButtonTitle": boolean,
      "sortOrder": number,
      "includedItems": [
        {
          "id": "string",
          "description": "string (max 45 characters)",
          "hideItem": boolean,
          "sortOrder": number
        }
      ]
    }
  ]
}`,
        rules: [
          "title: EXATAMENTE 85 caracteres",
          "deliverables: 2 a 5 itens, title até 30 caracteres, description até 330 caracteres",
          "plansItems: quantidade = {selectedPlans} (1 a 3)",
          "plan.title: EXATAMENTE 20 caracteres",
          "plan.description: EXATAMENTE 95 caracteres",
          "plan.value: formato R$X.XXX com até 11 caracteres",
          "plan.buttonTitle: CTA imperativa até 25 caracteres",
          "plan.planPeriod coerente (Mensal, Trimestral, Semestral, Anual ou Único)",
          "plan.recommended: apenas o plano de maior valor deve ser true",
          "includedItems: 3 a 6 por plano, description até 45 caracteres",
          "IDs únicos para planos e itens; sortOrder sequencial iniciando em 0",
          "Campos hide* devem ser false; includedItems com hideItem false",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Linguagem sofisticada, sedutora e orientada a valor percebido",
        ],
      },

      terms: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para termos e condições respeitando limites de tamanho sem ultrapassar.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "title": "Título com no máximo 30 caracteres, direto e elegante",
  "description": "Texto contínuo com no máximo 180 caracteres, mencionando prazo, pagamento e suporte com tom confiante"
}

REGRAS OBRIGATÓRIAS:
- NUNCA ultrapassar 30 caracteres no title (planeje antes de escrever)
- NUNCA ultrapassar 180 caracteres na description (planeje antes de escrever)
- Inclua prazo, pagamento e suporte no texto com tom confiante e refinado
- Use linguagem clara, objetiva, profissional e sofisticada
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (maximum 30 characters, premium tone)",
  "description": "string (maximum 180 characters, premium tone)"
}`,
        rules: [
          "title: NUNCA ultrapassar 30 caracteres",
          "description: NUNCA ultrapassar 180 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Incluir prazo, pagamento e suporte com tom confiante e refinado",
          "Linguagem clara, profissional e sofisticada",
        ],
      },

      faq: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para perguntas frequentes, respeitando limites máximos.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "faq": [
    {
      "question": "Pergunta com no máximo 100 caracteres",
      "answer": "Resposta com no máximo 300 caracteres"
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 10 perguntas e respostas
- question: NUNCA ultrapassar 100 caracteres
- answer: NUNCA ultrapassar 300 caracteres
- Cada pergunta deve ter question e answer
- Use linguagem clara, acolhedora, profissional e sofisticada
- Foque em dúvidas comuns do cliente para este projeto
- Planeje a contagem antes de escrever; não corte texto
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "faq": [
    {
      "question": "string (maximum 100 characters)",
      "answer": "string (maximum 300 characters)"
    }
  ]
}`,
        rules: [
          "EXATAMENTE 10 perguntas e respostas",
          "question: NUNCA ultrapassar 100 caracteres",
          "answer: NUNCA ultrapassar 300 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Use linguagem clara, acolhedora, profissional e sofisticada",
          "Foque em dúvidas comuns do cliente para este projeto",
        ],
        exactQuestions: 10,
      },

      footer: {
        enabled: true,
        callToAction: "Transforme sua presença digital conosco",
        disclaimer:
          "Estamos à disposição para apoiar cada etapa do seu projeto. Conte com nossa equipe para garantir sucesso, impacto e crescimento contínuo, com atenção e dedicação personalizada.",
      },
    },

    agentOverrides: {},
  },

  prime: {
    id: "prime",
    name: "Prime",
    type: "prime",
    status: "active",
    description:
      "Template premium com layout sofisticado e elementos visuais avançados",
    lastUpdated: "2024-01-10",

    moa: {
      enabled: true,
      referenceModels: [
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "deepseek-ai/DeepSeek-V3.1",
        "Qwen/Qwen2.5-7B-Instruct-Turbo",
      ],
      aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      maxRetries: 3,
      temperature: 0.6,
      maxTokens: 2500,
    },

    sections: {
      // Similar structure but with Prime-specific prompts
      introduction: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },
      aboutUs: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },
      team: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },
      specialties: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
        minTopics: 8,
        maxTopics: 12,
      },
      steps: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
        exactSteps: 6,
      },
      scope: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },
      investment: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },
      terms: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },
      faq: {
        enabled: true,
        prompt: "",
        expectedFormat: "",
        rules: [],
        exactQuestions: 12,
      },
      footer: {
        enabled: true,
        callToAction: "Eleve seus resultados conosco",
        disclaimer:
          "Nossa equipe está comprometida em entregar soluções excepcionais que superem suas expectativas e impulsionem seu negócio para novos patamares de sucesso.",
      },
    },

    agentOverrides: {},
  },
};

export class TemplateConfigManager {
  private configs: Map<string, TemplateConfig> = new Map();

  constructor() {
    // Initialize with default configs
    Object.values(defaultTemplateConfigs).forEach((config) => {
      this.configs.set(config.id, config);
    });
  }

  getConfig(templateId: string): TemplateConfig | undefined {
    return this.configs.get(templateId);
  }

  setConfig(templateId: string, config: TemplateConfig): void {
    this.configs.set(templateId, config);
  }

  getAllConfigs(): TemplateConfig[] {
    return Array.from(this.configs.values());
  }

  getActiveConfigs(): TemplateConfig[] {
    return this.getAllConfigs().filter((config) => config.status === "active");
  }

  updateSectionConfig(
    templateId: string,
    sectionKey: string,
    sectionConfig: Record<string, unknown>
  ): boolean {
    const config = this.configs.get(templateId);
    if (!config) return false;

    if (sectionKey in config.sections) {
      const currentSection = (config.sections as Record<string, unknown>)[
        sectionKey
      ] as Record<string, unknown>;
      (config.sections as Record<string, unknown>)[sectionKey] = {
        ...currentSection,
        ...sectionConfig,
      };
      return true;
    }
    return false;
  }

  updateMoAConfig(
    templateId: string,
    moaConfig: Partial<TemplateConfig["moa"]>
  ): boolean {
    const config = this.configs.get(templateId);
    if (!config) return false;

    config.moa = { ...config.moa, ...moaConfig };
    return true;
  }

  addAgentOverride(
    templateId: string,
    agentId: string,
    override: TemplateConfig["agentOverrides"][string]
  ): boolean {
    const config = this.configs.get(templateId);
    if (!config) return false;

    config.agentOverrides[agentId] = override;
    return true;
  }

  getEffectiveConfig(
    templateId: string,
    agentId?: string
  ): TemplateConfig | undefined {
    const config = this.configs.get(templateId);
    if (!config) return undefined;

    if (!agentId || !config.agentOverrides[agentId]) {
      return config;
    }

    // Apply agent-specific overrides
    const agentOverride = config.agentOverrides[agentId];
    const effectiveConfig = { ...config };

    if (agentOverride.systemPrompt) {
      // This would be used in the generation process
    }

    if (agentOverride.sectionOverrides) {
      Object.entries(agentOverride.sectionOverrides).forEach(
        ([sectionKey, override]) => {
          if (sectionKey in effectiveConfig.sections) {
            const section = (
              effectiveConfig.sections as Record<string, unknown>
            )[sectionKey] as Record<string, unknown>;
            if (override.prompt) section.prompt = override.prompt;
            if (override.rules) section.rules = override.rules;
          }
        }
      );
    }

    return effectiveConfig;
  }
}

// Global instance
export const templateConfigManager = new TemplateConfigManager();
