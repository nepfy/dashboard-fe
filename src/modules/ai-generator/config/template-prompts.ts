export interface TemplateConfig {
  id: string;
  name: string;
  type: "flash" | "minimal" | "prime" | "grid";
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
    plans?: {
      enabled: boolean;
      prompt: string;
      expectedFormat: string;
      rules: string[];
    };
    clients?: {
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
      prompt?: string;
      expectedFormat?: string;
      rules?: string[];
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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

DADOS DO PROJETO:
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
  "title": "Frase imperativa, inclusiva e sofisticada com entre 50 e 80 caracteres (sem aspas adicionais)",
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
- title: Escreva uma frase e conte. Deve ter pelo menos 50 e no máximo 80 caracteres; se ficar fora dessa faixa, REESCREVA (não trunque).
- subtitle: Escreva uma frase e conte. Se tiver 98 ou 103 caracteres, REESCREVA até ter EXATAMENTE 100.
- services[]: Cada item deve ter EXATAMENTE 30 caracteres. Conte cada um individualmente.
- Use primeira pessoa do plural e trate o leitor em segunda pessoa, sempre em voz ativa.
- Inclua pelo menos um gatilho (autoridade, prova social, transformação ou lucro) de forma natural.
- Não utilize aspas extras, emojis ou caracteres especiais fora do padrão ASCII básico.
- Não mencione diretamente {clientName} ou {projectName} no título, subtítulo ou serviços.
- Mantenha tom humano, acolhedor e de alto padrão; evite termos vazios como "melhor", "rápido" ou "completo".
- Responda apenas com o JSON final, sem comentários, textos adicionais ou linhas em branco externas.

EXEMPLOS CORRETOS (conte os caracteres):

✅ TITLE (faixa 50–80 chars):
"Elevamos sua presença visual no mercado com excelência" = 60 chars ✓
"Transformamos sua visão em realidade com excelência total" = 60 chars ✓
"Criamos experiências digitais premium que fortalecem sua marca" = 67 chars ✓

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
  "title": "string (50 a 80 caracteres, Title Case, tom premium e inclusivo)",
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
          "title: entre 50 e 80 caracteres, imperativo, inclusivo e sofisticado",
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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Crie uma seção "Sobre Nós" premium e personalizada para o projeto {projectName} de {clientName}.

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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere título e membros da equipe para o projeto.

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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido para a seção "Especialidades" seguindo, sem desvios, os limites abaixo.

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
- Use primeira pessoa do plural e segunda pessoa para o leitor; voz ativa e narrativa.
- Cada tópico deve soar concreto (sem placeholders como “Benefício 1/2”); contextualize com {projectDescription} e {companyInfo}.
- Insira ao menos um gatilho (autoridade, prova social, transformação ou lucro) distribuído nos textos.
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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido para a seção "Processo" respeitando rigorosamente os limites abaixo.

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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido para o escopo do projeto.

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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido para a seção "Investimento" obedecendo todos os limites e estrutura abaixo.

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
- Evite rótulos genéricos como "Benefício 1/2/3"; descreva entregas reais e específicas ao contexto de {projectDescription} e {companyInfo}.
- Use primeira pessoa do plural e trate o leitor em segunda pessoa; inclua gatilhos (autoridade, transformação, lucro ou prova social) sem soar repetitivo.
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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido (ARRAY) para termos e condições dentro dos limites abaixo.

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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido para perguntas frequentes, respeitando rigorosamente os limites.

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

  minimal: {
    id: "minimal",
    name: "Minimal",
    type: "minimal",
    status: "active",
    description:
      "Template minimalista com design limpo e foco em conteúdo essencial",
    lastUpdated: "2025-01-15",

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
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere uma introdução minimalista e direta para a proposta.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}
- Usuário: {userName}
- Email: {userEmail}

FORMATO:
{
  "clientName": "{clientName}",
  "userName": "{userName}",
  "email": "{userEmail}",
  "logo": null,
  "hideLogo": false,
  "clientPhoto": null,
  "hideClientPhoto": false,
  "title": "Título INTRODUTÓRIO da proposta, descrevendo o tipo de trabalho/serviço (MÁXIMO 120 caracteres)",
  "description": "Descrição concisa da proposta de valor (MÁXIMO 100 caracteres)",
  "hideDescription": false,
  "services": [
    { "id": "1", "serviceName": "Serviço 1 com até 50 caracteres", "sortOrder": 1 },
    { "id": "2", "serviceName": "Serviço 2 com até 50 caracteres", "sortOrder": 2 },
    { "id": "3", "serviceName": "Serviço 3 com até 50 caracteres", "sortOrder": 3 }
  ]
}

🚨🚨🚨 INSTRUÇÕES CRÍTICAS DE CONTAGEM - LEIA ANTES DE GERAR 🚨🚨🚨

⚠️ ATENÇÃO MÁXIMA: Cada campo tem um limite RÍGIDO que é VERIFICADO AUTOMATICAMENTE!
⚠️ Se você ultrapassar qualquer limite, sua resposta será REJEITADA e você terá que gerar TUDO NOVAMENTE!
⚠️ O sistema NÃO vai cortar/truncar seu texto. Ele vai REJEITAR e você vai refazer TODO o trabalho!

🔒 LIMITES ABSOLUTOS E INEGOCIÁVEIS (incluindo espaços, pontos, vírgulas, TUDO):
- title: MÁXIMO ABSOLUTO 120 caracteres | RECOMENDADO: 60-100 caracteres
- description: MÁXIMO ABSOLUTO 100 caracteres | RECOMENDADO: 50-80 caracteres  
- serviceName: MÁXIMO ABSOLUTO 50 caracteres CADA | RECOMENDADO: 30-40 caracteres

📏 MÉTODO OBRIGATÓRIO DE CONTAGEM:
1. Escreva o texto
2. CONTE caractere por caractere, incluindo TODOS os espaços
3. Se estiver acima do limite, DELETE palavras até ficar ABAIXO
4. Valide contando NOVAMENTE de trás para frente
5. Só envie depois de ter CERTEZA absoluta

⚠️ PROCESSO RIGOROSO ANTES DE ENVIAR:
1. Escreva o texto normalmente
2. Copie mentalmente e conte: 1, 2, 3, 4... até o fim
3. Se passar do MÁXIMO, corte palavras imediatamente
4. Sempre use 20 caracteres ABAIXO do limite máximo para segurança
5. title: nunca passe de 100 chars (margem de segurança)
6. description: nunca passe de 80 chars (margem de segurança)

REGRAS DE ESTILO:
- Linguagem direta e profissional
- Evite excesso de adjetivos
- Foco em benefícios concretos
- Máximo 3-4 serviços principais
- logo e clientPhoto sempre começam como null (usuário adiciona depois)

🚨 REGRA CRÍTICA PARA O CAMPO "title" 🚨
O campo "title" deve ser um TÍTULO INTRODUTÓRIO da proposta, NÃO o nome do projeto!

❌ ERRADO - Usar apenas o nome do projeto:
"Residência Horizonte Claro"
"Projeto Casa Nova"
"Site para Empresa XYZ"

✅ CORRETO - Título introdutório descritivo:
"Projeto de Arquitetura Residencial Personalizada"
"Desenvolvimento de Site Institucional Moderno"
"Consultoria Estratégica de Marketing Digital"
"Design de Interiores para Ambientes Corporativos"

ORIENTAÇÃO:
- O title deve descrever O QUE está sendo oferecido (tipo de serviço/trabalho)
- Não mencione diretamente o nome do projeto ({projectName})
- Use palavras que descrevam a natureza do trabalho
- Seja específico sobre o tipo de serviço oferecido

EXEMPLOS POR ÁREA:
Arquitetura: "Projeto Arquitetônico Residencial Completo" ou "Reforma e Design de Interiores"
Marketing: "Estratégia de Marketing Digital Integrada" ou "Gestão de Redes Sociais e Conteúdo"
Desenvolvimento: "Desenvolvimento de Plataforma Web Personalizada" ou "Sistema de Gestão Empresarial"
Design: "Identidade Visual e Branding Profissional" ou "Design de Experiência Digital"`,
        expectedFormat: `{
  "clientName": "string",
  "userName": "string",
  "email": "string",
  "logo": null,
  "hideLogo": false,
  "clientPhoto": null,
  "hideClientPhoto": false,
  "title": "string (max 120 chars - DESCRIPTIVE intro title, not project name)",
  "description": "string (max 100 chars)",
  "hideDescription": false,
  "services": [{"id": "string", "serviceName": "string (max 50 chars)", "sortOrder": number}]
}`,
        rules: [
          "title: até 120 caracteres, direto e claro",
          "description: até 100 caracteres, proposta de valor concisa",
          "subtitle: até 180 caracteres (CRÍTICO: conte os caracteres antes de gerar!)",
          "services: 3-4 itens, cada um com até 50 caracteres",
          "Tom profissional e minimalista",
        ],
      },

      aboutUs: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Crie uma seção "Sobre" minimalista e personalizada.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

FORMATO:
{
  "hideSection": false,
  "title": "Proposta de valor clara e direta (até 100 caracteres)",
  "subtitle": "Descrição detalhada conectando a empresa ao projeto do cliente. DEVE mencionar {clientName} de forma natural (até 250 caracteres)",
  "marqueeText": "Texto marquee com serviços separados por → (ex: Brand Design → UI Design → Development) (até 200 caracteres)",
  "hideMarquee": false,
  "items": [
    {
      "id": "1",
      "image": null,
      "caption": "Descrição concisa e impactante sobre expertise (até 100 caracteres)",
      "hideImage": false,
      "hideCaption": false,
      "sortOrder": 0
    },
    {
      "id": "2",
      "image": null,
      "caption": "Descrição concisa e impactante sobre metodologia (até 100 caracteres)",
      "hideImage": false,
      "hideCaption": false,
      "sortOrder": 1
    }
  ]
}

REGRAS RÍGIDAS
- title: ATÉ 100 caracteres - proposta de valor clara e específica
- subtitle: ATÉ 250 caracteres - DEVE mencionar naturalmente {clientName}
- marqueeText: ATÉ 200 caracteres - 4-6 serviços separados por →
- items: EXATAMENTE 2 itens (1º expertise, 2º metodologia)
- caption: ATÉ 100 caracteres cada
- image: sempre null (usuário adiciona depois)
- Planeje a contagem ANTES de escrever; não gere acima dos limites
- Linguagem direta, autêntica e minimalista
- Evite clichês e jargões
- Responda apenas com o JSON final`,
        expectedFormat: `{
  "hideSection": false,
  "title": "string (max 100 chars)",
  "subtitle": "string (max 250 chars, must mention client name)",
  "marqueeText": "string (max 200 chars, services separated by →)",
  "hideMarquee": false,
  "items": [
    {
      "id": "string",
      "image": null,
      "caption": "string (max 100 chars)",
      "hideImage": false,
      "hideCaption": false,
      "sortOrder": number
    }
  ]
}`,
        rules: [
          "title: até 100 caracteres",
          "subtitle: até 250 caracteres, DEVE mencionar o cliente",
          "marqueeText: até 200 caracteres, 4-6 serviços separados por →",
          "items: sempre 2 itens",
          "caption: até 100 caracteres por item",
          "image: sempre null",
          "Mensagem clara e direta",
          "Tom autêntico e personalizado",
        ],
      },

      team: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere a seção de equipe minimalista.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}
