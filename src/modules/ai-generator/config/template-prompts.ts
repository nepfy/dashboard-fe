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

OBJETIVO
Gerar textos premium, ÚNICOS e com VALOR REAL, com CONTAGEM EXATA de caracteres desde a concepção. 
- Cada proposta deve ser DIFERENTE e PERSONALIZADA para o contexto específico
- Evite frases genéricas ou repetitivas entre propostas
- Crie conteúdo que demonstre EXPERTISE e CONHECIMENTO do setor
- Planeje cada frase antes de escrever. NÃO gere conteúdo maior para depois cortar.

FORMATO OBRIGATÓRIO
{
  "title": "Frase imperativa, inclusiva e sofisticada com EXATAMENTE 60 caracteres (sem aspas adicionais)",
  "subtitle": "Frase sobre benefício e transformação com EXATAMENTE 100 caracteres",
  "services": [
    "Serviço 1 com EXATAMENTE 30 caracteres",
    "Serviço 2 com EXATAMENTE 30 caracteres",
    "Serviço 3 com EXATAMENTE 30 caracteres",
    "Serviço 4 com EXATAMENTE 30 caracteres"
  ],
  "validity": "15 dias",
  "buttonText": "Solicitar Proposta"
}

REGRAS RÍGIDAS
- CRÍTICO: Conte MANUALMENTE cada caractere (incluindo espaços) ANTES de finalizar cada campo.
- title: Escreva uma frase e conte. Se tiver 58 ou 62 caracteres, REESCREVA até ter EXATAMENTE 60.
- subtitle: Escreva uma frase e conte. Se tiver 98 ou 103 caracteres, REESCREVA até ter EXATAMENTE 100.
- services[]: Cada item deve ter EXATAMENTE 30 caracteres. Conte cada um individualmente.
- Não utilize aspas extras, emojis ou caracteres especiais fora do padrão ASCII básico.
- Não mencione diretamente {clientName} ou {projectName} no título, subtítulo ou serviços.
- Mantenha tom humano, acolhedor e de alto padrão; evite termos vazios como "melhor", "rápido" ou "completo".
- Responda apenas com o JSON final, sem comentários, textos adicionais ou linhas em branco externas.

EXEMPLOS CORRETOS (conte os caracteres):

✅ TITLE (60 chars):
"Elevamos sua presença visual no mercado com excelência" = 60 chars ✓
"Transformamos sua visão em realidade com excelência total" = 60 chars ✓

❌ TITLE ERRADO:
"Ativamos Estratégia de Marketing Digital Completa com entreg" = 61 chars (TRUNCADO!)
"Transforme Seu Lar Com Elegância E Funcional" = 46 chars (MUITO CURTO!)

✅ SUBTITLE (100 chars):
"Unimos estratégia, execução e cuidado para entregar resultados que superam suas expectativas hoje" = 100 chars ✓
"Transformamos marcas com experiências visuais que ampliam autoridade e geram impacto no mercado" = 97 chars (adicione 3!)

✅ SERVICES (30 chars cada):
"Diagnóstico estratégico total" = 30 chars ✓
"Plano orientado a dados reais" = 30 chars ✓
"Execução multicanal integrada" = 30 chars ✓
"Monitoramento contínuo eficaz" = 30 chars ✓

❌ SERVICES ERRADO:
"Design de Interiores Exclus" = 27 chars (TRUNCADO!)
"Arquitetura Residencial" = 23 chars (MUITO CURTO!)

