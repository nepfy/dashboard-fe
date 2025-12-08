import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { MinimalProposal } from "../templates/minimal/minimal-template";
import { BaseThemeData } from "./base-theme";
import { generateJSONRetryPrompt } from "./json-utils";
import { MOAService } from "../services/moa-service";
import {
  templateConfigManager,
  type TemplateConfig,
} from "../config/template-prompts";

function ensureCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export interface MinimalThemeData extends BaseThemeData {
  templateType: "minimal";
  mainColor: string;
}

type MinimalSectionKey = keyof TemplateConfig["sections"];

// Helper function to generate realistic client names based on project context
function generateDefaultClientNames(projectDescription: string, companyInfo?: string): Array<{
  id: string;
  name: string;
  logo: null;
  sortOrder: number;
}> {
  // Default generic names as fallback
  const genericNames = [
    "TECH INNOVATIONS",
    "DIGITAL SOLUTIONS",
    "CREATIVE STUDIO",
    "BRAND MAKERS",
    "GROWTH PARTNERS",
    "SMART AGENCY",
    "NEXUS GROUP",
    "VELOCITY BRANDS",
    "PRIME VENTURES",
    "FUSION LABS",
    "APEX DIGITAL",
    "QUANTUM CO"
  ];

  // Context-aware name patterns
  const contextPatterns: Record<string, string[]> = {
    tech: [
      "TECH SYSTEMS",
      "DIGITAL CORE",
      "CODE FACTORY",
      "CLOUD VENTURES",
      "DATA SOLUTIONS",
      "AI INNOVATIONS",
      "SMART TECH",
      "BYTE WORKS",
      "LOGIC GROUP",
      "PIXEL LABS",
      "CYBER BRANDS",
      "TECH VISION"
    ],
    marketing: [
      "BRAND STUDIO",
      "MEDIA MAKERS",
      "CREATIVE HUB",
      "GROWTH AGENCY",
      "CONTENT PLUS",
      "SOCIAL BRANDS",
      "VIRAL LABS",
      "AD GENIUS",
      "MARKET PULSE",
      "ENGAGE CO",
      "BUZZ CREATORS",
      "REACH DIGITAL"
    ],
    design: [
      "DESIGN STUDIO",
      "CREATIVE MINDS",
      "PIXEL PERFECT",
      "ARTISAN CO",
      "VISION LABS",
      "AESTHETIC BRANDS",
      "FORMA DESIGN",
      "STUDIO NOVA",
      "COLOR WORKS",
      "SHAPE MAKERS",
      "CONCEPT ART",
      "DESIGN FORGE"
    ],
    consultoria: [
      "STRATEGY GROUP",
      "CONSULTING PLUS",
      "ADVISORY LABS",
      "EXPERT MINDS",
      "INSIGHT CO",
      "WISDOM PARTNERS",
      "PRIME CONSULT",
      "GUIDANCE PRO",
      "CATALYST GROUP",
      "NEXUS ADVISORS",
      "VISION CONSULT",
      "GROWTH EXPERTS"
    ],
    saude: [
      "HEALTH SYSTEMS",
      "CARE SOLUTIONS",
      "WELLNESS GROUP",
      "MEDICAL PLUS",
      "VITAL CARE",
      "CLINIC BRANDS",
      "HEALTH LABS",
      "CARE VISION",
      "MEDICAL TECH",
      "WELLNESS PRO",
      "LIFE CARE",
      "HEALTH PARTNERS"
    ]
  };

  // Try to detect context from project description and company info
  const combinedText = `${projectDescription} ${companyInfo || ""}`.toLowerCase();
  
  let selectedNames = genericNames;
  
  if (combinedText.includes("tech") || combinedText.includes("software") || combinedText.includes("app") || combinedText.includes("desenvolvimento")) {
    selectedNames = contextPatterns.tech;
  } else if (combinedText.includes("marketing") || combinedText.includes("mídia") || combinedText.includes("social") || combinedText.includes("conteúdo")) {
    selectedNames = contextPatterns.marketing;
  } else if (combinedText.includes("design") || combinedText.includes("criativ") || combinedText.includes("visual") || combinedText.includes("gráfico")) {
    selectedNames = contextPatterns.design;
  } else if (combinedText.includes("consult") || combinedText.includes("estratégia") || combinedText.includes("assessoria")) {
    selectedNames = contextPatterns.consultoria;
  } else if (combinedText.includes("saúde") || combinedText.includes("médico") || combinedText.includes("clínica") || combinedText.includes("hospital")) {
    selectedNames = contextPatterns.saude;
  }

  return selectedNames.map((name, index) => ({
    id: crypto.randomUUID(),
    name,
    logo: null,
    sortOrder: index,
  }));
}

export class MinimalTheme {
  private moaService: MOAService;
  private templateConfig: TemplateConfig;
  private static readonly VALIDATION_MAX_ATTEMPTS = 5;

  constructor(private together: Together) {
    this.moaService = new MOAService(together, {
      referenceModels: [
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "deepseek-ai/DeepSeek-V3.1",
        "Qwen/Qwen2.5-7B-Instruct-Turbo",
      ],
      aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      maxRetries: 2,
      temperature: 0.7,
      maxTokens: 2000,
    });

    const config = templateConfigManager.getConfig("minimal");
    if (!config) {
      throw new Error("Minimal template configuration not found");
    }
    this.templateConfig = config;
  }

  private getSectionConfig(sectionKey: MinimalSectionKey) {
    return this.templateConfig.sections[sectionKey];
  }

  private getSectionPrompt(
    sectionKey: MinimalSectionKey,
    data: MinimalThemeData
  ): string {
    const sectionConfig = this.getSectionConfig(sectionKey);
    if (!sectionConfig || !("prompt" in sectionConfig)) {
      throw new Error(`Prompt for section ${sectionKey} not found in config`);
    }

    const promptTemplate = sectionConfig.prompt as string;
    return this.applyPromptReplacements(promptTemplate, data);
  }

  private getSectionExpectedFormat(
    sectionKey: MinimalSectionKey
  ): string | null {
    const sectionConfig = this.getSectionConfig(sectionKey);
    if (sectionConfig && "expectedFormat" in sectionConfig) {
      return sectionConfig.expectedFormat as string;
    }
    return null;
  }

  private applyPromptReplacements(
    prompt: string,
    data: MinimalThemeData
  ): string {
    const replacements: Record<string, string> = {
      clientName: data.clientName ?? "",
      projectName: data.projectName ?? "",
      projectDescription: data.projectDescription ?? "",
      companyInfo: data.companyInfo ?? "",
      clientDescription: data.clientDescription ?? "",
      selectedPlans: Array.isArray(data.selectedPlans)
        ? data.selectedPlans.join(", ")
        : data.selectedPlans !== undefined
          ? String(data.selectedPlans)
          : "",
      userName: data.userName ?? "",
      userEmail: data.userEmail ?? "",
    };

    return Object.entries(replacements).reduce((acc, [key, value]) => {
      const pattern = new RegExp(`\\{${key}\\}`, "g");
      return acc.replace(pattern, value);
    }, prompt);
  }

  private ensureMaxLength(value: string, max: number, label: string): string {
    ensureCondition(
      value.length <= max,
      `${label} must contain at most ${max} characters (received ${value.length} characters)`
    );
    return value;
  }

  private ensureArrayLength<T>(
    list: T[] | undefined,
    expected: number,
    label: string
  ) {
    ensureCondition(
      Array.isArray(list) && list.length === expected,
      `${label} must contain exactly ${expected} items`
    );
  }

  private ensureArrayRange<T>(
    list: T[] | undefined,
    min: number,
    max: number,
    label: string
  ) {
    ensureCondition(
      Array.isArray(list) && list.length >= min && list.length <= max,
      `${label} must contain between ${min} and ${max} items`
    );
  }

