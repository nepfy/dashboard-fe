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

  private ensureMaxLength(value: string, max: number, label: string) {
    if (value.length > max) {
      console.error(`❌ VALIDATION FAILED: ${label}`);
      console.error(`   Expected: max ${max} chars`);
      console.error(`   Received: ${value.length} chars (${value.length - max} chars over limit)`);
      console.error(`   Content: "${value}"`);
    }
    ensureCondition(
      value.length <= max,
      `${label} must contain at most ${max} characters (received ${value.length} characters: "${value.substring(0, 100)}...")`
    );
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
   * Use AI to rephrase text to fit within character limit while maintaining meaning
   */
  private async rephraseToFit(text: string, maxLength: number, context: string = ""): Promise<string> {
    if (text.length <= maxLength) {
      return text;
    }

    console.log(`🔄 Rephrasing ${context} (${text.length} -> ${maxLength} chars)`);

    try {
      const prompt = `Reescreva o seguinte texto mantendo EXATAMENTE o mesmo significado, mas com no máximo ${maxLength} caracteres.

TEXTO ORIGINAL (${text.length} caracteres):
"${text}"

REGRAS IMPORTANTES:
- Máximo de ${maxLength} caracteres (incluindo espaços e pontuação)
- Manter o mesmo tom e significado
- Ser conciso mas completo
- Não usar reticências (...)
- Responder APENAS com o texto reformulado, sem aspas ou explicações

TEXTO REFORMULADO:`;

      const stream = await this.together.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em copywriting que reescreve textos mantendo o significado original mas de forma mais concisa."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: maxLength * 2,
        stream: true,
      });

      let rephrased = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        rephrased += content;
      }

      rephrased = rephrased.trim().replace(/^["']|["']$/g, "");

      // Se ainda exceder, usar trim como fallback
      if (rephrased.length > maxLength) {
        console.warn(`⚠️  Rephrase ainda excedeu limite, usando trim como fallback`);
        return this.intelligentTrim(rephrased, maxLength);
      }

      console.log(`✅ Rephrased successfully: ${rephrased.length} chars`);
      return rephrased;
    } catch (error) {
      console.error(`❌ Error rephrasing, falling back to trim:`, error);
      return this.intelligentTrim(text, maxLength);
    }
  }

  /**
   * Intelligently trim text to fit within character limit (fallback method)
   * Tries to preserve whole words and sentences when possible
   */
  private intelligentTrim(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }

    // Try to cut at sentence boundary
    const trimmed = text.substring(0, maxLength);
    const lastPeriod = trimmed.lastIndexOf('.');
    const lastExclamation = trimmed.lastIndexOf('!');
    const lastQuestion = trimmed.lastIndexOf('?');
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

    if (lastSentenceEnd > maxLength * 0.7) {
      // If we can preserve at least 70% of content and end at sentence boundary
      return text.substring(0, lastSentenceEnd + 1).trim();
    }

    // Otherwise, cut at last complete word
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      // If we can preserve at least 80% of content with complete words
      return text.substring(0, lastSpace).trim();
    }

    // Last resort: hard cut
    return text.substring(0, maxLength).trim();
  }

  private async validateIntroductionSection(
    section: MinimalProposal["introduction"]
  ): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title.length > 120) {
      console.warn(`⚠️  Auto-correcting introduction.title (${section.title.length} -> 120 chars)`);
      section.title = await this.rephraseToFit(section.title, 120, "introduction.title");
    }
    this.ensureMaxLength(section.title, 120, "introduction.title");
    
    if (section.services) {
      this.ensureArrayRange(section.services, 1, 5, "introduction.services");
      for (let index = 0; index < section.services.length; index++) {
        const service = section.services[index];
        // Auto-correct service name if exceeds limit
        if (service.serviceName.length > 50) {
          console.warn(`⚠️  Auto-correcting introduction.services[${index}].serviceName (${service.serviceName.length} -> 50 chars)`);
          service.serviceName = await this.rephraseToFit(service.serviceName, 50, `introduction.services[${index}].serviceName`);
        }
        this.ensureMaxLength(
          service.serviceName,
          50,
          `introduction.services[${index}].serviceName`
        );
      }
    }
  }

  private async validateAboutUsSection(section: MinimalProposal["aboutUs"]): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title.length > 200) {
      console.warn(`⚠️  Auto-correcting aboutUs.title (${section.title.length} -> 200 chars)`);
      section.title = await this.rephraseToFit(section.title, 200, "aboutUs.title");
    }
    this.ensureMaxLength(section.title, 200, "aboutUs.title");
  }

  private async validateTeamSection(section: MinimalProposal["team"]): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title.length > 100) {
      console.warn(`⚠️  Auto-correcting team.title (${section.title.length} -> 100 chars)`);
      section.title = await this.rephraseToFit(section.title, 100, "team.title");
    }
    this.ensureMaxLength(section.title, 100, "team.title");
    
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
        this.ensureMaxLength(member.name, 50, `team.members[${index}].name`);
        this.ensureMaxLength(member.role, 50, `team.members[${index}].role`);
      }
    }
  }

  private async validateExpertiseSection(
    section: MinimalProposal["expertise"]
  ): Promise<void> {
    // Auto-correct title if exceeds limit
    if (section.title.length > 100) {
      console.warn(`⚠️  Auto-correcting expertise.title (${section.title.length} -> 100 chars)`);
      section.title = await this.rephraseToFit(section.title, 100, "expertise.title");
    }
    this.ensureMaxLength(section.title, 100, "expertise.title");
    
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
        if (topic.description.length > 120) {
          console.warn(`⚠️  Auto-correcting expertise.topics[${index}].description (${topic.description.length} -> 120 chars)`);
          topic.description = await this.rephraseToFit(topic.description, 120, `expertise.topics[${index}].description`);
        }
        this.ensureMaxLength(
          topic.title,
          30,
          `expertise.topics[${index}].title`
        );
        this.ensureMaxLength(
          topic.description,
          120,
          `expertise.topics[${index}].description`
        );
      }
    }
  }

  private validateResultsSection(section: MinimalProposal["results"]): void {
    this.ensureMaxLength(section.title, 100, "results.title");
    if (section.items) {
      this.ensureArrayRange(section.items, 1, 4, "results.items");
      section.items.forEach((item, index) => {
        this.ensureMaxLength(item.client, 50, `results.items[${index}].client`);
        if (item.instagram) {
          this.ensureMaxLength(
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
        this.ensureMaxLength(
          item.name,
          50,
          `testimonials.items[${index}].name`
        );
        this.ensureMaxLength(
          item.role,
          50,
          `testimonials.items[${index}].role`
        );
        this.ensureMaxLength(
          item.testimonial,
          400,
          `testimonials.items[${index}].testimonial`
        );
      });
    }
  }

  private validateClientsSection(section: MinimalProposal["clients"]): void {
    if (section.title) {
      this.ensureMaxLength(section.title, 100, "clients.title");
    }
    if (section.description) {
      this.ensureMaxLength(section.description, 180, "clients.description");
    }
    if (section.paragraphs) {
      section.paragraphs.forEach((paragraph, index) => {
        this.ensureMaxLength(paragraph, 200, `clients.paragraphs[${index}]`);
      });
    }
    if (section.items) {
      this.ensureArrayRange(section.items, 6, 12, "clients.items");
      section.items.forEach((client, index) => {
        this.ensureMaxLength(client.name, 50, `clients.items[${index}].name`);
      });
    }
  }

  private validateStepsSection(section: MinimalProposal["steps"]): void {
    if (section.topics) {
      this.ensureArrayRange(section.topics, 3, 6, "steps.topics");
      section.topics.forEach((topic, index) => {
        this.ensureMaxLength(topic.title, 50, `steps.topics[${index}].title`);
        this.ensureMaxLength(
          topic.description,
          400,
          `steps.topics[${index}].description`
        );
      });
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

  private validateInvestmentSection(
    section: MinimalProposal["investment"]
  ): void {
    this.ensureMaxLength(section.title, 150, "investment.title");
    if (section.projectScope) {
      this.ensureMaxLength(
        section.projectScope,
        200,
        "investment.projectScope"
      );
    }
  }

  private validatePlansSection(
    section: MinimalProposal["plans"],
    expectedPlans: number
  ): void {
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

    section.plansItems?.forEach((plan, index) => {
      this.ensureMaxLength(plan.title, 30, `plans.plansItems[${index}].title`);
      this.ensureMaxLength(
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
        plan.includedItems.forEach((item, itemIndex) => {
          this.ensureMaxLength(
            item.description,
            60,
            `plans.plansItems[${index}].includedItems[${itemIndex}].description`
          );
        });
      }
    });
  }

  private validateFAQSection(section: MinimalProposal["faq"]): void {
    if (section.items) {
      this.ensureArrayRange(section.items, 5, 10, "faq.items");
      section.items.forEach((item, index) => {
        this.ensureMaxLength(
          item.question,
          100,
          `faq.items[${index}].question`
        );
        this.ensureMaxLength(item.answer, 300, `faq.items[${index}].answer`);
      });
    }
  }

  private validateFooterSection(section: MinimalProposal["footer"]): void {
    if (section.callToAction) {
      this.ensureMaxLength(section.callToAction, 100, "footer.callToAction");
    }
    if (section.disclaimer) {
      this.ensureMaxLength(section.disclaimer, 300, "footer.disclaimer");
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
    expectedPlans: number
  ): Promise<void> {
    await this.validateIntroductionSection(proposal.introduction);
    await this.validateAboutUsSection(proposal.aboutUs);
    await this.validateTeamSection(proposal.team);
    await this.validateExpertiseSection(proposal.expertise);
    this.validateResultsSection(proposal.results);
    this.validateTestimonialsSection(proposal.testimonials);
    this.validateClientsSection(proposal.clients);
    this.validateStepsSection(proposal.steps);
    this.validateInvestmentSection(proposal.investment);
    this.validatePlansSection(proposal.plans, expectedPlans);
    this.validateFAQSection(proposal.faq);
    this.validateFooterSection(proposal.footer);
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
    await this.validateProposal(proposal, expectedPlans);

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

    sections.clients = {
      // ALWAYS show clients section - NEVER hide
      hideSection: false,
      
      title: clientsResult.title || "",
      hideTitle: clientsResult.hideTitle ?? false,
      
      paragraphs: clientsResult.paragraphs || ["", ""],
      
      items: clientItems,
    };
    
    console.log("✅ DEBUG - Clients Section Generated:", {
      itemsCount: sections.clients.items?.length || 0,
      firstItem: sections.clients.items?.[0]?.name,
      title: sections.clients.title,
      paragraphsCount: sections.clients.paragraphs?.length || 0,
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
    
    // Trim FAQ items if they exceed limits
    if (faqResult.items) {
      faqResult.items = faqResult.items.map((item, index) => {
        const trimmedItem = { ...item };
        
        // Trim question if over 100 chars
        if (trimmedItem.question.length > 100) {
          console.warn(`FAQ question [${index}] exceeded 100 chars (${trimmedItem.question.length}), trimming...`);
          trimmedItem.question = this.intelligentTrim(trimmedItem.question, 95);
        }
        
        // Trim answer if over 300 chars
        if (trimmedItem.answer.length > 300) {
          console.warn(`FAQ answer [${index}] exceeded 300 chars (${trimmedItem.answer.length}), trimming...`);
          trimmedItem.answer = this.intelligentTrim(trimmedItem.answer, 280);
        }
        
        return trimmedItem;
      });
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
