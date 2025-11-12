# Guia Rápido de Uso - AI Generator

Este guia fornece exemplos práticos de como usar o módulo AI Generator.

## 📦 Imports

```typescript
// Import centralizado - recomendado
import {
  FlashTheme,
  getAgentByServiceAndTemplate,
  type FlashThemeData,
  type FlashProposal,
} from "#/modules/ai-generator";

// Ou imports específicos
import { FlashTheme } from "#/modules/ai-generator/themes/flash";
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";
```

## 🎯 Casos de Uso Comuns

### 1. Gerar Proposta Flash Completa

```typescript
import { FlashTheme } from "#/modules/ai-generator";
import Together from "together-ai";

async function gerarPropostaFlash() {
  // 1. Configurar dados
  const data: FlashThemeData = {
    selectedService: "marketing-digital",
    templateType: "flash",
    clientName: "Empresa ABC",
    projectName: "Campanha Digital 2024",
    projectDescription: "Campanha completa de marketing digital focada em conversão...",
    companyInfo: "Somos uma agência especializada em marketing digital...",
    selectedPlans: 2,
    planDetails: "Plano Básico e Plano Premium",
    includeTerms: true,
    includeFAQ: true,
    mainColor: "#007BFF",
    userName: "João Silva",
    userEmail: "joao@empresa.com",
  };

  // 2. Inicializar
  const together = new Together({ 
    apiKey: process.env.TOGETHER_API_KEY 
  });
  const flashTheme = new FlashTheme(together);

  // 3. Gerar
  const proposal = await flashTheme.execute(data);

  // 4. Usar proposta
  console.log(proposal.introduction.title);     // "Transformamos..."
  console.log(proposal.investment.plansItems);  // [...]
  
  return proposal;
}
```

### 2. Gerar Apenas Uma Seção

```typescript
import { FlashTheme } from "#/modules/ai-generator";
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator";
import Together from "together-ai";

async function gerarApenasIntroducao() {
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
  const flashTheme = new FlashTheme(together);
  
  // Buscar agente
  const agent = await getAgentByServiceAndTemplate(
    "marketing-digital",
    "flash"
  );
  
  if (!agent) {
    throw new Error("Agente não encontrado");
  }

  // Dados mínimos necessários
  const data = {
    selectedService: "marketing-digital",
    templateType: "flash",
    clientName: "Cliente ABC",
    projectName: "Projeto XYZ",
    projectDescription: "Descrição...",
    companyInfo: "Info da empresa...",
    selectedPlans: 1,
    planDetails: "",
    includeTerms: false,
    includeFAQ: false,
  };

  // Gerar apenas introdução
  const introduction = await flashTheme["generateIntroduction"](
    data as FlashThemeData,
    agent
  );

  console.log(introduction);
  // {
  //   title: "...",  // 60 chars
  //   subtitle: "...", // 100 chars
  //   services: ["...", "...", "...", "..."], // 4x30 chars
  //   validity: "15 dias",
  //   buttonText: "Solicitar Proposta"
  // }
}
```

### 3. Validar Proposta Gerada

```typescript
import { validateFlashCharacterLimits } from "#/modules/ai-generator";
import type { FlashProposal } from "#/modules/ai-generator";

function validarProposta(proposal: FlashProposal) {
  const validations = validateFlashCharacterLimits(proposal);

  // Verificar cada campo
  Object.entries(validations).forEach(([key, isValid]) => {
    if (!isValid) {
      console.error(`❌ Campo inválido: ${key}`);
    }
  });

  // Verificar se tudo está válido
  const isAllValid = Object.values(validations).every(v => v === true);
  
  return isAllValid;
}
```

### 4. Buscar e Listar Agentes

```typescript
import {
  getAgentByServiceAndTemplate,
  getAgentsByTemplate,
  getAvailableServices,
  getAvailableTemplates,
} from "#/modules/ai-generator";

async function listarAgentes() {
  // Buscar um agente específico
  const agent = await getAgentByServiceAndTemplate(
    "marketing-digital",
    "flash"
  );
  console.log(agent?.name); // "Especialista em Marketing Digital Flash"

  // Listar todos os agentes de um template
  const flashAgents = await getAgentsByTemplate("flash");
  console.log(Object.keys(flashAgents)); 
  // ["marketing-digital", "design", "development", ...]

  // Listar serviços disponíveis
  const services = await getAvailableServices();
  console.log(services); 
  // ["marketing-digital", "design", ...]

  // Listar templates disponíveis
  const templates = await getAvailableTemplates();
  console.log(templates); 
  // ["flash", "prime", "grid"]
}
```

### 5. Customizar Prompts