  /**
   * Use AI to rephrase text to fit within character limit while maintaining meaning.
   * Nunca trunca: se a reescrita não cumprir o limite, lança erro.
   */
  private async rephraseToFit(
    text: string,
    maxLength: number,
    context: string = ""
  ): Promise<string> {
    if (text.length <= maxLength) {
      return text;
    }

    console.log(`🔄 Rephrasing ${context} (${text.length} -> ${maxLength} chars)`);

    const attempt = await this.rephraseOnce(text, maxLength, context, false);
    if (attempt.length <= maxLength) {
      return attempt;
    }

    console.warn(
      `⚠️  Rephrase for ${context} ainda excedeu (${attempt.length}/${maxLength}), tentando versão estrita`
    );

    const strictAttempt = await this.rephraseOnce(text, maxLength, context, true);
    if (strictAttempt.length > maxLength) {
      throw new Error(
        `Rephrase não respeitou limite para ${context}: ${strictAttempt.length}/${maxLength}`
      );
    }

    return strictAttempt;
  }

  private async rephraseOnce(
    text: string,
    maxLength: number,
    context: string,
    strict: boolean
  ): Promise<string> {
    const extraRule = strict
      ? "\nREGRAS EXTRAS (STRICT): conte os caracteres e reescreva até ficar DENTRO do limite. A resposta final DEVE ter no máximo o limite informado."
      : "";

    const prompt = `Reescreva o seguinte texto mantendo EXATAMENTE o mesmo significado, mas com no máximo ${maxLength} caracteres.${extraRule}

TEXTO ORIGINAL (${text.length} caracteres):
"${text}"

REGRAS IMPORTANTES:
- Máximo de ${maxLength} caracteres (incluindo espaços e pontuação)
- Manter o mesmo tom e significado
- Ser conciso mas completo
- Não usar reticências (...)
- Responder APENAS com o texto reformulado, sem aspas ou explicações

TEXTO REFORMULADO:`;

    try {
      const stream = await this.together.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um especialista em copywriting que reescreve textos mantendo o significado original, respeitando limites de caracteres sem truncar."
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: Math.max(64, maxLength * 2),
        stream: true,
      });

