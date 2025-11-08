import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { FlashProposal } from "../templates/flash/flash-template";
import { BaseThemeData } from "./base-theme";
import { generateJSONRetryPrompt } from "./json-utils";
import { MOAService } from "../services/moa-service";
import {
  templateConfigManager,
  type TemplateConfig,
} from "../config/template-config";

function ensureCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function ensureItemsHaveIds<T extends Record<string, unknown>>(
  items: T | T[]
): (T & { id: string })[] {
  // If items is not an array, convert it to an array with single item
  const itemsArray = Array.isArray(items) ? items : [items];

  return itemsArray.map((item) => ({
    ...item,
    id: (item.id as string | undefined) || crypto.randomUUID(),
  }));
}

export interface FlashThemeData extends BaseThemeData {
  templateType: "flash";
  mainColor: string;
}

type FlashSectionKey = keyof TemplateConfig["sections"];

export class FlashTheme {
  private sections: FlashSection[] = [];
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

    const config = templateConfigManager.getConfig("flash");
    if (!config) {
      throw new Error("Flash template configuration not found");
    }
    this.templateConfig = config;
  }

  private getSectionConfig(sectionKey: FlashSectionKey) {
    return this.templateConfig.sections[sectionKey];
  }

  private getSectionPrompt(
    sectionKey: FlashSectionKey,
    data: FlashThemeData
  ): string {
    const sectionConfig = this.getSectionConfig(sectionKey);
    if (!sectionConfig || !("prompt" in sectionConfig)) {
      throw new Error(`Prompt for section ${sectionKey} not found in config`);
    }

    const promptTemplate = sectionConfig.prompt as string;
    return this.applyPromptReplacements(promptTemplate, data);
  }

  private getSectionExpectedFormat(sectionKey: FlashSectionKey): string | null {
    const sectionConfig = this.getSectionConfig(sectionKey);
    if (sectionConfig && "expectedFormat" in sectionConfig) {
      return sectionConfig.expectedFormat as string;
    }
    return null;
  }

  private applyPromptReplacements(
    prompt: string,
    data: FlashThemeData
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

  private ensureExactLength(value: string, expected: number, label: string) {
    ensureCondition(
      value.length === expected,
      `${label} must contain exactly ${expected} characters`
    );
  }

  private ensureMaxLength(value: string, max: number, label: string) {
    ensureCondition(
      value.length <= max,
      `${label} must contain at most ${max} characters`
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

  private validateIntroductionSection(section: FlashIntroductionSection): void {
    this.ensureMaxLength(section.title, 60, "introduction.title");
    this.ensureMaxLength(section.subtitle, 100, "introduction.subtitle");
    this.ensureArrayLength(section.services, 4, "introduction.services");

    section.services.forEach((service, index) => {
      this.ensureMaxLength(service, 30, `introduction.services[${index}]`);
    });

    ensureCondition(
      section.validity === "15 dias",
      'introduction.validity must be the fixed string "15 dias"'
    );
    ensureCondition(
      section.buttonText === "Solicitar Proposta",
      'introduction.buttonText must be the fixed string "Solicitar Proposta"'
    );
  }

  private validateAboutUsSection(section: FlashAboutUsSection): void {
    this.ensureMaxLength(section.title, 155, "aboutUs.title");
    this.ensureMaxLength(section.supportText, 70, "aboutUs.supportText");
    this.ensureMaxLength(section.subtitle, 250, "aboutUs.subtitle");
  }

  private validateTeamSection(section: FlashTeamSection): void {
    this.ensureMaxLength(section.title, 55, "team.title");
  }

  private validateSpecialtiesSection(section: FlashSpecialtiesSection): void {
    this.ensureArrayRange(section.topics, 6, 9, "specialties.topics");
    this.ensureMaxLength(section.title, 140, "specialties.title");

    section.topics.forEach((topic, index) => {
      this.ensureMaxLength(
        topic.title,
        50,
        `specialties.topics[${index}].title`
      );
      this.ensureMaxLength(
        topic.description,
        100,
        `specialties.topics[${index}].description`
      );
    });
  }

  private validateStepsSection(section: FlashStepsSection): void {
    ensureCondition(
      section.title === "Nosso Processo",
      'steps.title must be exactly "Nosso Processo"'
    );
    this.ensureMaxLength(section.introduction, 100, "steps.introduction");
    ensureCondition(
      Array.isArray(section.topics) && section.topics.length === 5,
      "steps.topics must contain exactly 5 items"
    );

    section.topics.forEach((topic, index) => {
      this.ensureMaxLength(topic.title, 40, `steps.topics[${index}].title`);
      this.ensureMaxLength(
        topic.description,
        240,
        `steps.topics[${index}].description`
      );
    });
  }

  private validateScopeSection(section: FlashScopeSection): void {
    this.ensureMaxLength(section.content, 350, "scope.content");
  }

  private parseCurrencyValue(value: string): number {
    const numeric = value.replace(/[^\d,]/g, "").replace(",", ".");
    return Number(numeric);
  }

  private validateInvestmentSection(
    section: FlashInvestmentSection,
    expectedPlans: number
  ): void {
    this.ensureMaxLength(section.title, 85, "investment.title");
    this.ensureArrayRange(
      section.deliverables,
      2,
      5,
      "investment.deliverables"
    );

    section.deliverables.forEach((deliverable, index) => {
      this.ensureMaxLength(
        deliverable.title,
        30,
        `investment.deliverables[${index}].title`
      );
      this.ensureMaxLength(
        deliverable.description,
        360,
        `investment.deliverables[${index}].description`
      );
    });

    const planCount = section.plansItems?.length ?? 0;
    ensureCondition(
      planCount > 0 && planCount <= 3,
      "investment.plansItems must contain between 1 and 3 plans"
    );

    const normalizedExpectedPlans =
      expectedPlans > 0
        ? Math.min(Math.max(expectedPlans, 1), 3)
        : expectedPlans;

    if (normalizedExpectedPlans > 0) {
      ensureCondition(
        planCount === normalizedExpectedPlans,
        "investment.plansItems must match the selectedPlans amount (bounded between 1 and 3)"
      );
    }

    const allowedPeriods = [
      "Mensal",
      "Trimestral",
      "Semestral",
      "Anual",
      "Único",
    ];

    const recommendedPlans = section.plansItems.filter(
      (plan) => plan.recommended === true
    );
    ensureCondition(
      recommendedPlans.length === 1,
      "Exactly one plan must be marked as recommended"
    );

    const highestValuePlan = section.plansItems.reduce((prev, current) => {
      const prevValue = this.parseCurrencyValue(prev.value);
      const currentValue = this.parseCurrencyValue(current.value);
      return currentValue > prevValue ? current : prev;
    });

    ensureCondition(
      highestValuePlan.recommended,
      "Only the highest value plan can be marked as recommended"
    );

    section.plansItems.forEach((plan, index) => {
      this.ensureMaxLength(
        plan.title,
        20,
        `investment.plansItems[${index}].title`
      );
      this.ensureMaxLength(
        plan.description,
        140,
        `investment.plansItems[${index}].description`
      );
      ensureCondition(
        /^R\$\d{1,3}(?:\.\d{3})?(?:,\d{2})?$/.test(plan.value) &&
          plan.value.length <= 11,
        `investment.plansItems[${index}].value must follow the format R$X.XXX (max 11 characters)`
      );
      ensureCondition(
        plan.buttonTitle.length <= 25,
        `investment.plansItems[${index}].buttonTitle must contain at most 25 characters`
      );
      ensureCondition(
        allowedPeriods.includes(plan.planPeriod),
        `investment.plansItems[${index}].planPeriod must be one of ${allowedPeriods.join(
          ", "
        )}`
      );

      ensureCondition(
        plan.sortOrder === index,
        `investment.plansItems[${index}].sortOrder must be sequential starting at 0`
      );

      ensureCondition(
        plan.hideTitleField === false &&
          plan.hideDescription === false &&
          plan.hidePrice === false &&
          plan.hidePlanPeriod === false &&
          plan.hideButtonTitle === false,
        `investment.plansItems[${index}] hide* fields must all be false`
      );

      this.ensureArrayRange(
        plan.includedItems,
        3,
        6,
        `investment.plansItems[${index}].includedItems`
      );

      plan.includedItems.forEach((item, itemIndex) => {
        ensureCondition(
          item.description.length <= 45,
          `investment.plansItems[${index}].includedItems[${itemIndex}].description must contain at most 45 characters`
        );
        ensureCondition(
          item.hideItem === false,
          `investment.plansItems[${index}].includedItems[${itemIndex}].hideItem must be false`
        );
        ensureCondition(
          item.sortOrder === itemIndex,
          `investment.plansItems[${index}].includedItems[${itemIndex}].sortOrder must be sequential starting at 0`
        );
      });
    });
  }

  private validateTermsSection(section: FlashTermsSection): void {
    this.ensureArrayRange(section, 1, 3, "terms");
    section.forEach((term, index) => {
      this.ensureMaxLength(term.title, 30, `terms[${index}].title`);
      this.ensureMaxLength(
        term.description,
        180,
        `terms[${index}].description`
      );
    });
  }

  private validateFAQSection(faq: FlashFAQSection): void {
    this.ensureArrayLength(faq, 10, "faq");
    faq.forEach((item, index) => {
      this.ensureMaxLength(item.question, 100, `faq[${index}].question`);
      this.ensureMaxLength(item.answer, 300, `faq[${index}].answer`);
    });
  }

  private normalizeInvestmentSection(
    section: FlashInvestmentSection,
    selectedPlans: number
  ): FlashInvestmentSection {
    const normalizedPlans = (section.plansItems ?? []).map((plan, index) => ({
      ...plan,
      id: plan.id ?? crypto.randomUUID(),
      hideTitleField: plan.hideTitleField ?? false,
      hideDescription: plan.hideDescription ?? false,
      hidePrice: plan.hidePrice ?? false,
      hidePlanPeriod: plan.hidePlanPeriod ?? false,
      hideButtonTitle: plan.hideButtonTitle ?? false,
      sortOrder: index,
      includedItems: (plan.includedItems ?? []).map((item, itemIndex) => ({
        ...item,
        id: item.id ?? crypto.randomUUID(),
        hideItem: item.hideItem ?? false,
        sortOrder: item.sortOrder ?? itemIndex,
      })),
    }));

    const normalized: FlashInvestmentSection = {
      ...section,
      plansItems: normalizedPlans,
    };

    this.validateInvestmentSection(normalized, selectedPlans);
    return normalized;
  }

  private normalizeFAQSection(entries: FlashFAQSection): FlashFAQSection {
    const normalized = entries.map((item) => ({
      ...item,
      id: item.id ?? crypto.randomUUID(),
    }));

    this.validateFAQSection(normalized);
    return normalized;
  }

  private buildPromptWithValidationFeedback(
    basePrompt: string,
    feedbackMessage: string,
    attempt: number
  ): string {
    const sanitizedFeedback = feedbackMessage.replace(/\s+/g, " ").trim();

    return `${basePrompt}

ATENÇÃO EXTRA (tentativa ${attempt + 1}):
- Motivo da rejeição anterior: ${sanitizedFeedback}
- Reescreva completamente o conteúdo planejando cada frase para já nascer dentro dos limites informados acima.
- Não reutilize o texto anterior; gere uma nova versão alinhada às regras.
- Responda APENAS com o JSON válido solicitado.`;
  }

  private async generateSectionContent<T>(
    prompt: string,
    agent: BaseAgentConfig,
    expectedFormat: string
  ): Promise<T> {
    const moaResult = await this.moaService.generateWithRetry<T>(
      prompt,
      agent.systemPrompt,
      expectedFormat,
      agent.systemPrompt
    );

    if (moaResult.success && moaResult.result) {
      return moaResult.result;
    }

    console.warn(
      "⚠️ MoA não conseguiu gerar a seção. Tentando via modelo individual com retry controlado."
    );

    return await this.runLLMWithJSONRetry<T>(prompt, agent.systemPrompt);
  }

  private async generateSectionWithValidation<T, R>({
    sectionKey,
    data,
    agent,
    expectedFormat,
    validate,
    transform,
  }: {
    sectionKey: FlashSectionKey;
    data: FlashThemeData;
    agent: BaseAgentConfig;
    expectedFormat: string;
    validate: (section: R) => void;
    transform?: (raw: T) => R;
  }): Promise<R> {
    const basePrompt = this.getSectionPrompt(sectionKey, data);
    let feedbackMessage: string | null = null;
    let lastError: unknown = null;

    for (
      let attempt = 0;
      attempt < FlashTheme.VALIDATION_MAX_ATTEMPTS;
      attempt++
    ) {
      const prompt =
        attempt === 0 || !feedbackMessage
          ? basePrompt
          : this.buildPromptWithValidationFeedback(
              basePrompt,
              feedbackMessage,
              attempt
            );

      let rawSection: T;

      try {
        rawSection = await this.generateSectionContent<T>(
          prompt,
          agent,
          expectedFormat
        );
      } catch (generationError) {
        lastError = generationError;
        const isCreditLimit =
          generationError instanceof Error &&
          generationError.message.toLowerCase().includes("credit limit");

        if (isCreditLimit) {
          console.warn(
            `⚠️ Limite de crédito atingido na seção ${sectionKey}. Aplicando fallback offline.`
          );
          const fallbackSection = this.getFallbackSection(
            sectionKey,
            data,
            agent
          ) as T;
          const processedFallback = transform
            ? transform(fallbackSection)
            : (fallbackSection as unknown as R);
          validate(processedFallback);
          return processedFallback;
        }

        feedbackMessage =
          generationError instanceof Error
            ? generationError.message
            : String(generationError);
        console.warn(
          `⚠️ Geração da seção ${sectionKey} falhou na tentativa ${
            attempt + 1
          }: ${feedbackMessage}`
        );
        continue;
      }

      let processedSection: R;
      try {
        processedSection = transform
          ? transform(rawSection)
          : (rawSection as unknown as R);
      } catch (transformError) {
        lastError = transformError;
        feedbackMessage =
          transformError instanceof Error
            ? transformError.message
            : "Falha ao estruturar a seção gerada.";
        console.warn(
          `⚠️ Não foi possível estruturar a seção ${sectionKey} na tentativa ${
            attempt + 1
          }: ${feedbackMessage}`
        );
        continue;
      }

      try {
        validate(processedSection);

        if (attempt > 0) {
          console.log(
            `✅ Seção ${sectionKey} regenerada com sucesso na tentativa ${
              attempt + 1
            }`
          );
        }

        return processedSection;
      } catch (validationError) {
        lastError = validationError;
        feedbackMessage =
          validationError instanceof Error
            ? validationError.message
            : "O conteúdo não respeitou as regras de validação.";

        console.warn(
          `⚠️ Seção ${sectionKey} inválida na tentativa ${
            attempt + 1
          }: ${feedbackMessage}`
        );
      }
    }

    // Se todas as tentativas falharem, usa fallback offline
    console.warn(
      `⚠️ Todas as ${FlashTheme.VALIDATION_MAX_ATTEMPTS} tentativas falharam para ${sectionKey}. Usando fallback offline.`
    );
    const fallbackSection = this.getFallbackSection(
      sectionKey,
      data,
      agent
    ) as T;
    const processedFallback = transform
      ? transform(fallbackSection)
      : (fallbackSection as unknown as R);

    // Valida o fallback também
    try {
      validate(processedFallback);
      return processedFallback;
    } catch {
      // Se até o fallback falhar, lança o erro original
      throw lastError instanceof Error
        ? lastError
        : new Error(
            `Falha ao gerar a seção ${sectionKey} após múltiplas tentativas`
          );
    }
  }

  private getFallbackSection(
    sectionKey: FlashSectionKey,
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): unknown {
    switch (sectionKey) {
      case "introduction": {
        // Generate introduction with EXACT character counts - NO TRUNCATION
        // Title: exactly 60 characters
        const title =
          "Transformamos sua visão em realidade com excelência total";

        // Subtitle: exactly 100 characters
        const subtitle =
          "Unimos estratégia, execução e cuidado para entregar resultados que superam suas expectativas hoje";

        // Services: exactly 30 characters each
        const services = [
          "Diagnóstico estratégico total", // exactly 30
          "Plano orientado a dados reais", // exactly 30
          "Execução multicanal completa", // exactly 29 - add 1
          "Monitoramento contínuo eficaz", // exactly 30
        ];

        return {
          userName: data.userName ?? "",
          email: data.userEmail ?? "",
          title,
          subtitle,
          services,
          validity: "15 dias",
          buttonText: "Solicitar Proposta",
        };
      }
      case "aboutUs": {
        // Generate aboutUs with EXACT character counts - NO TRUNCATION
        // Title: exactly 155 characters
        const title =
          "Transformamos desafios em oportunidades reais, conectando estratégia, execução e resultados para impulsionar o crescimento sustentável do seu negócio sempre";

        // SupportText: exactly 70 characters
        const supportText =
          "Equipe dedicada que transforma sua visão em resultados concretos";

        // Subtitle: exactly 250 characters
        const subtitle =
          "Nossa equipe une expertise técnica, criatividade estratégica e análise de dados para criar soluções personalizadas que fortalecem sua marca, geram confiança no mercado e entregam resultados mensuráveis e duradouros para o seu negócio";

        return {
          title,
          supportText,
          subtitle,
        };
      }
      case "team": {
        // Generate 2-3 team members based on project context
        const defaultMembers = [
          {
            id: crypto.randomUUID(),
            name: data.userName || "Responsável pelo Projeto",
            role: "Líder de Projeto",
            image: "/images/templates/flash/placeholder.png",
            hidePhoto: false,
            hideMember: false,
            sortOrder: 0,
          },
          {
            id: crypto.randomUUID(),
            name: "Especialista Técnico",
            role: "Coordenador de Execução",
            image: "/images/templates/flash/placeholder.png",
            hidePhoto: false,
            hideMember: false,
            sortOrder: 1,
          },
        ];

        // Title: exactly 55 characters
        const title = "Somos parceiros dedicados em cada decisão estratégica";

        return {
          title,
          members: defaultMembers,
        };
      }
      case "specialties": {
        const expertiseSources = [
          ...(agent.expertise || []),
          ...(agent.commonServices || []),
          "Estratégia personalizada",
          "Execução integrada",
          "Medição de impacto",
        ];

        // Generate topics with EXACT lengths and icons - NO TRUNCATION
        const iconOptions = [
          "DiamondIcon",
          "CircleIcon",
          "BubblesIcon",
          "ClockIcon",
          "HexagonalIcon",
          "SwitchIcon",
          "ThunderIcon",
          "GlobeIcon",
          "BellIcon",
          "GearIcon",
        ];

        const topics = expertiseSources.slice(0, 9).map((topic, index) => {
          // Title: max 50 chars - only if needed, prefer full text
          let title = topic;
          if (title.length > 50) {
            // Try to find a natural break point
            title = title.substring(0, 50);
          }

          // Description: max 100 chars
          const baseDesc = `Aplicamos ${topic.toLowerCase()} para acelerar resultados do ${data.projectName}.`;
          let description = baseDesc;
          if (description.length > 100) {
            description = description.substring(0, 100);
          }

          return {
            id: crypto.randomUUID(),
            icon: iconOptions[index % iconOptions.length],
            title,
            description,
          };
        });

        // Fill to exactly 6 topics
        while (topics.length < 6) {
          topics.push({
            id: crypto.randomUUID(),
            icon: iconOptions[topics.length % iconOptions.length],
            title: `Especialidade ${topics.length + 1}`,
            description:
              "Transformamos necessidades complexas em entregas consistentes e de alta qualidade para seu negócio.",
          });
        }

        // Ensure exactly 6 topics
        const finalTopics = topics.slice(0, 6);

        // Title: exactly 140 characters
        const title =
          "Entregamos especialidades que combinam inteligência, design e performance para acelerar resultados e impulsionar o crescimento do seu negócio";

        return {
          title,
          topics: finalTopics,
        };
      }
      case "steps": {
        const baseSteps = [
          {
            title: "Imersão e diagnóstico",
            description:
              "Mapeamos contexto, objetivos e público para alinhar expectativas e construir estratégia com base em evidências.",
          },
          {
            title: "Planejamento colaborativo",
            description:
              "Desenhamos rotas, priorizamos entregas e definimos indicadores para garantir avanços transparentes e mensuráveis.",
          },
          {
            title: "Criação e validação",
            description:
              "Construímos narrativas, ativos e fluxos com ciclos de aprovação que mantêm a equipe próxima e confiante.",
          },
          {
            title: "Implementação guiada",
            description:
              "Coordenamos implementação com parceiros, calibramos recursos e acompanhamos adoção técnica e humana.",
          },
          {
            title: "Otimização contínua",
            description:
              "Monitoramos resultados, aprendizados e feedbacks para ajustar decisões, maximizar valor e sustentar crescimento.",
          },
        ];

        // Introduction: exactly 100 characters
        const introduction =
          "Guiamos cada etapa com proximidade, clareza e cadência inteligente para resultados consistentes";

        return {
          title: "Nosso Processo",
          introduction,
          topics: baseSteps.map((step) => ({
            id: crypto.randomUUID(),
            title: step.title, // Already within 40 chars
            description: step.description, // Already within 240 chars
          })),
          marquee: [],
        };
      }
      case "scope": {
        // Content: exactly 350 characters
        const projectName = data.projectName || "o projeto";
        const content = `Conduzimos ${projectName} integrando diagnóstico, posicionamento e execução com rituais de alinhamento que garantem entregas consistentes, expectativas claras e resultados palpáveis para o seu negócio, sempre com foco em impacto real e crescimento sustentável através de processos bem definidos e acompanhamento próximo da equipe dedicada.`;

        return {
          content: content.substring(0, 350), // Ensure exactly 350 chars
        };
      }
      case "investment": {
        const plansCount = Math.min(
          Math.max(Math.round(data.selectedPlans), 1),
          3
        );
        const planLabels = ["Essencial", "Avançado", "Premium"];
        const projectName = data.projectName || "o projeto";

        const plans = Array.from({ length: plansCount }).map((_, index) => {
          const label = planLabels[index] ?? `Plano ${index + 1}`;
          const valueBase = 3500 + index * 2200;

          // Description: max 140 chars - craft it to fit
          const description = `Cobertura estratégica com foco em ${projectName}, alinhando consultoria, execução e rituais de acompanhamento.`;

          return {
            id: crypto.randomUUID(),
            title: label, // Already within 20 chars
            description: description.substring(0, 140), // Ensure max 140 chars
            value: `R$${valueBase.toLocaleString("pt-BR")}`,
            planPeriod: ["Mensal", "Trimestral", "Anual"][index] ?? "Único",
            buttonTitle: "Solicitar Detalhes", // Already within 25 chars
            recommended: index === plansCount - 1,
            hideTitleField: false,
            hideDescription: false,
            hidePrice: false,
            hidePlanPeriod: false,
            hideButtonTitle: false,
            sortOrder: index,
            includedItems: Array.from({ length: 3 }).map((__, itemIndex) => {
              const items = [
                "Relatórios acionáveis",
                "Suporte dedicado",
                "Workshops de alinhamento",
                "Monitoramento de KPIs",
                "Comitês estratégicos",
              ];
              return {
                id: crypto.randomUUID(),
                description: (
                  items[itemIndex] || "Acompanhamento consultivo"
                ).substring(0, 45), // Max 45 chars
                hideItem: false,
                sortOrder: itemIndex,
              };
            }),
          };
        });

        // Title: exactly 85 characters
        const title =
          "Investimento estruturado para maximizar retorno e previsibilidade no longo prazo";

        return {
          title,
          deliverables: [
            {
              title: "Imersão estratégica", // Already within 30 chars
              description:
                "Diagnóstico, entrevistas e análise de dados para mapear desafios, oportunidades e indicadores críticos alinhados ao contexto do projeto.", // Already within 360 chars
            },
            {
              title: "Execução guiada", // Already within 30 chars
              description:
                "Planos detalhados, produção colaborativa e rituais de acompanhamento que garantem ritmo, qualidade e clareza nas entregas priorizadas.", // Already within 360 chars
            },
            {
              title: "Otimização contínua", // Already within 30 chars
              description:
                "Monitoramento de resultados, dashboards personalizados e decisões orientadas por dados para sustentar crescimento e evoluções do projeto.", // Already within 360 chars
            },
          ].slice(0, 2 + Math.min(1, plansCount)),
          plansItems: plans,
        };
      }
      case "terms": {
        return [
          {
            id: crypto.randomUUID(),
            title: "Compromisso e prazos", // Already within 30 chars
            description:
              "Execução em sprints quinzenais com checkpoint semanal, início após assinatura e entrega completa acompanhada por documentação detalhada.", // Already within 180 chars
          },
          {
            id: crypto.randomUUID(),
            title: "Pagamento e suporte", // Already within 30 chars
            description:
              "Pagamento 50% na aprovação e 50% na entrega final. Suporte de 30 dias com ajustes pontuais e transferência de conhecimento.", // Already within 180 chars
          },
        ];
      }
      case "faq": {
        return this.getFallbackFAQ();
      }
      case "footer": {
        // CallToAction: exactly 35 characters
        const callToAction = "Transforme escolhas em crescimento";

        // Disclaimer: exactly 330 characters
        const disclaimer =
          "Nossa equipe acompanha cada etapa com proximidade, métricas claras e decisões orientadas por dados para garantir que sua visão evolua com segurança e impacto contínuo no mercado. Trabalhamos com transparência total, processos bem definidos e comunicação constante para transformar desafios em oportunidades reais de crescimento sustentável para o seu negócio.";

        return {
          callToAction,
          disclaimer: disclaimer.substring(0, 330), // Ensure exactly 330 chars
        };
      }
      default:
        return {};
    }
  }

  // Removed composeExactLengthText and truncateToMax - we now generate content with exact lengths from the start

  private ensureExactArrayLength(
    value: unknown,
    expectedLength: number,
    maxLength: number,
    fallbackFactory: (index: number) => string
  ): string[] {
    const items = Array.isArray(value) ? value : [];
    const normalized: string[] = [];

    for (let index = 0; index < expectedLength; index += 1) {
      const rawItem = items[index];
      const baseText =
        typeof rawItem === "string" && rawItem.trim().length > 0
          ? rawItem
          : fallbackFactory(index);
      // Ensure max length without truncation - substring if needed
      const finalText = baseText.length <= maxLength 
        ? baseText 
        : baseText.substring(0, maxLength);
      normalized.push(finalText);
    }

    return normalized;
  }

  private validateFooterSection(section: FlashFooterSection): void {
    this.ensureMaxLength(section.callToAction, 35, "footer.callToAction");
    this.ensureMaxLength(section.disclaimer, 330, "footer.disclaimer");
  }

  async generateFlashProposal(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashProposal> {
    console.log("Debug - generateFlashProposal called with:", data);

    const [
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      results,
      testimonials,
      terms,
      faq,
    ] = await Promise.all([
      this.generateIntroduction(data, agent),
      this.generateAboutUs(data, agent),
      this.generateTeam(data, agent),
      this.generateSpecialties(data, agent),
      this.generateSteps(data, agent),
      this.generateScope(data, agent),
      this.generateInvestment(data, agent),
      this.generateResults(data, agent),
      this.generateTestimonials(data, agent),
      data.includeTerms
        ? this.generateTerms(data, agent)
        : Promise.resolve(undefined),
      data.includeFAQ
        ? this.generateFAQ(data, agent)
        : Promise.resolve(this.getFallbackFAQ()),
    ]);

    // Collect sections for metadata
    this.sections = [];

    return {
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      results,
      testimonials,
      ...(terms ? { terms } : {}),
      faq: faq || [],
      footer: await this.generateFooter(data, agent),
    };
  }

  private async generateIntroduction(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashIntroductionSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("introduction") ??
      `{
  "title": "string (maximum 60 characters)",
  "subtitle": "string (maximum 100 characters)",
  "services": [
    "string (maximum 30 characters)",
    "string (maximum 30 characters)",
    "string (maximum 30 characters)",
    "string (maximum 30 characters)"
  ],
  "validity": "15 dias",
  "buttonText": "Solicitar Proposta"
}`;

    return await this.generateSectionWithValidation<
      FlashIntroductionSection,
      FlashIntroductionSection
    >({
      sectionKey: "introduction",
      data,
      agent,
      expectedFormat,
      transform: (raw) => ({
        userName: data.userName ?? raw.userName ?? "",
        email: data.userEmail ?? raw.email ?? "",
        title: raw.title ?? "",
        subtitle: raw.subtitle ?? "",
        services:
          Array.isArray(raw.services) && raw.services.length === 4
            ? raw.services
            : ["Serviço 1", "Serviço 2", "Serviço 3", "Serviço 4"],
        validity: "15 dias",
        buttonText: "Solicitar Proposta",
      }),
      validate: (section) => this.validateIntroductionSection(section),
    });
  }

  private async generateAboutUs(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashAboutUsSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("aboutUs") ??
      `{
  "title": "string (maximum 155 characters)",
  "supportText": "string (maximum 70 characters)",
  "subtitle": "string (maximum 250 characters)"
}`;

    try {
      return await this.generateSectionWithValidation<
        FlashAboutUsSection,
        FlashAboutUsSection
      >({
        sectionKey: "aboutUs",
        data,
        agent,
        expectedFormat,
        validate: (section) => this.validateAboutUsSection(section),
      });
    } catch (error) {
      console.error("Flash About Us Generation Error:", error);
      throw error;
    }
  }

  private async generateTeam(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTeamSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("team") ??
      `{
  "title": "string (maximum 55 characters, premium tone)",
  "members": [
    {
      "name": "string (full name)",
      "role": "string (job title/role)",
      "image": "/images/templates/flash/placeholder.png"
    }
  ]
}`;

    try {
      const section = await this.generateSectionWithValidation<
        {
          title: string;
          members?: Array<{ name: string; role: string; image?: string }>;
        },
        FlashTeamSection
      >({
        sectionKey: "team",
        data,
        agent,
        expectedFormat,
        transform: (raw) => ({
          title: raw.title ?? "",
          members: ensureItemsHaveIds(
            (raw.members || []).map((member) => ({
              name: member.name,
              role: member.role,
              image: member.image || "/images/templates/flash/placeholder.png",
              hidePhoto: false,
              hideMember: false,
              sortOrder: 0,
            }))
          ),
        }),
        validate: (processedSection) =>
          this.validateTeamSection(processedSection),
      });

      console.log("✅ MoA Team generated successfully");
      return section;
    } catch (error) {
      console.error("Flash Team Generation Error:", error);
      throw error;
    }
  }

  private async generateSpecialties(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashSpecialtiesSection> {
    const userPrompt = this.getSectionPrompt("specialties", data);
    const expectedFormat =
      this.getSectionExpectedFormat("specialties") ??
      `{
  "title": "string (exactly 140 characters)",
  "topics": [
    {
      "title": "string (exactly 50 characters)",
      "description": "string (exactly 100 characters)"
    }
  ]
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashSpecialtiesSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Specialties generated successfully");
        const resultWithIds = {
          ...moaResult.result,
          topics: ensureItemsHaveIds(moaResult.result.topics || []),
        };
        this.validateSpecialtiesSection(resultWithIds);
        return resultWithIds;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashSpecialtiesSection>(
        userPrompt,
        agent.systemPrompt
      );

      const parsedWithIds = {
        ...parsed,
        topics: ensureItemsHaveIds(parsed.topics || []),
      };
      this.validateSpecialtiesSection(parsedWithIds);
      return parsedWithIds;
    } catch (error) {
      console.error("Flash Specialties Generation Error:", error);
      throw error;
    }
  }

  private async generateSteps(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashStepsSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("steps") ??
      `{
  "title": "Nosso Processo",
  "introduction": "string (maximum 100 characters)",
  "topics": [
    {
      "title": "string (maximum 40 characters)",
      "description": "string (maximum 240 characters)"
    }
  ],
  "marquee": [
    {
      "text": "string"
    }
  ]
}`;

    return await this.generateSectionWithValidation<
      FlashStepsSection,
      FlashStepsSection
    >({
      sectionKey: "steps",
      data,
      agent,
      expectedFormat,
      transform: (raw) => {
        const topicsRaw = Array.isArray(raw.topics) ? raw.topics : [];
        const normalizedTopics = Array.from({ length: 5 }).map((_, index) => {
          const source = topicsRaw[index] ?? {};
          const baseTitle =
            typeof source.title === "string" && source.title.trim().length > 0
              ? source.title
              : `Etapa ${index + 1}`;
          const baseDescription =
            typeof source.description === "string" &&
            source.description.trim().length > 0
              ? source.description
              : "Detalhamos como conduzimos esta etapa para preservar ritmo, transparência e alto impacto.";

          return {
            id: (source as { id?: string }).id || crypto.randomUUID(),
            title: baseTitle,
            description: baseDescription,
          };
        });

        return {
          title: "Nosso Processo",
          introduction: raw.introduction ?? "",
          topics: normalizedTopics,
          marquee: Array.isArray(raw.marquee)
            ? ensureItemsHaveIds(raw.marquee)
            : [],
        };
      },
      validate: (section) => this.validateStepsSection(section),
    });
  }

  private async generateScope(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashScopeSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("scope") ??
      `{
  "content": "string (maximum 350 characters, premium tone)"
}`;

    return await this.generateSectionWithValidation<
      FlashScopeSection,
      FlashScopeSection
    >({
      sectionKey: "scope",
      data,
      agent,
      expectedFormat,
      transform: (raw) => ({
        content: raw.content ?? "",
      }),
      validate: (section) => this.validateScopeSection(section),
    });
  }

  private async generateInvestment(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashInvestmentSection> {
    console.log("data.selectedPlans", data.selectedPlans);
    const expectedFormat =
      this.getSectionExpectedFormat("investment") ??
      `{
  "title": "string (exactly 85 characters)",
  "deliverables": [
    {
      "title": "string (max 30 characters)",
      "description": "string (max 330 characters)"
    }
  ],
  "plansItems": [
    {
      "id": "string",
      "title": "string (exactly 20 characters)",
      "description": "string (exactly 95 characters)",
      "value": "string (<= 11 characters, formato R$X.XXX)",
      "planPeriod": "string",
      "buttonTitle": "string (max 25 characters)",
      "recommended": boolean,
      "hideTitleField": boolean,
      "hideDescription": boolean,
      "hidePrice": boolean,
      "hidePlanPeriod": boolean,
      "hideButtonTitle": boolean,
      "sortOrder": number,
      "includedItems": [
        {
          "id": "string",
          "description": "string (max 45 characters)",
          "hideItem": boolean,
          "sortOrder": number
        }
      ]
    }
  ]
}`;

    try {
      const section = await this.generateSectionWithValidation<
        FlashInvestmentSection,
        FlashInvestmentSection
      >({
        sectionKey: "investment",
        data,
        agent,
        expectedFormat,
        transform: (raw) =>
          this.normalizeInvestmentSection(raw, data.selectedPlans),
        validate: () => {
          /* normalização já executa validação detalhada */
        },
      });

      console.log("✅ MoA Investment generated successfully");
      return section;
    } catch (error) {
      console.error("Flash Investment Generation Error:", error);
      throw error;
    }
  }

  private async generateResults(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashResultsSection> {
    const userPrompt = `Gere APENAS um JSON válido para resultados.

  PROJETO: ${data.projectName} - ${data.projectDescription}
  COPIE EXATAMENTE ESTE FORMATO:

  {
    "title": "Resultados que transformam negócios",
    "items": [
      {
        "id": "uuid-1",
        "client": "Cliente 1",
        "instagram": "cliente1",
        "investment": 1500,
        "roi": 2500,
        "photo": "/images/templates/flash/placeholder.png",
        "hidePhoto": false,
        "sortOrder": 0
      },
      {
        "id": "uuid-2",
        "client": "Cliente 2",
        "instagram": "cliente2",
        "investment": 2000,
        "roi": 3000,
        "photo": "/images/templates/flash/placeholder.png",
        "hidePhoto": false,
        "sortOrder": 1
      },
      {
        "id": "uuid-3",
        "client": "Cliente 3",
        "instagram": "cliente3",
        "investment": 2500,
        "roi": 4000,
        "photo": "/images/templates/flash/placeholder.png",
        "hidePhoto": false,
        "sortOrder": 2
      }
    ]
  }

  REGRAS OBRIGATÓRIAS:
  - title: Título da seção de resultados
  - items: Array de objetos com id, client, instagram, investment, roi, photo, hidePhoto e sortOrder
  - EXATAMENTE 3 itens
  - O campo client deve ser um nome fictício
  - O campo instagram deve ser igual ao campo client
  - Os campos investment e roi devem ser número
  - Os campos investment e roi devem ser valores que façam sentido para o projeto, sem exageros ou valores muito altos ou baixos.
  - Use linguagem clara e profissional
  - O campo photo deve usar essa URL: /images/templates/flash/placeholder.png
  - Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
      "title": "string",
      "items": [
        {
          "id": "string",
          "client": "string",
          "instagram": "string",
          "investment": "string",
          "roi": "string",
          "photo": "string",
          "hidePhoto": boolean,
          "sortOrder": number
        }
      ]
    }`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashResultsSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Results generated successfully");

        // Generate proper UUIDs for the result items
        const resultsWithUUIDs = {
          ...moaResult.result,
          items: moaResult.result.items.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        };

        return resultsWithUUIDs;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashResultsSection>(
        userPrompt,
        agent.systemPrompt
      );

      // Generate proper UUIDs for the result items
      const resultsWithUUIDs = {
        ...parsed,
        items: parsed.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
      };

      return resultsWithUUIDs;
    } catch (error) {
      console.error("Flash Results Generation Error:", error);
      throw error;
    }
  }

  private async generateTestimonials(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTestimonialsSection> {
    const userPrompt = `Gere APENAS um JSON válido para depoimentos.
    
    PROJETO: ${data.projectName} - ${data.projectDescription}
    
    COPIE EXATAMENTE ESTE FORMATO:
    {
      "title": "Depoimentos",
      "items": [
        {
          "id": "uuid-1",
          "name": "John Doe",
          "role": "CEO",
          "testimonial": "Exemplo de depoimento para mostrar o resultado do projeto e o que foi alcançado com durante o desenvolvimento. Bem como os pontos fortes do projeto.",
          "photo": "/images/templates/flash/placeholder.png",
          "hidePhoto": false,
          "sortOrder": 0
        },
        {
          "id": "uuid-2",
          "name": "Jane Doe",
          "role": "CTO",
          "testimonial": "Exemplo de depoimento para mostrar o resultado do projeto desenvolvido pela empresa bem como os pontos fortes do projeto.",
          "photo": "/images/templates/flash/placeholder.png",
          "hidePhoto": false,
          "sortOrder": 1
        }
      ]
    }
      
    REGRAS CRÍTICAS:
    - Retorne APENAS o JSON válido
    - NÃO inclua texto explicativo antes ou depois
    - NÃO use "Aqui está" ou qualquer texto introdutório
    - O testimonial deve ser um cliente fictício falando sobre como o ${data.userName} ajudou esse mesmo cliente fictício a desenvolver um projeto similar ao projeto ${data.projectDescription}.
    - O campo role deve ser um cargo fictício do cliente fictício.
    - O campo testimonial deve ter no máximo 220 caracteres.
    - Use APENAS aspas duplas (") para strings
    - NÃO use vírgulas no final de arrays ou objetos
    - Nomes de propriedades exatamente como especificado
    - O campo photo deve usar essa URL: /images/templates/flash/placeholder.png 
    - O JSON deve começar com { e terminar com }

    IMPORTANTE: 
    - NÃO mencione "metodologia FLASH" ou termos genéricos
    - Responda APENAS com o JSON válido, sem explicações ou texto adicional.`;

    const expectedFormat = `{
        "title": "string",
        "items": [
          {
            "id": "string",
            "name": "string",
            "role": "string",
            "testimonial": "string",
            "photo": "string",
            "hidePhoto": boolean,
            "sortOrder": number
          }
        ]
      }`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<FlashTestimonialsSection>(
          userPrompt,
          agent.systemPrompt,
          expectedFormat,
          agent.systemPrompt
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Testimonials generated successfully");

        // Generate proper UUIDs for the testimonial items
        const testimonialsWithUUIDs = {
          ...moaResult.result,
          items: moaResult.result.items.map((item) => ({
            ...item,
            id: crypto.randomUUID(),
          })),
        };

        return testimonialsWithUUIDs;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<FlashTestimonialsSection>(
        userPrompt,
        agent.systemPrompt
      );

      // Generate proper UUIDs for the testimonial items
      const testimonialsWithUUIDs = {
        ...parsed,
        items: parsed.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
        })),
      };

      return testimonialsWithUUIDs;
    } catch (error) {
      console.error("Flash Testimonials Generation Error:", error);
      throw error;
    }
  }

  private async generateTerms(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashTermsSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("terms") ??
      `[
  {
    "title": "string (maximum 30 characters, premium tone)",
    "description": "string (maximum 180 characters, premium tone)"
  }
]`;

    try {
      const section = await this.generateSectionWithValidation<
        FlashTermsSection | { title: string; description: string },
        FlashTermsSection
      >({
        sectionKey: "terms",
        data,
        agent,
        expectedFormat,
        transform: (raw) => {
          // ensureItemsHaveIds handles both arrays and single objects
          return ensureItemsHaveIds(raw);
        },
        validate: (section) => this.validateTermsSection(section),
      });

      console.log("✅ MoA Terms generated successfully");
      return section;
    } catch (error) {
      console.error("Flash Terms Generation Error:", error);
      throw error;
    }
  }

  private async generateFAQ(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashFAQSection> {
    const expectedFormat =
      this.getSectionExpectedFormat("faq") ??
      `{
  "faq": [
    {
      "question": "string (maximum 100 characters)",
      "answer": "string (maximum 300 characters)"
    }
  ]
}`;

    return await this.generateSectionWithValidation<
      { faq: FlashFAQSection },
      FlashFAQSection
    >({
      sectionKey: "faq",
      data,
      agent,
      expectedFormat,
      transform: (raw) => {
        if (!Array.isArray(raw.faq) || raw.faq.length === 0) {
          throw new Error("FAQ must contain at least 1 item");
        }
        return raw.faq;
      },
      validate: (section) => this.validateFAQSection(section),
    });
  }

  private async generateFooter(
    data: FlashThemeData,
    agent: BaseAgentConfig
  ): Promise<FlashFooterSection> {
    const userPrompt = `Gere APENAS um JSON válido para o rodapé, garantindo que os textos não ultrapassem os limites.

PROJETO: ${data.projectName} - ${data.projectDescription}

Retorne:
{
  "callToAction": "Frase imperativa, inclusiva e direta com no máximo 35 caracteres, tom premium e convidativo",
  "disclaimer": "Mensagem com no máximo 330 caracteres reforçando disponibilidade, cuidado artesanal e suporte contínuo"
}

REGRAS OBRIGATÓRIAS:
- callToAction: NUNCA ultrapassar 35 caracteres, tom imperativo, sofisticado e humano
- disclaimer: NUNCA ultrapassar 330 caracteres, tom empático, sensorial e profissional
- Foque em proximidade, acompanhamento e segurança
- Evite clichês como \"melhor escolha\" ou \"sucesso garantido\"
- Responda APENAS com o JSON válido, sem comentários adicionais.`;

    const expectedFormat = `{
  "callToAction": "string (maximum 35 characters)",
  "disclaimer": "string (maximum 330 characters)"
}`;

    try {
      const moaResult = await this.moaService.generateWithRetry<{
        callToAction: string;
        disclaimer: string;
      }>(userPrompt, agent.systemPrompt, expectedFormat, agent.systemPrompt);

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Footer generated successfully");

        const footer: FlashFooterSection = {
          callToAction: moaResult.result.callToAction,
          disclaimer: moaResult.result.disclaimer,
        };
        this.validateFooterSection(footer);
        return footer;
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const response = await this.runLLM(userPrompt, agent.systemPrompt);
      const parsed = JSON.parse(response) as {
        callToAction: string;
        disclaimer: string;
      };

      const footer: FlashFooterSection = {
        callToAction: parsed.callToAction,
        disclaimer: parsed.disclaimer,
      };
      this.validateFooterSection(footer);
      return footer;
    } catch (error) {
      console.error("Flash Footer Generation Error:", error);

      // CallToAction: exactly 35 characters
      const callToAction = "Confie em nós para transformar tudo";

      // Disclaimer: exactly 330 characters
      const disclaimer =
        "Estamos ao seu lado em cada decisão, oferecendo acompanhamento dedicado, ajustes ágeis e orientações criteriosas. Nosso compromisso é transformar sua visão em realidade acolhedora, com transparência, carinho e uma equipe inteira pronta para apoiar você em cada etapa estratégica do seu projeto de crescimento sustentável e impacto real no mercado.";

      const fallback: FlashFooterSection = {
        callToAction,
        disclaimer: disclaimer.substring(0, 330), // Ensure exactly 330 chars
      };
      this.validateFooterSection(fallback);
      return fallback;
    }
  }

  private getFallbackFAQ(): FlashFAQSection {
    const baseEntries = [
      {
        question:
          "Como garantem que o cronograma será cumprido sem comprometer a qualidade em cada entrega prevista?",
        answer:
          "Trabalhamos com cronogramas detalhados, reuniões de checkpoint e líderes dedicados por frente. Monitoramos indicadores de progresso diariamente, antecipamos riscos com planos de contingência e comunicamos qualquer ajuste com total transparência, garantindo que qualidade e prazo avancem juntos com tranquilidade.",
      },
      {
        question:
          "Quais tipos de ajustes posso solicitar durante o desenvolvimento sem custos adicionais extras?",
        answer:
          "Incluímos ciclos de validação a cada etapa-chave para alinhar expectativas. Ajustes que mantêm o escopo definido, refinam conteúdos, cores, tipografia ou fluxos previstos já estão cobertos. Alterações estruturais significativas ou acréscimos de funcionalidades são avaliados com novo orçamento claro e prazos realistas.",
      },
      {
        question:
          "Quanto tempo em média leva a entrega do projeto completo do briefing à implantação final?",
        answer:
          "Projetos residenciais completos costumam levar entre seis e oito semanas. Iniciamos com um briefing profundo, validamos diretrizes criativas, desenvolvemos plantas e layouts, apresentamos moodboards, refinamos escolhas e conduzimos reuniões semanais para que cada decisão avance com segurança, sem atropelar detalhes fundamentais.",
      },
      {
        question:
          "Que tipo de suporte acompanham o cliente após a apresentação final da proposta?",
        answer:
          "Oferecemos acompanhamento dedicado por trinta dias corridos após a entrega para orientar implementações, responder dúvidas e ajustar detalhes finos. Mantemos canal direto de comunicação, enviamos materiais organizados e indicamos fornecedores confiáveis sempre que necessário para garantir execução impecável.",
      },
      {
        question:
          "Como estruturam o processo de pagamento para que eu possa planejar o investimento?",
        answer:
          "Trabalhamos com divisão em duas parcelas iguais: cinquenta por cento na assinatura para reservar calendário e iniciar a imersão; cinquenta por cento na entrega completa, após validação de cada etapa. Caso precise, avaliamos parcelamentos adicionais com contrato formal e cronograma financeiro customizado.",
      },
      {
        question:
          "Vou acompanhar o progresso do trabalho ou receberei apenas a entrega final pronta?",
        answer:
          "Você participa de marcos estratégicos previamente agendados. Compartilhamos apresentações intermediárias, plantas evolutivas e moodboards interativos, sempre com espaço para feedbacks. Além disso, disponibilizamos área centralizada com arquivos atualizados e comentários registrados para consulta a qualquer momento.",
      },
      {
        question:
          "Trabalham apenas com projetos completos ou também apoiam demandas pontuais específicas?",
        answer:
          "Atuamos em projetos residenciais completos, mas também desenhamos pacotes pontuais quando o contexto exige foco em ambientes-chave, revisões de layout ou consultorias específicas. Avaliamos cada solicitação, ajustamos escopo, garantimos coerência estética e mantemos o mesmo padrão estratégico em qualquer formato.",
      },
      {
        question:
          "Existe alguma forma de garantia sobre a consistência das decisões e materiais propostos?",
        answer:
          "Sim. Documentamos todas as escolhas com memoriais descritivos, especificações de materiais e orientações claras para fornecedores. Caso identifique qualquer divergência dentro de noventa dias, reavaliamos juntos e propomos ajustes pontuais sem custos, assegurando que a execução reflita exatamente o conceito aprovado.",
      },
      {
        question:
          "Posso solicitar novos ambientes ou mudanças grandes após a aprovação inicial sem retrabalho total?",
        answer:
          "Podemos incorporar novos ambientes mediante aditivo simples. Mantemos todo o estudo organizado em camadas, o que facilita evoluir o escopo sem recomeçar. Alinhamos impacto em prazo e investimento antes de seguir, garantindo previsibilidade e mantendo coerência estética entre as áreas originais e as recém-incluídas.",
      },
      {
        question:
          "Como asseguram a segurança das informações compartilhadas durante nosso projeto?",
        answer:
          "Utilizamos plataformas seguras para armazenar plantas e referências, adotamos controle de acesso restrito e realizamos backups automáticos. Compartilhamos documentos sensíveis apenas através de canais criptografados e seguimos cláusulas contratuais de confidencialidade rígidas para proteger dados pessoais e estratégicos.",
      },
    ];

    const faq = baseEntries.map((entry) => ({
      id: crypto.randomUUID(),
      question: entry.question.substring(0, 100), // Max 100 chars
      answer: entry.answer.substring(0, 300), // Max 300 chars
    }));

    return this.normalizeFAQSection(faq);
  }

  private async runLLM(
    userPrompt: string,
    systemPrompt: string
  ): Promise<string> {
    console.log("🔍 Flash LLM Debug:");
    console.log(
      "- System Prompt (primeiros 100 chars):",
      systemPrompt.substring(0, 100)
    );
    console.log(
      "- User Prompt (primeiros 100 chars):",
      userPrompt.substring(0, 100)
    );

    const response = await this.together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content?.trim();
    console.log(
      "- Response (primeiros 100 chars):",
      content?.substring(0, 100)
    );

    if (!content) {
      throw new Error("No response from LLM");
    }

    return content;
  }

  private async runLLMWithJSONRetry<T>(
    userPrompt: string,
    systemPrompt: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔍 Flash LLM Debug (Attempt ${attempt}):`);
        console.log(
          "- System Prompt (primeiros 100 chars):",
          systemPrompt.substring(0, 100)
        );
        console.log(
          "- User Prompt (primeiros 100 chars):",
          userPrompt.substring(0, 100)
        );

        const response = await this.together.chat.completions.create({
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content?.trim();
        console.log(
          "- Response (primeiros 100 chars):",
          content?.substring(0, 100)
        );

        if (!content) {
          throw new Error("No response from LLM");
        }

        // Try to parse JSON directly
        try {
          return JSON.parse(content) as T;
        } catch (parseError) {
          console.error(
            `Flash JSON Parse Error (Attempt ${attempt}):`,
            parseError
          );
          lastError = parseError as Error;

          if (attempt < maxRetries) {
            console.log(
              `🔄 Retrying JSON parsing (Attempt ${
                attempt + 1
              }/${maxRetries})...`
            );

            // Generate a retry prompt with more specific instructions
            const retryPrompt = generateJSONRetryPrompt(
              userPrompt,
              (parseError as Error).message,
              content
            );

            const retryResponse = await this.together.chat.completions.create({
              model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a JSON repair specialist. Fix malformed JSON to make it valid and properly formatted. Return only the corrected JSON.",
                },
                {
                  role: "user",
                  content: retryPrompt,
                },
              ],
              temperature: 0.1,
              max_tokens: 2000,
            });

            const retryContent =
              retryResponse.choices[0]?.message?.content?.trim();
            if (retryContent) {
              try {
                return JSON.parse(retryContent) as T;
              } catch (retryParseError) {
                console.error(
                  `Flash Retry JSON Parse Error (Attempt ${attempt}):`,
                  retryParseError
                );
                lastError = retryParseError as Error;
              }
            }
          }
        }
      } catch (error) {
        console.error(`Flash LLM Error (Attempt ${attempt}):`, error);
        lastError = error as Error;

        if (attempt < maxRetries) {
          console.log(
            `🔄 Retrying LLM call (Attempt ${attempt + 1}/${maxRetries})...`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        }
      }
    }

    throw new Error(
      `Flash LLM failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  async execute(data: FlashThemeData): Promise<FlashProposal> {
    console.log("Debug - Flash theme execute called with:", data);

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
      const proposal = await this.generateFlashProposal(data, agent);
      console.log("Debug - Flash proposal generated successfully");
      return proposal;
    } catch (error) {
      console.error("Flash Template Workflow Error:", error);
      throw error;
    }
  }
}

// Type definitions
export interface FlashIntroductionSection {
  userName?: string;
  email: string;
  title: string;
  subtitle: string;
  services: string[];
  validity: string;
  buttonText: string;
}

export interface FlashAboutUsSection {
  title: string;
  supportText: string;
  subtitle: string;
}

export interface FlashTeamSection {
  title: string;
  members: Array<{
    id?: string;
    name: string;
    role: string;
    image?: string;
    hideMember?: boolean;
    sortOrder?: number;
  }>;
}

export interface FlashSpecialtiesSection {
  title: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
}

export interface FlashStepsSection {
  title: string;
  introduction: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
  marquee: Array<{
    id?: string;
    text: string;
    hideItem?: boolean;
    sortOrder?: number;
  }>;
}

export interface FlashScopeSection {
  content: string;
}

export interface FlashInvestmentSection {
  title: string;
  deliverables: Array<{
    title: string;
    description: string;
  }>;
  plansItems: Array<{
    id?: string;
    hideTitleField?: boolean;
    hideDescription?: boolean;
    hidePrice?: boolean;
    hidePlanPeriod?: boolean;
    hideButtonTitle?: boolean;
    buttonTitle: string;
    planPeriod: string;
    recommended: boolean;
    sortOrder?: number;
    title: string;
    description: string;
    value: string;
    includedItems: Array<{
      id?: string;
      description: string;
      hideItem?: boolean;
      sortOrder?: number;
    }>;
  }>;
}

export interface FlashResultsSection {
  title: string;
  items: Array<{
    id: string;
    client: string;
    instagram: string;
    investment: string;
    roi: string;
    photo: string;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export interface FlashTestimonialsSection {
  title: string;
  items: Array<{
    id: string;
    name: string;
    role: string;
    testimonial: string;
    photo: string;
    hidePhoto: boolean;
    sortOrder: number;
  }>;
}

export type FlashTermsSection = Array<{
  id?: string;
  title: string;
  description: string;
}>;

export type FlashFAQSection = Array<{
  id: string;
  question: string;
  answer: string;
}>;

export interface FlashFooterSection {
  callToAction: string;
  disclaimer: string;
}

export interface FlashSection {
  type: string;
  content: Record<string, unknown>;
}

export interface FlashWorkflowResult {
  success: boolean;
  proposal?: FlashProposal;
  error?: string;
  metadata?: {
    sections: FlashSection[];
    generationTime: number;
  };
}

export class FlashTemplateWorkflow {
  private agent: BaseAgentConfig | null = null;
  private model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";

  async execute(data: FlashThemeData): Promise<FlashWorkflowResult> {
    const startTime = Date.now();

    try {
      console.log("🚀 Starting Flash workflow execution...");
      const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
      const flashTheme = new FlashTheme(together);
      const proposal = await flashTheme.execute(data);

      console.log(
        "✅ Flash workflow completed successfully in",
        Date.now() - startTime,
        "ms"
      );
      return {
        success: true,
        proposal,
        metadata: {
          sections: flashTheme["sections"] || [],
          generationTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error("❌ Flash Template Workflow Error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        duration: Date.now() - startTime,
      });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: {
          sections: [],
          generationTime: Date.now() - startTime,
        },
      };
    }
  }
}
