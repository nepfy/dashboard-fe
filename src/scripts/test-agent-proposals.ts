#!/usr/bin/env tsx

import { getAgentByServiceAndTemplate } from "#/modules/ai-generator/agents";
import {
  FlashTemplateWorkflow,
  type FlashWorkflowResult,
} from "#/modules/ai-generator/themes/flash";
import {
  PrimeTemplateWorkflow,
  type PrimeWorkflowResult,
} from "#/modules/ai-generator/themes/prime";
// Define the service types used in the database
type DatabaseServiceType =
  | "marketing-digital"
  | "designer"
  | "desenvolvedor"
  | "arquiteto"
  | "photography"
  | "agencias-consultoria";
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

function getArgValue(flag: string): string | undefined {
  const prefix = `${flag}=`;
  const match = args.find((arg) => arg.startsWith(prefix));
  if (match) {
    return match.slice(prefix.length);
  }
  return undefined;
}

if (!process.env.TOGETHER_API_KEY) {
  console.warn(
    "⚠️ Missing TOGETHER_API_KEY. Using mock key to enable offline fallbacks."
  );
  process.env.TOGETHER_API_KEY = "mock";
}

const templateArg =
  getArgValue("--template") ??
  (args.includes("--flash")
    ? "flash"
    : args.includes("--prime")
      ? "prime"
      : undefined);
const supportedTemplates = new Set(["flash", "prime"]);
const templateFilter = supportedTemplates.has(templateArg ?? "")
  ? (templateArg as "flash" | "prime")
  : undefined;

if (templateArg && !templateFilter) {
  console.warn(
    `⚠️ Unsupported template filter "${templateArg}". Valid options are "flash" or "prime".`
  );
}

const serviceFilter = getArgValue("--service") as DatabaseServiceType | undefined;

interface TestCase {
  service: DatabaseServiceType;
  template: "flash" | "prime";
  name: string;
  testData: {
    companyInfo: string;
    clientName: string;
    projectName: string;
    projectDescription: string;
    selectedPlans: number | string | string[];
    planDetails: string;
    includeTerms: boolean;
    includeFAQ: boolean;
    mainColor: string;
  };
}