```typescript
import { templateConfigManager } from "#/modules/ai-generator";

function customizarPrompts() {
  // Obter config atual
  const flashConfig = templateConfigManager.getConfig("flash");
  console.log(flashConfig?.sections.introduction.prompt);

  // Atualizar uma seção
  templateConfigManager.updateSectionConfig(
    "flash",
    "introduction",
    {
      prompt: "Novo prompt customizado para introdução...",
      rules: ["Regra 1", "Regra 2", "Regra 3"],
    }
  );

  // Atualizar config de MoA
  templateConfigManager.updateMoAConfig("flash", {
    temperature: 0.8,
    maxRetries: 3,
  });

  // Adicionar override para agente específico
  templateConfigManager.addAgentOverride(
    "flash",
    "marketing-digital-flash-agent",
    {
      systemPrompt: "System prompt customizado...",
      sectionOverrides: {
        introduction: {
          prompt: "Prompt específico para este agente...",
        },
      },
    }
  );
}
```

### 6. Usar Utilitários de Validação

```typescript
import {
  ensureExactLength,
  ensureMaxLength,
  ensureLengthBetween,
  safeJSONParse,
  ensureItemsHaveIds,
} from "#/modules/ai-generator";

function exemplosValidacao() {
  // Validar comprimento exato
  try {
    const title = ensureExactLength("Meu título", 60, "introduction.title");
    console.log("✅ Título válido");
  } catch (error) {
    console.error("❌ Título inválido:", error.message);
  }

  // Validar comprimento máximo
  try {
    const description = ensureMaxLength(
      "Descrição do produto...",
      200,
      "product.description"
    );
    console.log("✅ Descrição válida");
  } catch (error) {
    console.error("❌ Descrição inválida:", error.message);
  }

  // Validar array
  const topics = [1, 2, 3, 4, 5, 6];
  try {
    ensureLengthBetween(topics, 6, 9, "specialties.topics");
    console.log("✅ Array válido");
  } catch (error) {
    console.error("❌ Array inválido:", error.message);
  }

  // Parse JSON seguro
  const jsonString = '{"title": "Test", "value": 123}';
  const result = safeJSONParse<{ title: string; value: number }>(jsonString);
  
  if (result.success) {
    console.log("✅ JSON válido:", result.data);
  } else {
    console.error("❌ JSON inválido:", result.error);
  }

  // Garantir IDs únicos
  const items = [
    { name: "Item 1" },
    { name: "Item 2", id: "custom-id" },
  ];
  const itemsWithIds = ensureItemsHaveIds(items);
  console.log(itemsWithIds);
  // [
  //   { name: "Item 1", id: "uuid-generated" },
  //   { name: "Item 2", id: "custom-id" }
  // ]
}
```

### 7. Trabalhar com Fallbacks

```typescript
import { FlashTheme } from "#/modules/ai-generator";
import Together from "together-ai";

async function gerarComFallback() {
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
  const flashTheme = new FlashTheme(together);
  
  const data: FlashThemeData = {
    // ... dados da proposta
  };

  try {
    // Tentar gerar proposta
    const proposal = await flashTheme.execute(data);
    console.log("✅ Proposta gerada com sucesso");
    return proposal;
  } catch (error) {
    console.error("❌ Erro na geração:", error);
    
    // Fallback é aplicado automaticamente pelo sistema
    // se todas as tentativas falharem
    throw error;
  }
}
```

### 8. Usar MoA (Mixture of Agents) Diretamente

```typescript
import { MOAService } from "#/modules/ai-generator";
import Together from "together-ai";

async function usarMOADiretamente() {
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
  
  // Configurar MoA
  const moaService = new MOAService(together, {
    referenceModels: [
      "Qwen/Qwen2.5-72B-Instruct-Turbo",
      "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    ],
    aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    maxRetries: 2,
    temperature: 0.7,
    maxTokens: 2000,
  });

  // Gerar conteúdo
  const result = await moaService.generateWithRetry<{
    title: string;
    description: string;
  }>(
    "Gere um título e descrição para um produto de tecnologia",
    "Você é um especialista em copywriting",
    '{"title": "string", "description": "string"}'
  );

  if (result.success) {
    console.log("✅ Gerado:", result.result);
    console.log("Tempo:", result.metadata.generationTime, "ms");
    console.log("Modelos usados:", result.metadata.modelsUsed);
  } else {
    console.error("❌ Erro:", result.error);
  }
}
```

### 9. Criar Novo Agente Programaticamente

