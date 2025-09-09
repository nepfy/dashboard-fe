# 🎯 Guia: Retool com Estrutura Real dos Agentes

## 📋 Baseado na Estrutura Real dos Arquivos

Este guia é baseado na estrutura real dos agentes que você mostrou nos arquivos `flash-agents.ts`.

## 🗄️ Estrutura Real dos Agentes

### **Cada Agente Tem:**

```typescript
{
  id: "flash-marketing-digital-agent",
  name: "Especialista em Marketing Digital Flash",
  sector: "Marketing Digital",
  systemPrompt: "Prompt completo com diretrizes específicas...",
  expertise: ["SEO e SEM Flash", "Redes Sociais Rápidas", ...],
  commonServices: ["Gestão de Redes Sociais Flash", ...],
  proposalStructure: ["Análise de Mercado Flash", ...],
  keyTerms: ["ROI Flash", "CTR Rápido", ...],
  flashSpecific: {
    introductionStyle: "Foco em marketing rápido...",
    aboutUsFocus: "Especialistas em marketing flash...",
    specialtiesApproach: "Metodologia ágil...",
    processEmphasis: "Processo estratégico...",
    investmentStrategy: "Investimento em marketing flash..."
  }
}
```

## 🚀 Setup no Retool

### **Passo 1: Criar Aplicação**