const testCases: TestCase[] = [
  // Flash Agents
  {
    service: "marketing-digital",
    template: "flash",
    name: "Marketing Digital Flash",
    testData: {
      companyInfo:
        "Agência Digital Inovadora - Especialistas em crescimento de negócios online com 5 anos de experiência. Nossa equipe é composta por especialistas em SEO, Google Ads, redes sociais e automação de marketing, ajudando empresas a aumentar suas vendas através de estratégias digitais personalizadas.",
      clientName: "Maria Silva",
      projectName: "Estratégia de Marketing Digital Completa",
      projectDescription:
        "Desenvolvimento de estratégia completa de marketing digital para e-commerce de moda feminina, incluindo SEO, Google Ads, gestão de redes sociais e automação de email marketing para aumentar vendas e engajamento.",
      selectedPlans: ["Básico", "Premium", "Enterprise"],
      planDetails:
        "Planos personalizados para crescimento acelerado com foco em ROI e resultados mensuráveis",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#3B82F6",
    },
  },
  {
    service: "agencias-consultoria",
    template: "flash",
    name: "Agências & Consultoria Flash",
    testData: {
      companyInfo:
        "Com mais de 10 anos de experiência em estratégia e posicionamento digital, conectamos dados, criatividade e performance para acelerar resultados de negócios B2B e B2C.",
      clientName: "Augusto Ferragens",
      projectName: "Site Institucional Consultivo",
      projectDescription:
        "Criação de experiência digital consultiva para posicionar a marca como referência em soluções industriais, destacando diferenciais, cases e canais de atendimento.",
      selectedPlans: ["Discovery", "Growth", "Enterprise"],
      planDetails:
        "Planos sob medida para conduzir crescimento consultivo com indicadores e narrativas que humanizam a marca",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#4F21A1",
    },
  },
  {
    service: "designer",
    template: "flash",
    name: "Designer Flash",
    testData: {
      companyInfo:
        "Studio Criativo Design - Especialistas em identidade visual e branding para startups e empresas em crescimento. Nossa missão é transformar ideias em experiências visuais memoráveis através de design estratégico e criativo.",
      clientName: "João Santos",
      projectName: "Identidade Visual Completa",
      projectDescription:
        "Criação de identidade visual completa para startup de tecnologia, incluindo logo, paleta de cores, tipografia, material gráfico e manual de marca para estabelecer presença visual forte no mercado.",
      selectedPlans: ["Logo", "Complete", "Premium"],
      planDetails:
        "Soluções de design que fortalecem marcas e geram resultados duradouros",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#8B5CF6",
    },
  },
  {
    service: "desenvolvedor",
    template: "flash",
    name: "Desenvolvedor Flash",
    testData: {
      companyInfo:
        "Tech Solutions Pro - Empresa de desenvolvimento de software especializada em aplicações web e mobile. Utilizamos tecnologias modernas como React, Node.js e React Native para criar soluções escaláveis e eficientes.",
      clientName: "Ana Costa",
      projectName: "Plataforma E-commerce",
      projectDescription:
        "Desenvolvimento de plataforma e-commerce completa com sistema de pagamentos, gestão de estoque, painel administrativo e aplicativo mobile para varejo de produtos naturais.",
      selectedPlans: ["Web App", "Mobile App", "Full Stack"],
      planDetails:
        "Soluções tecnológicas que geram eficiência, escalabilidade e lucro",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#10B981",
    },
  },
  {
    service: "arquiteto",
    template: "flash",
    name: "Arquiteto Flash",
    testData: {
      companyInfo:
        "Arquitetura Moderna - Escritório especializado em projetos residenciais e comerciais que combinam funcionalidade, estética e sustentabilidade. Nossa experiência inclui aprovações, acompanhamento de obra e design de interiores.",
      clientName: "Carlos Mendes",
      projectName: "Casa Contemporânea",
      projectDescription:
        "Projeto arquitetônico completo para residência unifamiliar contemporânea de 200m², incluindo plantas, elevações, especificações técnicas e acompanhamento de obra em terreno de 500m².",
      selectedPlans: ["Projeto", "Complete", "Premium"],
      planDetails:
        "Projetos que geram conforto, valorização e investimento inteligente",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#F59E0B",
    },
  },
  {
    service: "photography",
    template: "flash",
    name: "Fotógrafo Flash",
    testData: {
      companyInfo:
        "Estúdio Fotográfico Profissional - Especialistas em fotografia corporativa, de produtos, eventos e retratos. Nossa equipe utiliza equipamentos de alta qualidade e técnicas avançadas de pós-produção para capturar momentos únicos.",
      clientName: "Lucia Ferreira",
      projectName: "Sessão Corporativa",
      projectDescription:
        "Sessão fotográfica corporativa para equipe executiva de 15 pessoas, incluindo retratos individuais, fotos de grupo e imagens para site institucional e materiais de marketing.",
      selectedPlans: ["Session", "Package", "Premium"],
      planDetails:
        "Fotografia que gera visibilidade, lucro e memórias afetivas duradouras",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#EF4444",
    },
  },
  {
  },
  // Prime Agents
  {
    service: "marketing-digital",
    template: "prime",
    name: "Marketing Digital Prime",
    testData: {
      companyInfo:
        "Agência Premium Digital - Líderes em estratégias de marketing digital premium com metodologia exclusiva. Especializamos em campanhas de alto impacto, automação avançada e crescimento sustentável para empresas de médio e grande porte.",
      clientName: "Patricia Oliveira",
      projectName: "Estratégia Premium de Marketing Digital",
      projectDescription:
        "Desenvolvimento de estratégia premium de marketing digital para rede de clínicas estéticas, incluindo posicionamento de marca, campanhas multicanal, automação avançada e análise de performance com foco em conversão e ROI superior.",
      selectedPlans: ["Básico", "Intermediário", "Avançado"],
      planDetails:
        "Estratégias premium que garantem crescimento sustentável e presença digital dominante",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#7C3AED",
    },
  },
  {
    service: "agencias-consultoria",
    template: "prime",
    name: "Agências & Consultoria Prime",
    testData: {
      companyInfo:
        "Boutique estratégica que combina consultoria de crescimento, branding e performance para marcas que buscam diferenciação premium.",
      clientName: "Grupo Valorem",
      projectName: "Reposicionamento Consultivo Premium",
      projectDescription:
        "Programa completo de reposicionamento e aceleração comercial para holding de empresas de serviços consultivos, com foco em pipeline high-ticket e expansão Latam.",
      selectedPlans: ["Essencial", "Avançado", "Prime"],
      planDetails:
        "Planos modulados para elevar percepção de valor, previsibilidade de receita e fortalecimento institucional",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#5B21B6",
    },
  },
  {
    service: "designer",
    template: "prime",
    name: "Designer Prime",
    testData: {
      companyInfo:
        "Design Studio Premium - Atelier de design especializado em identidades visuais exclusivas e projetos de alto padrão. Nossa metodologia PRIME combina criatividade, estratégia e inovação para criar marcas memoráveis e impactantes.",
      clientName: "Fernando Alves",
      projectName: "Rebranding Premium",
      projectDescription:
        "Rebranding completo para holding empresarial com 8 empresas, incluindo identidade visual unificada, sistema de design, aplicações corporativas, manual de marca e estratégia de implementação em todos os touchpoints.",
      selectedPlans: ["Básico", "Intermediário", "Avançado"],
      planDetails:
        "Design premium que gera reconhecimento, valorização e lucro excepcional",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#A855F7",
    },
  },
  {
    service: "desenvolvedor",
    template: "prime",
    name: "Desenvolvedor Prime",
    testData: {
      companyInfo:
        "Tech Solutions Elite - Desenvolvedores especializados em soluções tecnológicas de alto padrão para empresas que buscam inovação e excelência. Utilizamos arquiteturas escaláveis, metodologias ágeis e tecnologias de ponta.",
      clientName: "Mariana Rocha",
      projectName: "Plataforma SaaS Avançada",
      projectDescription:
        "Desenvolvimento de plataforma SaaS completa para gestão de clínicas médicas, incluindo sistema de agendamentos, prontuários eletrônicos, telemedicina, integração com sistemas de pagamento e aplicativo mobile nativo.",
      selectedPlans: ["Básico", "Intermediário", "Avançado"],
      planDetails:
        "Soluções tecnológicas premium que geram eficiência máxima e lucro escalável",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#059669",
    },
  },
  {
    service: "arquiteto",
    template: "prime",
    name: "Arquiteto Prime",
    testData: {
      companyInfo:
        "Arquitetura de Excelência - Escritório premium especializado em projetos arquitetônicos de alto padrão. Nossa metodologia PRIME combina design inovador, sustentabilidade e funcionalidade para criar espaços únicos e valorizados.",
      clientName: "Isabela Martins",
      projectName: "Residência de Alto Padrão",
      projectDescription:
        "Projeto arquitetônico completo para residência de alto padrão de 400m² em terreno de 1000m², incluindo design de interiores, paisagismo, automação residencial e certificação de sustentabilidade.",
      selectedPlans: ["Básico", "Intermediário", "Avançado"],
      planDetails:
        "Arquitetura premium que gera conforto excepcional e investimento inteligente",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#D97706",
    },
  },
  {
    service: "photography",
    template: "prime",
    name: "Fotógrafo Prime",
    testData: {
      companyInfo:
        "Atelier Fotográfico Premium - Estúdio especializado em fotografia de alto padrão para marcas de luxo e eventos exclusivos. Nossa metodologia PRIME combina arte, técnica e storytelling para criar imagens impactantes e memoráveis.",
      clientName: "Gabriel Souza",
      projectName: "Campanha Premium de Marca",
      projectDescription:
        "Produção fotográfica completa para campanha de marca de joias de luxo, incluindo fotos de produtos, lifestyle, retratos executivos e material para redes sociais, site e catálogo premium.",
      selectedPlans: ["Básico", "Intermediário", "Avançado"],
      planDetails:
        "Fotografia premium que gera visibilidade excepcional e valor comercial",
      includeTerms: true,
      includeFAQ: true,
      mainColor: "#DC2626",
    },
  },
  {
  },
];

