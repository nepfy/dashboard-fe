# Proposta de Refatoração: Unificação dos Dados de Proposta

## Problema Atual

A estrutura atual utiliza **29+ tabelas separadas** apenas para o template Flash:

```
flash_template_introduction
flash_template_introduction_services
flash_template_about_us
flash_template_team
flash_template_team_members
flash_template_expertise
flash_template_expertise_topics
flash_template_steps
flash_template_steps_topics
flash_template_steps_marquee
flash_template_investment
flash_template_deliverables
flash_template_deliverables_list
flash_template_plans
flash_template_plans_list
flash_template_plans_included_items
flash_template_results
flash_template_results_list
flash_template_clients
flash_template_clients_list
flash_template_cta
flash_template_testimonials
flash_template_testimonials_list
flash_template_terms_conditions
flash_template_terms_conditions_list
flash_template_faq
flash_template_faq_list
flash_template_footer
flash_template_footer_marquee
```

### Problemas dessa abordagem:

❌ **Complexidade excessiva**: 29 tabelas para um único template  
❌ **Queries lentas**: Múltiplos JOINs necessários para buscar uma proposta  
❌ **Manutenção difícil**: Cada mudança requer migrations complexas  
❌ **Inflexibilidade**: Adicionar novos campos requer criar/alterar tabelas  
❌ **Duplicação**: Templates Prime e Minimal terão suas próprias 29 tabelas  
❌ **Código verboso**: Handlers enormes para salvar/buscar dados

## Solução Proposta

Adicionar um único campo JSON `proposalData` na tabela `projects`:

```typescript
export const projectsTable = pgTable("projects", {
  // ... outros campos
  proposalData: jsonb("proposal_data").$type<ProposalData>(),
});
```

### Vantagens:

✅ **Simplicidade**: 1 campo ao invés de 29+ tabelas  
✅ **Performance**: 1 query ao invés de múltiplos JOINs  
✅ **Flexibilidade**: Adicionar campos sem migrations  
✅ **Type-safe**: TypeScript continua validando a estrutura  
✅ **Manutenção fácil**: Código mais limpo e direto  
✅ **Escalável**: Funciona para qualquer template (Flash, Prime, Minimal, etc)

## Comparação de Código

### Antes (Estrutura Atual - Complexa)

```typescript
// Buscar dados de uma proposta requer múltiplas queries
const introduction = await db.query.flashTemplateIntroductionTable.findFirst({
  where: eq(flashTemplateIntroductionTable.projectId, projectId),
  with: {
    services: true,
  },
});

const aboutUs = await db.query.flashTemplateAboutUsTable.findFirst({
  where: eq(flashTemplateAboutUsTable.projectId, projectId),
});

const team = await db.query.flashTemplateTeamTable.findFirst({
  where: eq(flashTemplateTeamTable.projectId, projectId),
  with: {
    members: true,
  },
});

// ... repetir para todas as 29 tabelas

// Salvar dados requer múltiplas operações
await db.insert(flashTemplateIntroductionTable).values({
  projectId,
  name: data.name,
  email: data.email,
  // ...
});

await db.insert(flashTemplateIntroductionServicesTable).values(
  data.services.map((service) => ({
    introductionId,
    serviceName: service,
  }))
);

// ... repetir para todas as seções
```

### Depois (Nova Estrutura - Simples)

```typescript
// Buscar todos os dados da proposta com 1 query
const project = await db.query.projectsTable.findFirst({
  where: eq(projectsTable.id, projectId),
});

const proposalData = project.proposalData;

// Ou usar o helper
const proposalData = await getProposalData(projectId);

// Salvar dados é trivial
await updateProposalData(projectId, {
  introduction: {
    name: "Cliente",
    email: "cliente@email.com",
    title: "Título",
    services: [{ serviceName: "Serviço 1" }, { serviceName: "Serviço 2" }],
  },
  aboutUs: {
    title: "Sobre Nós",
    subtitle: "Nosso trabalho",
  },
  // ... todas as seções em um único objeto
});

// Atualizar apenas uma seção
await updateProposalSection(projectId, "introduction", {
  title: "Novo Título",
});
```

## Exemplo de Uso com AI