- Usuário: {userName}

FORMATO:
{
  "hideSection": false,
  "title": "Título da seção com até 100 caracteres",
  "members": [
    {
      "id": "1",
      "name": "Nome completo",
      "role": "Cargo/função com até 50 caracteres",
      "image": "/images/templates/flash/placeholder.png",
      "sortOrder": 1
    }
  ]
}

REGRAS:
- 2-3 membros principais
- Cargos claros e diretos
- Se houver userName, inclua como primeiro membro`,
        expectedFormat: `{
  "hideSection": false,
  "title": "string (max 100 chars)",
  "members": [{"id": "string", "name": "string", "role": "string (max 50 chars)", "image": "string", "sortOrder": number}]
}`,
        rules: [
          "title: até 100 caracteres",
          "2-3 membros",
          "Cargos diretos e claros",
        ],
      },

      clients: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere seção de clientes/parceiros PERSONALIZADA para o projeto específico.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

⚠️⚠️⚠️ REGRA CRÍTICA SOBRE O TITLE ⚠️⚠️⚠️
O TITLE É O ELEMENTO MAIS IMPORTANTE DESTA SEÇÃO!
- DEVE ter MÍNIMO 150 caracteres (idealmente 180-250 caracteres)
- DEVE seguir o padrão: "Reconhecemos/Identificamos [problema no setor]—[contexto detalhado]. [Por que existimos/nossa solução]."
- DEVE usar travessão (—) para separar ideias
- DEVE ser uma DECLARAÇÃO DE MISSÃO completa e impactante
- NÃO seja genérico - mencione o SETOR específico do projeto
- CONTE os caracteres - se tiver menos de 150, REESCREVA mais longo!

⚠️⚠️⚠️ REGRA ABSOLUTA #1 ⚠️⚠️⚠️
SEMPRE retorne "hideSection": false
Esta seção DEVE estar SEMPRE visível quando há projeto
NUNCA defina hideSection como true

⚠️⚠️⚠️ REGRA ABSOLUTA #2 ⚠️⚠️⚠️
items DEVE conter EXATAMENTE 12 clientes
NÃO envie lista vazia []
NÃO envie menos de 12
NÃO envie mais de 12

FORMATO OBRIGATÓRIO:
{
  "hideSection": false,
  "title": "DECLARAÇÃO DE MISSÃO LONGA E IMPACTANTE - MÍNIMO 150 CARACTERES, máximo 300",
  "hideTitle": false,
  "paragraphs": [
    "Parágrafo 1: Explicação completa de como a empresa ajuda clientes no contexto do projeto - máx 400 caracteres",
    "Parágrafo 2: Filosofia, metodologia e abordagem de trabalho da empresa de forma detalhada - máx 350 caracteres"
  ],
  "items": [
    {"id": "1", "name": "NOME MARCA 1", "logo": null, "sortOrder": 0},
    {"id": "2", "name": "NOME MARCA 2", "logo": null, "sortOrder": 1},
    {"id": "3", "name": "NOME MARCA 3", "logo": null, "sortOrder": 2},
    {"id": "4", "name": "NOME MARCA 4", "logo": null, "sortOrder": 3},
    {"id": "5", "name": "NOME MARCA 5", "logo": null, "sortOrder": 4},
    {"id": "6", "name": "NOME MARCA 6", "logo": null, "sortOrder": 5},
    {"id": "7", "name": "NOME MARCA 7", "logo": null, "sortOrder": 6},
    {"id": "8", "name": "NOME MARCA 8", "logo": null, "sortOrder": 7},
    {"id": "9", "name": "NOME MARCA 9", "logo": null, "sortOrder": 8},
    {"id": "10", "name": "NOME MARCA 10", "logo": null, "sortOrder": 9},
    {"id": "11", "name": "NOME MARCA 11", "logo": null, "sortOrder": 10},
    {"id": "12", "name": "NOME MARCA 12", "logo": null, "sortOrder": 11}
  ]
}

LIMITES OBRIGATÓRIOS:
- title: MÍNIMO 150 caracteres, MÁXIMO 300 caracteres (CONTE!)
- paragraph 1: ATÉ 400 caracteres (explicação completa)
- paragraph 2: ATÉ 350 caracteres (filosofia e metodologia)
- items: EXATAMENTE 12 clientes
- item.name: ATÉ 50 caracteres, MAIÚSCULAS

EXEMPLOS DE TITLE CORRETO (OBSERVE O TAMANHO!):

📌 Agência de Design Digital (177 caracteres) ✅
"Reconhecemos uma lacuna na indústria criativa—pequenos negócios frequentemente lutam para encontrar soluções de design de alta qualidade, porém acessíveis. É por isso que existimos."

📌 E-commerce para Cafeteria (189 caracteres) ✅
"Identificamos um desafio no setor de cafés especiais—cafeterias artesanais precisam de presença digital forte mas acessível. Nossa expertise transforma conceitos gastronômicos em experiências online memoráveis e lucrativas."

📌 Website Institucional (215 caracteres) ✅
"Reconhecemos uma lacuna no mercado de desenvolvimento web—empresas de médio porte frequentemente lutam para encontrar soluções tecnológicas que equilibrem qualidade excepcional com investimento acessível. Nossa missão é preencher essa lacuna."

📌 Identidade Visual para Arquitetura (203 caracteres) ✅
"Identificamos um desafio no setor residencial—famílias e profissionais buscam projetos arquitetônicos personalizados mas com preços justos. Nossa expertise combina técnica avançada e sensibilidade criativa para entregar soluções completas."

❌ EXEMPLO ERRADO - MUITO CURTO (76 caracteres):
"Desenvolvemos experiências digitais memoráveis para marcas de café especiais"
^ REJEITADO! Menos de 150 caracteres!

ESTRUTURA DO TITLE IDEAL:
1. Comece com "Reconhecemos/Identificamos/Percebemos"
2. Mencione uma "lacuna/desafio/problema" no SETOR específico
3. Use travessão (—) para explicar DETALHADAMENTE o problema
4. Termine com por que você existe ou sua solução
5. CONTE: deve ter 150-250 caracteres!

EXEMPLOS DE PARAGRAPHS:

✅ paragraph 1 (295 caracteres):
"Seu website é provavelmente o primeiro ponto de contato que alguém terá com sua marca. Destaque-se da multidão criando um site que ajuda você a alcançar seus objetivos de negócio enquanto mostra quem você é de uma forma que as pessoas não vão esquecer."

✅ paragraph 2 (235 caracteres):
"Design é sobre criar experiências, tornar a vida das pessoas mais fácil, ou até divertida quando não estão tendo o melhor dia. Com isso em mente, fornecemos serviços para ser seu parceiro no próximo projeto."

INSTRUÇÕES FINAIS:
- O TITLE É A PRIORIDADE #1 - deve ser LONGO (150+ chars) e IMPACTANTE
- Use as informações de {projectDescription} e {companyInfo}
- NÃO use textos genéricos - seja específico ao setor do projeto
- Paragraphs devem ser completos e profissionais
- SEMPRE conte os caracteres antes de enviar
- Textos devem transmitir expertise, confiança e valor

REGRAS ADICIONAIS:
- NÃO gere campos subtitle, description, hideSubtitle, hideDescription
- logo sempre null
- Nomes devem ser plausíveis e variados para o setor
- hideSection SEMPRE false
- items SEMPRE com 12 clientes`,
        expectedFormat: `{
  "hideSection": false,
  "title": "string (MIN 150 chars, MAX 300 chars, impactful mission statement)",
  "hideTitle": false,
  "paragraphs": [
    "string (max 400 chars, complete explanation)",
    "string (max 350 chars, detailed philosophy)"
  ],
  "items": [
    {"id": "1", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 0},
    {"id": "2", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 1},
    {"id": "3", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 2},
    {"id": "4", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 3},
    {"id": "5", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 4},
    {"id": "6", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 5},
    {"id": "7", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 6},
    {"id": "8", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 7},
    {"id": "9", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 8},
    {"id": "10", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 9},
    {"id": "11", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 10},
    {"id": "12", "name": "string (UPPERCASE, max 50 chars)", "logo": null, "sortOrder": 11}
  ]
}`,
        rules: [
          "title: MÍNIMO 150 caracteres, MÁXIMO 300 caracteres - DECLARAÇÃO DE MISSÃO",
          "paragraph 1: até 400 caracteres, explicação completa",
          "paragraph 2: até 350 caracteres, filosofia detalhada",
          "EXATAMENTE 12 marcas/clientes (obrigatório)",
          "Nomes em MAIÚSCULAS, até 50 caracteres",
          "hideSection SEMPRE false",
          "Conteúdo PERSONALIZADO baseado no projeto",
          "NÃO gerar subtitle ou description",
        ],
      },

      specialties: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere seção de expertise/áreas de atuação com estilo minimalista e profissional.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