async function generateProposal(
  agent: any,
  testData: any,
  template: string,
  service: string
): Promise<FlashWorkflowResult | PrimeWorkflowResult | null> {
  try {
    let workflow;
    if (template === "flash") {
      workflow = new FlashTemplateWorkflow();
    } else if (template === "prime") {
      workflow = new PrimeTemplateWorkflow();
    } else {
      throw new Error(`Unknown template: ${template}`);
    }

    const normalizedSelectedPlans = normalizeSelectedPlans(
      testData.selectedPlans
    );

    const payload = {
      ...testData,
      selectedPlans: normalizedSelectedPlans,
      selectedPlansLabels: Array.isArray(testData.selectedPlans)
        ? testData.selectedPlans
        : undefined,
      planDetails:
        typeof testData.planDetails === "string" ? testData.planDetails : "",
      templateType: template,
      selectedService: service, // Add the missing field
    };

    const result = await workflow.execute(payload);

    return result as FlashWorkflowResult | PrimeWorkflowResult;
  } catch (error) {
    console.error(`Error generating proposal for ${agent.name}:`, error);
    return null;
  }
}

function normalizeSelectedPlans(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return clampPlans(value);
  }

  if (Array.isArray(value)) {
    return clampPlans(value.length);
  }

  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return clampPlans(parsed);
  }

  return 1;
}

