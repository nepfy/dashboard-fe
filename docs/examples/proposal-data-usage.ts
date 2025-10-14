/**
 * Exemplos práticos de uso do novo sistema de ProposalData
 * Este arquivo demonstra como trabalhar com a estrutura unificada
 */

import {
  getProposalData,
  updateProposalData,
  updateProposalSection,
  mergeProposalData,
} from "#/lib/db/helpers/proposal-data.helpers";
import type { ProposalData } from "#/types/proposal-data";

// ============================================
// Exemplo 1: Criar uma nova proposta completa
// ============================================
async function createCompleteProposal(projectId: string) {
  const proposalData: ProposalData = {
    introduction: {
      name: "João Silva",
      email: "joao@empresa.com",
      buttonTitle: "Iniciar Projeto",
      title: "Transforme sua presença digital com nosso trabalho especializado",
      validity: "31/12/2025",
      subtitle:
        "Desenvolvemos soluções que geram resultados reais e impulsionam seu crescimento online de forma estratégica",
      services: [
        { serviceName: "Desenvolvimento Web Completo", sortOrder: 1 },
        { serviceName: "Design UI/UX Profissional", sortOrder: 2 },
        { serviceName: "Otimização de Performance", sortOrder: 3 },
        { serviceName: "Suporte Técnico Dedicado", sortOrder: 4 },
      ],
    },
    aboutUs: {
      title:
        "Somos especialistas em criar experiências digitais que convertem visitantes em clientes fiéis e geram resultados mensuráveis para seu negócio",
      supportText: "Mais de 10 anos transformando ideias em realidade digital",
      subtitle:
        "Nossa equipe combina expertise técnica com visão estratégica para entregar projetos que superam expectativas. Trabalhamos com as tecnologias mais modernas do mercado para garantir que sua solução seja escalável, segura e de alta performance.",
    },
    team: {
      title: "Nossa equipe está pronta para transformar sua visão em realidade",
      members: [
        {
          name: "Carlos Santos",
          role: "Tech Lead",
          image: "/images/team/carlos.jpg",
          sortOrder: 1,
        },
        {
          name: "Ana Paula",
          role: "UX Designer",
          image: "/images/team/ana.jpg",
          sortOrder: 2,
        },
        {
          name: "Roberto Lima",
          role: "Full Stack Developer",
          image: "/images/team/roberto.jpg",
          sortOrder: 3,
        },
      ],
    },
    expertise: {
      title:
        "Aplicamos estratégias que unem tecnologia, análise e execução, garantindo performance digital e resultados reais",
      topics: [
        {
          title: "Desenvolvimento Web Responsivo",
          description:
            "Sites otimizados que convertem visitantes em clientes com performance superior.",
          sortOrder: 1,
        },
        {
          title: "Sistemas de Agendamento",
          description:
            "Plataformas personalizadas que automatizam e organizam seus agendamentos.",
          sortOrder: 2,
        },
        {
          title: "Integrações Avançadas",
          description:
            "Conectamos ferramentas para criar fluxos de trabalho mais eficientes.",
          sortOrder: 3,
        },
      ],
    },
    faq: {
      title: "Perguntas Frequentes",
      items: [
        {
          question: "Qual é o prazo médio de entrega?",
          answer:
            "O prazo médio é de 30 dias úteis, variando conforme a complexidade do projeto.",
          sortOrder: 1,
        },
        {
          question: "Vocês oferecem suporte após a entrega?",
          answer:
            "Sim, incluímos suporte técnico gratuito por 30 dias após a entrega.",
          sortOrder: 2,
        },
      ],
    },
  };

  await updateProposalData(projectId, proposalData);
  console.log("✅ Proposta criada com sucesso!");
}

// ============================================
// Exemplo 2: Atualizar apenas uma seção
// ============================================
async function updateIntroductionOnly(projectId: string) {
  await updateProposalSection(projectId, "introduction", {
    name: "Maria Oliveira",
    email: "maria@empresa.com",
    buttonTitle: "Começar Agora",
    title: "Novo título personalizado para o projeto",
    validity: "30/06/2026",
  });

  console.log("✅ Introdução atualizada!");
}

// ============================================
// Exemplo 3: Adicionar/atualizar parcialmente
// ============================================
async function addFaqSection(projectId: string) {
  // Isso vai mesclar com os dados existentes, mantendo outras seções intactas
  await mergeProposalData(projectId, {
    faq: {
      title: "Dúvidas Frequentes",
      items: [
        {
          question: "Como funciona o processo de desenvolvimento?",
          answer:
            "Seguimos metodologias ágeis com entregas incrementais e comunicação constante.",
          sortOrder: 1,
        },
        {
          question: "Posso solicitar alterações durante o projeto?",
          answer:
            "Sim, incluímos ciclos de revisão e ajustes para garantir sua satisfação.",
          sortOrder: 2,
        },
      ],
    },
  });

  console.log("✅ FAQ adicionado/atualizado!");
}

// ============================================
// Exemplo 4: Buscar dados para exibição
// ============================================
async function displayProposal(projectId: string) {
  const proposal = await getProposalData(projectId);

  if (!proposal) {
    console.log("❌ Proposta não encontrada");
    return;
  }

  console.log("📄 Proposta:");
  console.log("Título:", proposal.introduction?.title);
  console.log("Cliente:", proposal.introduction?.name);
  console.log("Sobre:", proposal.aboutUs?.title);
  console.log("FAQ Items:", proposal.faq?.items?.length || 0);
}