FORMATO:
{
  "hideSection": false,
  "subtitle": "Subtítulo curto e impactante em MAIÚSCULAS com até 60 caracteres (ex: TRANSFORME SUAS IDEIAS EM RESULTADOS REAIS)",
  "hideSubtitle": false,
  "title": "Título principal da seção, direto e profissional com até 150 caracteres",
  "hideIcon": false,
  "topics": [
    {
      "id": "1",
      "icon": "DiamondIcon",
      "title": "Nome da área de atuação com até 40 caracteres",
      "description": "Descrição profissional e completa do serviço com até 180 caracteres, explicando valor e benefícios",
      "sortOrder": 1
    }
  ]
}

ÍCONES DISPONÍVEIS:
DiamondIcon (para branding/identidade), BulbIcon (para criatividade/ideias), ThunderIcon (para performance/rapidez), 
GearIcon (para processos/gestão), GlobeIcon (para web/digital), FolderIcon (para organização/arquivos),
EyeIcon (para consultoria/análise), StarIcon (para qualidade premium), HeartIcon (para experiência/relacionamento),
AwardIcon (para conquistas/resultados), KeyIcon (para soluções/acesso), PlayIcon (para ação/execução),
CrownIcon (para liderança/premium), HexagonalIcon (para estrutura/solidez), BellIcon (para comunicação/alertas)