PROCESSO:
1. Escreva o texto
2. Conte MANUALMENTE os caracteres
3. Se não bater EXATAMENTE, REESCREVA (não trunce!)
4. Valide novamente antes de enviar`,
        expectedFormat: `{
  "title": "string (exactly 60 characters, Title Case, premium tone)",
  "subtitle": "string (exactly 100 characters, sensory premium tone)",
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
          "title: EXATAMENTE 60 caracteres, imperativo, inclusivo e sofisticado",
          "subtitle: EXATAMENTE 100 caracteres, linguagem sensorial premium",
          "services: EXATAMENTE 4 itens com EXATAMENTE 30 caracteres cada",
          'validity: manter "15 dias"',
          'buttonText: manter "Solicitar Proposta"',
          "Planejar antes de escrever; não gerar texto para cortar",
          "Não mencionar cliente ou projeto diretamente",
        ],
      },

      aboutUs: {
        enabled: true,
        prompt: `Crie uma seção "Sobre Nós" premium e personalizada para o projeto {projectName} de {clientName}.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

ORIENTAÇÕES CRÍTICAS
- CONTEÚDO ÚNICO: Cada proposta deve ser DIFERENTE e PERSONALIZADA. Evite frases genéricas ou clichês.
- Demonstre EXPERTISE REAL do setor específico do projeto (ex: arquitetura, design, marketing, etc.)
- Planeje cada campo para ficar DENTRO do limite máximo antes de escrever (não gere para cortar depois).
- Utilize linguagem sensorial, humana e confiante, deixando claro valor, transformação e proximidade.
- Evite repetir o nome do cliente em todos os campos; use pronomes ou termos como "sua equipe".

FORMATO OBRIGATÓRIO
{
  "title": "Título que demonstra transformação, valor e benefício com até 155 caracteres",
  "supportText": "Texto de apoio (tom de confiança) com até 70 caracteres",
  "subtitle": "Subtítulo detalhado conectando trajetória, metodologia e impacto com até 250 caracteres"
}

REGRAS RÍGIDAS
- title ≤ 155 caracteres, sensorial e direto.
- supportText ≤ 70 caracteres, frase curta e memorável.
- subtitle ≤ 250 caracteres, frase fluida que una contexto, abordagem e resultados.
- Não listar entregas ou bullets; use frases corridas.
- Responda somente com o JSON final.`,
        expectedFormat: `{
  "title": "string (maximum 155 characters)",
  "supportText": "string (maximum 70 characters)",
  "subtitle": "string (maximum 250 characters)"
}`,
        rules: [
          "title: no máximo 155 caracteres, sensorial e orientado a transformação",
          "supportText: no máximo 70 caracteres, mensagem curta de confiança",
          "subtitle: no máximo 250 caracteres, narrativa completa",
          "Planejar contagem antes de escrever; não cortar texto",
          "Linguagem premium, calorosa e confiante",
        ],
      },

      team: {
        enabled: true,
        prompt: `Gere título e membros da equipe para o projeto.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}
{userName ? \`- Nome do responsável: {userName}\` : ""}

IMPORTANTE:
- Gere 2-3 membros da equipe baseado no contexto do projeto
- Use nomes realistas e profissionais
- Os cargos devem ser relevantes para o tipo de projeto
- Se houver nome do responsável, inclua-o como primeiro membro
- Todos os membros devem usar a imagem: /images/templates/flash/placeholder.png
- O título deve ter EXATAMENTE 55 caracteres

Retorne APENAS um JSON válido com:
{
  "title": "Frase sobre parceria e dedicação, MÁXIMO 55 caracteres",
  "members": [
    {
      "name": "Nome completo do membro",
      "role": "Cargo/função",
      "image": "/images/templates/flash/placeholder.png"
    }
  ]
}`,
        expectedFormat: `{
  "title": "string (exactly 55 characters, premium tone)",
  "members": [
    {
      "name": "string (full name)",
      "role": "string (job title/role)",
      "image": "/images/templates/flash/placeholder.png"
    }
  ]
}`,
        rules: [
          "title: exatamente 55 caracteres",
          "members: 2-3 membros com nomes realistas",
          "Cargos relevantes ao tipo de projeto",
          "Incluir responsável se disponível",
          "Usar imagem placeholder padrão",
        ],
      },

      specialties: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Especialidades" seguindo, sem desvios, os limites abaixo.

PROJETO: {projectName} - {projectDescription}

