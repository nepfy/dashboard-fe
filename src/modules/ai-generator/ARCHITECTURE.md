# Arquitetura do AI Generator

## Visão Geral

O módulo `ai-generator` é responsável por gerar propostas comerciais personalizadas usando IA (LLMs). O sistema suporta múltiplos templates (Flash, Prime) e múltiplos tipos de serviços (arquitetura, design, desenvolvimento, etc.).

## Estrutura de Diretórios

```
ai-generator/
├── agents/                    # Sistema de agentes especializados
│   ├── base/
│   │   ├── types.ts          # Tipos base para agentes
│   │   └── template-constraints.ts  # Sistema de constraints (limites de caracteres)
│   ├── database-agents.ts    # Funções para buscar agentes do banco de dados
│   └── index.ts              # API pública para agentes
├── config/
│   └── template-prompts.ts   # Prompts completos e configuração MoA para cada template
├── templates/                 # Definições de templates
│   ├── base/
│   │   └── base-template.ts  # Template base compartilhado
│   ├── flash/
│   │   ├── flash-template.ts # Tipos e estrutura do template Flash
│   │   ├── constraints.ts    # Constraints específicas do Flash (limites de caracteres)
│   │   ├── constants.ts      # Constantes do Flash
│   │   ├── index.ts          # Exports públicos
│   │   └── README.md         # Documentação do Flash
│   └── prime/
│       ├── prime-template.ts # Tipos e estrutura do template Prime
│       ├── constraints.ts    # Constraints específicas do Prime
│       ├── constants.ts      # Constantes do Prime
│       └── index.ts          # Exports públicos
├── themes/                    # Implementação de geração por template
│   ├── base-theme.ts         # Tema base e tipos compartilhados
│   ├── flash.ts              # Implementação completa do Flash (2000+ linhas)
│   ├── prime.ts              # Implementação completa do Prime
│   ├── json-utils.ts         # Utilitários para parsing de JSON
│   └── validators.ts         # Funções de validação
├── services/
│   └── moa-service.ts        # Serviço de Mixture of Agents (múltiplos LLMs)
├── utils/
│   ├── index.ts              # Utilitários gerais
│   ├── project-name-handler.ts
│   └── text-validation.ts
└── components/               # Componentes React para UI
    ├── generation-steps/     # Steps do fluxo de geração
    ├── icons/                # Ícones customizados
    ├── modal/                # Modais de configuração
    └── template-selection/   # Seleção de templates

```

## Fluxo de Geração de Propostas

### 1. Entrada do Usuário
```typescript
interface FlashThemeData {
  selectedService: ServiceType;      // Ex: "marketing-digital"
  companyInfo: string;               // Informações da empresa
  clientName: string;                // Nome do cliente
  projectName: string;               // Nome do projeto
  projectDescription: string;        // Descrição do projeto
  selectedPlans: number;             // Quantidade de planos (1-3)
  includeTerms: boolean;             // Incluir termos e condições
  includeFAQ: boolean;               // Incluir FAQ
  templateType: TemplateType;        // "flash" ou "prime"
  mainColor?: string;                // Cor principal
}
```

### 2. Busca do Agente Especializado

O sistema busca um agente especializado no banco de dados:

```typescript
// 1. Buscar agente no banco
const agent = await getAgentByServiceAndTemplate(
  data.selectedService,  // Ex: "marketing-digital"
  data.templateType      // Ex: "flash"
);

// 2. O agente contém:
interface BaseAgentConfig {
  id: string;                    // Ex: "marketing-digital-flash-agent"
  name: string;                  // Nome do agente
  sector: string;                // Setor de atuação
  systemPrompt: string;          // Prompt do sistema (contexto para IA)
  expertise: string[];           // Áreas de expertise
  commonServices: string[];      // Serviços comuns
  pricingModel: string;          // Modelo de precificação
  proposalStructure: string[];   // Estrutura da proposta
  keyTerms: string[];            // Termos-chave do setor
}
```

### 3. Geração de Seções

Cada template tem múltiplas seções que são geradas em paralelo:

#### Seções do Template Flash:
1. **Introduction** - Título, subtítulo, serviços (60/100/30 chars)
2. **About Us** - Título, supportText, subtitle (155/70/250 chars)
3. **Team** - Título e membros da equipe (55 chars)
4. **Specialties** - 6-9 especialidades (50/100 chars cada)
5. **Steps** - 5 etapas do processo (40/240 chars)
6. **Scope** - Escopo do projeto (350 chars)
7. **Investment** - Planos e investimento (limites variados)
8. **Terms** - Termos e condições (opcional)
9. **FAQ** - 10 perguntas frequentes (100/300 chars)
10. **Footer** - CTA e disclaimer (35/330 chars)

#### Processo de Geração de Cada Seção:

```typescript
// 1. Obter prompt específico da seção
const prompt = getSectionPrompt("introduction", data);

// 2. Gerar com MoA (Mixture of Agents)
const result = await moaService.generateWithRetry<Section>(
  prompt,
  agent.systemPrompt,
  expectedFormat
);

// 3. Validar limites de caracteres
validateIntroductionSection(result);

// 4. Se falhar, retry com feedback
// 5. Se falhar 5x, usar fallback offline
```