      let rephrased = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        rephrased += content;
      }

      rephrased = rephrased.trim().replace(/^["']|["']$/g, "");
      console.log(`✅ Rephrased${strict ? " (strict)" : ""} successfully: ${rephrased.length} chars`);
      return rephrased;
    } catch (error) {
      console.error(`❌ Error rephrasing ${context}:`, error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private async addTriggerKeyword(
    text: string,
    maxLength: number,
    context: string = "trigger"
  ): Promise<string> {
    const forbidden = /autoridade\s*e\s*prova\s*social/i;
    const triggerSynonyms = [
      "credibilidade validada",
      "cases comprovados",
      "confiança construída",
      "retorno mensurável",
      "urgência limitada",
      "transformação real"
    ];

    const hasForbidden = forbidden.test(text);
    const hasAnyTrigger =
      triggerSynonyms.some((kw) => text.toLowerCase().includes(kw.toLowerCase())) ||
      /(autoridade|prova\s*social|escassez|transformação|lucro)/i.test(text);

    if (hasAnyTrigger && !hasForbidden) {
      return this.ensureMaxLength(text, maxLength, "trigger-check");
    }

    // Escolhe uma variação curta que caiba
    for (const kw of triggerSynonyms) {
      const variant = `${text} — ${kw}`;
      if (variant.length <= maxLength) {
        return this.ensureMaxLength(variant, maxLength, "trigger-appended");
      }
    }

    // Rephrase forçada com sinônimos
    try {
      const rephrased = await this.rephraseToFit(
        `${text} com credibilidade validada e casos reais`,
        maxLength,
        `${context}-trigger`
      );
      if (rephrased.length <= maxLength && !forbidden.test(rephrased)) {
        return this.ensureMaxLength(rephrased, maxLength, "trigger-rephrase");
      }
    } catch (error) {
      console.warn(`⚠️  Falha ao rephrase gatilho para ${context}:`, error);
    }

    // Se ainda exceder, mantém original dentro do limite (sem gatilho literal)
    console.warn(
      `⚠️  Não foi possível adicionar gatilho mental sem exceder ${maxLength} chars para ${context}. Mantendo texto original sem gatilho.`
    );
    return this.ensureMaxLength(text.replace(forbidden, "").trim(), maxLength, "trigger-fallback");
  }

  /**
   * Rephrase deliverables/included items to avoid generic terms and ensure concreteness.
   */
  private async makeDeliverableSpecific(
    text: string,
    maxLength: number,
    context: string
  ): Promise<string> {
    const forbidden = ["benefício", "beneficio", "incluído", "incluso", "pacote"];
    const lower = text.toLowerCase();
    const hasForbidden = forbidden.some((w) => lower.includes(w));

    if (!hasForbidden && text.length <= maxLength) {
      return text;
    }

    const prompt = `Reescreva o item como uma entrega concreta, sem usar palavras genéricas como "benefício", "pacote" ou "incluído". Use verbo no infinitivo ou substantivo claro. Máximo ${maxLength} caracteres.

Texto original:
"${text}"

Regras:
- Evite repetição de termos genéricos.
- Seja específico e tangível (ex: "Implementar SEO técnico", "Setup de automação de leads", "Dashboard de métricas semanais").
- Não use "benefício", "incluído", "pacote".
- Responda apenas com o texto final.`;

    const rewritten = await this.rephraseToFit(prompt, maxLength, `${context}-deliverable`);
    return rewritten;
  }

  private getDeliverablePool(selectedService: string): string[] {
    if (selectedService === "marketing-digital") {
      return [
        "Otimizar SEO técnico e Core Web Vitals",
        "Setup de tags e pixels (GA4, Meta, LinkedIn)",
        "Pesquisa de palavras-chave e intenção de busca",
        "Landing page de conversão com teste A/B inicial",
        "Configurar automação de leads (CRM + e-mail)",
        "Copywriting orientado a conversão",
        "Fluxos de nurturing e scoring de leads",
        "Remarketing multicanal com públicos quentes",
        "Dashboard semanal (GA4 + Ads + CRM)",
        "Monitoramento e ajustes semanais de campanhas",
      ];
    }

    return [
      "Planejamento detalhado de escopo e cronograma",
      "Implementação técnica principal do projeto",
      "Teste de qualidade e correções",
      "Entrega com documentação resumida",
      "Suporte inicial pós-entrega",
      "Treinamento rápido para uso/operacionalização",
    ];
  }

  private normalizeDeliverable(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/["“”]/g, "")
      .trim();
  }

  private stripTriggerNoise(text: string): string {
    return text
      .replace(/—\s*autoridade.*$/i, "")
      .replace(/\(\s*autoridade.*\)/gi, "")
      .replace(/autoridade\s+e\s+prova\s+social/gi, "")
      .replace(/autoridade/gi, "")
      .replace(/prova\s+social/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  private async validateIntroductionSection(
    section: MinimalProposal["introduction"]
  ): Promise<void> {
    // Ensure hero title is sufficiently long and not over limit
    const minHero = 90;
    const maxHero = 100;
    if (section.title.length < minHero || section.title.length > maxHero) {
      const target = Math.min(Math.max(section.title.length, minHero + 10), maxHero);
      console.warn(
        `⚠️  Rephrasing introduction.title (${section.title.length} -> target ~${target} chars)`
      );
      const rephrased = await this.rephraseToFit(section.title, target, "introduction.title");
      // If still short, pad with a short clause to reach minHero
      section.title =
        rephrased.length >= minHero
          ? rephrased
          : `${rephrased} com experiências digitais premium`;
    }
    section.title = this.ensureMaxLength(section.title, maxHero, "introduction.title");
    if (section.title.length < minHero) {
      const paddedTitle = `${section.title}. Impulsionamos resultados com autoridade, prova social, escassez e lucro mensurável agora.`;
      section.title = await this.rephraseToFit(
        paddedTitle,
        maxHero,
        "introduction.title (padded for min length)"
      );
      if (section.title.length < minHero) {
        const fallbackTitle =
          "Impulsione resultados com autoridade, prova social, escassez e lucro mensurável agora";
        section.title = await this.rephraseToFit(
          fallbackTitle,
          maxHero,
          "introduction.title (fallback min length)"
        );
        if (section.title.length < minHero) {
          const fixedTitle =
            "Impulsione sua presença digital forte com autoridade, prova social e lucro mensurável agora";
          section.title = fixedTitle;
          section.title = this.ensureMaxLength(section.title, maxHero, "introduction.title (fixed fallback)");
          if (section.title.length < minHero) {
            throw new Error(
              `introduction.title permaneceu abaixo do mínimo (${section.title.length}/${minHero})`
            );
          }
        }
      }
    }
    section.title = await this.addTriggerKeyword(section.title, maxHero, "introduction.title");
    if (section.services) {
      this.ensureArrayRange(section.services, 1, 5, "introduction.services");
      for (let index = 0; index < section.services.length; index++) {
        const service = section.services[index];
        // Auto-correct service name if exceeds limit
        if (service.serviceName.length > 50) {
          console.warn(`⚠️  Auto-correcting introduction.services[${index}].serviceName (${service.serviceName.length} -> 50 chars)`);
          service.serviceName = await this.rephraseToFit(service.serviceName, 50, `introduction.services[${index}].serviceName`);
        }
        service.serviceName = this.ensureMaxLength(
          service.serviceName,
          50,
          `introduction.services[${index}].serviceName`
        );
      }
    }
  }

  private async validateAboutUsSection(section: MinimalProposal["aboutUs"]): Promise<void> {
    const maxTitle = 140;
    if (section.title.length > maxTitle) {
      console.warn(`⚠️  Auto-correcting aboutUs.title (${section.title.length} -> ${maxTitle} chars)`);
      section.title = await this.rephraseToFit(section.title, maxTitle, "aboutUs.title");
    }
    section.title = this.ensureMaxLength(section.title, maxTitle, "aboutUs.title");
    // Evitamos reforçar gatilho aqui; mantemos apenas no título principal da introdução

    if (section.subtitle) {
      const maxSubtitle = 95;
      if (section.subtitle.length > maxSubtitle) {
        console.warn(
          `⚠️  Auto-correcting aboutUs.subtitle (${section.subtitle.length} -> ${maxSubtitle} chars)`
        );
        section.subtitle = await this.rephraseToFit(
          section.subtitle,
          maxSubtitle,
          "aboutUs.subtitle"
        );
      }
      section.subtitle = this.ensureMaxLength(section.subtitle, maxSubtitle, "aboutUs.subtitle");
    }

    if (section.marqueeText) {
      const maxMarquee = 60;
      if (section.marqueeText.length > maxMarquee) {
        console.warn(
          `⚠️  Auto-correcting aboutUs.marqueeText (${section.marqueeText.length} -> ${maxMarquee} chars)`
        );
        section.marqueeText = await this.rephraseToFit(
          section.marqueeText,
          maxMarquee,
          "aboutUs.marqueeText"
        );
      }
      section.marqueeText = this.ensureMaxLength(
        section.marqueeText,
        maxMarquee,
        "aboutUs.marqueeText"
      );
    }

    if (section.items) {
      this.ensureArrayRange(section.items, 2, 2, "aboutUs.items");
      for (let index = 0; index < section.items.length; index++) {
        const item = section.items[index];
        if (item.caption && item.caption.length > 125) {
          console.warn(
            `⚠️  Auto-correcting aboutUs.items[${index}].caption (${item.caption.length} -> 125 chars)`
          );
          item.caption = await this.rephraseToFit(
            item.caption,
            125,
            `aboutUs.items[${index}].caption`
          );
        }
        if (item.caption) {
          item.caption = this.ensureMaxLength(
            item.caption,
            125,
            `aboutUs.items[${index}].caption`
          );
        }
      }
    }
  }

  private async validateTeamSection(section: MinimalProposal["team"]): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title.length > 100) {
      console.warn(`⚠️  Auto-correcting team.title (${section.title.length} -> 100 chars)`);
      section.title = await this.rephraseToFit(section.title, 100, "team.title");
    }
    section.title = this.ensureMaxLength(section.title, 100, "team.title");
    
    if (section.members) {
      this.ensureArrayRange(section.members, 1, 6, "team.members");
      for (let index = 0; index < section.members.length; index++) {
        const member = section.members[index];
        // Auto-correct member name if exceeds limit
        if (member.name.length > 50) {
          console.warn(`⚠️  Auto-correcting team.members[${index}].name (${member.name.length} -> 50 chars)`);
          member.name = await this.rephraseToFit(member.name, 50, `team.members[${index}].name`);
        }
        // Auto-correct member role if exceeds limit
        if (member.role.length > 50) {
          console.warn(`⚠️  Auto-correcting team.members[${index}].role (${member.role.length} -> 50 chars)`);
          member.role = await this.rephraseToFit(member.role, 50, `team.members[${index}].role`);
        }
        member.name = this.ensureMaxLength(member.name, 50, `team.members[${index}].name`);
        member.role = this.ensureMaxLength(member.role, 50, `team.members[${index}].role`);
      }
    }
  }

  private async validateExpertiseSection(
    section: MinimalProposal["expertise"]
  ): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title.length > 130) {
      console.warn(`⚠️  Auto-correcting expertise.title (${section.title.length} -> 130 chars)`);
      section.title = await this.rephraseToFit(section.title, 130, "expertise.title");
    }
    section.title = this.ensureMaxLength(section.title, 130, "expertise.title");
    // Evitamos gatilho aqui para não repetir em excesso
    if (section.subtitle) {
      const maxSubtitle = 30;
      if (section.subtitle.length > maxSubtitle) {
        console.warn(
          `⚠️  Auto-correcting expertise.subtitle (${section.subtitle.length} -> ${maxSubtitle} chars)`
        );
        section.subtitle = await this.rephraseToFit(
          section.subtitle,
          maxSubtitle,
          "expertise.subtitle"
        );
      }
      section.subtitle = this.ensureMaxLength(section.subtitle, maxSubtitle, "expertise.subtitle");
    }
    
    if (section.topics) {
      this.ensureArrayRange(section.topics, 3, 9, "expertise.topics");
      for (let index = 0; index < section.topics.length; index++) {
        const topic = section.topics[index];
        // Auto-correct topic title if exceeds limit
        if (topic.title.length > 30) {
          console.warn(`⚠️  Auto-correcting expertise.topics[${index}].title (${topic.title.length} -> 30 chars)`);
          topic.title = await this.rephraseToFit(topic.title, 30, `expertise.topics[${index}].title`);
        }
        // Auto-correct topic description if exceeds limit
        if (topic.description.length > 130) {
          console.warn(`⚠️  Auto-correcting expertise.topics[${index}].description (${topic.description.length} -> 130 chars)`);
          const rephrased = await this.rephraseToFit(
            topic.description,
            130,
            `expertise.topics[${index}].description`
          );
          topic.description = rephrased;
        }
        
        // Ensure minimum length for descriptions
        if (topic.description.length < 90) {
          console.warn(`⚠️  Description too short (${topic.description.length} chars), padding to minimum`);
          const fixedDescription =
            "Entregamos soluções completas com autoridade, prova social e lucro mensurável para gerar impacto real no seu projeto digital.";
          topic.description = await this.rephraseToFit(
            fixedDescription,
            125,
            `expertise.topics[${index}].description (fixed min)`
          );
          if (topic.description.length < 90) {
            throw new Error(
              `expertise.topics[${index}].description ficou abaixo do mínimo (${topic.description.length}/90)`
            );
          }
        }
        
        topic.title = this.ensureMaxLength(
          topic.title,
          30,
          `expertise.topics[${index}].title`
        );
        topic.description = this.ensureMaxLength(
          topic.description,
          130,
          `expertise.topics[${index}].description`
        );
      }
    }
  }

  private validateResultsSection(section: MinimalProposal["results"]): void {
    section.title = this.ensureMaxLength(section.title, 100, "results.title");
    if (section.items) {
      this.ensureArrayRange(section.items, 1, 4, "results.items");
      section.items.forEach((item, index) => {
        item.client = this.ensureMaxLength(item.client, 50, `results.items[${index}].client`);
        if (item.instagram) {
          item.instagram = this.ensureMaxLength(
            item.instagram,
            50,
            `results.items[${index}].instagram`
          );
        }
      });
    }
  }

  private validateTestimonialsSection(
    section: MinimalProposal["testimonials"]
  ): void {
    if (section.items) {
      this.ensureArrayRange(section.items, 2, 4, "testimonials.items");
      section.items.forEach((item, index) => {
        item.name = this.ensureMaxLength(
          item.name,
          50,
          `testimonials.items[${index}].name`
        );
        item.role = this.ensureMaxLength(
          item.role,
          50,
          `testimonials.items[${index}].role`
        );
        item.testimonial = this.ensureMaxLength(
          item.testimonial,
          400,
          `testimonials.items[${index}].testimonial`
        );
      });
    }
  }

  private async validateClientsSection(section: MinimalProposal["clients"]): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title && section.title.length > 300) {
      console.warn(`⚠️  Auto-correcting clients.title (${section.title.length} -> 300 chars)`);
      section.title = await this.rephraseToFit(section.title, 300, "clients.title");
    }
    if (section.title && section.title.length < 150) {
      console.warn(
        `⚠️  clients.title too short (${section.title.length} chars), rephrasing to reach >=150`
      );
      section.title = await this.rephraseToFit(section.title, 170, "clients.title");
    }
    if (section.title) {
      section.title = this.ensureMaxLength(section.title, 300, "clients.title");
      // Evitamos gatilho no título de clients para não repetir
    }
    
    // Auto-correct description if exceeds limit
    if (section.description && section.description.length > 180) {
      console.warn(`⚠️  Auto-correcting clients.description (${section.description.length} -> 180 chars)`);
      section.description = await this.rephraseToFit(section.description, 180, "clients.description");
    }
    if (section.description) {
      section.description = this.ensureMaxLength(section.description, 180, "clients.description");
    }
    
    // Auto-correct paragraphs if exceed limit
    if (section.paragraphs) {
      for (let index = 0; index < section.paragraphs.length; index++) {
        const paragraph = section.paragraphs[index];
        const maxLength = index === 0 ? 400 : 350; // paragraph 1: 400, paragraph 2: 350
        if (paragraph.length > maxLength) {
          console.warn(`⚠️  Auto-correcting clients.paragraphs[${index}] (${paragraph.length} -> ${maxLength} chars)`);
          section.paragraphs[index] = await this.rephraseToFit(paragraph, maxLength, `clients.paragraphs[${index}]`);
        }
        const minLength = index === 0 ? 200 : 150;
        if (paragraph.length < minLength) {
          console.warn(
            `⚠️  clients.paragraphs[${index}] too short (${paragraph.length} chars), padding to ${minLength}+`
          );
          const padded = `${paragraph} Reforçamos autoridade, prova social e transformação para impacto imediato.`;
          section.paragraphs[index] = await this.rephraseToFit(
            padded,
            maxLength,
            `clients.paragraphs[${index}] (min-length)`
          );
          if (section.paragraphs[index].length < minLength) {
            throw new Error(
              `clients.paragraphs[${index}] ficou abaixo do mínimo (${section.paragraphs[index].length}/${minLength})`
            );
          }
        }
      }
      section.paragraphs = section.paragraphs.map((paragraph, index) => {
        const maxLength = index === 0 ? 400 : 350;
        return this.ensureMaxLength(paragraph, maxLength, `clients.paragraphs[${index}]`);
      });
    }
    
    // Validate items
    if (section.items) {
      this.ensureArrayRange(section.items, 6, 12, "clients.items");
      for (let index = 0; index < section.items.length; index++) {
        const client = section.items[index];
        if (client.name.length > 50) {
          console.warn(`⚠️  Auto-correcting clients.items[${index}].name (${client.name.length} -> 50 chars)`);
          client.name = await this.rephraseToFit(client.name, 50, `clients.items[${index}].name`);
        }
        client.name = this.ensureMaxLength(client.name, 50, `clients.items[${index}].name`);
      }
    }
  }

  private async validateStepsSection(section: MinimalProposal["steps"]): Promise<void> {
    if (section.topics) {
      this.ensureArrayRange(section.topics, 3, 6, "steps.topics");
      for (let index = 0; index < section.topics.length; index++) {
        const topic = section.topics[index];
        topic.title = this.ensureMaxLength(topic.title, 50, `steps.topics[${index}].title`);
        if (topic.description.length > 400) {
          console.warn(
            `⚠️  Auto-correcting steps.topics[${index}].description (${topic.description.length} -> 400 chars)`
          );
          topic.description = await this.rephraseToFit(
            topic.description,
            400,
            `steps.topics[${index}].description`
          );
        }
        topic.description = this.ensureMaxLength(
          topic.description,
          400,
          `steps.topics[${index}].description`
        );
        // Não adicionamos gatilho em passos para evitar repetição
      }
    }
  }

  private parseCurrencyValue(
    value: string | number | null | undefined
  ): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") {
      ensureCondition(!Number.isNaN(value), "Invalid currency value");
      return value;
    }

    const cleaned = value.replace(/[R$\s]/gi, "");

    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    let normalized = cleaned;

    if (hasComma) {
      normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
    } else if (hasDot) {
      const dotAsDecimal = /\.\d{1,2}$/.test(cleaned);
      normalized = dotAsDecimal ? cleaned : cleaned.replace(/\./g, "");
    }

    const numeric = Number(normalized);
    ensureCondition(!Number.isNaN(numeric), "Invalid currency value");

    return numeric;
  }

  private async validateInvestmentSection(
    section: MinimalProposal["investment"]
  ): Promise<void> {
    section.title = this.ensureMaxLength(section.title, 150, "investment.title");
    // Não adicionamos gatilho aqui para evitar repetição
    if (section.projectScope) {
      section.projectScope = this.ensureMaxLength(
        section.projectScope,
        200,
        "investment.projectScope"
      );
    }
  }

  private async validatePlansSection(
    section: MinimalProposal["plans"],
    expectedPlans: number,
    selectedService: string
  ): Promise<void> {
    const planCount = section.plansItems?.length ?? 0;
    ensureCondition(
      planCount > 0 && planCount <= 3,
      "plans.plansItems must contain between 1 and 3 plans"
    );

    const normalizedExpectedPlans =
      expectedPlans > 0
        ? Math.min(Math.max(expectedPlans, 1), 3)
        : expectedPlans;

    if (normalizedExpectedPlans > 0) {
      ensureCondition(
        planCount === normalizedExpectedPlans,
        "plans.plansItems must match the selectedPlans amount (bounded between 1 and 3)"
      );
    }

    const recommendedPlans =
      section.plansItems?.filter((plan) => plan.recommended === true) ?? [];
    
    // Para 1 plano: pode ter 0 ou 1 recommended
    // Para 2 planos: deve ter 1 recommended (o mais caro)
    // Para 3 planos: deve ter 1 recommended (o do meio)
    if (planCount === 1) {
      ensureCondition(
        recommendedPlans.length <= 1,
        "Only one plan can be marked as recommended"
      );
    } else {
      ensureCondition(
        recommendedPlans.length === 1,
        "Exactly one plan must be marked as recommended"
      );
    }

    // Validação específica por quantidade de planos
    if (planCount === 2 && recommendedPlans.length === 1) {
      // Para 2 planos: o recommended deve ser o mais caro
      const highestValuePlan = section.plansItems?.reduce((prev, current) => {
        const prevValue = this.parseCurrencyValue(prev.value);
        const currentValue = this.parseCurrencyValue(current.value);
        return currentValue > prevValue ? current : prev;
      });
      
      if (highestValuePlan) {
        ensureCondition(
          highestValuePlan.recommended || false,
          "For 2 plans, the highest value plan must be marked as recommended"
        );
      }
    } else if (planCount === 3 && recommendedPlans.length === 1) {
      // Para 3 planos: o recommended deve ser o do meio (sortOrder 1)
      const sortedPlans = [...(section.plansItems || [])].sort((a, b) => {
        const aValue = this.parseCurrencyValue(a.value);
        const bValue = this.parseCurrencyValue(b.value);
        return aValue - bValue;
      });
      
      if (sortedPlans.length === 3) {
        const middlePlan = sortedPlans[1]; // Índice 1 = plano do meio
        ensureCondition(
          middlePlan.recommended || false,
          "For 3 plans, the middle-priced plan must be marked as recommended"
        );
      }
    }

    if (section.plansItems) {
      for (let index = 0; index < section.plansItems.length; index++) {
        const plan = section.plansItems[index];
        plan.title = this.ensureMaxLength(plan.title, 30, `plans.plansItems[${index}].title`);
        plan.description = this.ensureMaxLength(
          plan.description,
          120,
          `plans.plansItems[${index}].description`
        );

        if (plan.includedItems) {
          this.ensureArrayRange(
            plan.includedItems,
            3,
            9,
            `plans.plansItems[${index}].includedItems`
          );
          const seen = new Set<string>();
          const pool = this.getDeliverablePool(selectedService);
          let poolCursor = 0;

          for (let itemIndex = 0; itemIndex < plan.includedItems.length; itemIndex++) {
            const item = plan.includedItems[itemIndex];
            let desc = item.description || "";
            // se for genérico ou conter "benefício" ou "focus", descartamos o original
            const lower = desc.toLowerCase();
            const isGeneric =
              !desc.trim() ||
              lower.includes("benefício") ||
              lower.includes("beneficio") ||
              lower.includes("incluído") ||
              lower.includes("included") ||
              lower.includes("focus") ||
              lower.includes("variar foco");

            if (isGeneric) {
              while (poolCursor < pool.length && seen.has(this.normalizeDeliverable(pool[poolCursor]))) {
                poolCursor++;
              }
              const fallback =
                poolCursor < pool.length
                  ? pool[poolCursor]
                  : this.getFallbackDeliverable(selectedService, index, itemIndex);
              desc = fallback;
              poolCursor++;
            }

            desc = this.ensureMaxLength(
              desc,
              60,
              `plans.plansItems[${index}].includedItems[${itemIndex}].description`
            );
            desc = await this.makeDeliverableSpecific(
              desc,
              60,
              `plans.plansItems[${index}].includedItems[${itemIndex}]`
            );

            let norm = this.normalizeDeliverable(desc);
            if (seen.has(norm)) {
              // Escolher do pool uma entrega ainda não usada
              while (poolCursor < pool.length && seen.has(this.normalizeDeliverable(pool[poolCursor]))) {
                poolCursor++;
              }
              const fallback =
                poolCursor < pool.length
                  ? pool[poolCursor]
                  : this.getFallbackDeliverable(selectedService, index, itemIndex);
              desc = await this.rephraseToFit(
                fallback,
                60,
                `plans.plansItems[${index}].includedItems[${itemIndex}].fallback`
              );
              norm = this.normalizeDeliverable(desc);
              poolCursor++;
            }

            seen.add(norm);
            item.description = desc;
          }
        }
      }
    }
  }

  private getFallbackDeliverable(selectedService: string, planIndex: number, itemIndex: number): string {
    const marketing = [
      "Otimizar SEO técnico e Core Web Vitals",
      "Setup de tags e pixels (GA4, Meta, LinkedIn)",
      "Landing page de conversão com A/B test inicial",
      "Configurar automação de leads (CRM + e-mail)",
      "Dashboard semanal (GA4 + Ads + CRM)",
      "Copywriting orientado a conversão",
      "Fluxos de nurturing e scoring de leads",
      "Remarketing multicanal com públicos quentes",
      "Monitoramento e ajustes semanais de campanhas",
    ];

    const generic = [
      "Planejamento detalhado de escopo e cronograma",
      "Implementação técnica principal do projeto",
      "Teste de qualidade e correções",
      "Entrega com documentação resumida",
      "Suporte inicial pós-entrega",
    ];

    const pool = selectedService === "marketing-digital" ? marketing : generic;
    const idx = (planIndex * 5 + itemIndex) % pool.length;
    return pool[idx];
  }

  private async validateFAQSection(section: MinimalProposal["faq"]): Promise<void> {
    if (section.items) {
      this.ensureArrayRange(section.items, 10, 10, "faq.items");
      const seenQuestions = new Set<string>();
      const seenAnswers = new Set<string>();
      for (let index = 0; index < section.items.length; index++) {
        const item = section.items[index];
        if (item.question.length > 85) {
          console.warn(
            `⚠️  Auto-correcting faq.items[${index}].question (${item.question.length} -> 85 chars)`
          );
          item.question = await this.rephraseToFit(item.question, 85, `faq.items[${index}].question`);
        }
        if (item.answer.length > 310) {
          console.warn(
            `⚠️  Auto-correcting faq.items[${index}].answer (${item.answer.length} -> 310 chars)`
          );
          item.answer = await this.rephraseToFit(item.answer, 310, `faq.items[${index}].answer`);
        }
        item.question = this.ensureMaxLength(item.question, 85, `faq.items[${index}].question`);
        item.answer = this.ensureMaxLength(item.answer, 310, `faq.items[${index}].answer`);

        // Remove ruído de gatilho repetitivo
        item.question = this.stripTriggerNoise(item.question);
        item.answer = this.stripTriggerNoise(item.answer);

        // Deduplicação simples
        const normQ = this.normalizeDeliverable(item.question);
        const normA = this.normalizeDeliverable(item.answer);
        if (seenQuestions.has(normQ)) {
          item.question = await this.rephraseToFit(
            `${item.question} (reescreva sem repetir perguntas anteriores, mantenha o sentido)`,
            85,
            `faq.items[${index}].question.dedupe`
          );
        }
        if (seenAnswers.has(normA)) {
          item.answer = await this.rephraseToFit(
            `${item.answer} (reescreva sem repetir respostas anteriores, mantenha o sentido)`,
            310,
            `faq.items[${index}].answer.dedupe`
          );
        }

        // Evitamos gatilho em FAQ para não repetir em excesso

        seenQuestions.add(this.normalizeDeliverable(item.question));
        seenAnswers.add(this.normalizeDeliverable(item.answer));
      }
    }
  }

  private async validateFooterSection(section: MinimalProposal["footer"]): Promise<void> {
    if (section.callToAction) {
      section.callToAction = this.ensureMaxLength(section.callToAction, 100, "footer.callToAction");
      section.callToAction = this.stripTriggerNoise(section.callToAction);
    }
    if (section.disclaimer) {
      section.disclaimer = this.ensureMaxLength(section.disclaimer, 300, "footer.disclaimer");
      section.disclaimer = this.stripTriggerNoise(section.disclaimer);
    }
    if (section.email) {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      ensureCondition(
        emailRegex.test(section.email),
        "footer.email must be a valid email address"
      );
    }
    if (section.phone) {
      // Basic phone validation (Brazilian format - more flexible)
      const cleanedPhone = section.phone
        .replace(/\s/g, "")
        .replace(/[()]/g, "");
      const phoneRegex = /^\+?55\d{10,11}$|^\d{10,11}$/;
      ensureCondition(
        phoneRegex.test(cleanedPhone) || cleanedPhone.length >= 10,
        "footer.phone must be a valid phone number"
      );
    }
  }

  private async validateProposal(
    proposal: MinimalProposal,
    expectedPlans: number,
    selectedService: string
  ): Promise<void> {
    await this.validateIntroductionSection(proposal.introduction);
    await this.validateAboutUsSection(proposal.aboutUs);
    await this.validateTeamSection(proposal.team);
    await this.validateExpertiseSection(proposal.expertise);
    this.validateResultsSection(proposal.results);
    this.validateTestimonialsSection(proposal.testimonials);
    await this.validateClientsSection(proposal.clients);
    await this.validateStepsSection(proposal.steps);
    await this.validateInvestmentSection(proposal.investment);
    await this.validatePlansSection(proposal.plans, expectedPlans, selectedService);
    await this.validateFAQSection(proposal.faq);
    await this.validateFooterSection(proposal.footer);
  }

  private async runLLMWithJSONRetry<T>(
    userPrompt: string,
    systemPrompt: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Minimal template: Attempt ${attempt}/${maxRetries}`);

        const stream = await this.together.chat.completions.create({
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: "json_object" },
          stream: false,
        });

        const responseText =
          stream.choices?.[0]?.message?.content?.trim() || "{}";

        if (!responseText || responseText === "{}") {
          throw new Error("Empty JSON response from LLM");
        }

        const parsed = JSON.parse(responseText);
        return parsed;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(
          `Minimal template: Attempt ${attempt} failed:`,
          lastError.message
        );

        if (attempt < maxRetries) {
          userPrompt = generateJSONRetryPrompt(
            userPrompt,
            lastError.message,
            String(attempt)
          );
        }
      }
    }

    throw new Error(
      `Minimal template: Failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  async execute(data: MinimalThemeData): Promise<MinimalProposal> {
    console.log("Debug - Minimal theme execute called with:", data);

    const agent = await getAgentByServiceAndTemplate(
      data.selectedService,
      data.templateType
    );

    if (!agent) {
      throw new Error(
        `No agent found for service: ${data.selectedService} and template: ${data.templateType}`
      );
    }

    console.log("Debug - Agent found:", agent.name);

    try {
      const proposal = await this.generateMinimalProposal(data, agent);
      console.log("Debug - Minimal proposal generated successfully");
      return proposal;
    } catch (error) {
      console.error("Minimal Template Workflow Error:", error);
      throw error;
    }
  }

  private async generateMinimalProposal(
    data: MinimalThemeData,
    agent: BaseAgentConfig
  ): Promise<MinimalProposal> {
    console.log("Generating Minimal proposal sections...");

    const sections = await this.generateAllSections(data, agent);

    const proposal: MinimalProposal = {
      introduction: sections.introduction,
      aboutUs: sections.aboutUs,
      team: sections.team,
      expertise: sections.expertise,
      results: sections.results,
      testimonials: sections.testimonials,
      clients: sections.clients || {
        hideSection: false,
        title: "",
        items: [],
        paragraphs: [],
      },
      steps: sections.steps,
      escope: sections.escope,
      investment: sections.investment,
      plans: sections.plans,
      faq: sections.faq,
      footer: sections.footer,
    };

    // Validate the complete proposal
    const expectedPlans =
      typeof data.selectedPlans === "number" ? data.selectedPlans : 1;
    await this.validateProposal(proposal, expectedPlans, data.selectedService);

    return proposal;
  }

  private async generateAllSections(
    data: MinimalThemeData,
    agent: BaseAgentConfig
  ): Promise<MinimalProposal> {
    const sections: Partial<MinimalProposal> = {};

    // Generate introduction
    const introPrompt = this.getSectionPrompt("introduction", data);
    const introSystemPrompt = this.buildSystemPrompt(agent, "introduction");
    const introResult = await this.runLLMWithJSONRetry<{
      clientName?: string;
      userName?: string;
      email?: string;
      logo?: string | null;
      hideLogo?: boolean;
      clientPhoto?: string | null;
      hideClientPhoto?: boolean;
      title?: string;
      description?: string;
      hideDescription?: boolean;
      services?: Array<{
        id?: string;
        serviceName: string;
        sortOrder?: number;
      }>;
    }>(introPrompt, introSystemPrompt);
    
    // Log AI result for debugging
    console.log("🔍 DEBUG - Introduction AI Result:", JSON.stringify({
      hasClientName: !!introResult.clientName,
      clientName: introResult.clientName,
      hasTitle: !!introResult.title,
      title: introResult.title,
      hasDescription: !!introResult.description,
      servicesCount: introResult.services?.length || 0,
    }));

    // Default services for marquee if AI doesn't generate any
    const defaultServices = [
      { id: crypto.randomUUID(), serviceName: "Imagem 1", sortOrder: 0 },
      { id: crypto.randomUUID(), serviceName: "Imagem 2", sortOrder: 1 },
      { id: crypto.randomUUID(), serviceName: "Imagem 3", sortOrder: 2 },
      { id: crypto.randomUUID(), serviceName: "Imagem 4", sortOrder: 3 },
    ];

    sections.introduction = {
      clientName: introResult.clientName || data.clientName || "",
      userName: introResult.userName || data.userName || "",
      email: introResult.email || data.userEmail || "",
      title: introResult.title || "Proposta de Serviços Profissionais",
      services: (introResult.services && introResult.services.length > 0
        ? introResult.services
        : defaultServices
      ).map((service, index) => ({
        id: service.id || crypto.randomUUID(),
        serviceName: service.serviceName || `Imagem ${index + 1}`,
        sortOrder: service.sortOrder ?? index,
      })),
    };
    
    console.log("✅ DEBUG - Introduction Section Generated:", {
      clientName: sections.introduction?.clientName,
      title: sections.introduction?.title,
      titleLength: sections.introduction?.title?.length ?? 0,
      titleOK: (sections.introduction?.title?.length ?? 0) <= 120 ? "✓" : "✗ EXCEEDED!",
    });

    // Generate aboutUs
    const aboutUsPrompt = this.getSectionPrompt("aboutUs", data);
    const aboutUsSystemPrompt = this.buildSystemPrompt(agent, "aboutUs");
    const aboutUsResult = await this.runLLMWithJSONRetry<{
      hideSection?: boolean;
      title?: string;
      subtitle?: string;
      description?: string;
      paragraphs?: string[];
      marqueeText?: string;
      hideMarquee?: boolean;
      items?: Array<{
        id?: string;
        image?: string | null;
        caption?: string;
        hideImage?: boolean;
        hideCaption?: boolean;
        sortOrder?: number;
      }>;
    }>(aboutUsPrompt, aboutUsSystemPrompt);
    sections.aboutUs = {
      hideSection: aboutUsResult.hideSection ?? false,
      title: aboutUsResult.title || "Sobre nós",
      subtitle: aboutUsResult.subtitle || "",
      hideSubtitle: !aboutUsResult.subtitle,
    };
    
    console.log("✅ DEBUG - AboutUs Section Generated:", {
      title: sections.aboutUs.title,
      subtitle: sections.aboutUs.subtitle,
      subtitleLength: sections.aboutUs.subtitle?.length ?? 0,
      subtitleOK: (sections.aboutUs.subtitle?.length ?? 0) <= 250 ? "✓" : "✗ EXCEEDED!",
      hasSubtitle: !!sections.aboutUs.subtitle,
      hideSubtitle: sections.aboutUs.hideSubtitle,
    });

    // Generate team
    const teamPrompt = this.getSectionPrompt("team", data);
    const teamSystemPrompt = this.buildSystemPrompt(agent, "team");
    sections.team = await this.runLLMWithJSONRetry(
      teamPrompt,
      teamSystemPrompt
    );

    // Generate expertise
    const expertisePrompt = this.getSectionPrompt("specialties", data);
    const expertiseSystemPrompt = this.buildSystemPrompt(agent, "specialties");
    const expertiseResult = await this.runLLMWithJSONRetry<{
      hideSection?: boolean;
      subtitle?: string;
      hideSubtitle?: boolean;
      title?: string;
      topics?: Array<{
        id?: string;
        icon?: string;
        title?: string;
        description?: string;
        hideIcon?: boolean;
        hideTitle?: boolean;
        hideDescription?: boolean;
        sortOrder?: number;
      }>;
    }>(expertisePrompt, expertiseSystemPrompt);
    
    // Generate default topics if AI didn't generate enough
    const defaultTopics = Array.from({ length: 9 }, (_, i) => ({
      id: crypto.randomUUID(),
      icon: "DiamondIcon",
      title: `Área ${i + 1}`,
      description: "Descrição da área de atuação",
      sortOrder: i,
    }));

    // Log AI result for debugging
    console.log("🔍 DEBUG - Expertise AI Result:", JSON.stringify({
      topicsCount: expertiseResult.topics?.length || 0,
      hasSubtitle: !!expertiseResult.subtitle,
      hasTitle: !!expertiseResult.title,
    }));

    sections.expertise = {
      hideSection: expertiseResult.hideSection ?? false,
      subtitle: expertiseResult.subtitle,
      hideSubtitle: expertiseResult.hideSubtitle,
      title: expertiseResult.title || "Áreas de atuação",
      topics: (expertiseResult.topics && expertiseResult.topics.length > 0
        ? expertiseResult.topics
        : defaultTopics
      ).map((topic, index) => ({
        id: topic.id || crypto.randomUUID(),
        icon: topic.icon || "DiamondIcon",
        title: topic.title || `Área ${index + 1}`,
        description: topic.description || "Descrição da área de atuação",
        hideIcon: false,
        hideTitleField: false,
        hideDescription: false,
        sortOrder: topic.sortOrder ?? index,
      })),
    };
    
    console.log("✅ DEBUG - Expertise Section Generated:", {
      topicsCount: sections.expertise.topics?.length || 0,
      firstTopic: sections.expertise.topics?.[0]?.title,
      title: sections.expertise.title,
    });

    // Generate results section
    const resultsPrompt = `Com base nas informações do projeto, gere 2-3 cases de sucesso relevantes para o setor de ${agent.sector}.

Informações do projeto:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}

Para cada case, forneça:
- Nome do cliente (empresa/pessoa real desse setor)
- Investimento aproximado (valor realista)
- ROI ou resultado alcançado (porcentagem ou métrica)
- Instagram (opcional, formato @usuario)

Formato JSON esperado:
{
  "title": "Resultados Comprovados",
  "items": [
    {
      "client": "Nome do Cliente",
      "investment": "R$ X.XXX",
      "roi": "+X%",
      "instagram": "@usuario"
    }
  ]
}`;

    const resultsSystemPrompt = `Você é um especialista em ${agent.sector} gerando cases de sucesso realistas e inspiradores.
    
REGRAS:
- Gere 2-3 cases de sucesso
- Use nomes de empresas/clientes realistas do setor
- Investimentos devem ser proporcionais ao projeto
- ROI deve ser realista (50%-300%)
- Instagram é opcional`;

    const resultsResult = await this.runLLMWithJSONRetry<{
      title: string;
      items: Array<{
        client: string;
        investment: string;
        roi: string;
        instagram?: string;
      }>;
    }>(resultsPrompt, resultsSystemPrompt);

    sections.results = {
      hideSection: false,
      title: resultsResult.title,
      items: resultsResult.items.map((item, index) => ({
        id: crypto.randomUUID(),
        client: item.client,
        investment: item.investment,
        roi: item.roi,
        photo: "",
        instagram: item.instagram || "",
        hidePhoto: false,
        hideItem: false,
        sortOrder: index,
      })),
    };

    // Generate testimonials section
    const testimonialsPrompt = `Gere 2-3 depoimentos realistas de clientes satisfeitos para o setor de ${agent.sector}.

Informações do projeto:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Empresa: ${data.companyInfo}

Para cada depoimento:
- Nome completo do cliente
- Cargo e empresa (máx 50 caracteres)
- Depoimento autêntico (MÁXIMO 350 caracteres) destacando resultados específicos

Formato JSON:
{
  "items": [
    {
      "name": "Nome Completo",
      "role": "Cargo, Empresa",
      "testimonial": "Depoimento com MÁXIMO 350 caracteres..."
    }
  ]
}`;

    const testimonialsSystemPrompt = `Você é um especialista em ${agent.sector} criando depoimentos autênticos e convincentes.

REGRAS OBRIGATÓRIAS:
- 2-3 depoimentos
- Nomes brasileiros realistas
- role: máximo 50 caracteres
- testimonial: MÁXIMO 350 caracteres (CONTE OS CARACTERES ANTES DE GERAR!)
- Depoimentos específicos com resultados mensuráveis
- Tom profissional mas humanizado
- Seja conciso e direto`;

    const testimonialsResult = await this.runLLMWithJSONRetry<{
      items: Array<{
        name: string;
        role: string;
        testimonial: string;
      }>;
    }>(testimonialsPrompt, testimonialsSystemPrompt);

    sections.testimonials = {
      hideSection: false,
      items: testimonialsResult.items.map((item, index) => ({
        id: crypto.randomUUID(),
        name: item.name,
        role: item.role,
        testimonial: item.testimonial,
        photo: "",
        hidePhoto: false,
        sortOrder: index,
      })),
    };

    // Generate clients/brands section
    console.log("🚀 Starting clients section generation...");
    const clientsPrompt = this.getSectionPrompt("clients", data);
    const clientsSystemPrompt = this.buildSystemPrompt(agent, "clients");
    
    console.log("📝 Clients Prompt Preview:", clientsPrompt.substring(0, 200) + "...");
    
    const clientsResult = await this.runLLMWithJSONRetry<{
      hideSection?: boolean;
      title?: string;
      hideTitle?: boolean;
      paragraphs?: string[];
      items?: Array<{
        id?: string;
        name: string;
        logo?: string | null;
        sortOrder?: number;
      }>;
    }>(clientsPrompt, clientsSystemPrompt);

    // Generate default client items if not enough were generated
    const defaultClientItems = generateDefaultClientNames(
      data.projectDescription || "",
      data.companyInfo
    );

    // Log AI result for debugging
    console.log("🔍 DEBUG - Clients AI Result:", {
      hideSection: clientsResult.hideSection,
      itemsCount: clientsResult.items?.length || 0,
      hasTitle: !!clientsResult.title,
      paragraphsCount: clientsResult.paragraphs?.length || 0,
      firstItemName: clientsResult.items?.[0]?.name,
      title: clientsResult.title,
      willUseFallback: !clientsResult.items || clientsResult.items.length !== 12,
    });

    // Validate that we have exactly 12 items, otherwise use defaults
    const clientItems = (
      clientsResult.items && clientsResult.items.length === 12
        ? clientsResult.items
        : defaultClientItems
    ).map((item, index) => ({
      id: item.id || crypto.randomUUID(),
      name: item.name || `CLIENTE ${index + 1}`,
      logo: item.logo || undefined,
      sortOrder: item.sortOrder ?? index,
    }));
    
    console.log("✅ Clients Items Final Count:", clientItems.length);

    console.log("🔍 DEBUG - Clients Result from AI:", {
      hasTitle: !!clientsResult.title,
      title: clientsResult.title,
      hasParagraphs: !!clientsResult.paragraphs,
      paragraphsIsArray: Array.isArray(clientsResult.paragraphs),
      paragraphsLength: clientsResult.paragraphs?.length || 0,
      paragraph1: clientsResult.paragraphs?.[0],
      paragraph2: clientsResult.paragraphs?.[1],
    });

    // Ensure we have valid paragraphs, otherwise generate fallback
    let finalParagraphs = clientsResult.paragraphs;
    if (!finalParagraphs || finalParagraphs.length < 2 || !finalParagraphs[0] || !finalParagraphs[1]) {
      console.warn("⚠️ Paragraphs not properly generated by AI, using professional fallback");
      finalParagraphs = [
        "Reconhecemos uma lacuna na indústria criativa—pequenos negócios frequentemente lutam para encontrar soluções de alta qualidade, porém acessíveis. Trabalhamos com empresas que valorizam estratégia, qualidade e resultados concretos, estabelecendo parcerias verdadeiras que geram impacto mensurável em seus objetivos de negócio.",
        "Nossa filosofia é simples: design e estratégia devem trabalhar juntos para criar experiências que facilitam a vida das pessoas e fortalecem marcas. Com essa visão, fornecemos serviços completos para ser seu parceiro estratégico em cada etapa do projeto, combinando expertise técnica com sensibilidade criativa."
      ];
    }

    sections.clients = {
      // ALWAYS show clients section - NEVER hide
      hideSection: false,
      
      title: clientsResult.title || "Reconhecemos uma lacuna na indústria criativa—pequenos negócios frequentemente lutam para encontrar soluções de design de alta qualidade, porém acessíveis. É por isso que existimos.",
      hideTitle: clientsResult.hideTitle ?? false,
      
      paragraphs: finalParagraphs,
      
      items: clientItems,
    };
    
    console.log("✅ DEBUG - Clients Section Generated:", {
      itemsCount: sections.clients.items?.length || 0,
      firstItem: sections.clients.items?.[0]?.name,
      title: sections.clients.title,
      paragraphsCount: sections.clients.paragraphs?.length || 0,
      paragraph1Length: sections.clients.paragraphs?.[0]?.length || 0,
      paragraph2Length: sections.clients.paragraphs?.[1]?.length || 0,
      paragraph1Preview: sections.clients.paragraphs?.[0]?.substring(0, 50),
      paragraph2Preview: sections.clients.paragraphs?.[1]?.substring(0, 50),
      hasGeneratedContent: !!clientsResult.title && clientsResult.paragraphs && clientsResult.paragraphs.length > 0,
    });

    // Generate steps
    const stepsPrompt = this.getSectionPrompt("steps", data);
    const stepsSystemPrompt = this.buildSystemPrompt(agent, "steps");
    const stepsResult = await this.runLLMWithJSONRetry<
      MinimalProposal["steps"]
    >(stepsPrompt, stepsSystemPrompt);
    sections.steps = stepsResult;

    // Escope (static section)
    sections.escope = {
      hideSection: false,
    };

    // Generate investment
    const investmentPrompt = this.getSectionPrompt("investment", data);
    const investmentSystemPrompt = this.buildSystemPrompt(agent, "investment");
    sections.investment = await this.runLLMWithJSONRetry(
      investmentPrompt,
      investmentSystemPrompt
    );

    // Generate Plans
    const plansPrompt = this.getSectionPrompt("plans", data);
    const plansSystemPrompt = this.buildSystemPrompt(agent, "plans");
    const plansResult = await this.runLLMWithJSONRetry<{
      hideSection?: boolean;
      subtitle?: string;
      hideSubtitle?: boolean;
      title?: string;
      plansItems?: Array<{
        id?: string;
        title?: string;
        description?: string;
        value?: number;
        planPeriod?: string;
        recommended?: boolean;
        buttonTitle?: string;
        hideTitleField?: boolean;
        hideDescription?: boolean;
        hidePrice?: boolean;
        hidePlanPeriod?: boolean;
        hideButtonTitle?: boolean;
        hideItem?: boolean;
        sortOrder?: number;
        includedItems?: Array<{
          id?: string;
          description?: string;
          hideItem?: boolean;
          sortOrder?: number;
        }>;
      }>;
    }>(plansPrompt, plansSystemPrompt);

    // Generate default plans if not enough were generated
    const expectedPlanCount = typeof data.selectedPlans === "number" ? data.selectedPlans : 3;
    const defaultPlans = Array.from({ length: expectedPlanCount }, (_, i) => ({
      id: crypto.randomUUID(),
      title: `Plano ${i + 1}`,
      description: "Descrição do plano",
      value: 1000 * (i + 1),
      planPeriod: "mensal",
      recommended: i === 1, // Middle plan is recommended
      sortOrder: i,
      includedItems: Array.from({ length: 5 }, (_, j) => ({
        id: crypto.randomUUID(),
        description: `Benefício incluído ${j + 1}`,
        sortOrder: j,
      })),
    }));

    // Map AI result to MinimalProposal format
    sections.plans = {
      hideSection: plansResult.hideSection ?? false,
      plansItems: (plansResult.plansItems && plansResult.plansItems.length > 0
        ? plansResult.plansItems
        : defaultPlans
      ).map((plan, index) => ({
        id: plan.id || crypto.randomUUID(),
        title: plan.title || `Plano ${index + 1}`,
        description: plan.description || "Descrição do plano",
        value: plan.value || 0,
        planPeriod: plan.planPeriod || "mensal",
        recommended: plan.recommended ?? false,
        buttonTitle: "Contratar",
        buttonWhereToOpen: "_blank",
        buttonHref: "#",
        buttonPhone: "",
        hideTitleField: false,
        hideDescription: false,
        hidePrice: false,
        hidePlanPeriod: false,
        hideButtonTitle: false,
        sortOrder: plan.sortOrder ?? index,
        includedItems: Array.from({ length: 5 }, (_, j) => ({
          id: crypto.randomUUID(),
          description: `Benefício ${j + 1}`,
          sortOrder: j,
        })),
      })),
    };

    // Generate FAQ
    const faqPrompt = this.getSectionPrompt("faq", data);
    const faqSystemPrompt = this.buildSystemPrompt(agent, "faq");
    const faqResult = await this.runLLMWithJSONRetry<MinimalProposal["faq"]>(
      faqPrompt,
      faqSystemPrompt
    );
    
    // Rephrase FAQ items if they exceed limits (nunca truncar)
    if (faqResult.items) {
      faqResult.items = await Promise.all(
        faqResult.items.map(async (item, index) => {
          const adjusted = { ...item };

          if (adjusted.question.length > 85) {
            console.warn(
              `FAQ question [${index}] exceeded 85 chars (${adjusted.question.length}), rephrasing...`
            );
            adjusted.question = await this.rephraseToFit(
              adjusted.question,
              85,
              `faq.items[${index}].question`
            );
          }

          if (adjusted.answer.length > 310) {
            console.warn(
              `FAQ answer [${index}] exceeded 310 chars (${adjusted.answer.length}), rephrasing...`
            );
            adjusted.answer = await this.rephraseToFit(
              adjusted.answer,
              310,
              `faq.items[${index}].answer`
            );
          }

          return adjusted;
        })
      );
    }
    
    sections.faq = faqResult;

    // Generate Footer
    const footerConfig = this.getSectionConfig("footer");
    if (footerConfig && "prompt" in footerConfig) {
      const footerPrompt = this.getSectionPrompt("footer", data);
      const footerSystemPrompt = this.buildSystemPrompt(agent, "footer");
      const footerResult = await this.runLLMWithJSONRetry<{
        callToAction?: string;
        disclaimer?: string;
        email?: string;
        phone?: string;
        marqueeText?: string;
        hideMarquee?: boolean;
      }>(footerPrompt, footerSystemPrompt);

      sections.footer = {
        callToAction: footerResult.callToAction || "Vamos construir algo incrível juntos?",
        disclaimer: footerResult.disclaimer || "Proposta válida por 15 dias. Valores e prazos podem variar conforme escopo.",
        email: footerResult.email || data.userEmail || "contato@empresa.com.br",
        phone: footerResult.phone || "+55 11 99999-9999",
        hideCallToAction: false,
        hideDisclaimer: false,
      };
    } else {
      // Fallback to config values
      const config = templateConfigManager.getConfig("minimal");
      sections.footer = {
        callToAction:
          config?.sections?.footer?.callToAction ||
          "Vamos transformar sua ideia em realidade?",
        disclaimer:
          config?.sections?.footer?.disclaimer ||
          "Esta proposta é válida pelo período indicado.",
        email: data.userEmail || "contato@empresa.com.br",
        phone: "+55 11 99999-9999",
        hideCallToAction: false,
        hideDisclaimer: false,
      };
    }

    return sections as MinimalProposal;
  }

  private buildSystemPrompt(
    agent: BaseAgentConfig,
    sectionKey: MinimalSectionKey
  ): string {
    const expectedFormat = this.getSectionExpectedFormat(sectionKey);
    const formatInstruction = expectedFormat
      ? `\n\nExpected JSON format:\n${expectedFormat}`
      : "";

    return `${agent.systemPrompt}

You are generating content for the "${sectionKey}" section of a Minimal template proposal.

Key principles for Minimal template:
- Clean, focused content
- Direct and professional tone
- Emphasis on clarity and simplicity
- Avoid excessive decoration
- Focus on essential information${formatInstruction}

IMPORTANT: You must respond ONLY with valid JSON matching the expected format.`;
  }
}

// Export workflow result type
export interface MinimalWorkflowResult {
  proposal: MinimalProposal;
  status: "success" | "error";
  error?: string;
}

// Workflow class
export class MinimalTemplateWorkflow {
  async execute(data: MinimalThemeData): Promise<MinimalWorkflowResult> {
    try {
      const together = new Together({
        apiKey: process.env.TOGETHER_API_KEY,
      });

      const theme = new MinimalTheme(together);
      const proposal = await theme.execute(data);

      return {
        proposal,
        status: "success",
      };
    } catch (error) {
      console.error("MinimalTemplateWorkflow error:", error);
      return {
        proposal: {} as MinimalProposal,
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}

// Type exports
export type { MinimalProposal } from "../templates/minimal/minimal-template";