INSTRUÇÕES CRÍTICAS DE CONTAGEM:
⚠️ CRÍTICO: Cada campo tem um limite RÍGIDO que NÃO PODE ser ultrapassado!
⚠️ A DESCRIPTION É O ELEMENTO MAIS IMPORTANTE - deve ter MÍNIMO 120 caracteres!
⚠️ Escreva, CONTE manualmente, e se tiver menos de 120 chars, REESCREVA mais longo!
⚠️ NÃO envie descriptions curtas - serão REJEITADAS!

LIMITES OBRIGATÓRIOS:
- subtitle: ATÉ 60 caracteres (conte letra por letra!)
- title: ATÉ 150 caracteres (conte letra por letra!)
- topics: EXATAMENTE 9 áreas (grid 3x3) - NÃO MAIS, NÃO MENOS!
- topic.title: ATÉ 40 caracteres CADA (conte!)
- topic.description: MÍNIMO 120 caracteres, MÁXIMO 180 caracteres CADA (CONTE e seja PROFISSIONAL!)

EXEMPLOS CORRETOS:

✅ topic.title (40 chars ou menos):
"Estratégia de Marca Digital" = 28 chars ✓
"Marketing de Conteúdo" = 21 chars ✓
"Design de Experiência do Usuário" = 33 chars ✓

