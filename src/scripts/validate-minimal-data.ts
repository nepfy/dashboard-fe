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
    selectedService: "designer",
    clientName: "Beatriz Camargo",
    projectName: "Identidade Visual — Mîra Studio Collection One",
    projectDescription:
      "O projeto Identidade Visual — Mîra Studio Collection One vai ser criado para desenvolver toda a base visual da Mîra Studio, acompanhando o lançamento da primeira coleção oficial da marca. Ele vai começar com uma etapa de imersão, onde vamos levantar referências, entender o propósito da marca, estudar o público-alvo e analisar os diferenciais competitivos.\n" +
      "A partir disso, o processo vai seguir com a criação de um conceito visual inspirado na estética orgânica e minimalista que a Beatriz deseja. O projeto vai incluir:\n" +
      "construção do logo principal e versões alternativas\n" +
      "paleta cromática com tons naturais e suaves\n" +
      "tipografia elegante, com foco em legibilidade e personalidade\n" +
      "elementos gráficos inspirados em formas orgânicas\n" +
      "criação de padrões e texturas exclusivas\n" +
      "aplicações da identidade em tags, packaging, cartões e social media\n" +
      "kit de posts e stories editáveis\n" +
      "guia de marca completo para uso interno e externo\n" +
      "Além disso, o projeto vai contemplar uma direção de arte inicial para campanhas fotográficas, sugerindo cores, luz, ambientes e composições que reforcem o mood da marca. Tudo será planejado para que a Mîra Studio, logo de cara, se apresente como uma marca moderna, autoral e consistente — pronta para competir com outras labels de acessórios contemporâneos.",
    detailedClientInfo:
      "A Beatriz vai ser uma empreendedora que está lançando a Mîra Studio, uma marca de acessórios artesanais feitos à mão, com foco em peças minimalistas, sustentáveis e produzidas em pequenas coleções.\n" +
      "Ela vai estar buscando uma identidade visual que traduza a essência delicada e sofisticada da marca, com elementos que remetam à natureza, texturas orgânicas e uma estética clean. A Beatriz vai valorizar muito um posicionamento visual diferenciado, porque ela vai querer que a Mîra Studio se destaque no mercado de acessórios independentes — que é competitivo, cheio de marcas e altamente visual.\n" +
      "A Beatriz também vai desejar um processo guiado e organizado, com moodboards, conceito de marca, storytelling e um estilo visual coeso que ela possa aplicar em tags, embalagens, redes sociais e no e-commerce. Ela vai priorizar uma identidade que comunique autenticidade e que crie conexão imediata com o público-alvo.",
    companyInfo:
      "Sou uma designer especializada em identidade visual, branding e criação de peças estratégicas para marcas que querem se posicionar com clareza, personalidade e consistência. Trabalho na área há 6 anos, desenvolvendo projetos que vão desde a construção completa de marca até sistemas visuais, materiais digitais, apresentações e redes sociais.\n" +
      "Meu foco sempre é entender profundamente o que motiva o cliente, como ele quer ser percebido no mercado e qual é a mensagem que ele deseja transmitir. A partir disso, crio soluções visuais que unem estética, estratégia e funcionalidade — nada de visual bonito e vazio; tudo que desenvolvo precisa contribuir para posicionamento, percepção de valor e conexão com o público.\n" +
      "Tenho um processo muito organizado e colaborativo, sempre compartilhando etapas, moodboards, justificativas e direcionamentos, para que o cliente se sinta confiante e participe da construção do resultado final.\n" +
      "À frente do Estúdio Brava, eu desenvolvo projetos com uma abordagem profunda e estratégica de design. O estúdio nasceu da minha visão de que marcas fortes não são feitas apenas de um logo, mas de um conjunto de escolhas, sensações e experiências que precisam estar bem alinhadas desde o primeiro ponto de contato.\n" +
      "No Estúdio Brava, trabalhamos com processinhos muito claros — briefing estruturado, imersão, pesquisa de concorrência, mapa de marca, conceito visual, criação e entrega final organizada. Também oferecemos consultorias, direções de arte e materiais complementares para marcas que já existem, mas precisam de uma evolução visual.\n" +
      "Tudo aqui é feito de forma personalizada. Nada é template, nada é genérico. Cada marca ganha uma identidade única, pensada para seus objetivos negócios e personalidade.",
    selectedPlan: 3,
    templateType: "minimal",
    mainColor: "#000000",
    originalPageUrl: "beatriz-camargo",
    pagePassword: "Senha123",
    validUntil: "2025-12-31",
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