```typescript
// Gerar proposta completa com AI
async function generateProposal(projectId: string) {
  const projectDetails = await getProjectDetails(projectId);

  // Gerar cada seção
  const introduction = await generateWithAI("introduction", projectDetails);
  const aboutUs = await generateWithAI("aboutUs", projectDetails);
  const team = await generateWithAI("team", projectDetails);

  // Salvar tudo de uma vez
  await updateProposalData(projectId, {
    introduction,
    aboutUs,
    team,
    // ... outras seções
  });
}

// Atualizar apenas uma seção específica
async function regenerateSection(projectId: string, section: string) {
  const projectDetails = await getProjectDetails(projectId);
  const sectionData = await generateWithAI(section, projectDetails);

  await updateProposalSection(projectId, section, sectionData);
}
```

## Migração

### Passo 1: Adicionar o novo campo

```bash
# Executar a migration SQL
psql $DATABASE_URL < docs/migrations/add-proposal-data-field.sql
```

### Passo 2: Migrar dados existentes (opcional)

Se houver dados nas tabelas antigas que precisam ser preservados:

```typescript
async function migrateExistingProposals() {
  const projects = await db.query.projectsTable.findMany({
    where: eq(projectsTable.templateType, "flash"),
  });

  for (const project of projects) {
    // Buscar dados de todas as tabelas antigas
    const introduction = await getOldIntroductionData(project.id);
    const aboutUs = await getOldAboutUsData(project.id);
    // ... outras seções

    // Consolidar em um único objeto
    const proposalData: ProposalData = {
      introduction,
      aboutUs,
      // ... outras seções
    };

    // Salvar no novo formato
    await updateProposalData(project.id, proposalData);
  }
}
```

### Passo 3: Atualizar código

1. Substituir imports das tabelas antigas pelos helpers novos
2. Atualizar queries para usar `proposalData`
3. Atualizar handlers de save/update

### Passo 4: Remover tabelas antigas

Após verificar que tudo funciona:

```sql
-- Drop all old template tables
DROP TABLE flash_template_introduction_services CASCADE;
DROP TABLE flash_template_introduction CASCADE;
DROP TABLE flash_template_about_us CASCADE;
-- ... todas as outras tabelas
```

## Impacto nos Endpoints

### API Endpoints - Antes

```typescript
// Múltiplas rotas para cada seção
app.post('/api/projects/:id/introduction', ...);
app.post('/api/projects/:id/about-us', ...);
app.post('/api/projects/:id/team', ...);
// ... 15+ rotas diferentes
```

### API Endpoints - Depois

```typescript
// Rotas simplificadas
app.get("/api/projects/:id/proposal", async (req, res) => {
  const proposalData = await getProposalData(req.params.id);
  res.json(proposalData);
});

app.put("/api/projects/:id/proposal", async (req, res) => {
  await updateProposalData(req.params.id, req.body);
  res.json({ success: true });
});

app.patch("/api/projects/:id/proposal/:section", async (req, res) => {
  await updateProposalSection(req.params.id, req.params.section, req.body);
  res.json({ success: true });
});
```

## TypeScript Type Safety

A tipagem continua forte com o novo formato:

```typescript
// Autocomplete e type checking funcionam perfeitamente
const proposalData: ProposalData = {
  introduction: {
    name: "Cliente", // ✅ Type-safe
    email: "test@test.com", // ✅ Type-safe
    invalidField: "test", // ❌ Error: Property does not exist
  },
};

// Helpers também são type-safe
await updateProposalSection(projectId, "introduction", {
  name: "New Name", // ✅ Knows the shape of introduction
});

await updateProposalSection(projectId, "invalidSection", {}); // ❌ Error
```

## Performance

### Antes: Query para buscar proposta completa

```sql
-- 15+ queries com JOINs
SELECT * FROM flash_template_introduction
  LEFT JOIN flash_template_introduction_services ...
SELECT * FROM flash_template_about_us ...
SELECT * FROM flash_template_team
  LEFT JOIN flash_template_team_members ...
-- ... 12+ queries adicionais
```

**Tempo estimado**: 50-200ms (dependendo da latência do DB)

### Depois: Query para buscar proposta completa

```sql
-- 1 query simples
SELECT proposal_data FROM projects WHERE id = $1;
```

**Tempo estimado**: 5-20ms

**Melhoria**: ~10x mais rápido

## Conclusão

A mudança para um campo JSON unificado simplifica drasticamente:

- 📦 **Schema do banco**: de 29+ tabelas para 1 campo
- ⚡ **Performance**: queries ~10x mais rápidas
- 🛠️ **Manutenção**: código muito mais simples
- 🚀 **Desenvolvimento**: mudanças sem migrations
- ✨ **Flexibilidade**: funciona para qualquer template

Esta é uma refatoração significativa mas que vale muito a pena pelo ganho em simplicidade e manutenibilidade.