✅ topic.description (120-180 chars - OBSERVE O TAMANHO!):
"Desenvolvemos estratégias de marca completas que elevam seu posicionamento no mercado, criam conexões autênticas com seu público e estabelecem uma identidade visual memorável." = 177 chars ✓

"Gestão completa das suas redes sociais com conteúdo estratégico, design profissional e engajamento real que transforma seguidores em clientes fiéis e fortalece sua presença online." = 180 chars ✓

"Criamos experiências de usuário intuitivas e envolventes que facilitam a navegação, aumentam a satisfação e convertem visitantes em clientes através de design centrado no usuário." = 178 chars ✓

❌ EXEMPLO ERRADO - MUITO CURTO (95 chars):
"Desenvolvemos identidades visuais fortes e coerentes que destacam sua marca no mercado digital."
^ REJEITADO! Menos de 120 caracteres!

❌ ERRADO:
"Desenvolvemos estratégias completas e integradas de marca que elevam significativamente seu posicionamento no mercado e criam conexões profundas e duradouras com seu público-alvo através de experiências memoráveis" = 215 chars ✗ REJEITADO!

INSTRUÇÕES FINAIS:
- Selecionar ícones que representem visualmente cada área de atuação
- Usar linguagem PROFISSIONAL, COMPLETA e orientada a VALOR e RESULTADOS
- Cada descrição deve explicar CLARAMENTE o que é feito e qual o BENEFÍCIO
- Descriptions devem ter MÍNIMO 120 caracteres - conte antes de enviar!
- NÃO usar adjetivos vagos como "incrível", "fantástico" - ser ESPECÍFICO
- Textos devem transmitir EXPERTISE e CONFIANÇA
- Adaptar expertise ao contexto e setor do projeto`,
        expectedFormat: `{
  "hideSection": false,
  "subtitle": "string (max 60 chars, UPPERCASE)",
  "hideSubtitle": false,
  "title": "string (max 150 chars)",
  "hideIcon": false,
  "topics": [{"id": "string", "icon": "string", "title": "string (max 40 chars)", "description": "string (MIN 120 chars, MAX 180 chars)", "sortOrder": number}]
}`,
        rules: [
          "subtitle: até 60 caracteres, EM MAIÚSCULAS",
          "title: até 150 caracteres",
          "EXATAMENTE 9 topics (grid 3x3)",
          "topic.title: até 40 caracteres",
          "topic.description: MÍNIMO 120, MÁXIMO 180 caracteres - COMPLETO e PROFISSIONAL",
          "Ícones apropriados para cada área",
          "Linguagem profissional, completa e orientada a valor",
        ],
        minTopics: 9,
        maxTopics: 9,
      },

      steps: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere seção de processo/metodologia.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}

FORMATO:
{
  "hideSection": false,
  "topics": [
    {
      "id": "1",
      "title": "Nome da etapa com até 50 caracteres",
      "description": "Descrição da etapa com até 400 caracteres",
      "sortOrder": 1
    }
  ]
}

REGRAS:
- 3-5 etapas principais
- Títulos concisos
- Descrições claras e práticas`,
        expectedFormat: `{
  "hideSection": false,
  "topics": [{"id": "string", "title": "string (max 50 chars)", "description": "string (max 400 chars)", "sortOrder": number}]
}`,
        rules: [
          "3-5 etapas",
          "Títulos concisos (até 50 caracteres)",
          "Descrições práticas (até 400 caracteres)",
        ],
        exactSteps: 5,
      },

      scope: {
        enabled: false,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },

      investment: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere seção de investimento minimalista.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}