function clampPlans(count: number): number {
  const rounded = Math.round(count);
  if (rounded < 1) {
    return 1;
  }
  if (rounded > 3) {
    return 3;
  }
  return rounded;
}

async function testAgentProposals() {
  console.log("🧪 Testando geração de propostas para todos os agentes...\n");

  if (templateFilter) {
    console.log(`🔍 Filtro de template aplicado: ${templateFilter}`);
  }

  if (serviceFilter) {
    console.log(`🔍 Filtro de serviço aplicado: ${serviceFilter}`);
  }

  const results: any[] = [];
  const outputDir = path.join(process.cwd(), "proposal-samples");

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filteredCases = testCases.filter((testCase) => {
    if (templateFilter && testCase.template !== templateFilter) {
      return false;
    }
    if (serviceFilter && testCase.service !== serviceFilter) {
      return false;
    }
    return true;
  });

  if (filteredCases.length === 0) {
    console.warn("⚠️ Nenhum caso de teste correspondeu aos filtros fornecidos.");
    return;
  }

  for (const testCase of filteredCases) {
    console.log(`\n📋 TESTE: ${testCase.name}`);
    console.log("=".repeat(60));

    try {
      // Get agent
      const agent = await getAgentByServiceAndTemplate(
        testCase.service,
        testCase.template
      );

      if (!agent) {
        console.error(`❌ Agente não encontrado: ${testCase.name}`);
        results.push({
          agent: testCase.name,
          template: testCase.template,
          service: testCase.service,
          success: false,
          error: "Agente não encontrado",
        });
        continue;
      }

      console.log(`✅ Agente encontrado: ${agent.name}`);
      console.log(`   Setor: ${agent.sector}`);
      console.log(`   Serviços: ${agent.commonServices?.length || 0}`);
      console.log(`   Expertise: ${agent.expertise?.length || 0}`);

      // Generate proposal
      console.log("⏳ Gerando proposta...");
      const workflowResult = await generateProposal(
        agent,
        testCase.testData,
        testCase.template,
        testCase.service
      );

      if (!workflowResult) {
        console.error("❌ Falha ao gerar proposta (erro desconhecido)");
        results.push({
          agent: testCase.name,
          template: testCase.template,
          service: testCase.service,
          success: false,
          error: "Workflow retornou nulo",
        });
        continue;
      }

      if (!workflowResult.success) {
        const errorMessage =
          "error" in workflowResult && workflowResult.error
            ? workflowResult.error
            : "Workflow falhou sem mensagem detalhada";
        console.error(`❌ Falha ao gerar proposta: ${errorMessage}`);
        results.push({
          agent: testCase.name,
          template: testCase.template,
          service: testCase.service,
          success: false,
          error: errorMessage,
        });
        continue;
      }

      const proposalPayload =
        testCase.template === "flash"
          ? (workflowResult as FlashWorkflowResult).proposal
          : (workflowResult as PrimeWorkflowResult).data;

      if (!proposalPayload) {
        console.error("❌ Workflow retornou proposta vazia");
        results.push({
          agent: testCase.name,
          template: testCase.template,
          service: testCase.service,
          success: false,
          error: "Proposta vazia",
        });
        continue;
      }

      console.log("✅ Proposta gerada com sucesso!");

      // Save proposal to file
      const filename = `${testCase.service}-${testCase.template}-proposal.json`;
      const filepath = path.join(outputDir, filename);

      const proposalData = {
        agent: {
          id: agent.id,
          name: agent.name,
          sector: agent.sector,
          template: testCase.template,
        },
        testData: testCase.testData,
        proposal: proposalPayload,
        workflowMetadata: workflowResult.metadata,
        generatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(filepath, JSON.stringify(proposalData, null, 2));
      console.log(`💾 Proposta salva em: ${filepath}`);

      // Analyze proposal structure
      let analysis;
      try {
        analysis = analyzeProposal(proposalPayload, testCase.template);
        console.log("📊 Análise da proposta:");
        console.log(`   Estrutura: ${analysis.structureScore}/10`);
        console.log(`   Conteúdo: ${analysis.contentScore}/10`);
        console.log(`   Personalização: ${analysis.personalizationScore}/10`);
        console.log(`   Qualidade geral: ${analysis.overallScore}/10`);
      } catch (analysisError) {
        console.error(
          "⚠️ Falha ao analisar a proposta:",
          analysisError instanceof Error
            ? analysisError.message
            : String(analysisError)
        );
        analysis = null;
      }

      results.push({
        agent: testCase.name,
        template: testCase.template,
        service: testCase.service,
        success: true,
        analysis,
        filename,
      });
    } catch (error) {
      console.error(`❌ Erro ao testar ${testCase.name}:`, error);
      results.push({
        agent: testCase.name,
        template: testCase.template,
        service: testCase.service,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Generate summary report
  console.log("\n" + "=".repeat(60));
  console.log("📊 RELATÓRIO FINAL");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Sucessos: ${successful.length}/${results.length}`);
  console.log(`❌ Falhas: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    const avgScore =
      successful.reduce((sum, r) => sum + r.analysis.overallScore, 0) /
      successful.length;
    console.log(`📈 Pontuação média: ${avgScore.toFixed(1)}/10`);
  }

  // Template comparison
  const flashResults = successful.filter((r) => r.template === "flash");
  const primeResults = successful.filter((r) => r.template === "prime");

  if (flashResults.length > 0 && primeResults.length > 0) {
    const flashAvg =
      flashResults.reduce((sum, r) => sum + r.analysis.overallScore, 0) /
      flashResults.length;
    const primeAvg =
      primeResults.reduce((sum, r) => sum + r.analysis.overallScore, 0) /
      primeResults.length;

    console.log(`\n📊 Comparação de Templates:`);
    console.log(`   Flash: ${flashAvg.toFixed(1)}/10`);
    console.log(`   Prime: ${primeAvg.toFixed(1)}/10`);
  }

  // Save summary report
  const summaryReport = {
    generatedAt: new Date().toISOString(),
    totalTests: results.length,
    successful: successful.length,
    failed: failed.length,
    averageScore:
      successful.length > 0
        ? successful.reduce((sum, r) => sum + r.analysis.overallScore, 0) /
          successful.length
        : 0,
    results: results,
  };

  const summaryPath = path.join(outputDir, "summary-report.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2));
  console.log(`\n📄 Relatório completo salvo em: ${summaryPath}`);

  console.log("\n🎉 Teste de propostas concluído!");
}

function analyzeProposal(
  proposal: any,
  template: string
): {
  structureScore: number;
  contentScore: number;
  personalizationScore: number;
  overallScore: number;
} {
  let structureScore = 0;
  let contentScore = 0;
  let personalizationScore = 0;

  // Get the actual proposal data - handle both Flash and Prime structures
  const proposalData = proposal?.finalProposal || proposal?.data || proposal;

  // Analyze structure - check for required sections
  const requiredSections = [
    "introduction",
    "aboutUs",
    "specialties",
    "process",
    "investment",
    "plans",
  ];

  const presentSections = requiredSections.filter(
    (section) =>
      proposalData[section] && Object.keys(proposalData[section]).length > 0
  );

  structureScore = (presentSections.length / requiredSections.length) * 10;

  // Analyze content quality
  let contentChecks = 0;
  let contentPassed = 0;

  // Check introduction section
  if (
    proposalData.introduction?.title &&
    proposalData.introduction.title.length > 10
  ) {
    contentChecks++;
    contentPassed++;
  }
  if (
    proposalData.introduction?.subtitle &&
    proposalData.introduction.subtitle.length > 20
  ) {
    contentChecks++;
    contentPassed++;
  }
  if (
    proposalData.introduction?.services &&
    Array.isArray(proposalData.introduction.services) &&
    proposalData.introduction.services.length > 0
  ) {
    contentChecks++;
    contentPassed++;
  }

  // Check aboutUs section
  if (proposalData.aboutUs?.title && proposalData.aboutUs.title.length > 20) {
    contentChecks++;
    contentPassed++;
  }
  if (
    proposalData.aboutUs?.subtitle &&
    proposalData.aboutUs.subtitle.length > 50
  ) {
    contentChecks++;
    contentPassed++;
  }

  // Check specialties section
  if (
    proposalData.specialties?.topics &&
    Array.isArray(proposalData.specialties.topics) &&
    proposalData.specialties.topics.length > 0
  ) {
    contentChecks++;
    contentPassed++;
  }

  // Check process section
  if (
    proposalData.process?.steps &&
    Array.isArray(proposalData.process.steps) &&
    proposalData.process.steps.length > 0
  ) {
    contentChecks++;
    contentPassed++;
  }

  // Check investment/plans section
  if (
    proposalData.plans &&
    Array.isArray(proposalData.plans) &&
    proposalData.plans.length > 0
  ) {
    contentChecks++;
    contentPassed++;
  }

  contentScore = contentChecks > 0 ? (contentPassed / contentChecks) * 10 : 0;

  // Analyze personalization
  let personalizationChecks = 0;
  let personalizationPassed = 0;

  // Check for client name usage in aboutUs subtitle
  if (
    proposalData.aboutUs?.subtitle &&
    (proposalData.aboutUs.subtitle.includes("Maria") ||
      proposalData.aboutUs.subtitle.includes("João") ||
      proposalData.aboutUs.subtitle.includes("Ana") ||
      proposalData.aboutUs.subtitle.includes("Carlos") ||
      proposalData.aboutUs.subtitle.includes("Lucia") ||
      proposalData.aboutUs.subtitle.includes("Roberto") ||
      proposalData.aboutUs.subtitle.includes("Patricia") ||
      proposalData.aboutUs.subtitle.includes("Fernando") ||
      proposalData.aboutUs.subtitle.includes("Mariana") ||
      proposalData.aboutUs.subtitle.includes("Isabela") ||
      proposalData.aboutUs.subtitle.includes("Gabriel") ||
      proposalData.aboutUs.subtitle.includes("Eduardo"))
  ) {
    personalizationChecks++;
    personalizationPassed++;
  }

  // Check for project-specific content
  if (
    proposalData.aboutUs?.subtitle &&
    proposalData.aboutUs.subtitle.length > 100
  ) {
    personalizationChecks++;
    personalizationPassed++;
  }

  // Check for service-specific content in specialties
  if (
    proposalData.specialties?.topics &&
    proposalData.specialties.topics.some(
      (topic: any) =>
        topic.title && topic.description && topic.description.length > 20
    )
  ) {
    personalizationChecks++;
    personalizationPassed++;
  }

  personalizationScore =
    personalizationChecks > 0
      ? (personalizationPassed / personalizationChecks) * 10
      : 5;

  const overallScore =
    (structureScore + contentScore + personalizationScore) / 3;

  return {
    structureScore: Math.round(structureScore * 10) / 10,
    contentScore: Math.round(contentScore * 10) / 10,
    personalizationScore: Math.round(personalizationScore * 10) / 10,
    overallScore: Math.round(overallScore * 10) / 10,
  };
}

// Run the test
testAgentProposals().catch(console.error);