```typescript
import { upsertAgent, upsertAgentTemplate } from "#/modules/ai-generator";

async function criarNovoAgente() {
  // 1. Criar agente base
  const agentId = await upsertAgent({
    name: "Especialista em Novo Serviço",
    sector: "Novo Setor",
    serviceType: "novo-servico",
    systemPrompt: "Você é um especialista em...",
    expertise: ["Expertise 1", "Expertise 2"],
    commonServices: ["Serviço 1", "Serviço 2"],
    pricingModel: "project-based",
    proposalStructure: ["Etapa 1", "Etapa 2"],
    keyTerms: ["Termo 1", "Termo 2"],
  });

  console.log("✅ Agente criado:", agentId);

  // 2. Adicionar configuração específica do template Flash
  await upsertAgentTemplate(agentId, "flash", {
    introductionStyle: "Foco em velocidade e eficiência...",
    aboutUsFocus: "Especialistas em entregas rápidas...",
    specialtiesApproach: "Metodologia ágil adaptada...",
    processEmphasis: "Processo otimizado para...",
    investmentStrategy: "Investimento estruturado com...",
  });

  console.log("✅ Template Flash configurado para o agente");
}
```

### 10. Monitorar Performance

```typescript
import { FlashTheme } from "#/modules/ai-generator";
import Together from "together-ai";

async function monitorarPerformance() {
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
  const flashTheme = new FlashTheme(together);
  
  const startTime = Date.now();
  
  const data: FlashThemeData = {
    // ... dados
  };

  const proposal = await flashTheme.execute(data);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log("⏱️ Tempo total:", duration, "ms");
  console.log("📊 Tempo médio por seção:", duration / 10, "ms");
  
  // Log detalhado por seção
  console.log({
    introduction: "~5s",
    aboutUs: "~5s",
    team: "~4s",
    specialties: "~6s",
    steps: "~6s",
    scope: "~4s",
    investment: "~7s",
    terms: "~5s",
    faq: "~8s",
    footer: "~4s",
  });
}
```

## 🎨 Padrões de Design

### Padrão: Geração com Retry e Feedback

```typescript
async function gerarComRetry<T>(
  generateFn: () => Promise<T>,
  validateFn: (result: T) => void,
  maxAttempts: number = 5
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await generateFn();
      validateFn(result);
      return result; // Sucesso!
    } catch (error) {
      lastError = error as Error;
      console.log(`⚠️ Tentativa ${attempt + 1}/${maxAttempts} falhou:`, error.message);
      
      if (attempt < maxAttempts - 1) {
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

// Uso
const introduction = await gerarComRetry(
  () => generateIntroduction(data, agent),
  (intro) => ensureExactLength(intro.title, 60, "title"),
  5
);
```

### Padrão: Composição de Prompts

```typescript
function composePrompt(
  basePrompt: string,
  data: Record<string, string>,
  rules: string[]
): string {
  // 1. Substituir variáveis
  let prompt = basePrompt;
  for (const [key, value] of Object.entries(data)) {
    prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }

  // 2. Adicionar regras
  if (rules.length > 0) {
    prompt += "\n\nREGRAS ADICIONAIS:\n";
    rules.forEach((rule, index) => {
      prompt += `${index + 1}. ${rule}\n`;
    });
  }

  return prompt;
}

// Uso
const prompt = composePrompt(
  "Gere um título para {projectName} do cliente {clientName}",
  {
    projectName: "Campanha 2024",
    clientName: "Empresa ABC",
  },
  [
    "Exatamente 60 caracteres",
    "Tom profissional e convidativo",
    "Sem mencionar o nome do cliente",
  ]
);
```

## 🚀 Performance Tips

1. **Use geração paralela** - O sistema já faz isso automaticamente
2. **Cache agentes** - Busque uma vez e reutilize
3. **Desabilite MoA em dev** - Para testes rápidos
4. **Use fallbacks de qualidade** - Garanta que sempre funcionem

## 🐛 Debugging

### Habilitar logs detalhados

```typescript
// Adicione no início do seu código
process.env.DEBUG = "ai-generator:*";

// Ou no console do navegador
localStorage.setItem("DEBUG", "ai-generator:*");
```

### Ver prompts enviados

```typescript
const flashTheme = new FlashTheme(together);

// Hook into the generation process
const originalGenerate = flashTheme["generateSectionContent"];
flashTheme["generateSectionContent"] = async function(...args) {
  console.log("📤 Prompt:", args[0].substring(0, 200));
  const result = await originalGenerate.apply(this, args);
  console.log("📥 Result:", result);
  return result;
};
```

## 📚 Mais Recursos

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura completa
- [README.md](./README.md) - Guia geral
- [templates/flash/README.md](./templates/flash/README.md) - Específico do Flash