- Planos: {selectedPlans}

FORMATO:
{
  "hideSection": false,
  "title": "Título sobre investimento com até 150 caracteres",
  "projectScope": "Descrição do escopo com até 200 caracteres",
  "hideProjectScope": false
}

REGRAS:
- Título claro e direto
- Escopo conciso e objetivo`,
        expectedFormat: `{
  "hideSection": false,
  "title": "string (max 150 chars)",
  "projectScope": "string (max 200 chars)",
  "hideProjectScope": false
}`,
        rules: [
          "title: até 150 caracteres",
          "projectScope: até 200 caracteres",
          "Tom profissional e direto",
        ],
      },

      terms: {
        enabled: false,
        prompt: "",
        expectedFormat: "",
        rules: [],
      },

      plans: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere planos de investimento para a proposta com estilo minimalista e profissional.

DADOS DO PROJETO:
- Cliente: {clientName}
- Projeto: {projectName}
- Descrição: {projectDescription}
- Empresa: {companyInfo}
- Quantidade de planos: {selectedPlans}

FORMATO:
{
  "hideSection": false,
  "subtitle": "Subtítulo curto em MAIÚSCULAS com até 50 caracteres (ex: ESCOLHA SEU PLANO)",
  "hideSubtitle": false,
  "title": "Título principal sobre os planos com até 120 caracteres",
  "hideTitle": false,
  "plansItems": [
    {
      "id": "1",
      "title": "Nome do plano com até 30 caracteres",
      "description": "Descrição curta e persuasiva com até 120 caracteres",
      "value": "R$ 1.750",
      "planPeriod": "Investimento único",
      "recommended": false,
      "buttonTitle": "Escolher plano",
      "buttonWhereToOpen": "link",
      "buttonHref": "#",
      "buttonPhone": "",
      "hideTitleField": false,
      "hideDescription": false,
      "hidePrice": false,
      "hidePlanPeriod": false,
      "hideButtonTitle": false,
      "hideItem": false,
      "sortOrder": 0,
      "includedItems": [
        {
          "id": "1",
          "description": "Benefício/item incluído com até 60 caracteres",
          "hideDescription": false,
          "hideItem": false,
          "sortOrder": 0
        }
      ]
    }
  ]
}

INSTRUÇÕES CRÍTICAS PARA VARIAÇÕES:

SE {selectedPlans} = 1 (UM PLANO):
- Criar 1 plano completo e robusto
- recommended: false (não há comparação)
- 6-8 itens incluídos para demonstrar valor completo
- Título do plano: nome do pacote principal
- Valor sugerido: faixa R$ 1.500 a R$ 3.500

SE {selectedPlans} = 2 (DOIS PLANOS):
- Criar 2 planos: Básico + Premium
- O plano mais caro DEVE ter recommended: true
- Plano 1 (básico): 4-5 itens, valor R$ 980 a R$ 1.500
- Plano 2 (premium): 6-8 itens, valor R$ 1.750 a R$ 2.950
- Diferenciação clara entre os planos

SE {selectedPlans} = 3 (TRÊS PLANOS):
- Criar 3 planos: Essencial + Profissional + Completo
- O plano intermediário (do meio) DEVE ter recommended: true
- Plano 1 (essencial): 3-4 itens, valor R$ 980 a R$ 1.500
- Plano 2 (profissional): 5-6 itens, valor R$ 1.750 a R$ 2.500 [RECOMMENDED]
- Plano 3 (completo): 7-9 itens, valor R$ 2.950 a R$ 5.000
- Progressão lógica de recursos e valor

INSTRUÇÕES CRÍTICAS DE CONTAGEM:
⚠️ CRÍTICO: Cada campo tem um limite RÍGIDO de caracteres que NÃO PODE ser ultrapassado!
⚠️ Escreva o texto, CONTE manualmente os caracteres, e se ultrapassar, REESCREVA mais curto!
⚠️ NÃO envie textos mais longos esperando que sejam cortados - eles serão REJEITADOS!

LIMITES OBRIGATÓRIOS (incluindo espaços):
- subtitle: ATÉ 50 caracteres (conte letra por letra!)
- title: ATÉ 120 caracteres (conte letra por letra!)
- plan.title: ATÉ 30 caracteres CADA (conte!)
- plan.description: ATÉ 120 caracteres CADA (conte!)
- includedItems.description: ATÉ 60 caracteres CADA (este é o mais importante - conte!)

EXEMPLOS CORRETOS de includedItems (60 chars ou menos):

✅ CORRETO (60 chars ou menos):
"Design completo e responsivo para todas as telas" = 51 chars ✓
"SEO avançado com otimização técnica e de conteúdo" = 50 chars ✓  
"Suporte dedicado por 30 dias após lançamento" = 45 chars ✓

❌ ERRADO (mais de 60 chars):
"Design completo e totalmente responsivo para todas as telas e dispositivos" = 75 chars ✗ REJEITADO!
"SEO avançado com otimização técnica completa e auditoria de conteúdo detalhada" = 79 chars ✗ REJEITADO!

PROCESSO OBRIGATÓRIO:
1. Escreva o benefício
2. Conte CADA caractere (incluindo espaços)
3. Se passar de 60, REESCREVA mais curto
4. Valide novamente antes de enviar

OUTRAS REGRAS:
- value: formato "R$ X.XXX" (SEM centavos, COM espaço após R$)
- planPeriod: "Investimento único" OU "por mês" OU "mensal"
- Linguagem persuasiva, profissional e orientada a valor
- Items devem ser benefícios tangíveis, não features técnicas`,
        expectedFormat: `{
  "hideSection": false,
  "subtitle": "string (max 50 chars, UPPERCASE)",
  "hideSubtitle": false,
  "title": "string (max 120 chars)",
  "hideTitle": false,
  "plansItems": [{
    "id": "string",
    "title": "string (max 30 chars)",
    "description": "string (max 120 chars)",
    "value": "string (format: R$ X.XXX)",
    "planPeriod": "string",
    "recommended": boolean,
    "buttonTitle": "string (max 25 chars)",
    "buttonWhereToOpen": "link",
    "buttonHref": "#",
    "buttonPhone": "",
    "hideTitleField": false,
    "hideDescription": false,
    "hidePrice": false,
    "hidePlanPeriod": false,
    "hideButtonTitle": false,
    "hideItem": false,
    "sortOrder": number,
    "includedItems": [{
      "id": "string",
      "description": "string (max 60 chars)",
      "hideDescription": false,
      "hideItem": false,
      "sortOrder": number
    }]
  }]
}`,
        rules: [
          "subtitle: até 50 caracteres, EM MAIÚSCULAS",
          "title: até 120 caracteres",
          "Gerar EXATAMENTE {selectedPlans} planos",
          "1 plano: 6-8 items, recommended: false",
          "2 planos: 4-5 e 6-8 items, recommended no mais caro",
          "3 planos: 3-4, 5-6, 7-9 items, recommended no do meio",
          "value: formato R$ X.XXX (sem centavos)",
          "includedItems description: até 60 caracteres",
          "Linguagem persuasiva e profissional",
        ],
      },

      faq: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere APENAS um JSON válido para perguntas frequentes, respeitando rigorosamente os limites.

