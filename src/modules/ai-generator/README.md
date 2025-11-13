# AI Generator - Guia de Uso

Sistema completo para geração de propostas comerciais usando IA com múltiplos templates e agentes especializados.

## 📚 Documentação

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentação técnica completa da arquitetura
- **[templates/flash/README.md](./templates/flash/README.md)** - Guia específico do template Flash

## 🚀 Quick Start

### 1. Gerar uma Proposta

```typescript
import { FlashTheme } from "#/modules/ai-generator/themes/flash";
import Together from "together-ai";

// Configurar dados da proposta
const proposalData = {
  selectedService: "marketing-digital",
  templateType: "flash",
  clientName: "Empresa XYZ",
  projectName: "Campanha de Marketing 2024",
  projectDescription: "Campanha completa de marketing digital...",
  companyInfo: "Somos uma agência especializada...",
  selectedPlans: 2,
  includeTerms: true,
  includeFAQ: true,
  mainColor: "#007BFF",
};

// Inicializar e executar
const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
const flashTheme = new FlashTheme(together);
const proposal = await flashTheme.execute(proposalData);

console.log(proposal); // Proposta completa gerada
```

### 2. Buscar Agente Especializado

```typescript
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";

const agent = await getAgentByServiceAndTemplate(
  "marketing-digital", // ServiceType
  "flash"              // TemplateType
);

console.log(agent.name);          // "Especialista em Marketing Digital Flash"
console.log(agent.systemPrompt);  // Prompt especializado
console.log(agent.expertise);     // ["SEO/SEM", "Redes Sociais", ...]
```

### 3. Usar API REST

```bash
# Gerar proposta via API
curl -X POST http://localhost:3000/api/ai/generate-proposal \
  -H "Content-Type: application/json" \
  -d '{
    "selectedService": "marketing-digital",
    "templateType": "flash",
    "clientName": "Empresa XYZ",
    "projectName": "Projeto 2024",
    "projectDescription": "Descrição detalhada",
    "companyInfo": "Informações da empresa",
    "selectedPlans": 2,
    "includeTerms": true,
    "includeFAQ": true
  }'
```

## 📝 Estrutura dos Templates

### Templates Disponíveis

1. **Flash** - Template rápido e eficiente
   - Focado em conversão
   - Limites de caracteres estritos (60/100/30 chars)
   - 10 seções principais
   - Geração em ~30 segundos

2. **Prime** - Template premium
   - Focado em sofisticação
   - Limites mais flexíveis
   - 12 seções principais
   - Geração em ~45 segundos

### Serviços Suportados

- `marketing-digital` - Marketing Digital
- `design` - Design
- `development` - Desenvolvimento
- `architecture` - Arquitetura
- `photography` - Fotografia
- `agencias-consultoria` - Agências/Consultoria

## 🎯 Seções de uma Proposta Flash

### 1. Introduction (Introdução)
- **title**: 60 caracteres (exato)
- **subtitle**: 100 caracteres (exato)
- **services**: 4 itens de 30 caracteres cada
- **validity**: "15 dias" (fixo)
- **buttonText**: "Solicitar Proposta" (fixo)

### 2. About Us (Sobre Nós)
- **title**: 155 caracteres (máximo)
- **supportText**: 70 caracteres (máximo)
- **subtitle**: 250 caracteres (máximo)

### 3. Team (Equipe)
- **title**: 55 caracteres (máximo)
- **members**: 2-3 membros com nome, cargo e foto

### 4. Specialties (Especialidades)
- **title**: 140 caracteres (máximo)
- **topics**: 6-9 tópicos
  - topic.title: 50 caracteres (máximo)
  - topic.description: 100 caracteres (máximo)

### 5. Steps (Processo)
- **title**: "Nosso Processo" (fixo)
- **introduction**: 100 caracteres (máximo)
- **topics**: Exatamente 5 etapas
  - topic.title: 40 caracteres (máximo)
  - topic.description: 240 caracteres (máximo)

### 6. Scope (Escopo)
- **content**: 350 caracteres (máximo)

### 7. Investment (Investimento)
- **title**: 85 caracteres (máximo)
- **deliverables**: 2-5 entregáveis
- **plansItems**: 1-3 planos
  - plan.title: 20 caracteres (máximo)
  - plan.description: 140 caracteres (máximo)
  - plan.includedItems: 3-6 itens de 45 caracteres cada

