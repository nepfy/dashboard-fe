# Documentação Completa do Sistema de Propostas - Dashboard FE

## Visão Geral do Projeto

O **Dashboard FE** é um sistema completo de gerenciamento e criação de propostas comerciais com inteligência artificial. O sistema permite que profissionais criem propostas personalizadas e profissionais de forma automatizada, usando agentes de IA especializados em diferentes setores de mercado.

### Tecnologias Principais

- **Next.js 15.2.4**: Framework React para o frontend e backend
- **TypeScript**: Linguagem de programação com tipagem forte
- **Clerk**: Sistema de autenticação e gerenciamento de usuários
- **NeonDB**: Banco de dados PostgreSQL serverless
- **Together AI**: Plataforma de inteligência artificial para geração de conteúdo
- **Stripe**: Sistema de pagamentos e assinaturas
- **Vercel**: Plataforma de hospedagem e deploy

---

## 1. MÓDULO DE AUTENTICAÇÃO

### 1.1 O que é o Sistema de Autenticação?

O sistema de autenticação é responsável por:
- Permitir que usuários criem contas e façam login
- Proteger páginas e funcionalidades que só usuários logados podem acessar
- Sincronizar dados dos usuários com o banco de dados
- Integrar com o sistema de pagamentos (Stripe)

### 1.2 Como Funciona o Clerk

**Clerk** é uma plataforma que cuida de toda a parte de autenticação (login, cadastro, recuperação de senha). Em vez de você criar todo esse sistema manualmente, o Clerk já oferece tudo pronto.

#### Arquivos Principais

**1. Middleware de Autenticação** (`src/middleware.ts`)

Este arquivo é como um "segurança na porta" do sistema. Ele verifica:
- Se o usuário está logado antes de permitir acesso a certas páginas
- Se a URL possui um subdomínio personalizado (ex: `seuprojeto.nepfy.com`)
- Quais rotas são públicas (não precisam de login)

**Rotas Públicas** (qualquer pessoa pode acessar):
- `/login` - Página de login
- `/criar-conta` - Página de cadastro
- `/recuperar-senha` - Recuperação de senha
- `/propostas` - Visualização de propostas públicas
- `/project/*` - Páginas de propostas individuais

**Rotas Protegidas** (precisa estar logado):
- `/dashboard/*` - Painel principal
- `/editar/*` - Editor de propostas
- `/api/*` - Todas as APIs (exceto públicas)

**Como funciona na prática:**

```
Usuário tenta acessar /dashboard
   ↓
Middleware verifica se está logado
   ↓
Não está logado? → Redireciona para /login
Está logado? → Permite acesso à página
```

**2. Webhook do Clerk** (`src/app/api/webhooks/clerk/route.ts`)

Um **webhook** é como um "mensageiro automático". Sempre que algo acontece no Clerk (novo usuário, usuário atualizado, usuário deletado), o Clerk envia uma mensagem automática para este arquivo, que então atualiza o banco de dados.

**Eventos Tratados:**

**a) `user.created` - Novo usuário criou uma conta**
```
Clerk detecta novo usuário
   ↓
Webhook recebe notificação
   ↓
Cria registro na tabela person_user do banco
   ↓
Cria cliente no Stripe (para pagamentos futuros)
```

**b) `user.updated` - Usuário atualizou dados**
```
Usuário muda email ou nome no Clerk
   ↓
Webhook recebe notificação
   ↓
Atualiza informações na tabela person_user
```

**c) `user.deleted` - Usuário deletou a conta**
```
Usuário deleta conta
   ↓
Webhook recebe notificação
   ↓
Remove registro da tabela person_user
   ↓
Mantém dados do Stripe (para histórico de pagamentos)
```

**3. Serviço de Sincronização Clerk-Stripe** (`src/lib/services/clerk-stripe-sync.ts`)

Este serviço garante que quando um usuário é criado no Clerk, ele também seja criado como cliente no Stripe automaticamente. Isso é importante para que o sistema de pagamentos funcione corretamente.

```
Novo usuário no Clerk
   ↓
Serviço verifica se já existe no Stripe
   ↓
Não existe? → Cria novo cliente no Stripe
Já existe? → Atualiza informações
```

### 1.3 Estrutura de Dados de Usuários

Os dados dos usuários são salvos em duas tabelas principais:

#### Tabela `person_user` (Usuários Pessoa Física)

Esta tabela guarda informações de cada usuário:

| Campo | O que guarda | Exemplo |
|-------|--------------|---------|
| `id` | Identificador único | "550e8400-e29b-41d4-a716-446655440000" |
| `clerkUserId` | ID do usuário no Clerk | "user_2abc123def" |
| `firstName` | Primeiro nome | "João" |
| `lastName` | Sobrenome | "Silva" |
| `userName` | Nome de usuário único | "joaosilva" |
| `email` | Email do usuário | "joao@email.com" |
| `cpf` | CPF (opcional) | "123.456.789-00" |
| `phone` | Telefone | "(11) 98765-4321" |
| `street` | Rua | "Av. Paulista" |
| `number` | Número | "1000" |
| `complement` | Complemento | "Apto 101" |
| `neighborhood` | Bairro | "Bela Vista" |
| `city` | Cidade | "São Paulo" |
| `state` | Estado | "SP" |
| `zipCode` | CEP | "01310-100" |
| `country` | País | "Brasil" |
| `userJobType` | Tipo de trabalho | 1 (Designer), 2 (Desenvolvedor), etc. |
| `userDiscovery` | Como conheceu | 1 (Google), 2 (Instagram), etc. |
| `userUsedBefore` | Já usou antes? | 1 (Sim), 2 (Não) |
| `companyInfo` | Info da empresa | "Agência XYZ" |
| `created_at` | Data de criação | "2025-01-15 10:30:00" |
| `updated_at` | Última atualização | "2025-01-15 14:45:00" |

#### Tabela `company_user` (Usuários Empresa)

Esta tabela guarda informações de empresas vinculadas aos usuários:

| Campo | O que guarda |
|-------|--------------|
| `id` | Identificador único da empresa |
| `personId` | Referência ao usuário (person_user) |
| `name` | Nome da empresa |
| `cnpj` | CNPJ da empresa |
| `phone` | Telefone comercial |
| Endereço | Mesmos campos de endereço do person_user |

### 1.4 Variáveis de Ambiente Necessárias

Para o sistema de autenticação funcionar, você precisa configurar estas variáveis no arquivo `.env.local`:

```env
# Chaves do Clerk
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# URLs de login e cadastro
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/criar-conta
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
```

**O que cada uma significa:**

- `CLERK_WEBHOOK_SECRET`: Chave secreta para validar mensagens do webhook
- `CLERK_SECRET_KEY`: Chave secreta para comunicação com API do Clerk
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Chave pública (pode ser vista no navegador)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Caminho da página de cadastro
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Caminho da página de login

### 1.5 Fluxo Completo de Autenticação

```
1. CADASTRO
   Usuário acessa /criar-conta
   ↓
   Preenche formulário do Clerk
   ↓
   Clerk cria conta e envia email de confirmação
   ↓
   Webhook recebe evento user.created
   ↓
   Sistema cria registro em person_user
   ↓
   Sistema cria cliente no Stripe
   ↓
   Usuário é redirecionado para /onboarding

2. LOGIN
   Usuário acessa /login
   ↓
   Insere email e senha
   ↓
   Clerk valida credenciais
   ↓
   Usuário é redirecionado para /dashboard

3. ACESSO A PÁGINAS PROTEGIDAS
   Usuário tenta acessar /dashboard
   ↓
   Middleware verifica autenticação
   ↓
   Se logado: acessa página
   Se não logado: redireciona para /login

4. ATUALIZAÇÃO DE DADOS
   Usuário atualiza perfil no Clerk
   ↓
   Webhook recebe evento user.updated
   ↓
   Sistema atualiza person_user no banco
```

---

## 2. MÓDULO DE BANCO DE DADOS

### 2.1 O que é o NeonDB e Drizzle ORM

**NeonDB** é um banco de dados PostgreSQL hospedado na nuvem. É como um "armário digital" onde o sistema guarda todas as informações.

**Drizzle ORM** é uma ferramenta que facilita a comunicação com o banco de dados. Em vez de escrever comandos SQL complexos, você usa código TypeScript mais simples.

### 2.2 Configuração do Banco de Dados

**Arquivo de Conexão** (`src/lib/db/index.ts`):

```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Cria conexão com o banco
const sql = neon(process.env.DATABASE_URL);

// Exporta o banco configurado
export const db = drizzle({
  client: sql,
  casing: "snake_case", // usa_underline em vez de camelCase
  schema
});
```

**Como usar na prática:**

```typescript
import { db } from '#/lib/db';

// Buscar todos os projetos de um usuário
const projects = await db.query.projects.findMany({
  where: (projects, { eq }) => eq(projects.personId, userId)
});
```

### 2.3 Principais Tabelas do Sistema

#### 2.3.1 Tabela `projects` - A Mais Importante do Sistema

Esta tabela guarda todas as propostas criadas pelos usuários.

**Inovação:** Antigamente, cada seção da proposta tinha sua própria tabela (eram mais de 29 tabelas!). Agora, tudo é guardado em um único campo JSON chamado `proposalData`, tornando o sistema muito mais rápido e flexível.

**Estrutura da Tabela:**