PROJETO: {projectName} - {projectDescription}
CLIENTE: {clientName}
EMPRESA: {companyInfo}

FORMATO OBRIGATÓRIO
{
  "hideSection": false,
  "items": [
    {
      "id": "1",
      "question": "Pergunta objetiva com ATÉ 100 caracteres",
      "answer": "Resposta completa com ATÉ 300 caracteres",
      "sortOrder": 1
    }
  ]
}

REGRAS RÍGIDAS
- CONTEÚDO ÚNICO: Crie perguntas ESPECÍFICAS para o tipo de projeto. Evite FAQs genéricas.
- Demonstre EXPERTISE do setor nas respostas (ex: para web design, fale de UX e responsividade; para arquitetura, mencione plantas e moodboards)
- Gere EXATAMENTE 5 pares pergunta e resposta RELEVANTES ao contexto.
- Cada question deve ser frase direta, sem ponto de interrogação duplicado.
- Cada answer deve ser frase(s) corridas em parágrafo único (sem bullets), trazendo benefício concreto ou reforço do processo.
- Planeje a contagem ANTES de escrever; não gere acima dos limites.
- question: ATÉ 100 caracteres (conte cada letra, espaço, pontuação)
- answer: ATÉ 300 caracteres (conte cada letra, espaço, pontuação)
- Responda apenas com o JSON final.