### 8. Terms (Termos) - Opcional
- **Array de 1-3 termos**
  - title: 30 caracteres (máximo)
  - description: 180 caracteres (máximo)

### 9. FAQ (Perguntas Frequentes)
- **Array de exatamente 10 perguntas**
  - question: 100 caracteres (máximo)
  - answer: 300 caracteres (máximo)

### 10. Footer (Rodapé)
- **callToAction**: 35 caracteres (máximo)
- **disclaimer**: 330 caracteres (máximo)

## 🔧 Configuração Avançada

### Customizar Prompts

Os prompts estão em `/config/template-prompts.ts`:

```typescript
import { templateConfigManager } from "#/modules/ai-generator/config/template-prompts";

// Obter config de um template
const flashConfig = templateConfigManager.getConfig("flash");

// Atualizar uma seção
templateConfigManager.updateSectionConfig(
  "flash",
  "introduction",
  {
    prompt: "Novo prompt customizado...",
    rules: ["Regra 1", "Regra 2"],
  }
);
```

### Customizar MoA (Mixture of Agents)

```typescript
const flashTheme = new FlashTheme(together);

// Os modelos são configurados no construtor
// Para mudar, edite /themes/flash.ts no constructor
```

### Adicionar Novo Serviço

1. Adicionar tipo em `/agents/base/types.ts`:

```typescript
export type ServiceType =
  | "marketing-digital"
  | "design"
  | "novo-servico";  // ← Adicionar aqui
```

2. Criar agente no banco de dados:

```sql
INSERT INTO agents (
  id, name, sector, service_type, system_prompt,
  expertise, common_services, pricing_model,
  proposal_structure, key_terms
) VALUES (
  'novo-servico-flash-agent',
  'Especialista em Novo Serviço Flash',
  'Novo Setor',
  'novo-servico',
  'System prompt...',
  '["Expertise 1", "Expertise 2"]',
  '["Serviço 1", "Serviço 2"]',
  'project-based',
  '["Etapa 1", "Etapa 2"]',
  '["Termo 1", "Termo 2"]'
);
```

3. Adicionar template-specific config (se necessário):

```sql
INSERT INTO agent_templates (
  id, agent_id, template_type,
  introduction_style, about_us_focus,
  specialties_approach, process_emphasis,
  investment_strategy
) VALUES (
  'novo-servico-flash-agent-flash',
  'novo-servico-flash-agent',
  'flash',
  'Estilo de introdução...',
  'Foco do sobre nós...',
  'Abordagem de especialidades...',
  'Ênfase do processo...',
  'Estratégia de investimento...'
);
```

## 🛠️ Utilitários Disponíveis

### Validação

```typescript
import {
  ensureExactLength,
  ensureMaxLength,
  ensureLengthBetween,
} from "#/modules/ai-generator/utils/validation";

// Validar tamanho exato
ensureExactLength("Texto de teste", 14, "title");
// ✅ OK

// Validar tamanho máximo
ensureMaxLength("Texto qualquer", 50, "description");
// ✅ OK

// Validar range de array
ensureLengthBetween([1, 2, 3], 2, 5, "topics");
// ✅ OK
```

### JSON Parsing

```typescript
import { safeJSONParse } from "#/modules/ai-generator/utils/validation";

const result = safeJSONParse<MyType>(jsonString);

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Geração de IDs

```typescript
import { ensureItemsHaveIds } from "#/modules/ai-generator/utils/validation";

const items = [
  { name: "Item 1" },
  { name: "Item 2", id: "custom-id" },
];

