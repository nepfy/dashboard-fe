#!/usr/bin/env tsx

/**
 * Validação de dados do template Minimal (sem UI), inspirado no Empty Studio.
 *
 * Regras principais:
 * - Hero: título > 40 chars, clientName presente.
 * - Clients: título > 80 chars, 2 parágrafos > 120 chars cada, 12 items.
 * - Expertise: >= 6 tópicos, descrição > 120 chars.
 * - AboutUs: subtitle não vazio.
 *
 * Saída: relatório de pass/fail e contagem de caracteres.
 */
import { MinimalTemplateWorkflow } from "../modules/ai-generator/themes/minimal";

type Check = { name: string; ok: boolean; info?: string };

async function validate() {
  const workflow = new MinimalTemplateWorkflow();

  const payload = {
    selectedService: "designer", // alinha com agentes reais (designer)
    companyInfo:
      "Agência digital especializada em branding, design e web. Criamos experiências premium unindo estratégia, UX/UI e desenvolvimento.",
    clientName: "Aurora Café & Co.",
    projectName: "Site Institucional Premium",
    projectDescription:
      "Desenvolvimento de site institucional moderno e responsivo para cafeteria premium, com foco em identidade visual, UX e presença digital.",
    clientDescription:
      "A Aurora Café & Co. valoriza cafés de origem, processos artesanais e uma identidade visual moderna alinhada ao estilo urbano e contemporâneo.",
    selectedPlans: 3,
    planDetails: "",
    includeTerms: true,
    includeFAQ: true,
    templateType: "minimal" as const,
    mainColor: "#000000",
    userName: "Teste E2E",
    userEmail: "teste.e2e@nepfy.com",
  };

  const result = await workflow.execute(payload);

  // Debug keys to locate proposal
  console.log("Result keys:", Object.keys(result || {}).join(", "));
  if ((result as any).proposal) {
    console.log("Found proposal at result.proposal");
  }
  if ((result as any).data?.proposal) {
    console.log("Found proposal at result.data.proposal");
  }
  if ((result as any).proposalData) {
    console.log("Found proposalData at result.proposalData");
  }

  const proposal =
    (result as any).proposal ||
    (result as any).data?.proposal ||
    (result as any).proposalData ||
    (result as any).proposalData?.proposal ||
    null;

  if (!proposal) {
    console.error(
      "❌ Falha na geração Minimal: objeto proposal não encontrado."
    );
    console.error(
      "Chaves disponíveis em result:",
      Object.keys(result || {}).join(", ")
    );
    process.exit(1);
  }

  // Debug sections keys and samples
  const sections = (proposal as any).sections || (proposal as any);
  console.log("Sections keys:", Object.keys(sections || {}).join(", "));
  console.log("Intro sample:", sections?.introduction);
  console.log("Clients sample:", {
    title: sections?.clients?.title,
    paragraphs: sections?.clients?.paragraphs,
    itemsCount: sections?.clients?.items?.length,
  });
  console.log("Expertise sample:", {
    topicsCount: sections?.expertise?.topics?.length,
    firstTopic: sections?.expertise?.topics?.[0],
  });
  console.log("AboutUs sample:", {
    title: sections?.aboutUs?.title,
    subtitle: sections?.aboutUs?.subtitle,
  });
  const checks: Check[] = [];

  const intro = sections?.introduction;
  checks.push({
    name: "Hero title > 40",
    ok: !!intro?.title && intro.title.length > 40,
    info: `${intro?.title?.length || 0} chars`,
  });
  checks.push({
    name: "Hero clientName presente",
    ok: !!intro?.clientName,
  });

  const clients = sections?.clients;
  checks.push({
    name: "Clients title > 80",
    ok: !!clients?.title && clients.title.length > 80,
    info: `${clients?.title?.length || 0} chars`,
  });
  const p0 = clients?.paragraphs?.[0] || "";
  const p1 = clients?.paragraphs?.[1] || "";
  checks.push({
    name: "Clients paragraph 0 > 120",
    ok: p0.length > 120,
    info: `${p0.length} chars`,
  });
  checks.push({
    name: "Clients paragraph 1 > 120",
    ok: p1.length > 120,
    info: `${p1.length} chars`,
  });
  checks.push({
    name: "Clients items = 12",
    ok: (clients?.items?.length || 0) === 12,
    info: `${clients?.items?.length || 0} items`,
  });

  const expertise = sections?.expertise;
  checks.push({
    name: "Expertise topics >= 6",
    ok: (expertise?.topics?.length || 0) >= 6,
    info: `${expertise?.topics?.length || 0} topics`,
  });
  const shortDesc = expertise?.topics?.find(
    (t: { description?: string }) => (t.description || "").length <= 120
  );
  checks.push({
    name: "Todas descrições expertise > 120",
    ok: !shortDesc,
    info: shortDesc
      ? `${shortDesc.title}: ${(shortDesc.description || "").length} chars`
      : undefined,
  });

  const about = sections?.aboutUs;
  checks.push({
    name: "AboutUs subtitle não vazio",
    ok: !!about?.subtitle && about.subtitle.trim().length > 0,
    info: `${about?.subtitle?.length || 0} chars`,
  });

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;

  console.log("\n📊 Validação Minimal (dados) — referência Empty Studio");
  checks.forEach((c) => {
    console.log(
      `${c.ok ? "✅" : "❌"} ${c.name}${c.info ? " — " + c.info : ""}`
    );
  });
  console.log(`\nResultado: ${passed}/${total} checks passaram`);

  if (passed !== total) {
    process.exitCode = 1;
  }
}

validate().catch((err) => {
  console.error("❌ Erro no script:", err);
  process.exit(1);
});