| Campo | Tipo | O que guarda |
|-------|------|--------------|
| `id` | UUID | Identificador único do projeto |
| `personId` | UUID | Quem criou (referência a person_user) |
| `clientName` | Texto | Nome do cliente |
| `projectName` | Texto | Nome do projeto (obrigatório) |
| `projectSentDate` | Data | Quando foi enviada |
| `projectValidUntil` | Data | Válida até quando |
| `projectStatus` | Texto | Status (rascunho, enviada, aceita, recusada) |
| `projectVisualizationDate` | Data | Quando o cliente visualizou |
| `templateType` | Texto | Tipo de template (flash, minimal, prime) |
| `mainColor` | Texto | Cor principal (#FF0000) |
| `projectUrl` | Texto | URL personalizada |
| `pagePassword` | Texto | Senha de acesso (opcional) |
| `isPublished` | Booleano | Está publicada? |
| `isProposalGenerated` | Booleano | Foi gerada por IA? |
| `proposalData` | JSON | **TODOS OS DADOS DA PROPOSTA** |
| `buttonConfig` | JSON | Configuração dos botões |
| `created_at` | Data | Data de criação |
| `updated_at` | Data | Última atualização |

**O Campo Mágico: `proposalData`**

Este campo JSON guarda TODA a proposta em um único lugar. Veja a estrutura:

```typescript
{
  // Introdução
  introduction: {
    eyebrow: "Proposta Comercial",
    title: "Seu novo site profissional",
    subtitle: "Desenvolvido com as melhores práticas",
    services: ["Design", "Desenvolvimento", "SEO", "Hospedagem"]
  },

  // Sobre Nós
  aboutUs: {
    eyebrow: "Quem Somos",
    title: "Agência Digital Especializada",
    supportText: "Mais de 10 anos de experiência",
    subtitle: "Transformamos ideias em resultados",
    image: "https://exemplo.com/foto.jpg"
  },

  // Equipe
  team: {
    title: "Nossa Equipe",
    eyebrow: "Time Especializado",
    members: [
      {
        id: "member-1",
        name: "João Silva",
        role: "Designer",
        image: "https://exemplo.com/joao.jpg",
        hidePhoto: false,
        hideMember: false,
        sortOrder: 0
      },
      {
        id: "member-2",
        name: "Maria Santos",
        role: "Desenvolvedora",
        image: "https://exemplo.com/maria.jpg",
        hidePhoto: false,
        hideMember: false,
        sortOrder: 1
      }
    ]
  },

  // Especialidades
  expertise: {
    eyebrow: "Nossas Especialidades",
    title: "O que fazemos de melhor",
    topics: [
      {
        id: "topic-1",
        title: "Design UX/UI",
        description: "Interfaces intuitivas e bonitas",
        sortOrder: 0
      },
      {
        id: "topic-2",
        title: "Desenvolvimento Web",
        description: "Código limpo e performático",
        sortOrder: 1
      }
    ]
  },

  // Etapas do Processo
  steps: {
    eyebrow: "Como Trabalhamos",
    introduction: "Nosso processo em 5 etapas",
    topics: [
      {
        id: "step-1",
        title: "Descoberta",
        description: "Entendemos suas necessidades",
        sortOrder: 0
      },
      {
        id: "step-2",
        title: "Planejamento",
        description: "Criamos a estratégia",
        sortOrder: 1
      }
    ],
    marqueeItems: ["Ágil", "Transparente", "Colaborativo"]
  },

  // Investimento
  investment: {
    title: "Investimento",
    eyebrow: "Valores",
    content: "Escolha o plano ideal para você",
    hasPlans: true
  },

  // Planos de Preços
  plans: {
    title: "Planos",
    plansItems: [
      {
        id: "plan-1",
        title: "Básico",
        subtitle: "Para começar",
        price: "R$ 5.000",
        paymentType: "À vista",
        paymentConditions: "Pagamento único",
        sortOrder: 0,
        hidePlan: false
      },
      {
        id: "plan-2",
        title: "Premium",
        subtitle: "Completo",
        price: "R$ 12.000",
        paymentType: "Parcelado",
        paymentConditions: "3x sem juros",
        sortOrder: 1,
        hidePlan: false
      }
    ],
    includedItems: [
      {
        id: "item-1",
        planId: "plan-1",
        text: "Design responsivo",
        included: true,
        sortOrder: 0
      },
      {
        id: "item-2",
        planId: "plan-1",
        text: "5 páginas",
        included: true,
        sortOrder: 1
      },
      {
        id: "item-3",
        planId: "plan-2",
        text: "Design responsivo",
        included: true,
        sortOrder: 0
      },
      {
        id: "item-4",
        planId: "plan-2",
        text: "Páginas ilimitadas",
        included: true,
        sortOrder: 1
      }
    ]
  },

  // Entregas
  deliverables: {
    title: "O que você vai receber",
    content: "Todos os arquivos e documentação"
  },

  // Resultados
  results: {
    title: "Resultados Esperados",
    items: [
      {
        id: "result-1",
        number: "+150%",
        text: "Aumento em conversões",
        sortOrder: 0
      },
      {
        id: "result-2",
        number: "90%",
        text: "Satisfação dos clientes",
        sortOrder: 1
      }
    ]
  },

  // Clientes
  clients: {
    title: "Já confiaram em nós",
    items: [
      {
        id: "client-1",
        name: "Empresa A",
        logo: "https://exemplo.com/logo-a.jpg",
        sortOrder: 0
      }
    ]
  },

  // Call to Action
  cta: {
    title: "Vamos começar?",
    subtitle: "Entre em contato hoje mesmo",
    buttonText: "Falar com especialista",
    buttonLink: "https://wa.me/5511999999999"
  },

  // Depoimentos
  testimonials: {
    title: "O que dizem nossos clientes",
    items: [
      {
        id: "testimonial-1",
        text: "Trabalho excepcional!",
        author: "Pedro Costa",
        role: "CEO da Empresa X",
        image: "https://exemplo.com/pedro.jpg",
        sortOrder: 0
      }
    ]
  },

  // Termos e Condições
  termsConditions: {
    title: "Termos e Condições",
    items: [
      {
        id: "term-1",
        title: "Prazo de Execução",
        description: "30 dias úteis após aprovação",
        sortOrder: 0
      },
      {
        id: "term-2",
        title: "Pagamento",
        description: "50% início, 50% entrega",
        sortOrder: 1
      }
    ]
  },

  // FAQ
  faq: {
    title: "Perguntas Frequentes",
    items: [
      {
        id: "faq-1",
        question: "Quanto tempo leva?",
        answer: "De 30 a 45 dias úteis",
        sortOrder: 0
      },
      {
        id: "faq-2",
        question: "Tem garantia?",
        answer: "Sim, 90 dias de garantia",
        sortOrder: 1
      }
    ]
  },

  // Rodapé
  footer: {
    companyName: "Minha Agência",
    email: "contato@minhaagencia.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    socialLinks: {
      instagram: "https://instagram.com/minhaagencia",
      linkedin: "https://linkedin.com/company/minhaagencia",
      facebook: "",
      twitter: ""
    }
  }
}
```

**Por que isso é revolucionário?**

**Antes:**
- 29+ tabelas diferentes
- Consultas complexas ao banco
- Difícil de adicionar novos campos
- Lento para carregar dados

**Agora:**
- 1 único campo JSON
- 1 consulta simples ao banco
- Fácil adicionar novos dados
- Muito mais rápido

#### 2.3.2 Tabela `agents` - Agentes de IA

Esta tabela configura os "cérebros artificiais" que geram as propostas.

| Campo | O que guarda | Exemplo |
|-------|--------------|---------|
| `id` | ID do agente | "web-dev-flash" |
| `name` | Nome amigável | "Desenvolvedor Web - Flash" |
| `sector` | Setor de atuação | "Tecnologia" |
| `serviceType` | Tipo de serviço | "web-development" |
| `systemPrompt` | Instruções para a IA | "Você é um especialista em web..." |
| `expertise` | Especialidades | ["React", "Next.js", "Node.js"] |
| `commonServices` | Serviços comuns | ["Site institucional", "E-commerce"] |
| `pricingModel` | Modelo de preço | "project-based" |
| `proposalStructure` | Estrutura da proposta | ["intro", "about", "process"] |
| `keyTerms` | Termos importantes | ["prazo", "pagamento", "garantia"] |
| `templateConfig` | Config do template | `{ minPlans: 1, maxPlans: 3 }` |
| `isActive` | Está ativo? | true |

**Exemplo de um Agente:**

```typescript
{
  id: "web-dev-flash",
  name: "Desenvolvedor Web - Template Flash",
  sector: "Tecnologia",
  serviceType: "web-development",
  systemPrompt: `Você é um especialista em desenvolvimento web.
                 Crie propostas profissionais e objetivas para projetos de sites,
                 e-commerce e aplicações web. Foque em tecnologias modernas como
                 React, Next.js e Node.js.`,
  expertise: [
    "Desenvolvimento Frontend",
    "React e Next.js",
    "SEO e Performance",
    "Design Responsivo"
  ],
  commonServices: [
    "Site Institucional",
    "Landing Page",
    "E-commerce",
    "Sistema Web"
  ],
  pricingModel: "project-based",
  proposalStructure: [
    "introduction",
    "aboutUs",
    "expertise",
    "process",
    "investment",
    "faq"
  ],
  keyTerms: [
    "Prazo de entrega",
    "Formas de pagamento",
    "Garantia de 90 dias",
    "Suporte pós-lançamento"
  ]
}
```

#### 2.3.3 Tabela `agent_templates` - Templates por Agente

Esta tabela personaliza como cada agente gera propostas para diferentes templates (Flash, Minimal, Prime).

| Campo | O que guarda |
|-------|--------------|
| `id` | ID único |
| `agentId` | Qual agente (FK) |
| `templateType` | Tipo (flash/minimal/prime) |
| `introductionStyle` | Estilo da introdução |
| `aboutUsFocus` | Foco do "sobre nós" |
| `specialtiesApproach` | Como apresentar especialidades |
| `processEmphasis` | Ênfase no processo |
| `investmentStrategy` | Estratégia de investimento |
| `additionalPrompt` | Prompt adicional |

**Exemplo:**

```typescript
{
  id: "web-dev-flash-template",
  agentId: "web-dev-flash",
  templateType: "flash",
  introductionStyle: "Concisa e impactante, com foco em resultados rápidos",
  aboutUsFocus: "Experiência em desenvolvimento web moderno",
  specialtiesApproach: "Lista direta de tecnologias e metodologias",
  processEmphasis: "Agilidade e transparência no desenvolvimento",
  investmentStrategy: "Valores claros com opções de parcelamento",
  additionalPrompt: "Use linguagem técnica mas acessível. Destaque velocidade."
}
```

#### 2.3.4 Tabela `subscriptions` - Assinaturas

Controla as assinaturas de usuários com planos pagos.

| Campo | O que guarda |
|-------|--------------|
| `id` | ID da assinatura |
| `userId` | Usuário (FK) |
| `stripeSubscriptionId` | ID no Stripe |
| `stripeCustomerId` | ID do cliente no Stripe |
| `planId` | Plano contratado (FK) |
| `status` | active/canceled/past_due |
| `subscriptionType` | monthly/yearly |
| `currentPeriodStart` | Início do período |
| `currentPeriodEnd` | Fim do período |
| `cancelAtPeriodEnd` | Cancela ao fim? |
| `canceledAt` | Quando cancelou |
| `trialStart` | Início do trial |
| `trialEnd` | Fim do trial |

#### 2.3.5 Tabela `notifications` - Notificações

Guarda todas as notificações do sistema.

| Campo | O que guarda |
|-------|--------------|
| `id` | ID da notificação |
| `userId` | Para quem (FK) |
| `projectId` | Projeto relacionado (FK, opcional) |
| `type` | Tipo da notificação |
| `title` | Título |
| `message` | Mensagem |
| `metadata` | Dados extras (JSON) |
| `isRead` | Foi lida? |
| `readAt` | Quando leu |
| `emailSent` | Enviou email? |
| `emailSentAt` | Quando enviou |
| `actionUrl` | Link de ação |

**Tipos de Notificação:**

- `proposal_viewed` - Cliente visualizou a proposta
- `proposal_accepted` - Cliente aceitou
- `proposal_rejected` - Cliente recusou
- `proposal_feedback` - Cliente deixou feedback
- `proposal_expired` - Proposta expirou
- `proposal_expiring_soon` - Vai expirar em breve
- `project_status_changed` - Status mudou
- `payment_received` - Pagamento recebido
- `subscription_updated` - Assinatura atualizada
- `system_announcement` - Anúncio do sistema

#### 2.3.6 Tabela `notification_preferences` - Preferências de Notificação

Controla como cada usuário quer receber notificações.

| Campo | O que controla |
|-------|----------------|
| `emailEnabled` | Receber emails? |
| `emailProposalViewed` | Email quando proposta for vista? |
| `emailProposalAccepted` | Email quando aceita? |
| `emailProposalFeedback` | Email quando houver feedback? |
| `emailProposalExpiring` | Email quando for expirar? |
| `emailPaymentReceived` | Email quando receber pagamento? |
| `inAppEnabled` | Notificações no app? |
| `inAppProposalViewed` | Notificação no app quando vista? |
| `inAppProposalAccepted` | Notificação no app quando aceita? |
| ... | ... |

### 2.4 Migrações de Banco de Dados

**O que são migrações?**

Migrações são como um "histórico de mudanças" do banco de dados. Cada vez que você adiciona uma tabela, campo ou faz alguma alteração, cria-se uma migração.

**Localização:** `/Users/nepfy/Projects/dashboard-fe/src/migrations/`

**Evolução do Sistema (principais migrações):**

1. **Migração 0001-0010**: Criação das tabelas iniciais
2. **Migração 0015-0030**: Sistema de templates antigo (29+ tabelas)
3. **Migração 0043**: **REVOLUCIONÁRIA** - Unificação para `proposalData` JSON
4. **Migração 0044**: Adição do campo `buttonConfig`
5. **Migração 0045**: Remoção das tabelas antigas de templates
6. **Migração 0046**: Sistema de notificações

**Como funcionam:**

```
Estado Atual do Banco
   ↓
Nova migração criada
   ↓
Comando: npm run migrate
   ↓
Banco atualizado com mudanças
```

### 2.5 Variáveis de Ambiente do Banco

```env
# URL principal do banco
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require

# URL sem pooling (para migrações)
DATABASE_URL_UNPOOLED=postgresql://usuario:senha@host-direct/database

# Credenciais individuais
POSTGRES_DATABASE=nome_do_banco
POSTGRES_HOST=host.neon.tech
POSTGRES_PASSWORD=senha_secreta
POSTGRES_USER=usuario
PGDATABASE=nome_do_banco
PGHOST=host.neon.tech
PGHOST_UNPOOLED=host-direct.neon.tech
PGPASSWORD=senha_secreta
PGUSER=usuario
```

### 2.6 Como Usar o Banco no Código

**Exemplo 1: Buscar todos os projetos de um usuário**

```typescript
import { db } from '#/lib/db';

async function buscarMeusProjetos(userId: string) {
  const projetos = await db.query.projects.findMany({
    where: (projects, { eq }) => eq(projects.personId, userId),
    orderBy: (projects, { desc }) => desc(projects.created_at)
  });

  return projetos;
}
```

**Exemplo 2: Criar um novo projeto**

```typescript
import { db } from '#/lib/db';
import { projects } from '#/lib/db/schema';

async function criarProjeto(dados) {
  const [novoProjeto] = await db.insert(projects).values({
    personId: dados.userId,
    projectName: dados.nome,
    clientName: dados.cliente,
    templateType: 'flash',
    projectStatus: 'rascunho',
    isPublished: false,
    proposalData: {
      introduction: { ... },
      aboutUs: { ... },
      // ... resto dos dados
    }
  }).returning();

  return novoProjeto;
}
```

**Exemplo 3: Atualizar um projeto**

```typescript
async function atualizarProjeto(projectId: string, novosDados) {
  const [atualizado] = await db
    .update(projects)
    .set({
      proposalData: novosDados,
      updated_at: new Date()
    })
    .where(eq(projects.id, projectId))
    .returning();

  return atualizado;
}
```

---

## 3. MÓDULO GERADOR DE PROPOSTA COM IA

### 3.1 Como Funciona a Geração de Propostas

O sistema usa **inteligência artificial** para criar propostas personalizadas automaticamente. Em vez de você escrever tudo manualmente, você fornece informações básicas e a IA gera uma proposta completa e profissional.

**Fluxo Simplificado:**

```
Usuário preenche formulário
   ↓
Serviço: "Desenvolvimento Web"
Cliente: "Empresa ABC"
Descrição: "Site institucional moderno"
   ↓
Sistema escolhe o agente certo
   ↓
Agente de IA gera conteúdo
   ↓
Proposta completa em segundos
```

### 3.2 Sistema de Agentes de IA

**O que é um Agente?**

Um agente é como um "especialista virtual" treinado em um setor específico. Cada agente sabe como criar propostas para sua área de especialização.

**Tipos de Agentes Disponíveis:**

1. **Desenvolvedor Web** (`web-development`)
   - Cria propostas para sites, e-commerce, sistemas web
   - Conhece tecnologias como React, Node.js, WordPress
   - Fala sobre SEO, performance, responsividade

2. **Designer Gráfico** (`graphic-design`)
   - Cria propostas para identidade visual, logotipos, materiais gráficos
   - Conhece Adobe, Figma, Illustrator
   - Fala sobre branding, psicologia das cores

3. **Marketing Digital** (`digital-marketing`)
   - Cria propostas para gestão de redes sociais, tráfego pago, SEO
   - Conhece Google Ads, Meta Ads, Analytics
   - Fala sobre ROI, conversões, engajamento

4. **Consultoria** (`consulting`)
   - Cria propostas para consultoria empresarial
   - Conhece gestão, processos, estratégia
   - Fala sobre diagnóstico, planos de ação, KPIs

**Como o Sistema Escolhe o Agente:**

```typescript
// Usuário seleciona: "Desenvolvimento Web"
const servico = "web-development";

// Sistema busca no banco de dados
const agente = await buscarAgente(servico, "flash");

// Encontra: "Desenvolvedor Web - Template Flash"
// Agente tem conhecimento específico sobre desenvolvimento web
```

### 3.3 Templates de Proposta

O sistema oferece 3 tipos de templates, cada um com um estilo diferente:

#### Template FLASH ⚡
**Características:**
- Rápido de gerar (180 segundos)
- Objetivo e direto
- Foco em conversão
- Seções essenciais

**Ideal para:**
- Propostas rápidas
- Projetos pequenos/médios
- Clientes que preferem objetividade

**Seções:**
- Introdução impactante
- Sobre nós (resumido)
- Especialidades (lista direta)
- Processo em 5 etapas
- Investimento (até 3 planos)
- FAQ (10 perguntas)

#### Template MINIMAL 🎯
**Características:**
- Design minimalista
- Informações essenciais
- Clean e profissional
- Fácil customização

**Ideal para:**
- Propostas clean
- Clientes modernos
- Projetos de design/tech

**Seções:**
- Introdução clean
- Sobre (essencial)
- Especialidades
- Investimento
- Contato

#### Template PRIME 👑
**Características:**
- Completo e detalhado
- Premium e sofisticado
- Todas as seções disponíveis
- Altamente personalizável

**Ideal para:**
- Grandes projetos
- Clientes premium
- Propostas complexas

**Seções:**
- Todas as seções disponíveis
- Depoimentos de clientes
- Portfólio/Cases
- Termos detalhados
- Garantias e certificações

### 3.4 Motor de Geração Paralela

**Arquivo:** `src/lib/ai/parallel-workflow.ts`

**O que faz:**
Em vez de gerar a proposta seção por seção (que seria lento), o sistema gera **várias seções ao mesmo tempo** (em paralelo), tornando o processo muito mais rápido.

**Como funciona:**

```
Geração Sequencial (antiga - LENTA):
Introdução (30s) → Sobre (30s) → Processo (30s) → Preços (30s) = 120s total

Geração Paralela (atual - RÁPIDA):
Introdução (30s) ┐
Sobre (30s)      ├→ Todas ao mesmo tempo = 30s total
Processo (30s)   │
Preços (30s)     ┘
```

**Seções Geradas em Paralelo:**

1. **Conteúdo**: Introdução, sobre, metodologia, serviços, resultados, CTA
2. **Precificação**: Investimento, condições, entregas, garantias
3. **Timeline**: Fases, durações, marcos
4. **Termos** (opcional): Condições de execução, políticas
5. **FAQ** (opcional): Perguntas frequentes do setor

**Sistema de Fallback (Plano B):**

Se a IA demorar muito ou falhar, o sistema automaticamente usa conteúdo pré-definido para não deixar o usuário esperando:

```
Tentativa 1: Gerar com IA (30s)
   ↓ [Se falhar ou demorar]
Tentativa 2: Geração simples (10s)
   ↓ [Se falhar]
Plano C: Conteúdo estático padrão
```

### 3.5 Mixture of Agents (MoA) - Sistema de Múltiplos Modelos

**Arquivo:** `src/modules/ai-generator/services/moa-service.ts`

**O que é?**
É uma técnica avançada que usa **vários modelos de IA diferentes** para gerar a mesma seção, e depois combina o melhor de cada um para criar um resultado superior.

**Por que isso melhora a qualidade?**
- Cada modelo tem seus pontos fortes
- Combinando vários, você pega o melhor de cada
- Reduz erros e "alucinações" da IA
- Gera texto mais coerente e profissional

**Como funciona:**

```
ETAPA 1: GERAÇÃO DE REFERÊNCIAS
┌─────────────────────────────────┐
│ Prompt: "Crie uma introdução    │
│ para proposta de site"          │
└─────────────────────────────────┘
        │
        ├─→ Modelo 1 (Llama 8B): "Sua empresa merece..."
        ├─→ Modelo 2 (Llama 70B): "Transforme sua presença..."
        ├─→ Modelo 3 (Qwen 7B): "Destaque-se no digital..."
        └─→ Modelo 4 (Qwen 72B): "Alcance novos patamares..."

ETAPA 2: AGREGAÇÃO
┌─────────────────────────────────┐
│ Modelo Agregador (Llama 70B):  │
│ "Analise estas 4 versões e     │
│ crie a melhor combinação"       │
└─────────────────────────────────┘
        │
        ↓
Resultado Final: "Transforme sua presença digital e
alcance novos patamares com um site que destaca sua
empresa no mercado..."
```

**Modelos Utilizados:**

1. **meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo**
   - Modelo rápido e eficiente
   - Bom para textos concisos

2. **meta-llama/Llama-3.3-70B-Instruct-Turbo**
   - Modelo grande e poderoso
   - Excelente para textos complexos

3. **Qwen/Qwen2.5-7B-Instruct-Turbo**
   - Modelo alternativo rápido
   - Perspectiva diferente

4. **Qwen/Qwen2.5-72B-Instruct-Turbo**
   - Modelo alternativo grande
   - Máxima qualidade

**Configuração:**

```typescript
{
  referenceModels: [
    "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    "Qwen/Qwen2.5-7B-Instruct-Turbo",
    "Qwen/Qwen2.5-72B-Instruct-Turbo"
  ],
  aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  maxRetries: 3,          // Tenta até 3 vezes se falhar
  temperature: 0.7,       // Criatividade na geração
  maxTokens: 2000        // Tamanho máximo do texto
}
```

### 3.6 Fluxo Completo de Geração de Proposta

**Arquivo da API:** `src/app/api/projects/ai-generate/route.ts`

**Passo a Passo Detalhado:**

```
PASSO 1: USUÁRIO ENVIA DADOS
POST /api/projects/ai-generate
{
  "selectedService": "web-development",
  "clientName": "Empresa ABC",
  "projectName": "Site Institucional",
  "projectDescription": "Site moderno e responsivo",
  "templateType": "flash",
  "mainColor": "#FF6B35",
  "includeFAQ": true,
  "includeTerms": false
}

PASSO 2: SISTEMA VALIDA
✓ Usuário está autenticado?
✓ Serviço foi selecionado?
✓ Nome do cliente foi preenchido?
✓ Nome do projeto foi preenchido?
✓ Descrição foi preenchida?

PASSO 3: ESCOLHE O AGENTE
Sistema busca: agente de "web-development" para template "flash"
Encontra: "Desenvolvedor Web - Flash"

PASSO 4: EXECUTA WORKFLOW DO TEMPLATE
Para template Flash:
├─ Timeout máximo: 180 segundos
├─ Geração paralela ativada
└─ MoA ativado (se configurado)

PASSO 5: IA GERA O CONTEÚDO
┌─ Introdução
├─ Sobre Nós
├─ Especialidades (6-9 tópicos)
├─ Processo (5 etapas)
├─ Investimento
├─ Planos (1-3 opções)
└─ FAQ (10 perguntas)

PASSO 6: CRIA/ATUALIZA PROJETO NO BANCO
INSERT INTO projects (
  personId,
  clientName,
  projectName,
  templateType,
  mainColor,
  proposalData,  ← Todo conteúdo gerado pela IA
  isProposalGenerated: true,
  projectStatus: "rascunho"
)

PASSO 7: RETORNA RESULTADO
{
  "success": true,
  "data": {
    "pageData": { ... },  // Dados da proposta
    "project": {
      "id": "uuid-do-projeto",
      "projectName": "Site Institucional",
      "templateType": "flash",
      "mainColor": "#FF6B35"
    }
  },
  "metadata": {
    "service": "web-development",
    "agent": "Desenvolvedor Web - Flash",
    "generationType": "parallel",
    "planCount": 3,
    "projectCreated": true
  }
}

PASSO 8: USUÁRIO É REDIRECIONADO
Redireciona para: /editar/[projectId]
(onde pode editar a proposta gerada)
```

### 3.7 Estrutura dos Prompts de IA

**Como a IA entende o que fazer:**

Cada agente tem um "prompt de sistema" que funciona como um manual de instruções. Veja um exemplo simplificado:

```typescript
const systemPrompt = `
Você é um especialista em desenvolvimento web com 10 anos de experiência.

SUAS RESPONSABILIDADES:
- Criar propostas comerciais profissionais para projetos web
- Usar linguagem técnica mas acessível
- Focar em resultados e benefícios para o cliente
- Ser objetivo e direto

CONHECIMENTO:
- Tecnologias: React, Next.js, Node.js, WordPress, Shopify
- Serviços: Sites, E-commerce, Landing Pages, Sistemas Web
- Metodologias: Agile, Scrum, Design Thinking

ESTILO DE ESCRITA:
- Tom profissional mas acolhedor
- Frases curtas e impactantes
- Foco em resultados mensuráveis
- Use dados quando possível (ex: "+150% de conversões")

ESTRUTURA DA PROPOSTA:
1. Introdução: Apresente a solução de forma impactante
2. Sobre Nós: Destaque experiência e diferenciais
3. Especialidades: Liste 6-9 áreas de expertise
4. Processo: Descreva as 5 etapas do projeto
5. Investimento: Apresente 1-3 planos de forma clara
6. FAQ: Responda 10 perguntas comuns

REGRAS IMPORTANTES:
- Todos os textos em português brasileiro
- Use "você" e "sua empresa" para se dirigir ao cliente
- Evite termos muito técnicos sem explicação
- Cada seção deve ser independente mas coerente com o todo
- Valores devem estar em Real (R$)

FORMATO DE SAÍDA:
Retorne SEMPRE um JSON válido seguindo exatamente a estrutura fornecida.
Não adicione campos extras. Não omita campos obrigatórios.
`;
```

**Prompt Específico do Template:**

Além do prompt base, cada template tem instruções adicionais:

```typescript
// Template Flash - Ênfase em velocidade
const flashPrompt = `
TEMPLATE FLASH - CARACTERÍSTICAS:
- Textos CONCISOS (máx 100 caracteres em títulos)
- Foco em CONVERSÃO rápida
- Call-to-actions DIRETOS
- Informações ESSENCIAIS apenas

LIMITES DE CARACTERES:
- Título introdução: 60 caracteres
- Subtítulo introdução: 100 caracteres
- Título sobre nós: 155 caracteres
- Descrição etapas: 100 caracteres cada

Seja OBJETIVO e IMPACTANTE.
`;
```

### 3.8 Validação e Tratamento de Erros

**Sistema de Retry (Tentativas Automáticas):**

```typescript
// Se a IA falhar, tenta até 3 vezes
const maxRetries = 3;
let tentativa = 0;

while (tentativa < maxRetries) {
  try {
    const resultado = await gerarComIA();
    return resultado; // Sucesso!
  } catch (erro) {
    tentativa++;
    console.log(`Tentativa ${tentativa} falhou, tentando novamente...`);

    if (tentativa === maxRetries) {
      // Última tentativa falhou, usa conteúdo padrão
      return conteudoPadrao;
    }
  }
}
```

**Validação do JSON Gerado:**

```typescript
// A IA retorna texto, precisa validar se é JSON válido
function validarRespostaIA(resposta: string) {
  try {
    // Remove markdown se houver
    let jsonLimpo = resposta.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Tenta converter para objeto
    const dados = JSON.parse(jsonLimpo);

    // Valida campos obrigatórios
    if (!dados.introduction || !dados.aboutUs) {
      throw new Error("Campos obrigatórios faltando");
    }

    return dados; // Válido!
  } catch (erro) {
    console.error("JSON inválido da IA:", erro);
    return null;
  }
}
```

### 3.9 Personalização Avançada

**O usuário pode personalizar:**

1. **Cor Principal**
   ```typescript
   mainColor: "#FF6B35" // Laranja vibrante
   ```
   - Usada em botões, destaques, títulos
   - Automaticamente gera variações (hover, claro, escuro)

2. **Configuração de Botões**
   ```typescript
   buttonConfig: {
     primaryText: "Contratar Agora",
     primaryLink: "https://wa.me/5511999999999",
     secondaryText: "Saber Mais",
     secondaryLink: "mailto:contato@empresa.com"
   }
   ```

3. **URL Personalizada**
   ```typescript
   projectUrl: "meu-projeto-incrivel"
   // Gera: https://seuusuario.nepfy.com/meu-projeto-incrivel
   ```

4. **Senha de Acesso (opcional)**
   ```typescript
   pagePassword: "senhaSecreta123"
   // Cliente precisa digitar a senha para ver a proposta
   ```

5. **Validade da Proposta**
   ```typescript
   validUntil: "2025-12-31"
   // Proposta expira nesta data
   ```

### 3.10 Variáveis de Ambiente Necessárias

```env
# Together AI - Chave da API
TOGETHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4. MÓDULO EDITOR DE PROPOSTAS

### 4.1 O que é o Editor

O Editor é onde você pode **modificar, personalizar e ajustar** a proposta que foi gerada pela IA. Pense nele como um "editor de documentos" especializado para propostas comerciais.

**Funcionalidades Principais:**
- ✏️ Editar textos de qualquer seção
- 🖼️ Trocar imagens e fotos
- 🎨 Mudar cores e estilo visual
- ➕ Adicionar/remover itens (membros da equipe, planos, FAQ, etc.)
- 🔄 Reordenar seções e itens
- 👁️ Visualizar em tempo real
- 💾 Salvar alterações
- ⚠️ Alertas de alterações não salvas

### 4.2 EditorContext - O Cérebro do Editor

**Arquivo:** `src/app/editar/contexts/EditorContext.tsx`

**O que é um Context?**
É como um "gerenciador central" que guarda todos os dados da proposta e disponibiliza funções para modificá-los. Todos os componentes do editor podem acessar e modificar os mesmos dados.

**Analogia:**
Imagine o Context como um "quadro branco compartilhado" em uma sala. Todo mundo pode ver o que está escrito e todo mundo pode fazer alterações. Quando alguém muda algo, todos veem a mudança instantaneamente.

#### 4.2.1 Estado Principal

```typescript
interface EditorContextType {
  // DADOS
  projectData: TemplateData | null;  // Todos os dados da proposta
  isLoading: boolean;                // Está carregando?
  isDirty: boolean;                  // Tem alterações não salvas?
  error: string | null;              // Algum erro?
  isSaving: boolean;                 // Está salvando?

  // ... funções (veremos abaixo)
}
```

**O que cada campo significa:**

- **projectData**: Todos os dados da proposta (introdução, sobre, equipe, planos, etc.)
- **isLoading**: `true` quando está carregando dados do servidor
- **isDirty**: `true` quando você fez alterações que ainda não foram salvas
- **error**: Mensagem de erro, se algo der errado
- **isSaving**: `true` quando está salvando no servidor

#### 4.2.2 Funções de Atualização de Seções

O Editor oferece funções específicas para cada seção da proposta:

**Atualizar Introdução:**
```typescript
const { updateIntroduction } = useEditor();

// Mudar o título
updateIntroduction({
  title: "Seu Novo Título Impactante"
});

// Mudar múltiplos campos
updateIntroduction({
  title: "Novo Título",
  subtitle: "Novo Subtítulo",
  services: ["Design", "Desenvolvimento", "SEO"]
});
```

**Atualizar Sobre Nós:**
```typescript
const { updateAboutUs } = useEditor();

updateAboutUs({
  title: "Nossa História",
  subtitle: "Transformando ideias em realidade desde 2015",
  image: "https://nova-imagem.jpg"
});
```

**Atualizar Rodapé:**
```typescript
const { updateFooter } = useEditor();

updateFooter({
  companyName: "Minha Empresa Ltda",
  email: "contato@minhaempresa.com",
  phone: "(11) 99999-9999",
  socialLinks: {
    instagram: "https://instagram.com/minhaempresa",
    linkedin: "https://linkedin.com/company/minhaempresa"
  }
});
```

#### 4.2.3 Sistema de CRUD para Conteúdo Dinâmico

**O que é CRUD?**
- **C**reate (Criar)
- **R**ead (Ler)
- **U**pdate (Atualizar)
- **D**elete (Deletar)

São as 4 operações básicas que você pode fazer com dados.

**Exemplo 1: Gerenciar Membros da Equipe**

```typescript
const {
  updateTeamMember,    // Atualizar um membro
  addTeamMember,       // Adicionar novo membro
  deleteTeamMember,    // Remover um membro
  reorderTeamMembers   // Reordenar membros
} = useEditor();

// ADICIONAR um novo membro
function adicionarMembro() {
  addTeamMember();
  // Cria um membro vazio:
  // {
  //   id: "member-1699999999",
  //   name: "",
  //   role: "",
  //   image: "",
  //   hidePhoto: false,
  //   sortOrder: 2
  // }
}

// ATUALIZAR dados de um membro
function editarMembro() {
  updateTeamMember("member-123", {
    name: "João Silva",
    role: "Designer Sênior",
    image: "https://foto-joao.jpg"
  });
}

// DELETAR um membro
function removerMembro() {
  deleteTeamMember("member-123");
}

// REORDENAR membros (arrastar e soltar)
function reordenar(novaOrdem) {
  reorderTeamMembers(novaOrdem);
  // Atualiza o sortOrder de cada membro automaticamente
}
```

**Exemplo 2: Gerenciar Planos de Preço**

```typescript
const {
  updatePlanItem,              // Atualizar plano
  addPlanItem,                 // Adicionar novo plano
  deletePlanItem,              // Remover plano
  reorderPlanIncludedItems     // Reordenar itens do plano
} = useEditor();

// ADICIONAR novo plano
function adicionarPlano() {
  const planId = addPlanItem({
    title: "Plano Básico",
    price: "R$ 5.000",
    paymentType: "À vista"
  });
  // Retorna o ID do novo plano: "plan-1699999999"
}

// ATUALIZAR um plano
function editarPlano() {
  updatePlanItem("plan-123", {
    title: "Plano Premium",
    price: "R$ 12.000",
    paymentType: "Parcelado em 3x",
    paymentConditions: "Sem juros"
  });
}

// DELETAR um plano
function removerPlano() {
  deletePlanItem("plan-123");
}

// REORDENAR itens incluídos no plano
function reordenarItens(planId, novosItens) {
  reorderPlanIncludedItems(planId, novosItens);
}
```

**Exemplo 3: Gerenciar FAQ**

```typescript
const {
  updateFAQItem,    // Atualizar pergunta
  addFAQItem,       // Adicionar nova pergunta
  deleteFAQItem,    // Remover pergunta
  reorderFAQItems   // Reordenar perguntas
} = useEditor();

// ADICIONAR nova pergunta
function adicionarPergunta() {
  addFAQItem();
  // Cria: { id: "faq-xxx", question: "", answer: "", sortOrder: 10 }
}

// ATUALIZAR uma pergunta
function editarPergunta() {
  updateFAQItem("faq-123", {
    question: "Qual o prazo de entrega?",
    answer: "O prazo médio é de 30 dias úteis"
  });
}

// DELETAR uma pergunta
function removerPergunta() {
  deleteFAQItem("faq-123");
}
```

**Outros Itens que Funcionam da Mesma Forma:**

- **Especialidades** (`updateExpertiseTopic`, `addExpertiseTopic`, etc.)
- **Resultados** (`updateResultItem`, `addResultItem`, etc.)
- **Depoimentos** (`updateTestimonialItem`, `addTestimonialItem`, etc.)
- **Etapas do Processo** (`updateStepTopic`, `addStepTopic`, etc.)
- **Termos e Condições** (`updateTermsItem`, `addTermsItem`, etc.)

#### 4.2.4 Sistema de Proteção de Alterações Não Salvas

**Problema que resolve:**
Imagine que você passou 30 minutos editando sua proposta e acidentalmente fecha a aba do navegador. Você perderia todo o trabalho!

**Solução:**
O sistema detecta quando você fez alterações e não salvou, e mostra um aviso antes de você sair da página.

**Como funciona:**

```typescript
// Detecta quando há alterações não salvas
const [isDirty, setIsDirty] = useState(false);

// Quando você edita algo, marca como "sujo" (dirty)
const updateIntroduction = (data) => {
  setProjectData({ ...projectData, introduction: data });
  setIsDirty(true); // ← Marca que tem alterações não salvas
};

// Aviso do navegador
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      return "Você tem alterações não salvas. Tem certeza que deseja sair?";
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [isDirty]);
```

**Quando você vê o aviso:**

```
Você clica para fechar a aba
   ↓
