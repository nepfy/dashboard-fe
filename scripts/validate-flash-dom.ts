#!/usr/bin/env tsx

/**
 * Validação DOM do template Flash usando o HTML estático de visualize.
 *
 * Fluxo:
 * - Lê o estado de login do Playwright (`e2e/.auth/state.json`) para reaproveitar cookies.
 * - Chama a API `/api/projects/ai-generate` (template flash) para obter a proposta real.
 * - Converte o payload para `ProposalData` (shape usado pelo injetor).
 * - Carrega `public/template-flash-visualize/index.html` no JSDOM, aplica IDs esperados
 *   e executa `public/template-flash-visualize/js/data-injection.js`.
 * - Injeta dados com `flashInjectData` e faz asserts em TODAS as seções geradas.
 *
 * Requisitos:
 * - Servidor Next rodando em http://localhost:3000
 * - Estado de login salvo em `e2e/.auth/state.json` (via login manual/Playwright)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { JSDOM } from "jsdom";
import type { FlashProposal } from "../src/modules/ai-generator/templates/flash/flash-template";
import type { FlashWorkflowResult } from "../src/modules/ai-generator/themes/flash";
import type { NepfyAIRequestData } from "../src/app/api/projects/ai-generate/route";
import type { ProposalData } from "../src/types/proposal-data";
import type { ButtonConfig } from "../src/types/template-data";

type Assertion = { name: string; ok: boolean; detail?: string };
type FlashApiResponse = {
  success?: boolean;
  data?: unknown;
  error?: string;
};

const ROOT = path.resolve(__dirname, "..");
const STATE_PATH = path.join(ROOT, "e2e/.auth/state.json");
const FLASH_HTML = path.join(
  ROOT,
  "public/template-flash-visualize/index.html"
);
const FLASH_INJECTOR = path.join(
  ROOT,
  "public/template-flash-visualize/js/data-injection.js"
);

function pickText(el: Element | null): string {
  return el?.textContent?.trim() ?? "";
}

function setId(
  doc: Document,
  selector: string,
  id: string
): Element | null {
  const el = doc.querySelector(selector);
  if (el && !el.id) {
    el.id = id;
  }
  return el;
}

function ensureElement(
  doc: Document,
  selector: string,
  id: string
): Element {
  const existing = doc.getElementById(id);
  if (existing) return existing;
  const anchor = doc.querySelector(selector) || doc.body;
  const created = doc.createElement("div");
  created.id = id;
  anchor.appendChild(created);
  return created;
}

function attachVisualizeIds(doc: Document) {
  setId(doc, ".hero_heading h1", "introduction-title");
  setId(
    doc,
    ".section_hero .proposal-date .opacity-60 div",
    "introduction-validity"
  );
  setId(
    doc,
    ".hero_bottom-wrap.is--right .text-weight-medium.text-size-medium",
    "introduction-subtitle"
  );
  setId(doc, ".hero_bottom .hero_text-wrap.is--opacity", "introduction-services");
  setId(doc, ".nav_brand .text-weight-medium", "introduction-username");
  ensureElement(doc, ".nav_brand", "introduction-email");

  setId(doc, ".section_about h2", "aboutus-title");

  setId(doc, ".section_team h2", "team-title");
  setId(doc, ".section_team .team_grid", "team-members-list");

  setId(doc, ".section_expertise h2", "expertise-title");
  setId(doc, ".section_expertise .expertise_grid", "expertise-topics-list");

  setId(doc, ".section_proof h2", "results-title");
  setId(doc, ".section_proof .proof_grid", "results-list");

  setId(doc, ".section_process .accordion", "steps-list");
  setId(doc, ".section_process .process_number", "steps-number");

  setId(doc, ".section_pricing .heading-style-h2", "investment-title");
  setId(
    doc,
    ".section_pricing .pricing_scope-content p",
    "investment-projectScope"
  );
  setId(doc, ".section_pricing .pricing_grid", "plans-plansItems");

  setId(doc, ".section_faq .accordion", "faq-items");

  setId(doc, ".footer_heading h3", "footer-callToAction");
  setId(
    doc,
    ".footer .proposal-date .opacity-60 div",
    "footer-validity"
  );
  setId(doc, ".footer_subtitle p", "footer-disclaimer");

  const testimonialsSlider = doc.querySelector(".section_tesitominal .slider");
  if (testimonialsSlider) {
    testimonialsSlider.setAttribute("data-testimonials-container", "true");
  }
}

async function loadCookies(origin: URL): Promise<string> {
  const raw = await fs.readFile(STATE_PATH, "utf8");
  const parsed = JSON.parse(raw) as {
    cookies?: Array<{
      name: string;
      value: string;
      domain: string;
    }>;
  };
  const cookies = parsed.cookies?.filter((c) => {
    if (!c.domain) return false;
    if (c.domain === "localhost") return true;
    if (c.domain.startsWith(".")) {
      const dom = c.domain.replace(/^\./, "");
      return origin.hostname.endsWith(dom);
    }
    return origin.hostname === c.domain;
  });

  if (!cookies || cookies.length === 0) {
    throw new Error(
      "Nenhum cookie encontrado em e2e/.auth/state.json. Faça login e salve o estado antes de rodar."
    );
  }

  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
}

async function callFlashApi(body: NepfyAIRequestData): Promise<{
  proposal: FlashProposal;
  projectValidUntil?: string;
  mainColor?: string;
  buttonConfig?: ButtonConfig;
  projectId?: string;
  projectUrl?: string;
}> {
  const origin = new URL("http://localhost:3000");
  const cookieHeader = await loadCookies(origin);

  const resp = await fetch(new URL("/api/projects/ai-generate", origin), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(
      `Falha na API (${resp.status}): ${text.slice(0, 500)}`
    );
  }

  const payload = (await resp.json()) as FlashApiResponse;
  const data = payload.data as Partial<FlashWorkflowResult> & {
    projectId?: string;
    projectUrl?: string;
    mainColor?: string;
    pageData?: { mainColor?: string };
    buttonConfig?: ButtonConfig;
  };

  const proposal =
    data?.proposal ||
    (data as any)?.data?.proposal ||
    (data as any)?.proposalData?.proposal;

  if (!proposal) {
    throw new Error("Resposta da API não trouxe proposal para o template Flash.");
  }

  return {
    proposal,
    projectValidUntil: body.validUntil,
    mainColor: data.mainColor || data.pageData?.mainColor || body.mainColor,
    buttonConfig: data.buttonConfig || body.buttonConfig,
    projectId: data.projectId,
    projectUrl: data.projectUrl,
  };
}

function toProposalData(
  proposal: FlashProposal,
  req: NepfyAIRequestData
): ProposalData {
  return {
    introduction: {
      userName: proposal.introduction.userName,
      email: proposal.introduction.email,
      buttonTitle: proposal.introduction.buttonText,
      title: proposal.introduction.title,
      validity: req.validUntil || new Date().toISOString(),
      subtitle: proposal.introduction.subtitle,
      hideSubtitle: false,
      services:
        proposal.introduction.services?.map((service, index) => ({
          id: crypto.randomUUID(),
          serviceName: service,
          hideService: false,
          sortOrder: index,
        })) || [],
    },
    aboutUs: {
      hideSection: false,
      title: proposal.aboutUs.title,
      hideTitle: false,
      supportText: proposal.aboutUs.supportText,
      hideSupportText: false,
      subtitle: proposal.aboutUs.subtitle,
      hideSubtitle: false,
    },
    team: {
      hideSection: false,
      title: proposal.team.title,
      hideTitle: false,
      members:
        proposal.team.members?.map((member, index) => ({
          name: member.name,
          role: member.role,
          image: member.image,
          hideMember: false,
          sortOrder: member.sortOrder ?? index,
        })) || [],
    },
    expertise: {
      hideSection: false,
      title: proposal.specialties.title,
      hideTitle: false,
      topics:
        proposal.specialties.topics?.map((topic, index) => ({
          title: topic.title,
          description: topic.description,
          icon: topic.icon,
          hideTopic: false,
          sortOrder: index,
        })) || [],
    },
    steps: {
      hideSection: false,
      title: proposal.steps.title,
      hideTitle: false,
      introduction: proposal.steps.introduction,
      hideIntroduction: false,
      topics:
        proposal.steps.topics?.map((topic, index) => ({
          title: topic.title,
          description: topic.description,
          hideTopic: false,
          sortOrder: index,
        })) || [],
      marquee:
        proposal.steps.marquee?.map((item, index) => ({
          text: item.text,
          hideItem: item.hideItem ?? false,
          sortOrder: item.sortOrder ?? index,
        })) || [],
    },
    clients: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items: [],
    },
    testimonials: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      items:
        proposal.testimonials.items?.map((item, index) => ({
          name: item.name,
          role: item.role,
          testimonial: item.testimonial,
          image: item.photo ?? undefined,
          hideTestimonial: false,
          sortOrder: item.sortOrder ?? index,
        })) || [],
    },
    investment: {
      hideSection: false,
      title: proposal.investment.title,
      projectScope: proposal.scope.content,
      hideProjectScope: false,
      hideTitle: false,
    },
    results: {
      hideSection: false,
      title: proposal.results.title,
      hideTitle: false,
      items:
        proposal.results.items?.map((item) => ({
          id: item.id,
          client: item.client,
          instagram: item.instagram,
          investment: item.investment,
          roi: item.roi,
          photo: item.photo,
          hidePhoto: false,
          sortOrder: item.sortOrder,
        })) || [],
    },
    deliverables: {
      hideSection: false,
      title: "Entregáveis",
      hideTitle: false,
      items:
        proposal.investment.deliverables?.map((deliverable, index) => ({
          title: deliverable.title,
          description: deliverable.description,
          hideItem: false,
          sortOrder: index,
        })) || [],
    },
    plans: {
      hideSection: false,
      title: undefined,
      hideTitle: false,
      plansItems:
        proposal.investment.plansItems?.map((plan, index) => ({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          value: plan.value,
          planPeriod: plan.planPeriod,
          recommended: plan.recommended,
          buttonTitle: plan.buttonTitle,
          hideTitleField: false,
          hideDescription: false,
          hidePrice: false,
          hidePlanPeriod: false,
          hideButtonTitle: false,
          sortOrder: plan.sortOrder ?? index,
          includedItems:
            plan.includedItems?.map((item, itemIndex) => ({
              id: item.id,
              description: item.description,
              hideItem: false,
              sortOrder: item.sortOrder ?? itemIndex,
            })) || [],
        })) || [],
    },
    termsConditions: {
      hideSection: false,
      title: proposal.terms?.[0]?.title || "Termos e Condições",
      hideTitle: false,
      items:
        proposal.terms?.map((term, index) => ({
          term: `${term.title}: ${term.description}`,
          hideTerm: false,
          sortOrder: index,
        })) || [],
    },
    faq: {
      hideSection: false,
      title: "Perguntas Frequentes",
      hideTitle: false,
      items:
        proposal.faq?.map((item, index) => ({
          question: item.question,
          answer: item.answer,
          hideQuestion: false,
          sortOrder: index,
        })) || [],
    },
    footer: {
      hideSection: false,
      callToAction: proposal.footer.callToAction,
      disclaimer: proposal.footer.disclaimer,
      hideCallToAction: false,
      hideDisclaimer: false,
      marquee: [],
    },
  };
}

async function waitForInjection(
  dom: JSDOM,
  payload: {
    proposalData: ProposalData;
    projectValidUntil?: string;
    mainColor?: string;
    buttonConfig?: ButtonConfig;
    userEmail?: string;
  }
): Promise<void> {
  const { window } = dom;
  // Force visualize mode (JSDOM window type is not the DOM Window; loosen typing)
  (window as unknown as { parent: unknown }).parent = window as unknown;

  const injector = (window as unknown as {
    flashInjectData?: (data: typeof payload) => void;
  }).flashInjectData;

  if (!injector) {
    throw new Error("flashInjectData não encontrado no contexto JSDOM.");
  }

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Timeout aguardando injeção do template Flash")),
      2000
    );
    window.addEventListener("flash-template-data-injected", () => {
      clearTimeout(timeout);
      resolve();
    });
    injector(payload);
  });
}

function runDomAssertions(
  dom: JSDOM,
  proposalData: ProposalData
): Assertion[] {
  const doc = dom.window.document;
  const assertions: Assertion[] = [];

  const servicesCount =
    doc.getElementById("introduction-services")?.children.length || 0;
  assertions.push({
    name: "Hero title preenchido",
    ok: pickText(doc.getElementById("introduction-title")).length > 0,
  });
  assertions.push({
    name: "Hero subtitle preenchido",
    ok: pickText(doc.getElementById("introduction-subtitle")).length > 0,
  });
  assertions.push({
    name: "Hero serviços renderizados",
    ok: servicesCount === (proposalData.introduction?.services?.length || 0),
    detail: `${servicesCount}/${proposalData.introduction?.services?.length || 0}`,
  });

  assertions.push({
    name: "About título preenchido",
    ok: pickText(doc.getElementById("aboutus-title")).length > 0,
  });

  const teamCount =
    doc
      .getElementById("team-members-list")
      ?.querySelectorAll(".team_card").length || 0;
  assertions.push({
    name: "Time renderizado",
    ok: teamCount === (proposalData.team?.members?.length || 0),
    detail: `${teamCount}/${proposalData.team?.members?.length || 0}`,
  });

  const expertiseCount =
    doc
      .getElementById("expertise-topics-list")
      ?.querySelectorAll(".expertise_card").length || 0;
  assertions.push({
    name: "Expertise renderizada",
    ok: expertiseCount === (proposalData.expertise?.topics?.length || 0),
    detail: `${expertiseCount}/${proposalData.expertise?.topics?.length || 0}`,
  });

  const resultsCount =
    doc
      .getElementById("results-list")
      ?.querySelectorAll(".proof_card").length || 0;
  assertions.push({
    name: "Resultados renderizados",
    ok: resultsCount === (proposalData.results?.items?.length || 0),
    detail: `${resultsCount}/${proposalData.results?.items?.length || 0}`,
  });

  const testimonialsCount =
    doc.querySelectorAll(
      '[data-testimonials-container="true"] .mask.w-slider-mask .w-slide'
    ).length || 0;
  assertions.push({
    name: "Depoimentos renderizados",
    ok: testimonialsCount === (proposalData.testimonials?.items?.length || 0),
    detail: `${testimonialsCount}/${proposalData.testimonials?.items?.length || 0}`,
  });

  const stepsCount =
    doc.getElementById("steps-list")?.querySelectorAll(".accordion_item")
      .length || 0;
  assertions.push({
    name: "Processo renderizado",
    ok: stepsCount === (proposalData.steps?.topics?.length || 0),
    detail: `${stepsCount}/${proposalData.steps?.topics?.length || 0}`,
  });

  const plansCount =
    doc.getElementById("plans-plansItems")?.querySelectorAll(".pricing_card")
      .length || 0;
  assertions.push({
    name: "Planos renderizados",
    ok: plansCount === (proposalData.plans?.plansItems?.length || 0),
    detail: `${plansCount}/${proposalData.plans?.plansItems?.length || 0}`,
  });

  const faqCount =
    doc.getElementById("faq-items")?.querySelectorAll(".accordion_item")
      .length || 0;
  assertions.push({
    name: "FAQ renderizado",
    ok: faqCount === (proposalData.faq?.items?.length || 0),
    detail: `${faqCount}/${proposalData.faq?.items?.length || 0}`,
  });

  assertions.push({
    name: "Footer CTA preenchido",
    ok: pickText(doc.getElementById("footer-callToAction")).length > 0,
  });
  assertions.push({
    name: "Footer disclaimer preenchido",
    ok: pickText(doc.getElementById("footer-disclaimer")).length > 0,
  });

  return assertions;
}

async function main() {
  const requestPayload: NepfyAIRequestData = {
    userName: "Teste DOM Flash",
    userEmail: "teste.e2e@nepfy.com",
    selectedService: "agencias",
    clientName: "Clínica Vanguarda",
    projectName: "Branding e Go-to-Market",
    projectDescription:
      "Proposta completa de branding, identidade e materiais digitais para lançamento e consolidação da clínica.",
    clientDescription:
      "Clínica premium que deseja fortalecer percepção de valor, autoridade e captação de pacientes com posicionamento moderno.",
    companyInfo:
      "Estúdio especializado em branding e design estratégico para saúde, unindo narrativa, visual e experiência integrada.",
    selectedPlans: 3,
    planDetails: "",
    includeTerms: true,
    includeFAQ: true,
    templateType: "flash",
    mainColor: "#4F21A1",
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
      buttonConfig: {
      buttonTitle: "Iniciar Projeto",
      buttonWhereToOpen: undefined,
      buttonHref: undefined,
      buttonPhone: undefined,
    },
  };

  console.log("➡️  Gerando proposta Flash via API...");
  const {
    proposal,
    projectValidUntil,
    mainColor,
    buttonConfig,
    projectId,
    projectUrl,
  } = await callFlashApi(requestPayload);
  console.log(
    `✅ Proposta obtida (projectId=${projectId ?? "n/a"}, slug=${projectUrl ?? "n/a"})`
  );

  const proposalData = toProposalData(proposal, requestPayload);

  const rawHtml = await fs.readFile(FLASH_HTML, "utf8");
  const sanitizedHtml = rawHtml.replace(/<script[\s\S]*?<\/script>/gi, "");
  const dom = new JSDOM(sanitizedHtml, {
    runScripts: "dangerously",
    pretendToBeVisual: true,
    url: "http://localhost:3000/template-flash-visualize/",
  });

  attachVisualizeIds(dom.window.document);

  const injectorCode = await fs.readFile(FLASH_INJECTOR, "utf8");
  dom.window.eval(injectorCode);

  await waitForInjection(dom, {
    proposalData,
    projectValidUntil: projectValidUntil || requestPayload.validUntil,
    mainColor: mainColor || requestPayload.mainColor,
    buttonConfig: buttonConfig || requestPayload.buttonConfig,
    userEmail: requestPayload.userEmail,
  });

  const assertions = runDomAssertions(dom, proposalData);

  console.log("\n📊 Validação DOM Flash");
  assertions.forEach((a) =>
    console.log(`${a.ok ? "✅" : "❌"} ${a.name}${a.detail ? ` — ${a.detail}` : ""}`)
  );

  const passed = assertions.filter((a) => a.ok).length;
  const total = assertions.length;
  console.log(`\nResultado: ${passed}/${total} checks passaram`);

  if (passed !== total) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("❌ Erro na validação DOM Flash:", err);
  process.exit(1);
});