1. Acesse [retool.com](https://retool.com)
2. **Create new app** → "Agentes IA - Nepfy (Real)"
3. **Template**: "Blank app"

### **Passo 2: Configurar Banco**

1. **Resources** → **Create new**
2. **Tipo**: PostgreSQL
3. **Configuração**:
   ```
   Host: [seu-host-neon]
   Port: 5432
   Database: [seu-database]
   Username: [seu-username]
   Password: [sua-password]
   SSL: Required
   ```

### **Passo 3: Criar Queries (uma por vez)**

#### **Query 1: Listar Agentes**

```sql
-- Nome: getAllAgents
SELECT
  a.id,
  a.name,
  a.sector,
  a.service_type,
  a.pricing_model,
  a.is_active,
  a.created_at,
  a.updated_at,
  COUNT(at.id) as template_count
FROM agents a
LEFT JOIN agent_templates at ON a.id = at.agent_id AND at.is_active = true
WHERE a.is_active = true
GROUP BY a.id, a.name, a.sector, a.service_type, a.pricing_model, a.is_active, a.created_at, a.updated_at
ORDER BY a.name;
```

#### **Query 2: Buscar Agente Completo**

```sql
-- Nome: getAgentComplete
SELECT
  a.*,
  at.template_type,
  at.introduction_style,
  at.about_us_focus,
  at.specialties_approach,
  at.process_emphasis,
  at.investment_strategy,
  at.additional_prompt
FROM agents a
LEFT JOIN agent_templates at ON a.id = at.agent_id
WHERE a.id = {{ agentId.value }}
  AND a.is_active = true;
```

#### **Query 3: Salvar Agente**

```sql
-- Nome: saveAgent
INSERT INTO agents (
  id, name, sector, service_type, system_prompt,
  expertise, common_services, pricing_model,
  proposal_structure, key_terms, is_active
) VALUES (
  {{ basicForm.id }},
  {{ basicForm.name }},
  {{ basicForm.sector }},
  {{ basicForm.serviceType }},
  {{ systemPromptEditor.value }},
  {{ expertiseEditor.value }},
  {{ commonServicesEditor.value }},
  {{ basicForm.pricingModel }},
  {{ proposalStructureEditor.value }},
  {{ keyTermsEditor.value }},
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sector = EXCLUDED.sector,
  service_type = EXCLUDED.service_type,
  system_prompt = EXCLUDED.system_prompt,
  expertise = EXCLUDED.expertise,
  common_services = EXCLUDED.common_services,
  pricing_model = EXCLUDED.pricing_model,
  proposal_structure = EXCLUDED.proposal_structure,
  key_terms = EXCLUDED.key_terms,
  updated_at = CURRENT_TIMESTAMP;
```

### **Passo 4: Criar Interface**

#### **Página Principal: Dashboard**

1. **Título**: "🤖 Gerenciador de Agentes IA - Estrutura Real"
2. **Tabela de Agentes**:
   - Data Source: `getAllAgents`
   - Colunas: Nome, Setor, Tipo de Serviço, Modelo de Preço, Templates, Ações
3. **Botões**:
   - "➕ Novo Agente"
   - "🔄 Atualizar"

#### **Página de Edição: Agente Completo**

1. **Título**: "✏️ Editar Agente - Estrutura Real"
2. **Aba 1: Informações Básicas**
   - Formulário com: ID, Nome, Setor, Tipo de Serviço, Modelo de Preço
3. **Aba 2: System Prompt**
   - Textarea grande (20 linhas)
   - Contador de caracteres
4. **Aba 3: Arrays JSON**
   - JSON Editor para: Expertise, Common Services, Proposal Structure, Key Terms
5. **Aba 4: Templates Específicos**
   - Sub-abas: Flash Template, Prime Template
   - Campos específicos de cada template
6. **Aba 5: Preview**
   - Mostrar dados completos do agente

### **Passo 5: Configurar Eventos**

#### **Evento da Tabela**

```javascript
// Ao clicar em "Editar"
selectedAgent.setValue(agentsTable.selectedRow);
utils.openPage("edit-agent");
```

#### **Evento do Formulário**

```javascript
// Ao salvar
await saveAgent.trigger();
await saveFlashTemplate.trigger();
await savePrimeTemplate.trigger();
await getAllAgents.trigger();
utils.showNotification("Agente salvo com sucesso!", "success");
utils.closePage();
```

#### **Evento de Teste**

```javascript
// Ao testar agente
await testAgent.trigger();
utils.showNotification("Teste executado! Verifique o resultado.", "info");
```

## 🎨 Componentes Especiais

### **Editor de System Prompt**

- **Tipo**: Textarea
- **Tamanho**: 20 linhas
- **Features**: Contador de caracteres, auto-save

### **Editor de Arrays JSON**

- **Tipo**: JSON Editor
- **Features**: Validação JSON, formatação automática

### **Editor de Templates**

- **Tipo**: Form com campos específicos
- **Campos**: Introduction Style, About Us Focus, etc.

## 📊 Dados de Exemplo

### **Agente Flash - Marketing Digital**

```json
{
  "id": "flash-marketing-digital-agent",
  "name": "Especialista em Marketing Digital Flash",
  "sector": "Marketing Digital",
  "service_type": "marketing-digital",
  "system_prompt": "Prompt completo com diretrizes específicas...",
  "expertise": [
    "SEO e SEM Flash",
    "Redes Sociais Rápidas",
    "Email Marketing Express",
    "Marketing de Conteúdo Flash"
  ],
  "common_services": [
    "Gestão de Redes Sociais Flash",
    "Campanhas de Google Ads Express",
    "SEO - Otimização para Buscadores Flash"
  ],
  "proposal_structure": [
    "Análise de Mercado Flash",
    "Estratégia de Marketing Rápida",
    "Execução Flash das Campanhas"
  ],
  "key_terms": ["ROI Flash", "CTR Rápido", "CPC Eficiente", "Conversão Rápida"],
  "flashSpecific": {
    "introductionStyle": "Foco em marketing rápido com estratégias ágeis e resultados imediatos",
    "aboutUsFocus": "Especialistas em marketing flash que combinam velocidade com estratégia",
    "specialtiesApproach": "Metodologia ágil para marketing digital de impacto rápido",
    "processEmphasis": "Processo estratégico otimizado para entrega rápida de resultados",
    "investmentStrategy": "Investimento em marketing flash com retorno rápido e crescimento acelerado"
  }
}
```

## 🔧 Funcionalidades Especiais

### **1. Preview do Agente**

- Mostrar dados completos
- Simular uso do agente
- Validar estrutura

### **2. Teste de Agente**

- Botão "Testar Agente"
- Chamada para API
- Mostrar resultado

### **3. Validação de Dados**

- Verificar campos obrigatórios
- Validar JSON arrays
- Verificar tamanho do prompt

### **4. Backup e Restore**

- Exportar agente completo
- Importar de arquivo
- Histórico de versões

## 🎯 Próximos Passos

1. **Criar aplicação no Retool**
2. **Configurar banco de dados**
3. **Criar queries acima**
4. **Criar interface com abas**
5. **Implementar editores especiais**
6. **Testar com dados reais**

## ✅ Checklist

- [ ] Conexão com banco funcionando
- [ ] Queries executando sem erro
- [ ] Tabela carregando dados
- [ ] Formulário funcionando
- [ ] Editores JSON funcionando
- [ ] Templates específicos funcionando
- [ ] Preview funcionando
- [ ] Teste de agente funcionando

---

**Esta é a estrutura real que os agentes usam! Agora você pode criar o Retool exatamente como precisa.**
