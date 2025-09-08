# 🚀 Guia de Migração: Agentes para Retool

Este guia explica como migrar toda a configuração dos agentes de IA do sistema de arquivos para o banco de dados, permitindo gerenciamento via Retool.

## 📋 Pré-requisitos

- Banco de dados MySQL/PostgreSQL configurado
- Retool configurado e conectado ao banco
- Acesso ao ambiente de desenvolvimento

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas:

1. **`agents`** - Configurações base dos agentes
2. **`agent_templates`** - Configurações específicas por template
3. **`service_types`** - Tipos de serviço disponíveis
4. **`template_types`** - Tipos de template disponíveis

## 📝 Passos da Migração

### 1. Executar Migração do Banco

```bash
# Executar o script de migração do banco
mysql -u username -p database_name < src/migrations/agents-migration.sql
```

### 2. Migrar Dados dos Agentes

```bash
# Executar script de migração de dados
npm run migrate-agents
# ou
npx tsx src/scripts/migrate-agents-to-db.ts
```

### 3. Atualizar Imports no Código

Substituir imports de:

```typescript
// Antes
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";

// Depois
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents/index-database";
```

### 4. Configurar Retool

1. Importar o arquivo `retool-config/agents-management.json`
2. Configurar conexão com o banco de dados
3. Testar queries e componentes

## 🔧 Configuração do Retool

### Queries Principais:

- `getAllAgents` - Lista todos os agentes
- `getAgentById` - Busca agente específico
- `getAgentTemplates` - Lista configurações de template
- `createAgent` - Cria novo agente
- `updateAgent` - Atualiza agente existente

### Componentes:

- **Agents Table** - Tabela com todos os agentes
- **Agent Form** - Formulário para criar/editar agentes
- **Templates Table** - Tabela com configurações de template
- **Template Form** - Formulário para templates

## 📊 Estrutura dos Dados

### Agent (Base):

```json
{
  "id": "marketing-flash-agent",
  "name": "Especialista em Marketing Digital Flash",
  "sector": "Marketing Digital",
  "service_type": "marketing",
  "system_prompt": "...",
  "expertise": ["SEO", "SEM", "..."],
  "common_services": ["Gestão de Redes Sociais", "..."],
  "pricing_model": "monthly-retainer",
  "proposal_structure": ["...", "..."],
  "key_terms": ["ROI", "CTR", "..."]
}
```

### Agent Template:

```json
{
  "agent_id": "marketing-flash-agent",
  "template_type": "flash",
  "introduction_style": "Foco em marketing rápido...",
  "about_us_focus": "Especialistas em marketing flash...",
  "specialties_approach": "Metodologia ágil...",
  "process_emphasis": "Processo estratégico...",
  "investment_strategy": "Investimento em marketing flash..."
}
```

## 🎯 Benefícios da Migração

### ✅ Vantagens:

- **Interface Visual**: Gerenciamento via Retool
- **Versionamento**: Histórico de mudanças no banco
- **Backup**: Dados seguros no banco
- **Colaboração**: Múltiplos usuários podem editar
- **Validação**: Controles de integridade
- **Performance**: Queries otimizadas

### ⚠️ Considerações:

- **Dependência do Banco**: Sistema depende da disponibilidade do banco
- **Complexidade**: Mais complexo que arquivos estáticos
- **Migração**: Processo de migração inicial necessário

## 🔄 Rollback

Se necessário, é possível voltar ao sistema de arquivos:

1. Reverter imports para `#/modules/ai-generator/agents`
2. Manter arquivos originais como backup
3. Sistema continuará funcionando normalmente

## 🧪 Testes

### Verificar Migração:

```typescript
import { checkMigrationStatus } from "#/modules/ai-generator/agents/index-database";

const status = await checkMigrationStatus();
console.log("Migration status:", status);
```

### Testar Agentes:

```typescript
import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents/index-database";

const agent = await getAgentByServiceAndTemplate("marketing", "flash");
console.log("Agent found:", agent?.name);
```

## 📞 Suporte

Em caso de problemas:

1. Verificar logs do banco de dados
2. Confirmar conexão com Retool
3. Validar estrutura das tabelas
4. Testar queries individualmente

## 🎉 Próximos Passos

Após migração bem-sucedida:

1. Treinar equipe no uso do Retool
2. Documentar processos de edição
3. Configurar backups automáticos
4. Implementar validações adicionais
5. Criar dashboards de monitoramento