isDirty === true? (tem alterações não salvas?)
   ↓
SIM → Mostra: "⚠️ Você tem alterações não salvas. Tem certeza que deseja sair?"
   ├─ Ficar na página: Continua editando
   └─ Sair mesmo assim: Perde as alterações

NÃO → Fecha normalmente
```

#### 4.2.5 Sistema de Bloqueio de Edição

**Problema que resolve:**
Evita que você abra múltiplas janelas de edição ao mesmo tempo, o que poderia causar conflitos e perda de dados.

**Como funciona:**

```typescript
const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

// Tenta começar a editar
const startEditing = (id: string): boolean => {
  if (activeEditingId !== null && activeEditingId !== id) {
    // Já está editando outra coisa!
    return false; // Não permite
  }

  setActiveEditingId(id);
  return true; // Permite
};

// Para de editar
const stopEditing = (id: string) => {
  if (activeEditingId === id) {
    setActiveEditingId(null);
  }
};
```

**Exemplo de uso:**

```typescript
// Componente de modal de edição
function ModalEditarMembro({ memberId }) {
  const { startEditing, stopEditing } = useEditor();

  const abrirModal = () => {
    const podeEditar = startEditing(`member-${memberId}`);

    if (!podeEditar) {
      alert("Você já está editando outro item. Salve ou cancele primeiro!");
      return;
    }

    setModalAberto(true);
  };

  const fecharModal = () => {
    stopEditing(`member-${memberId}`);
    setModalAberto(false);
  };

  return (
    <button onClick={abrirModal}>Editar Membro</button>
  );
}
```

#### 4.2.6 Função de Salvar Projeto

A função mais importante do Editor: salvar todas as alterações no banco de dados.

```typescript
const saveProject = async (options?: {
  projectStatus?: string;
  isPublished?: boolean;
  skipNavigation?: boolean;
}) => {
  // 1. Validações
  if (!projectData || !projectData.id || isSaving) {
    return; // Não pode salvar agora
  }

  // 2. Indica que está salvando
  setIsSaving(true);
  setError(null);

  try {
    // 3. Envia para a API
    const response = await fetch(`/api/projects/${projectData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...projectData,
        ...options,
        updated_at: new Date()
      })
    });

    // 4. Verifica resposta
    if (!response.ok) {
      throw new Error("Erro ao salvar projeto");
    }

    const data = await response.json();

    // 5. Atualiza estado
    setProjectData(data.project);
    setIsDirty(false); // ← Marca como salvo

    // 6. Redireciona (se não for "save and continue editing")
    if (!options?.skipNavigation) {
      router.push(`/dashboard?success&project=${projectData.projectName}`);
    }

  } catch (erro) {
    setError("Não foi possível salvar. Tente novamente.");
  } finally {
    setIsSaving(false);
  }
};
```

**Diferentes modos de salvar:**

```typescript
// 1. Salvar e voltar pro dashboard
await saveProject();

// 2. Salvar como rascunho (continua editando)
await saveProject({
  skipNavigation: true,
  projectStatus: "rascunho"
});

// 3. Salvar e publicar
await saveProject({
  isPublished: true,
  projectStatus: "enviada"
});
```

#### 4.2.7 Função de Reverter Alterações

Desfaz todas as alterações não salvas, voltando ao estado original:

```typescript
const revertChanges = () => {
  if (!originalData) return;

  setProjectData(originalData); // Volta pro original
  setIsDirty(false);            // Marca como não modificado
};
```

**Uso no componente:**

```typescript
function BotaoReverter() {
  const { isDirty, revertChanges } = useEditor();

  if (!isDirty) return null; // Só mostra se tiver alterações

  return (
    <button onClick={revertChanges}>
      ❌ Descartar Alterações
    </button>
  );
}
```

### 4.3 Componentes de Edição

**Localização:** `src/app/editar/modules/[template]/components/`

#### 4.3.1 EditableText - Texto Editável

Permite editar textos diretamente na página ou em um modal.

```typescript
<EditableText
  value={projectData.introduction.title}
  onChange={(newValue) => updateIntroduction({ title: newValue })}
  placeholder="Digite o título"
  maxLength={60}
  multiline={false}
/>
```

**Propriedades:**
- `value`: Texto atual
- `onChange`: Função chamada quando o texto muda
- `placeholder`: Texto de exemplo quando está vazio
- `maxLength`: Número máximo de caracteres
- `multiline`: `true` para textarea, `false` para input simples

#### 4.3.2 EditableImage - Imagem Editável

Permite fazer upload e trocar imagens.

```typescript
<EditableImage
  currentImage={projectData.aboutUs.image}
  onImageChange={(newUrl) => updateAboutUs({ image: newUrl })}
  aspectRatio="16:9"
  maxSizeMB={5}
/>
```

**Como funciona:**

```
Usuário clica no componente
   ↓
Abre seletor de arquivo
   ↓
Usuário escolhe imagem
   ↓
Upload para Vercel Blob Storage
   ↓
Retorna URL da imagem
   ↓
onImageChange(novaURL) é chamado
   ↓
Imagem é atualizada na proposta
```

#### 4.3.3 EditableDate - Data Editável

Seletor de data para validade da proposta.

```typescript
<EditableDate
  value={projectData.projectValidUntil}
  onChange={(newDate) => updateProjectValidUntil(newDate)}
  minDate={new Date()}  // Não permite datas passadas
  label="Válida até"
/>
```

#### 4.3.4 EditableButton - Configuração de Botões

Edita texto e link dos botões de ação.

```typescript
<EditableButton
  config={projectData.buttonConfig}
  onChange={(newConfig) => updateButtonConfig(newConfig)}
/>

// Estrutura de buttonConfig:
{
  primaryText: "Aceitar Proposta",
  primaryLink: "https://wa.me/5511999999999",
  secondaryText: "Fazer Perguntas",
  secondaryLink: "mailto:contato@empresa.com"
}
```

#### 4.3.5 ItemEditorModal - Modal de Edição Complexa

Modal completo para editar itens complexos (membros da equipe, depoimentos, etc.).

```typescript
<ItemEditorModal
  isOpen={modalAberto}
  onClose={() => setModalAberto(false)}
  title="Editar Membro da Equipe"
  onSave={(dados) => updateTeamMember(membroId, dados)}
>
  <div>
    <label>Nome:</label>
    <input name="name" defaultValue={membro.name} />

    <label>Cargo:</label>
    <input name="role" defaultValue={membro.role} />

    <label>Foto:</label>
    <EditableImage
      currentImage={membro.image}
      onImageChange={(url) => setFotoUrl(url)}
    />
  </div>
</ItemEditorModal>
```

#### 4.3.6 PersonalizeModal - Personalização Visual

Modal para configurar cores, URL e senha.

```typescript
<PersonalizeModal
  isOpen={modalAberto}
  onClose={() => setModalAberto(false)}
  currentColor={projectData.mainColor}
  currentUrl={projectData.projectUrl}
  currentPassword={projectData.pagePassword}
  onSave={(config) => updatePersonalization(config)}
/>

// Configurações disponíveis:
{
  mainColor: "#FF6B35",           // Cor principal
  projectUrl: "meu-projeto",      // URL personalizada
  pagePassword: "senha123"        // Senha (opcional)
}
```

#### 4.3.7 UnsavedChangesModal - Aviso de Alterações Não Salvas

Modal que aparece quando você tenta sair sem salvar.

```typescript
<UnsavedChangesModal
  isOpen={isDirty && tentandoSair}
  onSave={() => {
    await saveProject();
    sair();
  }}
  onDiscard={() => {
    revertChanges();
    sair();
  }}
  onCancel={() => setTentandoSair(false)}
/>
```

### 4.4 Fluxo Completo de Edição

**Cenário:** Usuário quer editar o nome de um membro da equipe

```
PASSO 1: USUÁRIO ACESSA EDITOR
URL: /editar/abc-123-def-456
   ↓
EditorContext carrega dados do projeto
   ↓
GET /api/projects/abc-123-def-456
   ↓
Dados carregados em projectData

PASSO 2: USUÁRIO CLICA EM "EDITAR MEMBRO"
   ↓
startEditing("member-789") é chamado
   ↓
Sistema verifica: já está editando algo?
   ↓
NÃO → Abre modal de edição
SIM → Mostra alerta "Finalize a edição atual primeiro"

PASSO 3: USUÁRIO EDITA NO MODAL
Nome: "João Silva" → "João Pedro Silva"
Cargo: "Designer" → "Designer Sênior"
   ↓
Clica em "Salvar"

PASSO 4: DADOS SÃO ATUALIZADOS
updateTeamMember("member-789", {
  name: "João Pedro Silva",
  role: "Designer Sênior"
})
   ↓
projectData é atualizado
isDirty é marcado como true
   ↓
stopEditing("member-789") é chamado
Modal fecha

PASSO 5: USUÁRIO VÊ MUDANÇA EM TEMPO REAL
Componente re-renderiza automaticamente
Nome e cargo atualizados na visualização
Indicador "Não salvo" aparece no topo

PASSO 6: USUÁRIO SALVA O PROJETO
Clica no botão "Salvar Projeto"
   ↓
saveProject() é chamado
   ↓
PUT /api/projects/abc-123-def-456
Body: { proposalData: { ... }, updated_at: "2025-11-15..." }
   ↓
Servidor atualiza banco de dados
   ↓
isDirty é marcado como false
Indicador "Salvo ✓" aparece

PASSO 7: REDIRECIONAMENTO (OPCIONAL)
Se não for "save and continue":
   ↓
Router redireciona para /dashboard
Mensagem de sucesso aparece
```

### 4.5 Edição por Template

Cada template (Flash, Minimal, Prime) tem seu próprio editor customizado.

**Localização:**
- **Flash**: `src/app/editar/modules/flash/`
- **Minimal**: `src/app/editar/modules/minimal/`
- **Prime**: `src/app/editar/modules/prime/`

**Diferenças:**

**Template Flash:**
- Editor mais simples e direto
- Limites de caracteres visíveis
- Foco em edições rápidas
- Menos opções de customização

**Template Minimal:**
- Editor clean e minimalista
- Apenas seções essenciais
- Interface mais espaçada
- Foco em simplicidade

**Template Prime:**
- Editor completo com todas as opções
- Máxima customização
- Mais seções disponíveis
- Controles avançados

### 4.6 Exemplo Prático Completo

Vamos criar um componente completo de edição de equipe:

```typescript
import { useEditor } from '#/app/editar/contexts/EditorContext';
import { useState } from 'react';

function EditorEquipe() {
  const {
    projectData,
    updateTeamMember,
    addTeamMember,
    deleteTeamMember,
    reorderTeamMembers,
    startEditing,
    stopEditing,
    isDirty,
    saveProject
  } = useEditor();

  const [modalAberto, setModalAberto] = useState(false);
  const [membroEditando, setMembroEditando] = useState(null);

  // Pega dados da equipe
  const equipe = projectData?.proposalData?.team?.members || [];
  const maxMembros = 6;
  const podeAdicionar = equipe.length < maxMembros;

  // Função para abrir modal de edição
  const abrirEditar = (membro) => {
    const podeMesmo = startEditing(`member-${membro.id}`);
    if (!podeMesmo) {
      alert('Finalize a edição atual primeiro!');
      return;
    }
    setMembroEditando(membro);
    setModalAberto(true);
  };

  // Função para salvar edição
  const salvarEdicao = (dados) => {
    updateTeamMember(membroEditando.id, dados);
    fecharModal();
  };

  // Função para fechar modal
  const fecharModal = () => {
    stopEditing(`member-${membroEditando?.id}`);
    setModalAberto(false);
    setMembroEditando(null);
  };

  // Função para adicionar membro
  const adicionar = () => {
    if (!podeAdicionar) {
      alert(`Máximo de ${maxMembros} membros permitido!`);
      return;
    }
    addTeamMember();
  };

  // Função para remover membro
  const remover = (id) => {
    if (!confirm('Tem certeza que deseja remover este membro?')) {
      return;
    }
    deleteTeamMember(id);
  };

  return (
    <div className="editor-equipe">
      {/* Cabeçalho */}
      <div className="header">
        <h2>Equipe ({equipe.length}/{maxMembros})</h2>
        <button onClick={adicionar} disabled={!podeAdicionar}>
          ➕ Adicionar Membro
        </button>
      </div>

      {/* Lista de membros */}
      <div className="membros">
        {equipe.map((membro) => (
          <div key={membro.id} className="membro-card">
            <img src={membro.image || '/avatar-placeholder.png'} />
            <h3>{membro.name || 'Nome não definido'}</h3>
            <p>{membro.role || 'Cargo não definido'}</p>

            <div className="acoes">
              <button onClick={() => abrirEditar(membro)}>
                ✏️ Editar
              </button>
              <button onClick={() => remover(membro.id)}>
                🗑️ Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de alterações não salvas */}
      {isDirty && (
        <div className="alerta-nao-salvo">
          ⚠️ Você tem alterações não salvas
          <button onClick={() => saveProject({ skipNavigation: true })}>
            💾 Salvar Agora
          </button>
        </div>
      )}

      {/* Modal de edição */}
      {modalAberto && membroEditando && (
        <ItemEditorModal
          isOpen={modalAberto}
          onClose={fecharModal}
          title="Editar Membro da Equipe"
          onSave={salvarEdicao}
        >
          <div className="form">
            <label>
              Nome:
              <input
                type="text"
                defaultValue={membroEditando.name}
                name="name"
                required
              />
            </label>

            <label>
              Cargo:
              <input
                type="text"
                defaultValue={membroEditando.role}
                name="role"
                required
              />
            </label>

            <label>
              Foto:
              <EditableImage
                currentImage={membroEditando.image}
                onImageChange={(url) => {
                  // Atualiza preview
                }}
                aspectRatio="1:1"
              />
            </label>

            <label>
              <input
                type="checkbox"
                defaultChecked={membroEditando.hidePhoto}
                name="hidePhoto"
              />
              Ocultar foto
            </label>

            <label>
              <input
                type="checkbox"
                defaultChecked={membroEditando.hideMember}
                name="hideMember"
              />
              Ocultar membro completamente
            </label>
          </div>
        </ItemEditorModal>
      )}
    </div>
  );
}

export default EditorEquipe;
```

### 4.7 Melhores Práticas de Uso do Editor

#### 4.7.1 Sempre use o Context

❌ **ERRADO:**
```typescript
// Não faça chamadas diretas à API
const salvar = async () => {
  await fetch('/api/projects/123', {
    method: 'PUT',
    body: JSON.stringify(dados)
  });
};
```

✅ **CORRETO:**
```typescript
// Use as funções do Context
const { saveProject } = useEditor();

const salvar = async () => {
  await saveProject();
};
```

#### 4.7.2 Valide antes de salvar

```typescript
const salvarMembro = (dados) => {
  // Validações
  if (!dados.name || dados.name.trim() === '') {
    alert('Nome é obrigatório!');
    return;
  }

  if (!dados.role || dados.role.trim() === '') {
    alert('Cargo é obrigatório!');
    return;
  }

  if (dados.name.length > 100) {
    alert('Nome muito longo! Máximo 100 caracteres.');
    return;
  }

  // Tudo ok, pode salvar
  updateTeamMember(membroId, dados);
};
```

#### 4.7.3 Dê feedback visual ao usuário

```typescript
const { isSaving } = useEditor();

return (
  <button onClick={salvar} disabled={isSaving}>
    {isSaving ? '⏳ Salvando...' : '💾 Salvar'}
  </button>
);
```

#### 4.7.4 Trate erros adequadamente

```typescript
const { error, saveProject } = useEditor();

const salvar = async () => {
  try {
    await saveProject();
    alert('✅ Salvo com sucesso!');
  } catch (erro) {
    alert('❌ Erro ao salvar. Tente novamente.');
  }
};

// Mostre erros na interface
{error && (
  <div className="erro">
    ❌ {error}
  </div>
)}
```

---

## 5. FLUXO COMPLETO DO SISTEMA

### Fluxo de Criação de uma Proposta do Início ao Fim

```
ETAPA 1: CADASTRO E LOGIN
Usuário acessa site
   ↓
Cria conta em /criar-conta (Clerk)
   ↓
Webhook cria registro em person_user
   ↓
Sistema cria cliente no Stripe
   ↓
Usuário completa onboarding
   ↓
Redireciona para /dashboard

ETAPA 2: CRIAR NOVA PROPOSTA
No dashboard, clica em "Nova Proposta"
   ↓
Abre formulário de criação:
   - Seleciona serviço: "Desenvolvimento Web"
   - Nome do cliente: "Empresa ABC"
   - Nome do projeto: "Site Institucional"
   - Descrição: "Site moderno para empresa de tecnologia"
   - Template: "Flash"
   - Cor principal: "#FF6B35"
   - Incluir FAQ: Sim
   - Incluir Termos: Não
   ↓
Clica em "Gerar com IA"

ETAPA 3: GERAÇÃO COM IA
POST /api/projects/ai-generate
   ↓
Sistema escolhe agente "web-dev-flash"
   ↓
IA gera proposta completa em 30-60 segundos
   ↓
Salva no banco de dados (tabela projects)
   ↓
Retorna proposta gerada
   ↓
Redireciona para /editar/[projectId]

ETAPA 4: EDIÇÃO
Usuário visualiza proposta gerada
   ↓
Edita seções conforme necessário:
   - Muda título da introdução
   - Adiciona foto da equipe
   - Ajusta valores dos planos
   - Corrige textos
   - Personaliza cores
   ↓
Clica em "Salvar Projeto"
   ↓
PUT /api/projects/[id]
   ↓
Dados atualizados no banco
   ↓
Volta para /dashboard

ETAPA 5: PUBLICAÇÃO
No dashboard, encontra o projeto
   ↓
Clica em "Publicar"
   ↓
Sistema gera URL pública:
   exemplo: https://joaosilva.nepfy.com/site-empresa-abc
   ↓
Define senha (opcional)
   ↓
Define validade: 30 dias
   ↓
Clica em "Publicar"
   ↓
Status muda para "Publicada"
   ↓
Copia link e envia para o cliente

ETAPA 6: CLIENTE VISUALIZA
Cliente acessa o link
   ↓
Se tiver senha, digita senha
   ↓
Proposta é exibida com design profissional
   ↓
Sistema registra: proposal_viewed
   ↓
Usuário recebe notificação:
   "🔔 Sua proposta 'Site Institucional' foi visualizada!"

ETAPA 7: INTERAÇÃO DO CLIENTE
Cliente lê a proposta
   ↓
Clica em botão "Aceitar Proposta"
   ↓
Sistema registra: proposal_accepted
   ↓
Usuário recebe notificação:
   "🎉 Parabéns! Sua proposta foi aceita!"
   ↓
Ou...
Cliente clica em "Deixar Feedback"
   ↓
Sistema registra: proposal_feedback
   ↓
Usuário recebe notificação:
   "💬 Você recebeu feedback sobre sua proposta"

ETAPA 8: ACOMPANHAMENTO
No dashboard, usuário vê:
   ✅ Status: Aceita
   📊 Visualizações: 3
   📅 Visualizada em: 15/11/2025
   ↓
Pode editar, duplicar ou arquivar o projeto
   ↓
Histórico completo de interações salvo
```

---

## 6. ESTRUTURA DE PASTAS DO PROJETO

```
dashboard-fe/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # APIs Backend
│   │   │   ├── projects/             # CRUD de Projetos
│   │   │   │   ├── ai-generate/      # 🤖 Geração com IA
│   │   │   │   ├── [id]/             # Operações em projeto específico
│   │   │   │   └── draft/            # Salvar rascunho
│   │   │   ├── admin/                # Admin (agentes, templates)
│   │   │   ├── webhooks/             # Webhooks (Clerk, Stripe)
│   │   │   ├── stripe/               # Pagamentos
│   │   │   ├── notifications/        # Sistema de notificações
│   │   │   └── onboarding/           # Dados de onboarding
│   │   │
│   │   ├── dashboard/                # 📊 Painel Principal
│   │   │   ├── propostas/            # Lista de propostas
│   │   │   ├── configuracoes/        # Configurações do usuário
│   │   │   └── calculadora/          # Calculadora de preços
│   │   │
│   │   ├── editar/                   # ✏️ Editor de Propostas
│   │   │   ├── contexts/             # EditorContext
│   │   │   ├── modules/              # Editores por template
│   │   │   │   ├── flash/
│   │   │   │   ├── minimal/
│   │   │   │   └── prime/
│   │   │   └── components/           # Componentes de edição
│   │   │
│   │   ├── project/                  # 🌐 Visualização Pública
│   │   │   └── [userName]/[projectURL]/
│   │   │
│   │   ├── criar-conta/              # Cadastro
│   │   ├── login/                    # Login
│   │   ├── onboarding/               # Onboarding novo usuário
│   │   ├── planos/                   # Página de planos
│   │   └── admin/                    # Admin dashboard
│   │       ├── agents/               # Gerenciar agentes
│   │       └── templates/            # Gerenciar templates
│   │
│   ├── lib/
│   │   ├── db/                       # 💾 Camada de Banco de Dados
│   │   │   ├── schema/               # Schemas Drizzle
│   │   │   │   ├── users.ts          # Tabelas de usuários
│   │   │   │   ├── projects.ts       # Tabela de projetos
│   │   │   │   ├── agents.ts         # Agentes de IA
│   │   │   │   ├── subscriptions.ts  # Assinaturas
│   │   │   │   ├── notifications.ts  # Notificações
│   │   │   │   ├── onboarding.ts     # Dados de onboarding
│   │   │   │   └── plans.ts          # Planos de preços
│   │   │   ├── helpers/              # Funções auxiliares
│   │   │   └── index.ts              # Conexão com NeonDB
│   │   │
│   │   ├── ai/                       # 🤖 Infraestrutura de IA
│   │   │   └── parallel-workflow.ts  # Geração paralela
│   │   │
│   │   ├── services/                 # 🔧 Serviços
│   │   │   ├── clerk-stripe-sync.ts  # Sincronização
│   │   │   ├── notification-service.ts
│   │   │   └── email-service.ts
│   │   │
│   │   └── analytics/                # 📈 Analytics (PostHog)
│   │
│   ├── modules/
│   │   └── ai-generator/             # 🧠 Sistema de Geração com IA
│   │       ├── agents/               # Sistema de Agentes
│   │       │   ├── database-agents.ts
│   │       │   └── base/             # Tipos e constraints
│   │       ├── templates/            # Definições de Templates
│   │       │   ├── flash/
│   │       │   ├── minimal/
│   │       │   └── prime/
│   │       ├── themes/               # Workflows por Template
│   │       │   ├── flash.ts
│   │       │   ├── minimal.ts
│   │       │   └── prime.ts
│   │       ├── services/             # Serviços de IA
│   │       │   └── moa-service.ts    # Mixture of Agents
│   │       └── utils/                # Utilidades
│   │
│   ├── components/                   # 🎨 Componentes React
│   ├── hooks/                        # 🪝 Custom Hooks
│   ├── types/                        # 📘 Tipos TypeScript
│   │   ├── proposal-data.ts          # Tipo ProposalData
│   │   ├── template-data.ts          # Tipo TemplateData
│   │   └── project.ts                # Tipos de Project
│   ├── contexts/                     # Contextos React
│   ├── migrations/                   # 🗄️ Migrações do Banco
│   ├── styles/                       # Estilos globais
│   └── middleware.ts                 # 🔒 Middleware de Auth
│
├── docs/                             # 📚 Documentação
│   ├── schemas/
│   ├── NOTIFICATIONS_SYSTEM.md
│   ├── CLERK_STRIPE_SYNC.md
│   └── DATABASE_MIGRATIONS.md
│
├── public/                           # Assets estáticos
├── drizzle.config.ts                 # Config Drizzle ORM
├── next.config.ts                    # Config Next.js
├── tailwind.config.ts                # Config Tailwind CSS
└── package.json                      # Dependências
```

---

## 7. COMANDOS ÚTEIS

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm run start

# Verificar erros TypeScript
npm run type-check

# Lint (verificar código)
npm run lint
```

### Banco de Dados

```bash
# Gerar nova migração (após alterar schema)
npm run migrations

# Aplicar migrações ao banco
npm run migrate

# Abrir Drizzle Studio (visualizar dados)
npx drizzle-kit studio
```

### Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm test -- --watch
```

### Agentes de IA

```bash
# Migrar agentes para o banco de dados
npm run migrate-agents

# Verificar agentes no banco
npm run verify-agents

# Listar agentes disponíveis
npm run list-db-agents

# Testar geração com template específico
npm run test-flash
npm run test-minimal
npm run test-prime
```

---

## 8. VARIÁVEIS DE AMBIENTE COMPLETAS

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# === APLICAÇÃO ===
NEXT_PUBLIC_VERCEL_ENV=development
NEXT_PUBLIC_VERCEL_URL=localhost:3000
NEXT_PUBLIC_NEPFY_API_URL=http://localhost:3000/api
NEXT_PUBLIC_PROJECT_BASE_DOMAIN=nepfy.com

# === BANCO DE DADOS (NeonDB) ===
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host-direct/database
POSTGRES_DATABASE=nome_do_banco
POSTGRES_HOST=host.neon.tech
POSTGRES_PASSWORD=sua_senha
POSTGRES_USER=seu_usuario
PGDATABASE=nome_do_banco
PGHOST=host.neon.tech
PGHOST_UNPOOLED=host-direct.neon.tech
PGPASSWORD=sua_senha
PGUSER=seu_usuario

# === AUTENTICAÇÃO (Clerk) ===
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/criar-conta
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login

# === INTELIGÊNCIA ARTIFICIAL (Together AI) ===
TOGETHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === PAGAMENTOS (Stripe) ===
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# === ARMAZENAMENTO (Vercel Blob) ===
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx

# === APIS EXTERNAS ===
PEXELS_API_KEY=xxxxxxxxxxxxx  # Para imagens de stock

# === ANALYTICS (PostHog) ===
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# === EMAIL (opcional) ===
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Se usar Resend para emails
```

---

## 9. GLOSSÁRIO DE TERMOS

### Termos Técnicos

- **API**: Interface de Programação de Aplicações - forma de diferentes sistemas conversarem
- **Webhook**: Sistema de notificação automática entre serviços
- **CRUD**: Create, Read, Update, Delete - operações básicas de dados
- **JSON**: Formato de dados estruturados em texto
- **UUID**: Identificador único universal (ex: "550e8400-e29b-41d4-a716-446655440000")
- **ORM**: Object-Relational Mapping - converte dados do banco em objetos JavaScript
- **Middleware**: Código que roda entre a requisição e a resposta
- **Context**: Sistema do React para compartilhar dados entre componentes
- **Hook**: Função especial do React que adiciona funcionalidades
- **Prompt**: Instruções dadas para a IA
- **Template**: Modelo/estrutura pré-definida
- **Schema**: Estrutura/definição de como os dados são organizados

### Termos do Projeto

- **ProposalData**: Objeto JSON com todos os dados de uma proposta
- **TemplateData**: Dados completos de um projeto incluindo metadata
- **Agent**: Especialista virtual de IA para um setor específico
- **MoA**: Mixture of Agents - técnica de usar múltiplos modelos de IA
- **isDirty**: Indica se há alterações não salvas
- **Flash/Minimal/Prime**: Os 3 tipos de templates disponíveis
- **Clerk**: Serviço de autenticação
- **NeonDB**: Banco de dados PostgreSQL serverless
- **Drizzle**: ORM usado para acessar o banco
- **Together AI**: Plataforma de IA usada
- **Vercel**: Plataforma de hospedagem

---

## 10. PERGUNTAS FREQUENTES (FAQ)

### Sobre o Sistema

**P: Por que usar JSONB em vez de tabelas separadas?**
R: Mais rápido, mais flexível, mais fácil de manter. Uma consulta em vez de 29+.

**P: Posso adicionar meu próprio agente de IA?**
R: Sim! Adicione um registro na tabela `agents` e `agent_templates`.

**P: Como o sistema sabe qual template usar?**
R: O usuário escolhe no formulário de criação (flash, minimal ou prime).

**P: A IA pode errar ou gerar conteúdo ruim?**
R: Sim, por isso é importante revisar e editar a proposta gerada.

**P: Quanto custa usar a IA (Together AI)?**
R: Depende do uso. Aproximadamente $0.002 por proposta gerada.

### Sobre Desenvolvimento

**P: Preciso saber React para mexer no projeto?**
R: Sim, conhecimento de React e TypeScript é fundamental.

**P: Como adiciono um novo campo na proposta?**
R: 1) Adicione no tipo `ProposalData`, 2) Adicione no template, 3) Adicione no editor.

**P: Posso mudar o banco de dados?**
R: Tecnicamente sim, mas seria muito trabalhoso. NeonDB é otimizado para serverless.

**P: Como adiciono uma nova seção na proposta?**
R: É complexo. Precisa mexer em: tipo ProposalData, template, workflow de IA, e editor.

### Solução de Problemas

**P: Erro "JWT inválido" no Clerk**
R: Verifique se `CLERK_SECRET_KEY` está correta no `.env.local`.

**P: IA demora muito para gerar**
R: Normal até 3 minutos. Se passar disso, verifique `TOGETHER_API_KEY`.

**P: Mudanças no banco não aparecem**
R: Execute `npm run migrate` para aplicar migrações.

**P: Erro ao salvar projeto**
R: Verifique se usuário está autenticado e se tem permissão no projeto.

---

## CONCLUSÃO

Este sistema representa uma solução completa e moderna para geração e gerenciamento de propostas comerciais. A arquitetura foi cuidadosamente planejada para ser:

✅ **Rápida**: Geração paralela de conteúdo, banco otimizado com JSONB
✅ **Flexível**: Fácil adicionar novos agentes, templates e seções
✅ **Escalável**: Serverless, preparado para crescer
✅ **Confiável**: Sistema de fallback, retry automático, proteção de dados
✅ **Moderna**: Next.js 15, React 19, TypeScript, IA de última geração

**Principais Diferenciais:**

1. **Inteligência Artificial Avançada**: Múltiplos modelos com MoA
2. **Banco de Dados Eficiente**: JSONB unificado em vez de 29+ tabelas
3. **Editor Poderoso**: Edição em tempo real com proteção de dados
4. **Sistema Multi-Template**: Flash, Minimal e Prime
5. **Totalmente Integrado**: Clerk + Stripe + NeonDB + Together AI

**Próximos Passos Sugeridos:**

1. Explorar cada módulo na prática
2. Criar um agente personalizado
3. Customizar templates existentes
4. Adicionar novos tipos de seções
5. Implementar analytics mais detalhados

---

**Documentação criada em**: 15 de Novembro de 2025
**Versão do Sistema**: 1.0.0
**Última Atualização**: 15/11/2025