COPIE EXATAMENTE ESTE FORMATO:
{
  "title": "Aplicamos estratégias que unem tecnologia, análise e execução, garantindo performance digital e resultados reais.",
  "topics": [
    {
      "id": "uuid-1",
      "icon": "DiamondIcon",
      "title": "Desenvolvimento web responsivo",
      "description": "Sites otimizados que convertem visitantes em clientes com performance superior."
    },
    {
      "id": "uuid-2",
      "icon": "CircleIcon",
      "title": "Sistemas de agendamento",
      "description": "Plataformas personalizadas que automatizam e organizam seus agendamentos."
    },
    {
      "id": "uuid-3",
      "icon": "BubblesIcon",
      "title": "Integrações avançadas",
      "description": "Conectamos ferramentas para criar fluxos de trabalho mais eficientes."
    },
    { 
      "id": "uuid-4",
      "icon": "ClockIcon",
      "title": "Otimização de performance",
      "description": "Aceleramos carregamento e melhoramos experiência do usuário."
    },
    {
      "id": "uuid-5",
      "icon": "HexagonalIcon",
      "title": "Segurança e proteção",
      "description": "Implementamos medidas robustas para proteger dados e operações."
    },
    {
      "id": "uuid-6",
      "icon": "SwitchIcon",
      "title": "Suporte técnico especializado",
      "description": "Equipe dedicada para garantir funcionamento perfeito e contínuo."
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 6 tópicos únicos e relevantes ao projeto
- Cada tópico DEVE ter: id (UUID válido), icon, title e description
- O campo icon DEVE ser um dos seguintes: DiamondIcon, CircleIcon, BubblesIcon, ClockIcon, HexagonalIcon, SwitchIcon, ThunderIcon, GlobeIcon, BellIcon ou GearIcon
- Escolha ícones DIFERENTES para cada tópico (varie os ícones)
- title: ATÉ 50 caracteres - seja específico e impactante
- description: ATÉ 100 caracteres - foque em valor e resultados
- title do objeto principal: ATÉ 140 caracteres
- Planeje cada campo para já nascer dentro do limite; não escreva para depois cortar
- Use linguagem profissional, sofisticada e focada em resultados REAIS
- Cada especialidade deve ser ÚNICA - evite repetições entre propostas
- Adapte as especialidades ao contexto específico do projeto
- Responda APENAS com o JSON válido`,
        expectedFormat: `{
  "title": "string (maximum 140 characters, premium tone)",
  "topics": [
    {
      "id": "string (valid UUID)",
      "icon": "string (one of: DiamondIcon, CircleIcon, BubblesIcon, ClockIcon, HexagonalIcon, SwitchIcon, ThunderIcon, GlobeIcon, BellIcon, GearIcon)",
      "title": "string (maximum 50 characters)",
      "description": "string (maximum 100 characters)"
    }
  ]
}`,
        rules: [
          "Título principal: no máximo 140 caracteres",
          "Gerar exatamente 6 tópicos",
          "Cada tópico deve ter: id (UUID), icon, title, description",
          "icon: escolher entre DiamondIcon, CircleIcon, BubblesIcon, ClockIcon, HexagonalIcon, SwitchIcon, ThunderIcon, GlobeIcon, BellIcon, GearIcon",
          "Variar os ícones entre os tópicos",
          "topic.title: no máximo 50 caracteres",
          "topic.description: no máximo 100 caracteres",
          "Planejar contagem antes de responder",
          "Conteúdo único e adaptado ao projeto",
          "Linguagem profissional, sofisticada e focada em resultados",
        ],
        minTopics: 6,
        maxTopics: 9,
      },

      steps: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Processo" respeitando rigorosamente os limites abaixo.

PROJETO: {projectName} - {projectDescription}

FORMATO OBRIGATÓRIO
{
  "title": "Nosso Processo",
  "introduction": "Frase premium descrevendo ritmo e cuidado, com ATÉ 100 caracteres",
  "topics": [
    {
      "title": "Título da etapa com ATÉ 40 caracteres",
      "description": "Descrição da etapa com ATÉ 240 caracteres"
    }
  ],
  "marquee": []
}

REGRAS RÍGIDAS
- CONTEÚDO ÚNICO: Crie etapas ESPECÍFICAS para o tipo de projeto. Evite processos genéricos.
- Demonstre CONHECIMENTO REAL do setor (ex: para design, fale de moodboards; para dev, de sprints)
- Gere EXATAMENTE 5 tópicos (0 a 4 no sortOrder). Cada título deve ser curto (substantivo + verbo ou benefício).
- Planeje a contagem de cada frase antes de escrever; não exceda os limites.
- Evite bullets ou listas internas; use frases corridas.
- Linguagem clara, transparente, acolhedora e de alto padrão.
- Responda somente com o JSON final.`,
        expectedFormat: `{
  "title": "Nosso Processo",
  "introduction": "string (maximum 100 characters)",
  "topics": [
    {
      "title": "string (maximum 40 characters)",
      "description": "string (maximum 240 characters)"
    }
  ],
  "marquee": []
}`,
        rules: [
          "title fixo: Nosso Processo",
          "introduction: no máximo 100 caracteres",
          "topics: exatamente 5 itens",
          "topic.title: no máximo 40 caracteres",
          "topic.description: no máximo 240 caracteres",
          "Planejar contagem antes de escrever; não cortar",
          "Linguagem profissional, transparente e acolhedora",
        ],
        exactSteps: 5,
      },

      scope: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para o escopo do projeto.

PROJETO: {projectName} - {projectDescription}

FORMATO OBRIGATÓRIO
{
  "content": "Parágrafo contínuo com até 350 caracteres, narrando benefícios, entregas e narrativa premium"
}

REGRAS RÍGIDAS
- Planeje o texto para ficar entre 320 e 350 caracteres (incluindo espaços) — não gere acima do limite.
- Estruture como frase fluida (sem listar itens) destacando visão estratégica, entregas e resultados.
- Evite jargões vazios; mantenha clareza, calor humano e sofisticação.
- Responda apenas com o JSON final.`,
        expectedFormat: `{
  "content": "string (maximum 350 characters, premium tone)"
}`,
        rules: [
          "content: no máximo 350 caracteres (ideal entre 320 e 350)",
          "Planejar contagem antes de escrever",
          "Focar em benefícios, entregas e narrativa premium",
          "Linguagem profissional, calorosa e focada em resultados",
        ],
      },

      investment: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para a seção "Investimento" obedecendo todos os limites e estrutura abaixo.

PROJETO: {projectName} - {projectDescription}
PLANOS INFORMADOS PELO USUÁRIO: {selectedPlans}

FORMATO OBRIGATÓRIO
{
  "title": "Frase premium apresentando valor e impacto com ATÉ 85 caracteres",
  "deliverables": [
    {
      "title": "Título da entrega com ATÉ 30 caracteres",
      "description": "Descrição imperativa destacando impacto, com ATÉ 360 caracteres"
    }
  ],
  "plansItems": [
    {
      "id": "string",
      "title": "Título do plano com ATÉ 20 caracteres",
      "description": "Descrição do plano com ATÉ 140 caracteres",
      "value": "Valor no formato R$1.500 ou R$5.000 ou R$25.000 (SEM CENTAVOS, SEM ESPAÇOS após R$)",
      "planPeriod": "Mensal | Trimestral | Semestral | Anual | Único",
      "buttonTitle": "CTA imperativa com ATÉ 25 caracteres",
      "recommended": true/false,
      "hideTitleField": false,
      "hideDescription": false,
      "hidePrice": false,
      "hidePlanPeriod": false,
      "hideButtonTitle": false,
      "sortOrder": número sequencial iniciando em 0,
      "includedItems": [
        {
          "id": "string",
          "description": "Item resumido com ATÉ 45 caracteres",
          "hideItem": false,
          "sortOrder": número sequencial iniciando em 0
        }
      ]
    }
  ]
}

REGRAS RÍGIDAS
- Gere entre 2 e 5 entregáveis; mantenha frases objetivas no singular.
- Gere até 3 planos, respeitando exatamente a quantidade informada em {selectedPlans} (caso haja mais, escolha os três primeiros). O plano de maior valor deve ter recommended = true e os demais recommended = false.
- Cada plano deve conter entre 3 e 6 itens em includedItems, todos com descrições curtas (<=45 caracteres) usando verbos no infinitivo ou substantivos fortes.
- Valide todos os limites de caracteres antes de responder (não gere para cortar).
- Responda somente com o JSON final (sem comentários, sem campos extras).`,
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
      "value": "string (FORMATO: R$1.500 ou R$5.000 ou R$25.000 - SEM CENTAVOS, SEM ESPAÇOS)",
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
          "description": "string (maximum 45 characters)",
          "hideItem": boolean,
          "sortOrder": number
        }
      ]
    }
  ]
}`,
        rules: [
          "title: no máximo 85 caracteres",
          "deliverables: 2 a 5 itens; title ≤30, description ≤360",
          "plansItems: até 3 planos, respeitando quantidade informada",
          "plan.title: no máximo 20 caracteres",
          "plan.description: no máximo 140 caracteres",
          "plan.value: formato R$1.500 ou R$5.000 ou R$25.000 (SEM CENTAVOS, SEM ESPAÇOS)",
          "plan.buttonTitle: no máximo 25 caracteres",
          "plan.planPeriod: usar opções válidas",
          "recommended: apenas o plano de maior valor como true",
          "includedItems: 3 a 6 itens; description ≤45 caracteres",
          "IDs únicos e sortOrder sequencial iniciando em 0",
          "Todos os campos hide* devem ser false",
          "Planejar contagem antes de responder; não cortar texto",
          "Linguagem sofisticada, sedutora e orientada a valor percebido",
        ],
      },

      terms: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido (ARRAY) para termos e condições dentro dos limites abaixo.

PROJETO: {projectName} - {projectDescription}

FORMATO OBRIGATÓRIO (deve ser um ARRAY com 1-3 itens)
[
{
    "title": "Título objetivo com ATÉ 30 caracteres",
    "description": "Texto corrido abordando prazo, pagamento e suporte com ATÉ 180 caracteres"
}
]

REGRAS RÍGIDAS
- CRÍTICO: Retorne um ARRAY (com colchetes []), não um objeto
- Gere 1-3 termos diferentes (ex: Prazo, Pagamento, Suporte)
- Planeje a frase completa antes de responder; não gere acima do limite.
- Tonalidade premium, transparente e confiante. Utilize verbos no presente.
- Evite listas, marcadores ou múltiplas frases curtas dentro da description.
- Responda apenas com o JSON final (array).`,
        expectedFormat: `[
  {
  "title": "string (maximum 30 characters, premium tone)",
  "description": "string (maximum 180 characters, premium tone)"
  }
]`,
        rules: [
          "DEVE ser um ARRAY (com colchetes [])",
          "1-3 termos diferentes",
          "title: no máximo 30 caracteres",
          "description: no máximo 180 caracteres",
          "Planejar contagem antes de escrever",
          "Incluir prazo, pagamento e suporte",
          "Linguagem clara, profissional e sofisticada",
        ],
      },

      faq: {
        enabled: true,
        prompt: `Gere APENAS um JSON válido para perguntas frequentes, respeitando rigorosamente os limites.

PROJETO: {projectName} - {projectDescription}

FORMATO OBRIGATÓRIO
{
  "faq": [
    {
      "question": "Pergunta objetiva com ATÉ 100 caracteres",
      "answer": "Resposta completa com ATÉ 300 caracteres"
    }
  ]
}

REGRAS RÍGIDAS
- CONTEÚDO ÚNICO: Crie perguntas ESPECÍFICAS para o tipo de projeto. Evite FAQs genéricas.
- Demonstre EXPERTISE do setor nas respostas (ex: para arquitetura, fale de plantas e moodboards)
- Gere EXATAMENTE 10 pares pergunta e resposta RELEVANTES ao contexto.
- Cada question deve ser frase direta, sem ponto de interrogação duplicado.
- Cada answer deve ser frase(s) corridas em parágrafo único (sem bullets), trazendo benefício concreto ou reforço do processo.
- Planeje a contagem antes de escrever; não gere acima dos limites.
- Responda apenas com o JSON final.`,
        expectedFormat: `{
  "faq": [
    {
      "question": "string (maximum 100 characters)",
      "answer": "string (maximum 300 characters)"
    }
  ]
}`,
        rules: [
          "FAQ: exatamente 10 perguntas e respostas",
          "question: no máximo 100 caracteres",
          "answer: no máximo 300 caracteres",
          "Planejar contagem antes de escrever",
          "Linguagem clara, acolhedora, profissional e sofisticada",
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