### 4. Mixture of Agents (MoA)

O sistema usa múltiplos modelos de IA para gerar conteúdo de alta qualidade:

```typescript
// Etapa 1: Gerar versões com 4 modelos diferentes
const references = await Promise.all([
  model1.generate(prompt),
  model2.generate(prompt),
  model3.generate(prompt),
  model4.generate(prompt),
]);

// Etapa 2: Agregar e refinar com o melhor modelo
const final = await aggregatorModel.generate({
  prompt: "Sintetize as melhores partes de cada resposta",
  references: references,
});
```

**Modelos Usados:**
- **Reference Models:** Qwen2.5-72B, Llama-3.3-70B, DeepSeek-V3.1, Qwen2.5-7B
- **Aggregator Model:** Llama-3.3-70B

### 5. Validação e Retry

Cada seção passa por um processo rigoroso de validação:

```typescript
// Tentativas: até 5 vezes
for (let attempt = 0; attempt < 5; attempt++) {
  try {
    // Gerar
    const section = await generateSection(prompt);
    
    // Validar limites exatos
    if (section.title.length !== 60) {
      throw new Error(`Title must be exactly 60 chars, got ${section.title.length}`);
    }
    
    return section; // Sucesso!
    
  } catch (error) {
    // Montar prompt com feedback específico
    const feedbackPrompt = buildPromptWithValidationFeedback(
      basePrompt,
      error.message,
      attempt
    );
    
    // Retry com feedback
  }
}

// Se falhar todas as tentativas, usar fallback
return getFallbackSection(sectionKey);
```

### 6. Fallback Offline

Cada seção tem um fallback pré-definido que garante que a proposta sempre será gerada:

```typescript
function getFallbackSection(sectionKey: string) {
  switch (sectionKey) {
    case "introduction":
      return {
        title: "Transformamos sua visão em realidade com excelência total", // 60
        subtitle: "Unimos estratégia, execução e cuidado para entregar resultados que superam suas expectativas hoje", // 100
        services: [
          "Diagnóstico estratégico total", // 30
          "Plano orientado a dados reais", // 30
          "Execução multicanal completa", // 29
          "Monitoramento contínuo eficaz", // 30
        ],
        validity: "15 dias",
        buttonText: "Solicitar Proposta",
      };
    // ... outros fallbacks
  }
}
```

## Sistema de Constraints

### Tipos de Constraints

1. **Exact Length** - Exatamente N caracteres
```typescript
title: exact(60)  // DEVE ter exatamente 60 caracteres
```

2. **Max Length** - Até N caracteres
```typescript
description: max(100)  // Pode ter de 1 a 100 caracteres
```

3. **Array Constraints** - Quantidade de itens
```typescript
services: {
  exactItems: 4,      // Exatamente 4 itens
  stringItem: exact(30)  // Cada item com 30 chars
}

topics: {
  minItems: 6,        // Mínimo 6 itens
  maxItems: 9,        // Máximo 9 itens
}
```

### Arquivo de Constraints

Cada template tem seu arquivo de constraints (`constraints.ts`) que define limites específicos:

```typescript
export const flashTemplateConstraints: TemplateConfig = {
  version: "1.0.0",
  templateType: "flash",
  sections: {
    introduction: {
      fields: {
        title: exact(60),
        subtitle: exact(100),
      },
      collections: {
        services: {
          exactItems: 4,
          stringItem: exact(30),
        },
      },
    },
    // ... outras seções
  },
};
```

## Sistema de Prompts

### Arquivo de Prompts

O arquivo `/config/template-prompts.ts` contém os prompts completos para cada seção de cada template:

```typescript
export const defaultTemplateConfigs = {
  flash: {
    sections: {
      introduction: {
        prompt: `
          DADOS DO PROJETO:
          - Cliente: {clientName}
          - Projeto: {projectName}
          
          OBJETIVO
          Gerar textos premium com CONTAGEM EXATA de caracteres
          
          FORMATO OBRIGATÓRIO
          {
            "title": "Frase com EXATAMENTE 60 caracteres",
            "subtitle": "Frase com EXATAMENTE 100 caracteres",
            ...
          }
          
          REGRAS RÍGIDAS
          - title: Exatamente 60 caracteres
          - subtitle: Exatamente 100 caracteres
          - Planejar antes de escrever
          - NÃO gerar texto para depois cortar
        `,
        expectedFormat: `{ "title": "string", "subtitle": "string", ... }`,
        rules: [
          "title: EXATAMENTE 60 caracteres",
          "subtitle: EXATAMENTE 100 caracteres",
        ],
      },
    },
  },
};
```

### Substituição de Variáveis

Os prompts usam placeholders que são substituídos com dados reais:

```typescript
function applyPromptReplacements(prompt: string, data: FlashThemeData): string {
  return prompt
    .replace(/{clientName}/g, data.clientName)
    .replace(/{projectName}/g, data.projectName)
    .replace(/{projectDescription}/g, data.projectDescription)
    .replace(/{companyInfo}/g, data.companyInfo)
    .replace(/{selectedPlans}/g, String(data.selectedPlans));
}
```

## Banco de Dados

### Tabela: agents

Armazena os agentes especializados:

```sql
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  service_type TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  expertise JSONB NOT NULL,
  common_services JSONB NOT NULL,
  pricing_model TEXT NOT NULL,
  proposal_structure JSONB NOT NULL,
  key_terms JSONB NOT NULL,
  template_config JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: agent_templates

Armazena configurações específicas de template para cada agente:

```sql
CREATE TABLE agent_templates (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  template_type TEXT NOT NULL,
  introduction_style TEXT,
  about_us_focus TEXT,
  specialties_approach TEXT,
  process_emphasis TEXT,
  investment_strategy TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);
```

## APIs Principais

### 1. Geração de Proposta

```typescript
POST /api/ai/generate-proposal

Body: {
  selectedService: "marketing-digital",
  templateType: "flash",
  clientName: "Nome do Cliente",
  projectName: "Nome do Projeto",
  projectDescription: "Descrição detalhada",
  companyInfo: "Informações da empresa",
  selectedPlans: 2,
  includeTerms: true,
  includeFAQ: true,
}

Response: {
  success: true,
  proposal: {
    introduction: { ... },
    aboutUs: { ... },
    team: { ... },
    // ... todas as seções
  }
}
```

### 2. Buscar Agentes

```typescript
GET /api/agents?service=marketing-digital&template=flash

Response: {
  id: "marketing-digital-flash-agent",
  name: "Especialista em Marketing Digital Flash",
  sector: "Marketing Digital",
  // ... configuração completa
}
```

## Boas Práticas

### 1. Geração de Conteúdo

- ✅ **Planeje o tamanho antes de escrever**
  - Não gere texto longo e depois corte
  - Componha frases que já nascem no tamanho correto

- ✅ **Use o sistema de retry com feedback**
  - Se falhar validação, informe o erro específico
  - Tente até 5 vezes antes de usar fallback

- ✅ **Mantenha fallbacks de qualidade**
  - Fallbacks devem ser textos reais, não placeholders
  - Devem passar todas as validações

### 2. Validação

- ✅ **Valide rigorosamente**
  - Use `ensureExactLength` para limites exatos
  - Use `ensureMaxLength` para limites máximos
  - Lance erros descritivos

- ✅ **Não truncate silenciosamente**
  - Se o texto está longo demais, rejeite e regenere
  - Truncar perde informação e qualidade

### 3. Prompts

- ✅ **Seja específico nos prompts**
  - Especifique limites exatos de caracteres
  - Dê exemplos do formato esperado
  - Explique as regras claramente

- ✅ **Use system prompts contextualizados**
  - Cada agente tem um system prompt específico
  - Combine com prompts de seção para melhor resultado

## Troubleshooting

### Problema: Texto truncado ou muito longo

**Causa:** IA não respeitou o limite de caracteres

**Solução:**
1. Verificar se o prompt especifica o limite claramente
2. Verificar se está usando retry com feedback
3. Verificar se o fallback é válido

### Problema: JSON inválido

**Causa:** IA retornou JSON malformado

**Solução:**
1. Sistema tenta parsing normal
2. Se falhar, usa `json-utils.ts` para tentar corrigir
3. Se falhar, retry com prompt de correção
4. Se falhar todas tentativas, usa fallback

### Problema: Geração muito lenta

**Causa:** MoA usa 5 chamadas de API (4 reference + 1 aggregator)

**Solução:**
1. Para desenvolvimento, pode desabilitar MoA
2. Para produção, MoA garante qualidade superior
3. Seções são geradas em paralelo para velocidade

## Referências

- **Together AI:** https://docs.together.ai/
- **MoA (Mixture of Agents):** Técnica de usar múltiplos LLMs e agregar resultados
- **Drizzle ORM:** https://orm.drizzle.team/
- **Zod:** https://zod.dev/ (validação de tipos)

## Manutenção

### Adicionar Novo Template

1. Criar pasta em `/templates/novo-template/`
2. Criar `novo-template.ts` com tipos
3. Criar `constraints.ts` com limites
4. Criar implementação em `/themes/novo-template.ts`
5. Adicionar prompts em `/config/template-prompts.ts`
6. Atualizar tipos em `/agents/base/types.ts`

### Adicionar Novo Tipo de Serviço

1. Adicionar tipo em `ServiceType` em `/agents/base/types.ts`
2. Criar agente no banco de dados
3. Adicionar prompts específicos se necessário
4. Atualizar UI de seleção de serviços

### Ajustar Limites de Caracteres

1. Atualizar constraints em `/templates/{template}/constraints.ts`
2. Atualizar prompts em `/config/template-prompts.ts`
3. Atualizar validações em `/themes/{template}.ts`
4. Atualizar fallbacks para respeitar novos limites

