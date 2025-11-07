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

Gere a introdução planejando cada frase para já nascer com o tamanho exato descrito abaixo. NÃO corte texto depois de escrever; produza diretamente com a contagem correta de caracteres.

Retorne APENAS um JSON válido com:
{
  "title": "Frase imperativa, inclusiva e direta com exatamente 60 caracteres",
  "subtitle": "Frase sobre benefício, transformação e bem-estar com exatamente 100 caracteres",
  "services": [
    "Serviço 1 com exatamente 30 caracteres",
    "Serviço 2 com exatamente 30 caracteres",
    "Serviço 3 com exatamente 30 caracteres",
    "Serviço 4 com exatamente 30 caracteres"
  ],
  "validity": "15 dias",
  "buttonText": "Solicitar Proposta"
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 60 caracteres, tom imperativo e inclusivo
- subtitle: EXATAMENTE 100 caracteres, reforçando transformação, impacto e bem-estar
- services: EXATAMENTE 4 itens, cada um com EXATAMENTE 30 caracteres
- validity: manter exatamente "15 dias"
- buttonText: manter exatamente "Solicitar Proposta"
- Produza o texto já com o tamanho correto, sem truncar ou cortar manualmente
- NÃO mencione o nome do cliente, mantenha linguagem humana e calorosa
- Responda APENAS com o JSON válido, sem comentários ou texto adicional.`,
        expectedFormat: `{
  "title": "string (exactly 60 characters)",
  "subtitle": "string (exactly 100 characters)",
  "services": [
    "string (exactly 30 characters)",
    "string (exactly 30 characters)",
    "string (exactly 30 characters)",
    "string (exactly 30 characters)"
  ],
  "validity": "15 dias",
  "buttonText": "Solicitar Proposta"
}`,
        rules: [
          "title: EXATAMENTE 60 caracteres, imperativo e inclusivo",
          "subtitle: EXATAMENTE 100 caracteres, evidenciando transformação, impacto e bem-estar",
          "services: EXATAMENTE 4 itens, cada um com EXATAMENTE 30 caracteres",
          "validity: manter \"15 dias\"",
          "buttonText: manter \"Solicitar Proposta\"",
          "Planeje o tamanho antes de escrever; não corte texto",
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

Retorne APENAS um JSON válido com cada campo já escrito no comprimento exato solicitado. Não corte texto ao final; pense no número de caracteres antes de escrever.
{
  "title": "Título que mostra transformação, valor e benefício com exatamente 155 caracteres",
  "supportText": "Texto de apoio com exatamente 70 caracteres",
  "subtitle": "Subtítulo detalhado com exatamente 250 caracteres"
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 155 caracteres
- supportText: EXATAMENTE 70 caracteres
- subtitle: EXATAMENTE 250 caracteres
- Antecipe o tamanho antes de escrever; não gere texto maior para depois cortar
- Foque em transformação, impacto, confiança e benefício contínuo
- Use linguagem natural, próxima, calorosa e confiante
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (exactly 155 characters)",
  "supportText": "string (exactly 70 characters)",
  "subtitle": "string (exactly 250 characters)"
}`,
        rules: [
          "title: EXATAMENTE 155 caracteres",
          "supportText: EXATAMENTE 70 caracteres",
          "subtitle: EXATAMENTE 250 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Foque em transformação, impacto, confiança e benefício contínuo",
          "Use linguagem natural, próxima e confiante",
        ],
      },

      team: {
        enabled: true,
        prompt: `Responda APENAS com JSON válido. Gere o título da seção "Time" com exatamente 55 caracteres:
- Linguagem: Português brasileiro
- Tom: Empático, moderno, acessível, profissional e impactante
- Foco: Mostrar dedicação, proximidade e confiança
- Use primeira pessoa do plural

Retorne APENAS:
{
  "title": "Título com exatamente 55 caracteres, mostrando dedicação, proximidade e confiança"
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 55 caracteres
- Mostrar dedicação, proximidade e confiança
- Use primeira pessoa do plural
- Planeje a contagem antes de escrever; não corte texto ao final`,
        expectedFormat: `{
  "title": "string (exactly 55 characters)"
}`,
        rules: [
          "title: EXATAMENTE 55 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Mostrar dedicação, proximidade e confiança",
          "Usar primeira pessoa do plural",
        ],
      },

      specialties: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Especialidades" cumprindo rigorosamente os limites.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "title": "Frase com exatamente 140 caracteres demonstrando autoridade e resultados comprovados",
  "topics": [
    {
      "title": "Título com exatamente 50 caracteres",
      "description": "Descrição com exatamente 100 caracteres"
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- Gere entre 6 e 9 tópicos exclusivos
- title: EXATAMENTE 140 caracteres
- topic.title: EXATAMENTE 50 caracteres cada
- topic.description: EXATAMENTE 100 caracteres cada
- Planeje o texto para nascer com o tamanho correto; não corte ou trunque
- Linguagem profissional, calorosa e orientada a impacto e bem-estar
- Responda APENAS com o JSON válido, sem comentários.`,
        expectedFormat: `{
  "title": "string (exactly 140 characters)",
  "topics": [
    {
      "title": "string (exactly 50 characters)",
      "description": "string (exactly 100 characters)"
    }
  ]
}`,
        rules: [
          "Título principal: EXATAMENTE 140 caracteres",
          "Gerar entre 6 e 9 tópicos",
          "topic.title: EXATAMENTE 50 caracteres",
          "topic.description: EXATAMENTE 100 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Linguagem profissional, calorosa e orientada a resultados",
        ],
        minTopics: 6,
        maxTopics: 9,
      },

      steps: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Processo" respeitando os limites exatos.

PROJETO: {projectName} - {projectDescription}

Retorne:
{
  "title": "Nosso Processo",
  "introduction": "Frase com exatamente 100 caracteres explicando o ritmo ágil e cuidadoso",
  "topics": [
    {
      "title": "Título da etapa com exatamente 40 caracteres",
      "description": "Descrição da etapa com exatamente 240 caracteres"
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
- introduction: EXATAMENTE 100 caracteres
- topics: EXATAMENTE 5 itens
- topic.title: EXATAMENTE 40 caracteres
- topic.description: EXATAMENTE 240 caracteres
- Planeje a contagem antes de escrever; não corte texto
- Use linguagem profissional, transparente e acolhedora
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "Nosso Processo",
  "introduction": "string (exactly 100 characters)",
  "topics": [
    {
      "title": "string (exactly 40 characters)",
      "description": "string (exactly 240 characters)"
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
          "introduction: EXATAMENTE 100 caracteres",
          "topics: EXATAMENTE 5 itens",
          "topic.title: EXATAMENTE 40 caracteres",
          "topic.description: EXATAMENTE 240 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Linguagem profissional, transparente e acolhedora",
        ],
        exactSteps: 5,
      },

      scope: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para o escopo do projeto.

PROJETO: {projectName} - {projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "content": "Nosso projeto integra soluções digitais estratégicas que ampliam resultados e fortalecem a presença online. Desenvolvemos sistemas robustos que entregam performance, conversão e crescimento sustentável para seu negócio."
}

REGRAS OBRIGATÓRIAS:
- content: EXATAMENTE 350 caracteres
- Foque em benefícios do investimento e entregas
- Use linguagem profissional e focada em resultados
- Planeje o texto para atingir 350 caracteres sem cortes
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "content": "string (exactly 350 characters)"
}`,
        rules: [
          "content: EXATAMENTE 350 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Foque em benefícios do investimento e entregas",
          "Use linguagem profissional e focada em resultados",
        ],
      },

      investment: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Investimento" obedecendo todos os limites de caracteres.

PROJETO: {projectName} - {projectDescription}
PLANOS SELECIONADOS: {selectedPlans}

Retorne:
{
  "title": "Frase com exatamente 85 caracteres apresentando valor, impacto e personalização do orçamento",
  "deliverables": [
    {
      "title": "Título com até 30 caracteres",
      "description": "Descrição com até 330 caracteres, tom imperativo destacando impacto, transformação e bem-estar"
    }
  ],
  "plansItems": [
    {
      "title": "Título do plano com exatamente 20 caracteres",
      "description": "Descrição com exatamente 95 caracteres",
      "value": "Formato R$X.XXX (máximo 11 caracteres)",
      "planPeriod": "Mensal | Trimestral | Semestral | Anual | Único",
      "buttonTitle": "CTA curta (até 25 caracteres)",
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
- title: EXATAMENTE 85 caracteres
- deliverables: 2 a 5 itens; cada title até 30 caracteres e description até 330 caracteres
- plansItems: quantidade deve respeitar {selectedPlans} (mínimo 1, máximo 3)
- plan.title: EXATAMENTE 20 caracteres
- plan.description: EXATAMENTE 95 caracteres
- plan.value: string no formato R$X.XXX (máximo 11 caracteres, exemplo "R$8.500")
- plan.buttonTitle: CTA imperativa até 25 caracteres
- plan.planPeriod: defina coerente com o plano (ex.: "Mensal", "Anual", "Único")
- plan.recommended: apenas um plano deve ser true (use o de maior valor)
- includedItems: 3 a 6 itens por plano, description até 45 caracteres
- Gere IDs únicos para planos e itens; mantenha sortOrder sequencial a partir de 0
- Inclua os campos hideTitleField, hideDescription, hidePrice, hidePlanPeriod e hideButtonTitle como false
- Inclua hideItem e sortOrder em cada includedItem (hideItem false; sortOrder crescente)
- sortOrder: utilize números inteiros iniciando em 0 em ordem crescente
- Planeje o tamanho antes de escrever; não corte texto
- Responda APENAS com o JSON válido, sem comentários.`,
        expectedFormat: `{
  "title": "string (exactly 85 characters)",
  "deliverables": [
    {
      "title": "string (max 30 characters)",
      "description": "string (max 330 characters)"
    }
  ],
  "plansItems": [
    {
      "id": "string",
      "title": "string (exactly 20 characters)",
      "description": "string (exactly 95 characters)",
      "value": "string (<= 11 characters, formato R$X.XXX)",
      "planPeriod": "string",
      "buttonTitle": "string (max 25 characters)",
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
        ],
      },

      terms: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para termos e condições.

PROJETO: {projectName} - {projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Termos e Condições",
  "description": "Estes termos regem a prestação de serviços de desenvolvimento web e design. O projeto será desenvolvido conforme especificações acordadas, com prazo de entrega de 30 dias úteis. Incluímos 2 revisões gratuitas e suporte técnico por 30 dias após a entrega. Pagamento: 50% na assinatura do contrato e 50% na entrega final."
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 30 caracteres
- description: EXATAMENTE 180 caracteres
- Inclua prazo, pagamento e suporte no texto
- Planeje a contagem antes de escrever; não corte texto
- Use linguagem clara, objetiva e profissional
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (exactly 30 characters)",
  "description": "string (exactly 180 characters)"
}`,
        rules: [
          "title: EXATAMENTE 30 caracteres",
          "description: EXATAMENTE 180 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Incluir prazo, pagamento e suporte",
          "Linguagem clara e profissional",
        ],
      },

      faq: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para perguntas frequentes.

PROJETO: {projectName} - {projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "faq": [
    {
      "question": "Como vocês garantem que o projeto será entregue no prazo?",
      "answer": "Utilizamos metodologias ágeis e planejamento detalhado para garantir entregas pontuais. Nossa equipe trabalha com cronogramas realistas e comunicação constante."
    },
    {
      "question": "Posso solicitar alterações durante o desenvolvimento?",
      "answer": "Sim, incluímos ciclos de revisão e ajustes para garantir que o resultado final atenda perfeitamente às suas expectativas e necessidades."
    },
    {
      "question": "Qual é o prazo médio para entrega do projeto?",
      "answer": "O prazo médio é de 30 dias úteis, variando conforme a complexidade do projeto. Sempre informamos o cronograma detalhado antes do início."
    },
    {
      "question": "Vocês oferecem suporte após a entrega?",
      "answer": "Sim, incluímos suporte técnico gratuito por 30 dias após a entrega, além de manutenção e atualizações conforme necessário."
    },
    {
      "question": "Como funciona o processo de pagamento?",
      "answer": "O pagamento é dividido em duas parcelas: 50% na assinatura do contrato e 50% na entrega final do projeto."
    },
    {
      "question": "Posso ver o progresso do projeto durante o desenvolvimento?",
      "answer": "Sim, mantemos comunicação constante e fornecemos relatórios de progresso regulares para que você acompanhe cada etapa."
    },
    {
      "question": "Vocês trabalham com projetos de qualquer tamanho?",
      "answer": "Sim, atendemos desde pequenos sites institucionais até grandes plataformas complexas, sempre adaptando nossa abordagem às suas necessidades."
    },
    {
      "question": "Qual é a garantia oferecida?",
      "answer": "Oferecemos garantia de 90 dias para correção de bugs e ajustes necessários, além do suporte técnico incluído no projeto."
    },
    {
      "question": "Posso solicitar funcionalidades adicionais depois?",
      "answer": "Sim, podemos desenvolver funcionalidades adicionais conforme suas necessidades, com orçamento e prazo específicos para cada nova demanda."
    },
    {
      "question": "Como vocês garantem a segurança do projeto?",
      "answer": "Implementamos as melhores práticas de segurança, incluindo certificados SSL, backups regulares e monitoramento contínuo para proteger seus dados."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 10 perguntas e respostas
- question: EXATAMENTE 100 caracteres
- answer: EXATAMENTE 300 caracteres
- Cada pergunta deve ter question e answer
- Use linguagem clara, acolhedora e profissional
- Foque em dúvidas comuns do cliente para este projeto
- Planeje a contagem antes de escrever; não corte texto
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "faq": [
    {
      "question": "string (exactly 100 characters)",
      "answer": "string (exactly 300 characters)"
    }
  ]
}`,
        rules: [
          "EXATAMENTE 10 perguntas e respostas",
          "question: EXATAMENTE 100 caracteres",
          "answer: EXATAMENTE 300 caracteres",
          "Planeje a contagem antes de escrever; não cortar texto",
          "Use linguagem clara, acolhedora e profissional",
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