const itemsWithIds = ensureItemsHaveIds(items);
// [
//   { name: "Item 1", id: "uuid-generated" },
//   { name: "Item 2", id: "custom-id" }
// ]
```

## 🐛 Troubleshooting

### Problema: Texto truncado

**Causa:** IA gerou texto muito longo e o sistema truncou

**Solução:**
- Verifique os prompts em `/config/template-prompts.ts`
- Certifique-se de que os limites estão claros
- Use o sistema de retry com feedback

### Problema: JSON inválido

**Causa:** IA retornou JSON malformado

**Solução:**
- Sistema tenta corrigir automaticamente
- Se persistir, verifique o prompt
- Ajuste temperatura do modelo (padrão: 0.7)

### Problema: Seção com fallback

**Causa:** Todas as tentativas de geração falharam

**Solução:**
- Verifique os logs para o erro específico
- Verifique se a API key está configurada
- Verifique se tem créditos na conta Together AI
- Fallbacks garantem que a proposta seja gerada de qualquer forma

### Problema: Geração muito lenta

**Causa:** MoA usa 5 chamadas de API (4 reference + 1 aggregator)

**Soluções:**
- Para desenvolvimento: desabilite MoA temporariamente
- Para produção: considere cache ou geração assíncrona
- Seções são geradas em paralelo para otimização

## 📊 Performance

### Tempos Médios (Flash Template)

- **Introduction**: ~5s
- **About Us**: ~5s
- **Team**: ~4s
- **Specialties**: ~6s
- **Steps**: ~6s
- **Scope**: ~4s
- **Investment**: ~7s
- **Terms**: ~5s
- **FAQ**: ~8s
- **Footer**: ~4s

**Total**: ~30-40s (com MoA e validação)

### Otimizações

1. **Geração paralela** - Todas as seções são geradas simultaneamente
2. **Retry inteligente** - Apenas seções com erro fazem retry
3. **Fallbacks rápidos** - Fallbacks offline são instantâneos
4. **Cache de agentes** - Agentes são buscados do banco uma vez

## 🧪 Testing

### Testar Geração

```bash
# Via npm script
npm run test:agent-proposals

# Via API
curl -X POST http://localhost:3000/api/ai/test-generation \
  -H "Content-Type: application/json" \
  -d '{"service": "marketing-digital", "template": "flash"}'
```

### Testar Validação

```typescript
import { validateFlashCharacterLimits } from "#/modules/ai-generator/templates/flash";

const validations = validateFlashCharacterLimits(proposal);

console.log(validations);
// {
//   introductionTitle: true,
//   introductionSubtitle: true,
//   ...
// }
```

## 📖 Boas Práticas

### 1. Sempre valide limites

```typescript
// ✅ Bom
ensureExactLength(title, 60, "introduction.title");

// ❌ Ruim
if (title.length !== 60) {
  title = title.substring(0, 60); // Trunca sem validar
}
```

### 2. Use system prompts especializados

```typescript
// ✅ Bom
const agent = await getAgentByServiceAndTemplate("marketing-digital", "flash");
const result = await generateSection(prompt, agent.systemPrompt);

// ❌ Ruim
const result = await generateSection(prompt, "Você é um assistente útil");
```

### 3. Componha tamanhos corretos desde o início

```typescript
// ✅ Bom no prompt
"Escreva uma frase e conte os caracteres. 
Se tiver 58 ou 62, REESCREVA até ter EXATAMENTE 60."

// ❌ Ruim no prompt
"Escreva uma frase interessante sobre o tema."
// (sem especificar tamanho)
```

### 4. Use fallbacks de qualidade

```typescript
// ✅ Bom fallback
{
  title: "Transformamos sua visão em realidade com excelência total", // 60
  subtitle: "...", // 100
}

// ❌ Ruim fallback
{
  title: "Lorem ipsum dolor sit...", // Placeholder genérico
  subtitle: "...",
}
```

## 🔗 Links Úteis

- [Together AI Docs](https://docs.together.ai/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

## 🤝 Contribuindo

Ao contribuir com código para este módulo:

1. Siga o padrão de nomenclatura existente
2. Mantenha a documentação atualizada
3. Adicione testes quando aplicável
4. Valide limites de caracteres rigorosamente
5. Use TypeScript com tipos estritos
6. Evite usar `any` (conforme memória do usuário)

## 📝 Changelog

### v2.0.0 (2024-11)
- ✨ Renomeou arquivos `template-config.ts` para clareza
- 📚 Criou documentação completa (ARCHITECTURE.md)
- 🧹 Removeu código legacy (backup/hardcoded-agents)
- 🔧 Consolidou utilitários de validação
- 📝 Criou guia de uso completo

### v1.0.0
- 🎉 Versão inicial com templates Flash e Prime
- 🤖 Sistema de MoA (Mixture of Agents)
- 📊 Integração com banco de dados
- ✅ Sistema de validação rigoroso






