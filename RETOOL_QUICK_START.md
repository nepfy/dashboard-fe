# 🚀 Guia Rápido: Como Usar o Retool

## ⚡ Setup em 5 Minutos

### 1. **Criar Aplicação no Retool**

1. Acesse [retool.com](https://retool.com)
2. Clique em "Create new app"
3. Nome: "Agentes IA - Nepfy"
4. Template: "Blank app"

### 2. **Configurar Banco de Dados**

1. Vá em **Resources** → **Create new**
2. Tipo: **PostgreSQL**
3. Nome: "Nepfy Database"
4. **Configuração**:
   ```
   Host: [seu-host-neon]
   Port: 5432
   Database: [seu-database]
   Username: [seu-username]
   Password: [sua-password]
   SSL: Required
   ```
5. **Teste a conexão** ✅

### 3. **Importar Queries**

1. Vá em **Queries** → **Create new**
2. Copie e cole as queries do arquivo `retool-config/queries.sql`
3. **Queries essenciais**:
   - `getAllAgents` - Lista todos os agentes
   - `getAgentById` - Busca agente específico
   - `upsertAgent` - Salva/atualiza agente
   - `getServiceTypes` - Lista tipos de serviço
   - `getTemplateTypes` - Lista tipos de template

### 4. **Criar Interface Básica**

#### **Página Principal - Dashboard**

1. **Título**: "🤖 Gerenciador de Agentes IA"
2. **Tabela de Agentes**:
   - Data Source: `getAllAgents.data`
   - Colunas: Nome, Setor, Tipo, Modelo, Ações
3. **Botões**:
   - "➕ Novo Agente"
   - "🔄 Atualizar"

#### **Página de Edição**

1. **Formulário de Agente**:
   - ID (readonly)
   - Nome
   - Setor
   - Tipo de Serviço (dropdown)
   - System Prompt (textarea grande)
   - JSON fields (expertise, services, etc.)
2. **Botões**:
   - "💾 Salvar"
   - "❌ Cancelar"
   - "🧪 Testar Agente"

### 5. **Configurar Eventos**

#### **Eventos da Tabela**

```javascript
// Ao clicar em "Editar"
selectedAgent.setValue(agentsTable.selectedRow);
utils.openPage("edit-agent");

// Ao clicar em "Novo Agente"
selectedAgent.setValue({});
utils.openPage("edit-agent");
```

#### **Eventos do Formulário**

```javascript
// Ao salvar
await upsertAgent.trigger();
await getAllAgents.trigger();
utils.showNotification("Agente salvo com sucesso!", "success");
utils.closePage();
```

## 🎯 Funcionalidades Principais

### ✅ **Listar Agentes**

- Tabela com todos os agentes
- Filtros por setor e tipo
- Busca por texto
- Contador de templates

### ✅ **Editar Agente**

- Formulário completo
- Editor de System Prompt
- Campos JSON editáveis
- Validação de dados

### ✅ **Gerenciar Templates**

- Lista de templates por agente
- Criação/edição de templates
- Configurações específicas

### ✅ **Testar Agente**

- Botão de teste
- Chamada para API
- Visualização de resultado

## 🔧 Comandos Úteis

### **Queries SQL Essenciais**

```sql
-- Listar agentes
SELECT * FROM agents WHERE is_active = true;

-- Buscar agente
SELECT * FROM agents WHERE id = 'marketing-flash-agent';

-- Salvar agente
INSERT INTO agents (...) VALUES (...) ON CONFLICT DO UPDATE SET ...;
```

### **JavaScript no Retool**

```javascript
// Abrir página
utils.openPage("edit-agent");

// Mostrar notificação
utils.showNotification("Sucesso!", "success");

// Fechar página
utils.closePage();

// Definir valor
selectedAgent.setValue({ id: "novo-agente" });
```

## 📱 Layout Responsivo

### **Desktop**

- Sidebar com navegação
- Tabela principal
- Modal para edição

### **Mobile**

- Stack layout
- Formulários em tela cheia
- Botões grandes

## 🎨 Personalização

### **Cores e Estilo**

- Tema: Dark/Light
- Cores: Azul (#3B82F6)
- Fontes: Inter, sans-serif

### **Componentes**

- Tabelas com paginação
- Formulários com validação
- Modais responsivos
- Botões com ícones

## 🚀 Deploy

### **Produção**

1. **Versão**: v1.0
2. **URL**: `https://retool.com/apps/[seu-app-id]`
3. **Usuários**: Adicionar membros da equipe
4. **Permissões**: Editor/Viewer

### **Compartilhamento**

- Link direto
- Convite por email
- Controle de acesso

## 🆘 Troubleshooting

### **Problemas Comuns**

#### **Conexão com Banco**

```
❌ Connection failed
✅ Verificar credenciais
✅ Testar SSL
✅ Verificar firewall
```

#### **Queries Não Funcionam**

```
❌ Query error
✅ Verificar sintaxe SQL
✅ Testar no banco
✅ Verificar parâmetros
```

#### **Interface Não Carrega**

```
❌ Components not loading
✅ Verificar data sources
✅ Testar queries
✅ Verificar eventos
```

## 📊 Próximos Passos

### **Funcionalidades Avançadas**

- [ ] Editor de código para prompts
- [ ] Preview em tempo real
- [ ] Histórico de alterações
- [ ] Backup automático
- [ ] Analytics de uso
- [ ] Integração com API

### **Melhorias de UX**

- [ ] Drag & drop
- [ ] Auto-save
- [ ] Undo/Redo
- [ ] Atalhos de teclado
- [ ] Temas personalizados

---

## 🎉 Resultado Final

Após seguir este guia, você terá:

✅ **Interface visual** para gerenciar agentes
✅ **Edição em tempo real** dos prompts
✅ **Teste de agentes** integrado
✅ **Backup e versionamento**
✅ **Colaboração** entre equipe

**Tempo estimado**: 15-30 minutos
**Dificuldade**: Iniciante
**Resultado**: Sistema completo de gestão de agentes

---

**🚀 Pronto para começar? Vá para o Passo 1!**