EXEMPLO DE RESPOSTA BOA (answer com 265 chars):
"O prazo varia conforme a complexidade. Projetos simples levam de 2 a 4 semanas, enquanto projetos complexos podem levar de 6 a 10 semanas. Após entendermos suas necessidades, fornecemos um cronograma detalhado com todas as etapas e prazos específicos."`,
        expectedFormat: `{
  "hideSection": false,
  "items": [{"id": "string", "question": "string (max 100 chars)", "answer": "string (max 300 chars)", "sortOrder": number}]
}`,
        rules: [
          "4-6 perguntas",
          "Perguntas diretas (até 100 caracteres)",
          "Respostas práticas (até 300 caracteres)",
        ],
        exactQuestions: 5,
      },

      footer: {
        enabled: true,
        prompt: `⚠️ IDIOMA OBRIGATÓRIO: TODO o conteúdo DEVE ser gerado EXCLUSIVAMENTE em português brasileiro (pt-BR).
NUNCA use inglês, japonês, chinês, espanhol ou qualquer outro idioma. APENAS pt-BR.

Gere informações de contato para o rodapé da proposta.

DADOS DO PROJETO:
- Cliente: {clientName}
- Empresa: {companyInfo}
- Usuário: {userName}
- Email: {userEmail}

FORMATO:
{
  "callToAction": "Pergunta de chamada para ação com até 100 caracteres",
  "disclaimer": "Texto de aviso legal com até 300 caracteres",
  "email": "{userEmail}",
  "phone": "Telefone de contato no formato brasileiro (+55 XX XXXXX-XXXX)",
  "marqueeText": "Texto marquee com serviços separados por → (ex: Design → Desenvolvimento → Marketing) (até 200 caracteres)",
  "hideMarquee": false
}

INSTRUÇÕES CRÍTICAS:
- callToAction: pergunta convidativa e direta (MÁXIMO 100 caracteres - CONTE!)
- disclaimer: texto sobre validade da proposta (MÁXIMO 300 caracteres - CONTE!)
- email: SEMPRE usar {userEmail} fornecido
- phone: formato brasileiro com DDD e 9 dígitos (+55 XX XXXXX-XXXX)
- marqueeText: serviços separados por → (MÁXIMO 200 caracteres - CONTE!)
- TODOS os campos devem ser preenchidos
- Linguagem profissional e acessível`,
        expectedFormat: `{
  "callToAction": "string (max 100 chars)",
  "disclaimer": "string (max 300 chars)",
  "email": "string (valid email format)",
  "phone": "string (format: +55 XX XXXXX-XXXX)",
  "marqueeText": "string (max 200 chars)",
  "hideMarquee": false
}`,
        rules: [
          "callToAction: até 100 caracteres, pergunta convidativa",
          "disclaimer: até 300 caracteres, texto sobre validade",
          "email: SEMPRE usar {userEmail}",
          "phone: formato brasileiro +55 XX XXXXX-XXXX",
          "marqueeText: até 200 caracteres, serviços separados por →",
          "Todos os campos obrigatórios",
        ],
        callToAction: "Vamos transformar sua ideia em realidade?",
        disclaimer:
          "Esta proposta é válida pelo período indicado. Estamos à disposição para esclarecer dúvidas e personalizar soluções de acordo com suas necessidades.",
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