// ============================================
// Exemplo 5: Geração com AI (integração)
// ============================================
async function generateProposalWithAI(
  projectId: string,
  projectDetails: {
    projectName: string;
    projectDescription: string;
    clientName: string;
    companyInfo: string;
  }
) {
  // Gerar cada seção com AI
  const introductionData = await generateSectionWithAI(
    "introduction",
    projectDetails
  );
  const aboutUsData = await generateSectionWithAI("aboutUs", projectDetails);
  const teamData = await generateSectionWithAI("team", projectDetails);

  // Salvar tudo de uma vez
  await updateProposalData(projectId, {
    introduction: introductionData.introduction,
    aboutUs: aboutUsData.aboutUs,
    team: teamData.team,
  });

  console.log("✅ Proposta gerada com AI!");
}

// Helper simulado para geração com AI
async function generateSectionWithAI(
  section: string,
  projectDetails: Record<string, string>
) {
  // Aqui você integraria com seu sistema de AI (OpenAI, etc)
  // Por agora, retorna dados mockados
  return {
    [section]: {
      /* dados gerados pela AI */
    },
  };
}

// ============================================
// Exemplo 6: Validação e tratamento de erros
// ============================================
async function safeUpdateProposal(
  projectId: string,
  data: Partial<ProposalData>
) {
  try {
    // Validar dados antes de salvar
    if (data.introduction?.email && !isValidEmail(data.introduction.email)) {
      throw new Error("Email inválido");
    }

    if (data.introduction?.title && data.introduction.title.length > 100) {
      throw new Error("Título muito longo (máximo 100 caracteres)");
    }

    await mergeProposalData(projectId, data);
    console.log("✅ Proposta atualizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar proposta:", error);
    throw error;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// Exemplo 7: Migração de dados antigos
// ============================================
async function migrateOldProposalFormat(
  projectId: string,
  oldData: {
    introductionTable: Record<string, unknown>;
    aboutUsTable: Record<string, unknown>;
    servicesTable: Array<Record<string, unknown>>;
  }
) {
  // Converter formato antigo para novo
  const newFormat: ProposalData = {
    introduction: {
      name: String(oldData.introductionTable.name || ""),
      email: String(oldData.introductionTable.email || ""),
      buttonTitle: String(oldData.introductionTable.buttonTitle || ""),
      title: String(oldData.introductionTable.title || ""),
      validity: String(oldData.introductionTable.validity || ""),
      subtitle: oldData.introductionTable.subtitle
        ? String(oldData.introductionTable.subtitle)
        : undefined,
      services: oldData.servicesTable.map((service, index) => ({
        serviceName: String(service.serviceName || ""),
        sortOrder: index + 1,
      })),
    },
    aboutUs: {
      title: oldData.aboutUsTable.title
        ? String(oldData.aboutUsTable.title)
        : undefined,
      supportText: oldData.aboutUsTable.supportText
        ? String(oldData.aboutUsTable.supportText)
        : undefined,
      subtitle: oldData.aboutUsTable.subtitle
        ? String(oldData.aboutUsTable.subtitle)
        : undefined,
    },
  };

  await updateProposalData(projectId, newFormat);
  console.log("✅ Dados migrados do formato antigo!");
}

// ============================================
// Exemplo 8: Buscar seção específica
// ============================================
async function getSpecificSection(projectId: string) {
  const proposal = await getProposalData(projectId);

  // Acessar seções específicas de forma type-safe
  const introduction = proposal?.introduction;
  const faq = proposal?.faq;

  if (introduction) {
    console.log("📧 Email:", introduction.email);
    console.log("📝 Título:", introduction.title);
    console.log("🛠️ Serviços:", introduction.services?.length || 0);
  }

  if (faq) {
    console.log("❓ Perguntas:", faq.items?.length || 0);
  }
}

// ============================================
// Exemplo 9: Clonar proposta para outro projeto
// ============================================
async function cloneProposal(sourceProjectId: string, targetProjectId: string) {
  const sourceProposal = await getProposalData(sourceProjectId);

  if (!sourceProposal) {
    throw new Error("Proposta de origem não encontrada");
  }

  // Clonar para o novo projeto (você pode modificar campos aqui)
  await updateProposalData(targetProjectId, {
    ...sourceProposal,
    // Resetar campos específicos se necessário
    introduction: sourceProposal.introduction
      ? {
          ...sourceProposal.introduction,
          validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        }
      : undefined,
  });

  console.log("✅ Proposta clonada!");
}

// ============================================
// Exemplo 10: Export/Import de propostas
// ============================================
async function exportProposal(projectId: string): Promise<string> {
  const proposal = await getProposalData(projectId);

  if (!proposal) {
    throw new Error("Proposta não encontrada");
  }

  // Exportar como JSON
  return JSON.stringify(proposal, null, 2);
}

async function importProposal(projectId: string, jsonData: string) {
  const proposalData = JSON.parse(jsonData) as ProposalData;

  // Validar estrutura
  if (typeof proposalData !== "object") {
    throw new Error("Dados inválidos");
  }

  await updateProposalData(projectId, proposalData);
  console.log("✅ Proposta importada!");
}

// Exports para uso em outros arquivos
export {
  createCompleteProposal,
  updateIntroductionOnly,
  addFaqSection,
  displayProposal,
  generateProposalWithAI,
  safeUpdateProposal,
  migrateOldProposalFormat,
  getSpecificSection,
  cloneProposal,
  exportProposal,
  importProposal,
};
