# 🎯 Guia Completo: Como Usar o Retool para Gerenciar Agentes

## 📋 Pré-requisitos

1. ✅ Conta no Retool (retool.com)
2. ✅ Acesso ao banco de dados PostgreSQL (Neon)
3. ✅ Agentes já migrados para o banco (✅ CONCLUÍDO)

## 🚀 Passo 1: Criar Nova Aplicação no Retool

1. **Acesse o Retool** e clique em "Create new app"
2. **Nome da aplicação**: "Agentes IA - Nepfy"
3. **Escolha um template**: "Blank app"

## 🔗 Passo 2: Configurar Conexão com Banco de Dados

### 2.1 Criar Resource (Conexão com DB)

1. Vá em **Resources** → **Create new**
2. **Tipo**: PostgreSQL
3. **Nome**: "Nepfy Database"
4. **Configuração**:
   ```
   Host: [seu-host-neon]
   Port: 5432
   Database: [seu-database]
   Username: [seu-username]
   Password: [sua-password]
   SSL: Required
   ```

### 2.2 Testar Conexão

- Clique em "Test connection"
- Deve aparecer ✅ "Connection successful"

## 📊 Passo 3: Criar Queries (Consultas)

### 3.1 Query: Listar Todos os Agentes

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
  a.updated_at
FROM agents a
WHERE a.is_active = true
ORDER BY a.name;
```

### 3.2 Query: Buscar Agente por ID

```sql
-- Nome: getAgentById
SELECT
  a.*,
  at.template_type,
  at.introduction_style,
  at.about_us_focus,
  at.specialties_approach,
  at.process_emphasis,
  at.investment_strategy
FROM agents a
LEFT JOIN agent_templates at ON a.id = at.agent_id
WHERE a.id = {{ agentId.value }}
  AND a.is_active = true;
```

### 3.3 Query: Criar/Atualizar Agente

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

### 3.4 Query: Listar Templates de um Agente

```sql
-- Nome: getAgentTemplates
SELECT
  at.*,
  tt.name as template_name
FROM agent_templates at
JOIN template_types tt ON at.template_type = tt.id
WHERE at.agent_id = {{ selectedAgent.id }}
  AND at.is_active = true
ORDER BY at.template_type;
```

### 3.5 Query: Criar/Atualizar Template

```sql
-- Nome: upsertAgentTemplate
INSERT INTO agent_templates (
  id, agent_id, template_type, introduction_style,
  about_us_focus, specialties_approach, process_emphasis,
  investment_strategy, is_active
) VALUES (
  {{ templateForm.id }},
  {{ templateForm.agentId }},
  {{ templateForm.templateType }},
  {{ templateForm.introductionStyle }},
  {{ templateForm.aboutUsFocus }},
  {{ templateForm.specialtiesApproach }},
  {{ templateForm.processEmphasis }},
  {{ templateForm.investmentStrategy }},
  true
)
ON CONFLICT (id) DO UPDATE SET
  introduction_style = EXCLUDED.introduction_style,
  about_us_focus = EXCLUDED.about_us_focus,
  specialties_approach = EXCLUDED.specialties_approach,
  process_emphasis = EXCLUDED.process_emphasis,
  investment_strategy = EXCLUDED.investment_strategy,
  updated_at = CURRENT_TIMESTAMP;
