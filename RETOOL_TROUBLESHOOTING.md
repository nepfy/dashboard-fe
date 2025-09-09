# 🔧 Troubleshooting - Retool

## ❌ Erro: "Cannot read properties of undefined (reading 'data')"

### **Causa do Problema**

O Retool não consegue acessar a propriedade `data` de um objeto que está `undefined`. Isso geralmente acontece quando:

1. A query não foi executada ainda
2. A query falhou
3. O formato do JSON não é compatível com o Retool

### **Soluções**

#### **Solução 1: Usar Configuração Simples**

1. **Não importe** o arquivo JSON complexo
2. **Use** o arquivo `simple-retool-config.json`
3. **Crie manualmente** os componentes no Retool

#### **Solução 2: Configuração Manual (Recomendado)**

##### **Passo 1: Criar Queries**

1. Vá em **Queries** → **Create new**
2. **Nome**: `getAllAgents`
3. **Tipo**: SQL
4. **Query**:

```sql
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

##### **Passo 2: Criar Tabela**

1. **Componente**: Table
2. **Nome**: `agentsTable`
3. **Data Source**: `getAllAgents`
4. **Colunas**:
   - `name` - Nome
   - `sector` - Setor
   - `service_type` - Tipo de Serviço
   - `pricing_model` - Modelo de Preço
   - `template_count` - Templates

##### **Passo 3: Criar Botões**

1. **Botão 1**: "➕ Novo Agente"
2. **Botão 2**: "🔄 Atualizar"
3. **Evento**: `getAllAgents.trigger()`

#### **Solução 3: Verificar Data Sources**

##### **Problema**: Data source não carrega

```javascript
// ❌ Erro
dataSource: "getAllAgents.data";

// ✅ Correto
dataSource: "getAllAgents";
```

##### **Problema**: Query não executa

1. **Verificar conexão** com banco
2. **Testar query** no banco
3. **Verificar parâmetros**
4. **Executar manualmente**

#### **Solução 4: Formato Correto do JSON**

##### **Estrutura Básica**

```json
{
  "appName": "Minha App",
  "pages": [
    {
      "name": "Dashboard",
      "components": [
        {
          "type": "table",
          "name": "minhaTabela",
          "dataSource": "minhaQuery"
        }
      ]
    }
  ],
  "queries": [
    {
      "name": "minhaQuery",
      "type": "sql",
      "query": "SELECT * FROM minha_tabela;"
    }
  ]
}
```

##### **Evitar**

```json
// ❌ Não usar
"dataSource": "{{ query.data }}"
"dataSource": "query.data"
"dataSource": "{{ query }}"

// ✅ Usar
"dataSource": "query"
```

## 🚀 Setup Manual Passo a Passo

### **1. Criar Aplicação**

1. Acesse [retool.com](https://retool.com)
2. **Create new app**
3. **Nome**: "Agentes IA - Nepfy"
4. **Template**: "Blank app"

### **2. Configurar Banco**

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

### **3. Criar Queries Essenciais**

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
  COUNT(at.id) as template_count
FROM agents a
LEFT JOIN agent_templates at ON a.id = at.agent_id AND at.is_active = true
WHERE a.is_active = true
GROUP BY a.id, a.name, a.sector, a.service_type, a.pricing_model, a.is_active
ORDER BY a.name;
```

#### **Query 2: Buscar Agente**

```sql
-- Nome: getAgentById
SELECT * FROM agents
WHERE id = {{ agentId.value }}
  AND is_active = true;
```

#### **Query 3: Salvar Agente**

```sql
-- Nome: upsertAgent
INSERT INTO agents (
  id, name, sector, service_type, system_prompt,
  expertise, common_services, pricing_model,
  proposal_structure, key_terms, is_active
) VALUES (
  {{ agentForm.id }},
  {{ agentForm.name }},
  {{ agentForm.sector }},
  {{ agentForm.serviceType }},
  {{ agentForm.systemPrompt }},
  {{ agentForm.expertise }},
  {{ agentForm.commonServices }},
  {{ agentForm.pricingModel }},
  {{ agentForm.proposalStructure }},
  {{ agentForm.keyTerms }},
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

### **4. Criar Interface**

#### **Componente 1: Título**

- **Tipo**: Text
- **Texto**: "🤖 Gerenciador de Agentes IA"
- **Fonte**: 24px, bold

#### **Componente 2: Tabela**

- **Tipo**: Table
- **Nome**: `agentsTable`
- **Data Source**: `getAllAgents`
- **Colunas**:
  - `name` - Nome
  - `sector` - Setor
  - `service_type` - Tipo
  - `pricing_model` - Modelo
  - `template_count` - Templates

#### **Componente 3: Botões**

- **Botão 1**: "➕ Novo Agente"
- **Botão 2**: "🔄 Atualizar"
- **Evento**: `getAllAgents.trigger()`

### **5. Testar**

1. **Executar** `getAllAgents`
2. **Verificar** se a tabela carrega
3. **Testar** botões
4. **Verificar** conexão com banco

## 🔍 Debugging

### **Verificar Queries**

```sql
-- Testar no banco diretamente
SELECT * FROM agents LIMIT 5;
SELECT * FROM agent_templates LIMIT 5;
SELECT * FROM service_types;
SELECT * FROM template_types;
```

### **Verificar Data Sources**

1. **Queries** → **Executar**
2. **Verificar** se retorna dados
3. **Verificar** formato dos dados
4. **Verificar** erros

### **Verificar Componentes**

1. **Table** → **Data Source**
2. **Verificar** se está correto
3. **Verificar** colunas
4. **Verificar** eventos

## ✅ Checklist de Verificação

- [ ] Conexão com banco funcionando
- [ ] Queries executando sem erro
- [ ] Data sources configurados corretamente
- [ ] Componentes carregando dados
- [ ] Eventos funcionando
- [ ] Interface responsiva

## 🆘 Ainda com Problemas?

### **Opção 1: Usar Setup Manual**

1. Siga o guia manual acima
2. Crie componentes um por um
3. Teste cada etapa

### **Opção 2: Usar Configuração Simples**

1. Use o arquivo `simple-retool-config.json`
2. Importe apenas as queries
3. Crie interface manualmente

### **Opção 3: Suporte**

1. **Documentação Retool**: https://docs.retool.com
2. **Comunidade**: https://community.retool.com
3. **Suporte**: support@retool.com

---

**💡 Dica**: Comece sempre com o setup manual para entender como funciona, depois use as configurações automáticas!
