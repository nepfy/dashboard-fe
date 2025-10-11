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
        "Qwen/Qwen2-72B-Instruct",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "databricks/dbrx-instruct",
      ],
      aggregatorModel: "mistralai/Mistral-7B-Instruct-v0.3",
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
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (exactly 60 characters)",
  "subtitle": "string (exactly 100 characters)",
  "services": ["string (30 chars)", "string (30 chars)", "string (30 chars)", "string (30 chars)"],
  "validity": "string",
  "buttonText": "string"
}`,
        rules: [
          "title: EXATAMENTE 60 caracteres",
          "subtitle: EXATAMENTE 100 caracteres",
          "services: EXATAMENTE 4 itens, cada um com EXATAMENTE 30 caracteres",
          "Use linguagem imperativa e inclusiva",
          "Foque em benefícios, transformação e lucro",
          "NÃO mencione o nome do cliente nos textos",
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
          "Foque em transformação, impacto e lucro",
          "Use linguagem natural, próxima e confiante",
        ],
      },

      team: {
        enabled: true,
        prompt: `Responda APENAS com JSON válido. Crie o título da seção "Time" (máximo 60 caracteres):
- Linguagem: Português brasileiro
- Tom: Empático, moderno, acessível, profissional e impactante
- Foco: Mostrar dedicação, proximidade e confiança
- Use primeira pessoa do plural

Retorne APENAS:
{
  "title": "Título que mostra dedicação, proximidade e confiança"
}`,
        expectedFormat: `{
  "title": "string (max 60 characters)"
}`,
        rules: [
          "Máximo 60 caracteres",
          "Mostrar dedicação, proximidade e confiança",
          "Use primeira pessoa do plural",
        ],
      },

      specialties: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para especialidades.

PROJETO: {projectName} - {projectDescription}

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
      "title": "Suporte técnico especializado",
      "description": "Equipe dedicada para garantir funcionamento perfeito e contínuo."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 6 tópicos
- Cada tópico deve ter title e description
- Use linguagem profissional e focada em resultados
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (max 140 characters)",
  "topics": [
    {
      "title": "string (max 50 characters)",
      "description": "string (max 100 characters)"
    }
  ]
}`,
        rules: [
          "EXATAMENTE 6 tópicos",
          "Cada tópico deve ter title e description",
          "Use linguagem profissional e focada em resultados",
        ],
        minTopics: 6,
        maxTopics: 9,
      },

      steps: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para etapas do processo.

PROJETO: {projectName} - {projectDescription}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Nosso processo",
  "introduction": "Desenvolvemos soluções inovadoras com foco em resultados e impacto contínuo.",
  "topics": [
    {
      "title": "Análise e planejamento estratégico",
      "description": "Identificamos as necessidades da sua marca para criar uma estratégia personalizada que maximize resultados e garanta o sucesso do seu projeto digital."
    },
    {
      "title": "Elaboração de layout e design",
      "description": "Criamos layouts atraentes e funcionais que refletem a imagem da sua marca e apresentam seu negócio de forma clara e profissional."
    },
    {
      "title": "Desenvolvimento da funcionalidade",
      "description": "Implementamos todas as funcionalidades necessárias para que seu site funcione perfeitamente e atenda às suas necessidades específicas."
    },
    {
      "title": "Testes e otimização da experiência",
      "description": "Realizamos testes rigorosos para garantir que o site seja fácil de navegar, intuitivo e performe bem em todos os dispositivos."
    },
    {
      "title": "Deploy finalizado e entrega completa",
      "description": "Implementamos seu projeto com segurança, configuramos os sistemas necessários para funcionar de forma integrada e eficiente."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 5 etapas
- Cada etapa deve ter title e description
- Use linguagem profissional e focada em processo
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (max 50 characters)",
  "introduction": "string (max 200 characters)",
  "topics": [
    {
      "title": "string (max 40 characters)",
      "description": "string (max 240 characters)"
    }
  ]
}`,
        rules: [
          "EXATAMENTE 5 etapas",
          "Cada etapa deve ter title e description",
          "Use linguagem profissional e focada em processo",
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
- content: Máximo 350 caracteres
- Foque em benefícios do investimento e entregas
- Use linguagem profissional e focada em resultados
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "content": "string (max 350 characters)"
}`,
        rules: [
          "content: Máximo 350 caracteres",
          "Foque em benefícios do investimento e entregas",
          "Use linguagem profissional e focada em resultados",
        ],
      },

      investment: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para investimento.

PROJETO: {projectName} - {projectDescription}
PLANOS: {selectedPlans}

COPIE EXATAMENTE ESTE FORMATO:

{
  "title": "Investimento planejado para gerar impacto digital, valor e reconhecimento duradouro",
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
  "plans": [
    {
      "title": "Plano Essencial",
      "description": "Impulsione resultados com soluções digitais que ampliam performance e conversão",
      "value": "R$ 4.500",
      "topics": [
        "Site responsivo completo",
        "Sistema de gestão",
        "Otimização SEO básica",
        "Suporte técnico 30 dias"
      ]
    },
    {
      "title": "Plano Executivo", 
      "description": "Acelere crescimento com integrações avançadas e automações inteligentes",
      "value": "R$ 7.200",
      "topics": [
        "Tudo do Essencial",
        "Integrações avançadas",
        "Automações personalizadas",
        "Relatórios detalhados",
        "Suporte técnico 90 dias"
      ]
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 2 planos
- Cada plano deve ter title, description, value e topics
- topics: 3 a 6 itens por plano
- Use valores realistas em reais
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string (max 150 characters)",
  "deliverables": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "plans": [
    {
      "title": "string (max 20 characters)",
      "description": "string (max 95 characters)",
      "value": "string",
      "topics": ["string (max 45 chars)"]
    }
  ]
}`,
        rules: [
          "EXATAMENTE 2 planos",
          "Cada plano deve ter title, description, value e topics",
          "topics: 3 a 6 itens por plano",
          "Use valores realistas em reais",
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
- description: Máximo 500 caracteres
- Inclua informações essenciais sobre prazo, pagamento e suporte
- Use linguagem clara e profissional
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "title": "string",
  "description": "string (max 500 characters)"
}`,
        rules: [
          "description: Máximo 500 caracteres",
          "Inclua informações essenciais sobre prazo, pagamento e suporte",
          "Use linguagem clara e profissional",
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
- Cada pergunta deve ter question e answer
- Use linguagem clara e profissional
- Foque em dúvidas comuns sobre desenvolvimento web
- Responda APENAS com o JSON válido.`,
        expectedFormat: `{
  "faq": [
    {
      "question": "string (max 85 characters)",
      "answer": "string (max 310 characters)"
    }
  ]
}`,
        rules: [
          "EXATAMENTE 10 perguntas e respostas",
          "Cada pergunta deve ter question e answer",
          "Use linguagem clara e profissional",
          "Foque em dúvidas comuns sobre desenvolvimento web",
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
        "Qwen/Qwen2-72B-Instruct",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "mistralai/Mistral-7B-Instruct-v0.3",
        "databricks/dbrx-instruct",
      ],
      aggregatorModel: "mistralai/Mistral-7B-Instruct-v0.3",
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