```

## 🎨 Passo 4: Criar Interface de Usuário

### 4.1 Página Principal - Lista de Agentes

**Componentes necessários:**

1. **Título**: "Gerenciador de Agentes IA"
2. **Tabela de Agentes**:

   - **Data Source**: `getAllAgents.data`
   - **Colunas**:
     - Nome
     - Setor
     - Tipo de Serviço
     - Modelo de Preço
     - Status
     - Ações (Editar/Ver)

3. **Botão "Novo Agente"**
4. **Filtros**:
   - Dropdown: Setor
   - Dropdown: Tipo de Serviço
   - Input: Buscar por nome

### 4.2 Página de Edição de Agente

**Componentes necessários:**

1. **Formulário de Agente**:

   - Input: ID (readonly)
   - Input: Nome
   - Input: Setor
   - Dropdown: Tipo de Serviço
   - Textarea: System Prompt (grande)
   - JSON Editor: Expertise
   - JSON Editor: Common Services
   - Input: Pricing Model
   - JSON Editor: Proposal Structure
   - JSON Editor: Key Terms

2. **Aba de Templates**:

   - Tabela com templates do agente
   - Botão "Adicionar Template"
   - Formulário de template

3. **Botões de Ação**:
   - Salvar
   - Cancelar
   - Testar Agente

## 🔧 Passo 5: Configurar Eventos e Ações

### 5.1 Eventos da Tabela Principal

```javascript
// Ao clicar em "Editar"
selectedAgent.setValue(table1.selectedRow);
utils.openPage("edit-agent");

// Ao clicar em "Novo Agente"
selectedAgent.setValue({});
utils.openPage("edit-agent");
```

### 5.2 Eventos do Formulário

```javascript
// Ao salvar agente
await upsertAgent.trigger();
await getAllAgents.trigger();
utils.showNotification("Agente salvo com sucesso!", "success");
utils.closePage();
```

## 📱 Passo 6: Layout Responsivo

### 6.1 Desktop (Layout Principal)

- **Sidebar**: Navegação
- **Main Content**: Tabela de agentes
- **Modal**: Formulário de edição

### 6.2 Mobile

- **Stack Layout**: Componentes empilhados
- **Full Screen**: Formulários em tela cheia

## 🎯 Passo 7: Funcionalidades Avançadas

### 7.1 Editor de System Prompt

- **Componente**: Code Editor
- **Language**: Markdown
- **Features**: Syntax highlighting, auto-save

### 7.2 Preview do Agente

- **Componente**: Text Display
- **Data**: `getAgentById.data`
- **Formatação**: JSON formatado

### 7.3 Teste de Agente

- **Botão**: "Testar Agente"
- **Ação**: Chamar API de teste
- **Resultado**: Mostrar resposta do agente

## 🚀 Passo 8: Deploy e Compartilhamento

### 8.1 Deploy da Aplicação

1. **Versão**: "v1.0"
2. **Ambiente**: Production
3. **URL**: `https://retool.com/apps/[seu-app-id]`

### 8.2 Compartilhamento

1. **Usuários**: Adicionar membros da equipe
2. **Permissões**: Editor/Viewer
3. **Acesso**: Por email ou link

## 📊 Passo 9: Monitoramento e Analytics

### 9.1 Dashboard de Uso

- **Métricas**: Agentes mais editados
- **Gráficos**: Uso por setor
- **Logs**: Histórico de alterações

### 9.2 Alertas

- **Notificações**: Agentes inativos
- **Backup**: Export automático
- **Versionamento**: Histórico de mudanças

## 🔒 Passo 10: Segurança e Backup

### 10.1 Controle de Acesso

- **Roles**: Admin, Editor, Viewer
- **Permissions**: Por funcionalidade
- **Audit**: Log de ações

### 10.2 Backup Automático

- **Frequência**: Diária
- **Formato**: JSON/CSV
- **Storage**: Cloud storage

---

## 🎉 Resultado Final

Após seguir este guia, você terá:

✅ **Interface visual** para gerenciar agentes
✅ **Edição em tempo real** dos prompts
✅ **Versionamento** das configurações
✅ **Colaboração** entre equipe
✅ **Backup automático** dos dados
✅ **Monitoramento** de uso

## 🆘 Suporte

Se precisar de ajuda:

1. **Documentação Retool**: https://docs.retool.com
2. **Comunidade**: https://community.retool.com
3. **Suporte**: support@retool.com

---

**Próximo passo**: Começar com o Passo 1 - Criar aplicação no Retool! 🚀
