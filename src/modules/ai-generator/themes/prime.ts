import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { BaseThemeData } from "./base-theme";
import {
  ensureArray,
  ensureCondition,
  ensureLengthBetween,
  ensureMatchesRegex,
  ensureString,
  validateMaxLengthWithWarning,
} from "./validators";
import { safeJSONParse, generateJSONRetryPrompt } from "./json-utils";
import { MOAService } from "../services/moa-service";

export interface PrimeThemeData extends BaseThemeData {
  templateType: "prime";
  primeFeatures?: {
    premiumStyling: boolean;
    advancedCustomization: boolean;
    prioritySupport: boolean;
  };
}

export interface PrimeIntroductionSection {
  title: string;
  subtitle: string;
  services: string[];
  validity: string;
  buttonText: string;
}

export interface PrimeAboutUsSection {
  title: string;
  supportText: string;
  subtitle: string;
}

export interface PrimeTeamSection {
  title: string;
  subtitle: string;
}

export interface PrimeSpecialtiesSection {
  title: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
}

export interface PrimeProcessStepsSection {
  introduction: string;
  title: string;
  topics: Array<{
    title: string;
    description: string;
  }>;
}

export interface PrimeScopeSection {
  content: string;
}

export interface PrimeInvestmentSection {
  title: string;
  deliverables: Array<{
    title: string;
    description: string;
  }>;
  plans: Array<{
    title: string;
    description: string;
    value: string;
    topics: string[];
  }>;
}

export type PrimeFAQSection = Array<{
  question: string;
  answer: string;
}>;

export interface PrimeFooterSection {
  callToAction: string;
  contactInfo: string;
}

export interface PrimeSpecialtyTopic {
  title: string;
  description: string;
}

export interface PrimeStepsTopic {
  title: string;
  description: string;
}

export interface PrimeDeliverable {
  title: string;
  description: string;
}

export interface PrimePlan {
  id?: string;
  hideTitleField?: boolean;
  hideDescription?: boolean;
  hidePrice?: boolean;
  hidePlanPeriod?: boolean;
  hideButtonTitle?: boolean;
  buttonTitle: string;
  title: string;
  description: string;
  value: string;
  planPeriod: string;
  recommended: boolean;
  sortOrder?: number;
  includedItems: Array<{
    item: string;
    hideItem?: boolean;
    sortOrder?: number;
  }>;
}

export interface PrimeFAQItem {
  question: string;
  answer: string;
}

export interface PrimeProposal {
  introduction: {
    title: string;
    subtitle: string;
    services: string[];
    validity: string;
    buttonText: string;
  };
  aboutUs: {
    title: string;
    supportText: string;
    subtitle: string;
  };
  team: PrimeTeamSection;
  specialties: {
    title: string;
    topics: PrimeSpecialtyTopic[];
  };
  steps: {
    introduction: string;
    title: string;
    topics: PrimeStepsTopic[];
  };
  scope: {
    content: string;
  };
  investment: {
    title: string;
    deliverables: PrimeDeliverable[];
    plans: PrimePlan[];
  };
  terms?: {
    title: string;
    description: string;
  }[];
  faq: PrimeFAQItem[];
  footer: {
    callToAction: string;
    contactInfo: string;
  };
}

export interface PrimeWorkflowResult {
  success: boolean;
  templateType: "prime";
  data: PrimeProposal;
  metadata: {
    service: string;
    agent: string;
    timestamp: string;
    generationType: string;
  };
}

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });
const currencyRegex = /^R\$\d{1,3}(?:\.\d{3})?(?:,\d{2})?$/;

export class PrimeTemplateWorkflow {
  private agent: BaseAgentConfig | null = null;
  private model = "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";
  private moaService: MOAService;

  constructor() {
    this.moaService = new MOAService(client, {
      referenceModels: [
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "deepseek-ai/DeepSeek-V3.1",
        "Qwen/Qwen2.5-7B-Instruct-Turbo",
      ],
      aggregatorModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      maxRetries: 3,
      temperature: 0.6,
      maxTokens: 2500,
    });
  }

  async execute(data: PrimeThemeData): Promise<PrimeWorkflowResult> {
    const startTime = Date.now();

    try {
      console.log("🚀 Starting Prime workflow execution...");
      const proposal = await this.generateTemplateProposal(data);

      console.log(
        "✅ Prime workflow completed successfully in",
        Date.now() - startTime,
        "ms"
      );
      return {
        success: true,
        templateType: "prime",
        data: proposal,
        metadata: {
          service: data.selectedService,
          agent: this.agent?.name ?? "unknown",
          timestamp: new Date().toISOString(),
          generationType: "prime-workflow",
        },
      };
    } catch (error) {
      console.error("❌ Prime Template Workflow Error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        duration: Date.now() - startTime,
      });

      // Return a failed result instead of throwing
      return {
        success: false,
        templateType: "prime",
        data: {} as PrimeProposal, // Empty placeholder
        metadata: {
          service: data.selectedService,
          agent: this.agent?.name ?? "unknown",
          timestamp: new Date().toISOString(),
          generationType: "prime-workflow-failed",
        },
      };
    }
  }

  async generateTemplateProposal(data: PrimeThemeData): Promise<PrimeProposal> {
    this.agent = await getAgentByServiceAndTemplate(
      data.selectedService,
      "prime"
    );
    if (!this.agent) {
      throw new Error(
        `No agent found for service: ${data.selectedService} and template: prime`
      );
    }

    const [
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      terms,
      faq,
      footer,
    ] = await Promise.all([
      this.generateIntroduction(data),
      this.generateAboutUs(data),
      this.generateTeam(data),
      this.generateSpecialties(data),
      this.generateProcessSteps(data),
      this.generateScope(data),
      this.generateInvestment(data),
      data.includeTerms ? this.generateTerms(data) : Promise.resolve(undefined),
      this.generateFAQ(data),
      this.generateFooter(data),
    ]);

    return {
      introduction,
      aboutUs,
      team,
      specialties,
      steps,
      scope,
      investment,
      ...(terms ? { terms } : {}),
      faq,
      footer,
    };
  }

  private async generateIntroduction(data: PrimeThemeData) {
    const { cleanProjectNameForProposal } = await import(
      "../utils/project-name-handler"
    );
    const normalizedProjectName = cleanProjectNameForProposal(data.projectName);

    const userPrompt = `Você é um especialista em propostas premium. Responda APENAS com JSON válido.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${normalizedProjectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

IMPORTANTE: Os textos devem ter EXATAMENTE as contagens de caracteres especificadas (contando espaços).

Retorne:
{
  "title": "Frase imperativa premium, EXATAMENTE 60 caracteres",
  "subtitle": "Frase sobre valor, exclusividade e lucro, EXATAMENTE 100 caracteres",
  "services": [
    "Serviço com EXATAMENTE 30 caracteres",
    "Serviço com EXATAMENTE 30 caracteres",
    "Serviço com EXATAMENTE 30 caracteres",
    "Serviço com EXATAMENTE 30 caracteres"
  ],
  "validity": "dd/mm/aaaa",
  "buttonText": "texto"
}

Exemplos:
- Título com 60 caracteres: "Transforme sua visão em realidade com nossa expertise premium"
- Subtítulo com 100 caracteres: "Nós criamos soluções exclusivas que elevam seu negócio e multiplicam seus resultados."
- Serviços com 30 caracteres: "Consultoria estratégica", "Desenvolvimento premium"`;

    const expectedFormat = `{
  "title": "string (exactly 60 characters)",
  "subtitle": "string (exactly 100 characters)",
  "services": ["string (30 chars)", "string (30 chars)", "string (30 chars)", "string (30 chars)"],
  "validity": "string",
  "buttonText": "string"
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<PrimeIntroductionSection>(
          userPrompt,
          this.agent?.systemPrompt || "You are a premium proposal specialist.",
          expectedFormat,
          this.agent?.systemPrompt || "You are a premium proposal specialist."
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Prime Introduction generated successfully");
        const parsed = moaResult.result;

        // Validate and retry if needed
        const titleLength = parsed.title?.length || 0;
        const subtitleLength = parsed.subtitle?.length || 0;
        const servicesLength = parsed.services?.length || 0;
        const servicesValidLength =
          parsed.services?.every((s: string) => s.length === 30) || false;

        if (
          titleLength !== 60 ||
          subtitleLength !== 100 ||
          servicesLength !== 4 ||
          !servicesValidLength
        ) {
          console.log(
            `Prime Introduction length mismatch: title=${titleLength}, subtitle=${subtitleLength}, services=${servicesLength}, servicesValid=${servicesValidLength}, retrying...`
          );
          const retryPrompt = `O conteúdo anterior tinha contagens incorretas:
- Título: ${titleLength} caracteres (deveria ter 60)
- Subtítulo: ${subtitleLength} caracteres (deveria ter 100)
- Serviços: ${servicesLength} itens (deveria ter 4)
- Serviços válidos: ${servicesValidLength}

Crie novos textos com as contagens EXATAS:

{
  "title": "Novo título com exatamente 60 caracteres",
  "subtitle": "Novo subtítulo com exatamente 100 caracteres",
  "services": [
    "Serviço 1 com exatamente 30 caracteres",
    "Serviço 2 com exatamente 30 caracteres",
    "Serviço 3 com exatamente 30 caracteres",
    "Serviço 4 com exatamente 30 caracteres"
  ],
  "validity": "dd/mm/aaaa",
  "buttonText": "texto"
}`;

          const retryResponse = await this.runLLM(retryPrompt);
          const retryParsed = JSON.parse(retryResponse);

          const retryTitleValidation = validateMaxLengthWithWarning(
            retryParsed.title,
            60,
            "introduction.title"
          );
          const retrySubtitleValidation = validateMaxLengthWithWarning(
            retryParsed.subtitle,
            100,
            "introduction.subtitle"
          );

          if (retryTitleValidation.warning) {
            console.warn(
              "Prime Introduction Retry Title Warning:",
              retryTitleValidation.warning
            );
          }
          if (retrySubtitleValidation.warning) {
            console.warn(
              "Prime Introduction Retry Subtitle Warning:",
              retrySubtitleValidation.warning
            );
          }

          const retryServices = ensureArray<string>(
            retryParsed.services,
            "introduction.services"
          );
          ensureCondition(
            retryServices.length === 4,
            "introduction.services must have 4 items"
          );
          retryServices.forEach((service, index) => {
            const serviceValidation = validateMaxLengthWithWarning(
              service,
              30,
              `introduction.services[${index}]`
            );
            if (serviceValidation.warning) {
              console.warn(
                `Prime Introduction Retry Service ${index} Warning:`,
                serviceValidation.warning
              );
            }
          });

          return {
            title: retryTitleValidation.value,
            subtitle: retrySubtitleValidation.value,
            services: retryServices.map((service, index) => {
              const serviceValidation = validateMaxLengthWithWarning(
                service,
                30,
                `introduction.services[${index}]`
              );
              return serviceValidation.value;
            }),
            validity: ensureString(
              retryParsed.validity,
              "introduction.validity"
            ),
            buttonText: ensureString(
              retryParsed.buttonText,
              "introduction.buttonText"
            ),
          };
        }

        const titleValidation = validateMaxLengthWithWarning(
          parsed.title,
          60,
          "introduction.title"
        );
        const subtitleValidation = validateMaxLengthWithWarning(
          parsed.subtitle,
          100,
          "introduction.subtitle"
        );

        if (titleValidation.warning) {
          console.warn(
            "Prime Introduction Title Warning:",
            titleValidation.warning
          );
        }
        if (subtitleValidation.warning) {
          console.warn(
            "Prime Introduction Subtitle Warning:",
            subtitleValidation.warning
          );
        }

        const services = ensureArray<string>(
          parsed.services,
          "introduction.services"
        );
        ensureCondition(
          services.length === 4,
          "introduction.services must have 4 items"
        );
        services.forEach((service, index) => {
          const serviceValidation = validateMaxLengthWithWarning(
            service,
            30,
            `introduction.services[${index}]`
          );
          if (serviceValidation.warning) {
            console.warn(
              `Prime Introduction Service ${index} Warning:`,
              serviceValidation.warning
            );
          }
        });

        return {
          title: titleValidation.value,
          subtitle: subtitleValidation.value,
          services: services.map((service, index) => {
            const serviceValidation = validateMaxLengthWithWarning(
              service,
              30,
              `introduction.services[${index}]`
            );
            return serviceValidation.value;
          }),
          validity: ensureString(parsed.validity, "introduction.validity"),
          buttonText: ensureString(
            parsed.buttonText,
            "introduction.buttonText"
          ),
        };
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<PrimeIntroductionSection>(
        userPrompt
      );

      // Validate and retry if needed
      const titleLength = parsed.title?.length || 0;
      const subtitleLength = parsed.subtitle?.length || 0;
      const servicesLength = parsed.services?.length || 0;
      const servicesValidLength =
        parsed.services?.every((s: string) => s.length === 30) || false;

      if (
        titleLength !== 60 ||
        subtitleLength !== 100 ||
        servicesLength !== 4 ||
        !servicesValidLength
      ) {
        console.log(
          `Prime Introduction length mismatch: title=${titleLength}, subtitle=${subtitleLength}, services=${servicesLength}, servicesValid=${servicesValidLength}, retrying...`
        );
        const retryPrompt = `O conteúdo anterior tinha contagens incorretas:
- Título: ${titleLength} caracteres (deveria ter 60)
- Subtítulo: ${subtitleLength} caracteres (deveria ter 100)
- Serviços: ${servicesLength} itens (deveria ter 4)
- Serviços válidos: ${servicesValidLength}

Crie novos textos com as contagens EXATAS:

{
  "title": "Novo título com exatamente 60 caracteres",
  "subtitle": "Novo subtítulo com exatamente 100 caracteres",
  "services": [
    "Serviço 1 com exatamente 30 caracteres",
    "Serviço 2 com exatamente 30 caracteres",
    "Serviço 3 com exatamente 30 caracteres",
    "Serviço 4 com exatamente 30 caracteres"
  ],
  "validity": "dd/mm/aaaa",
  "buttonText": "texto"
}`;

        const retryResponse = await this.runLLM(retryPrompt);
        const retryParsed = JSON.parse(retryResponse);

        const retryTitleValidation = validateMaxLengthWithWarning(
          retryParsed.title,
          60,
          "introduction.title"
        );
        const retrySubtitleValidation = validateMaxLengthWithWarning(
          retryParsed.subtitle,
          100,
          "introduction.subtitle"
        );

        if (retryTitleValidation.warning) {
          console.warn(
            "Prime Introduction Retry Title Warning:",
            retryTitleValidation.warning
          );
        }
        if (retrySubtitleValidation.warning) {
          console.warn(
            "Prime Introduction Retry Subtitle Warning:",
            retrySubtitleValidation.warning
          );
        }

        const retryServices = ensureArray<string>(
          retryParsed.services,
          "introduction.services"
        );
        ensureCondition(
          retryServices.length === 4,
          "introduction.services must have 4 items"
        );
        retryServices.forEach((service, index) => {
          const serviceValidation = validateMaxLengthWithWarning(
            service,
            30,
            `introduction.services[${index}]`
          );
          if (serviceValidation.warning) {
            console.warn(
              `Prime Introduction Retry Service ${index} Warning:`,
              serviceValidation.warning
            );
          }
        });

        return {
          title: retryTitleValidation.value,
          subtitle: retrySubtitleValidation.value,
          services: retryServices.map((service, index) => {
            const serviceValidation = validateMaxLengthWithWarning(
              service,
              30,
              `introduction.services[${index}]`
            );
            return serviceValidation.value;
          }),
          validity: ensureString(retryParsed.validity, "introduction.validity"),
          buttonText: ensureString(
            retryParsed.buttonText,
            "introduction.buttonText"
          ),
        };
      }

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        60,
        "introduction.title"
      );
      const subtitleValidation = validateMaxLengthWithWarning(
        parsed.subtitle,
        100,
        "introduction.subtitle"
      );

      if (titleValidation.warning) {
        console.warn(
          "Prime Introduction Title Warning:",
          titleValidation.warning
        );
      }
      if (subtitleValidation.warning) {
        console.warn(
          "Prime Introduction Subtitle Warning:",
          subtitleValidation.warning
        );
      }

      const services = ensureArray<string>(
        parsed.services,
        "introduction.services"
      );
      ensureCondition(
        services.length === 4,
        "introduction.services must have 4 items"
      );
      services.forEach((service, index) => {
        const serviceValidation = validateMaxLengthWithWarning(
          service,
          30,
          `introduction.services[${index}]`
        );
        if (serviceValidation.warning) {
          console.warn(
            `Prime Introduction Service ${index} Warning:`,
            serviceValidation.warning
          );
        }
      });

      return {
        title: titleValidation.value,
        subtitle: subtitleValidation.value,
        services: services.map((service, index) => {
          const serviceValidation = validateMaxLengthWithWarning(
            service,
            30,
            `introduction.services[${index}]`
          );
          return serviceValidation.value;
        }),
        validity: ensureString(parsed.validity, "introduction.validity"),
        buttonText: ensureString(parsed.buttonText, "introduction.buttonText"),
      };
    } catch (error) {
      console.error("Prime Introduction Generation Error:", error);
      throw error;
    }
  }

  private async generateAboutUs(data: PrimeThemeData) {
    const userPrompt = `Crie uma seção "Sobre Nós" única e personalizada para nossa empresa no projeto ${
      data.projectName
    } de ${data.clientName}.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

IMPORTANTE: Os textos devem ter EXATAMENTE as contagens de caracteres especificadas (contando espaços).

Retorne APENAS um JSON válido com:
{
  "title": "Título que mostra transformação, valor e benefício com EXATAMENTE 155 caracteres",
  "supportText": "Texto de apoio sofisticado com EXATAMENTE 70 caracteres",
  "subtitle": "Subtítulo detalhado com EXATAMENTE 250 caracteres"
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 155 caracteres
- supportText: EXATAMENTE 70 caracteres
- subtitle: EXATAMENTE 250 caracteres
- Foque em transformação, impacto e lucro
- Use linguagem premium, sofisticada e confiante
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "title": "string (exactly 155 characters)",
  "supportText": "string (exactly 70 characters)",
  "subtitle": "string (exactly 250 characters)"
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<PrimeAboutUsSection>(
          userPrompt,
          this.agent?.systemPrompt || "You are a premium proposal specialist.",
          expectedFormat,
          this.agent?.systemPrompt || "You are a premium proposal specialist."
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Prime AboutUs generated successfully");
        const parsed = moaResult.result;

        // Validate and retry if needed
        if (
          parsed.title.length !== 155 ||
          parsed.supportText.length !== 70 ||
          parsed.subtitle.length !== 250
        ) {
          console.log(
            `Prime AboutUs length mismatch: title=${parsed.title.length}, supportText=${parsed.supportText.length}, subtitle=${parsed.subtitle.length}, retrying...`
          );
          const retryPrompt = `O conteúdo anterior tinha contagens incorretas:
- Título: ${parsed.title.length} caracteres (deveria ter 155)
- SupportText: ${parsed.supportText.length} caracteres (deveria ter 70)
- Subtítulo: ${parsed.subtitle.length} caracteres (deveria ter 250)

Crie novos textos com as contagens EXATAS:

{
  "title": "Novo título com exatamente 155 caracteres",
  "supportText": "Novo supportText com exatamente 70 caracteres",
  "subtitle": "Novo subtítulo com exatamente 250 caracteres"
}`;

          const retryResponse = await this.runLLM(retryPrompt);
          const retryParsed = JSON.parse(retryResponse);

          return {
            title: retryParsed.title,
            supportText: retryParsed.supportText,
            subtitle: retryParsed.subtitle,
          };
        }

        return {
          title: parsed.title,
          supportText: parsed.supportText,
          subtitle: parsed.subtitle,
        };
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<PrimeAboutUsSection>(
        userPrompt
      );

      // Validate and retry if needed
      if (
        parsed.title.length !== 155 ||
        parsed.supportText.length !== 70 ||
        parsed.subtitle.length !== 250
      ) {
        console.log(
          `Prime AboutUs length mismatch: title=${parsed.title.length}, supportText=${parsed.supportText.length}, subtitle=${parsed.subtitle.length}, retrying...`
        );
        const retryPrompt = `O conteúdo anterior tinha contagens incorretas:
- Título: ${parsed.title.length} caracteres (deveria ter 155)
- SupportText: ${parsed.supportText.length} caracteres (deveria ter 70)
- Subtítulo: ${parsed.subtitle.length} caracteres (deveria ter 250)

Crie novos textos com as contagens EXATAS:

{
  "title": "Novo título com exatamente 155 caracteres",
  "supportText": "Novo supportText com exatamente 70 caracteres",
  "subtitle": "Novo subtítulo com exatamente 250 caracteres"
}`;

        const retryResponse = await this.runLLM(retryPrompt);
        const retryParsed = JSON.parse(retryResponse);

        const retryTitleValidation = validateMaxLengthWithWarning(
          retryParsed.title,
          155,
          "aboutUs.title"
        );
        const retrySupportTextValidation = validateMaxLengthWithWarning(
          retryParsed.supportText,
          70,
          "aboutUs.supportText"
        );
        const retrySubtitleValidation = validateMaxLengthWithWarning(
          retryParsed.subtitle,
          250,
          "aboutUs.subtitle"
        );

        if (retryTitleValidation.warning) {
          console.warn(
            "Prime AboutUs Retry Title Warning:",
            retryTitleValidation.warning
          );
        }
        if (retrySupportTextValidation.warning) {
          console.warn(
            "Prime AboutUs Retry SupportText Warning:",
            retrySupportTextValidation.warning
          );
        }
        if (retrySubtitleValidation.warning) {
          console.warn(
            "Prime AboutUs Retry Subtitle Warning:",
            retrySubtitleValidation.warning
          );
        }

        return {
          title: retryTitleValidation.value,
          supportText: retrySupportTextValidation.value,
          subtitle: retrySubtitleValidation.value,
        };
      }

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        155,
        "aboutUs.title"
      );
      const supportTextValidation = validateMaxLengthWithWarning(
        parsed.supportText,
        70,
        "aboutUs.supportText"
      );
      const subtitleValidation = validateMaxLengthWithWarning(
        parsed.subtitle,
        250,
        "aboutUs.subtitle"
      );

      if (titleValidation.warning) {
        console.warn("Prime AboutUs Title Warning:", titleValidation.warning);
      }
      if (supportTextValidation.warning) {
        console.warn(
          "Prime AboutUs SupportText Warning:",
          supportTextValidation.warning
        );
      }
      if (subtitleValidation.warning) {
        console.warn(
          "Prime AboutUs Subtitle Warning:",
          subtitleValidation.warning
        );
      }

      return {
        title: titleValidation.value,
        supportText: supportTextValidation.value,
        subtitle: subtitleValidation.value,
      };
    } catch (error) {
      console.error("Prime AboutUs Generation Error:", error);
      throw error;
    }
  }

  private async generateTeam(data: PrimeThemeData) {
    const userPrompt = `Crie título e subtítulo para seção Time premium adaptados ao projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

IMPORTANTE: Os textos devem ter EXATAMENTE as contagens de caracteres especificadas (contando espaços).

Retorne APENAS um JSON válido com:
{
  "title": "Frase com confiança e parceria, EXATAMENTE 60 caracteres",
  "subtitle": "Frase sobre dedicação e proximidade, EXATAMENTE 120 caracteres"
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 60 caracteres
- subtitle: EXATAMENTE 120 caracteres
- Foque em parceria, confiança e dedicação
- Use linguagem premium e personalizada ao projeto
- Responda APENAS com o JSON válido.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<PrimeTeamSection>(
        userPrompt
      );

      // Validate and retry if needed
      if (parsed.title.length !== 60 || parsed.subtitle.length !== 120) {
        console.log(
          `Prime Team length mismatch: title=${parsed.title.length}, subtitle=${parsed.subtitle.length}, retrying...`
        );
        const retryPrompt = `O conteúdo anterior tinha contagens incorretas:
- Título: ${parsed.title.length} caracteres (deveria ter 60)
- Subtítulo: ${parsed.subtitle.length} caracteres (deveria ter 120)

Crie novos textos com as contagens EXATAS:

{
  "title": "Novo título com exatamente 60 caracteres",
  "subtitle": "Novo subtítulo com exatamente 120 caracteres"
}`;

        const retryResponse = await this.runLLM(retryPrompt);
        const retryParsed = JSON.parse(retryResponse);

        const retryTitleValidation = validateMaxLengthWithWarning(
          retryParsed.title,
          60,
          "team.title"
        );
        const retrySubtitleValidation = validateMaxLengthWithWarning(
          retryParsed.subtitle,
          120,
          "team.subtitle"
        );

        if (retryTitleValidation.warning) {
          console.warn(
            "Prime Team Retry Title Warning:",
            retryTitleValidation.warning
          );
        }
        if (retrySubtitleValidation.warning) {
          console.warn(
            "Prime Team Retry Subtitle Warning:",
            retrySubtitleValidation.warning
          );
        }

        return {
          title: retryTitleValidation.value,
          subtitle: retrySubtitleValidation.value,
        };
      }

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        60,
        "team.title"
      );
      const subtitleValidation = validateMaxLengthWithWarning(
        parsed.subtitle,
        120,
        "team.subtitle"
      );

      if (titleValidation.warning) {
        console.warn("Prime Team Title Warning:", titleValidation.warning);
      }
      if (subtitleValidation.warning) {
        console.warn(
          "Prime Team Subtitle Warning:",
          subtitleValidation.warning
        );
      }

      return {
        title: titleValidation.value,
        subtitle: subtitleValidation.value,
      };
    } catch (error) {
      console.error("Prime Team Generation Error:", error);
      throw error;
    }
  }

  private async generateSpecialties(data: PrimeThemeData) {
    const userPrompt = `Crie especialidades premium personalizadas para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON válido com:
{
  "title": "Título com autoridade e resultados, EXATAMENTE 180 caracteres",
  "topics": [
    {
      "title": "Especialidade com EXATAMENTE 60 caracteres",
      "description": "Descrição com EXATAMENTE 140 caracteres"
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 180 caracteres
- topics: EXATAMENTE 9 especialidades
- Cada topic.title: EXATAMENTE 60 caracteres
- Cada topic.description: EXATAMENTE 140 caracteres
- Personalize conforme o setor e projeto do cliente
- Use linguagem premium e técnica
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "title": "string (max 180 characters)",
  "topics": [
    {
      "title": "string (max 60 characters)",
      "description": "string (max 140 characters)"
    }
  ]
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<PrimeSpecialtiesSection>(
          userPrompt,
          this.agent?.systemPrompt || "You are a premium proposal specialist.",
          expectedFormat,
          this.agent?.systemPrompt || "You are a premium proposal specialist."
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Prime Specialties generated successfully");
        const parsed = moaResult.result;

        const topics = ensureArray<PrimeSpecialtyTopic>(
          parsed.topics,
          "specialties.topics"
        );
        ensureCondition(
          topics.length === 9,
          "specialties.topics must have exactly 9 items"
        );

        const titleValidation = validateMaxLengthWithWarning(
          parsed.title,
          180,
          "specialties.title"
        );

        if (titleValidation.warning) {
          console.warn(
            "Prime Specialties Title Warning:",
            titleValidation.warning
          );
        }

        return {
          title: titleValidation.value,
          topics: topics.map((topic, index) => {
            const topicTitleValidation = validateMaxLengthWithWarning(
              topic.title,
              60,
              `specialties.topics[${index}].title`
            );
            const topicDescValidation = validateMaxLengthWithWarning(
              topic.description,
              140,
              `specialties.topics[${index}].description`
            );

            if (topicTitleValidation.warning) {
              console.warn(
                `Prime Specialties Topic ${index} Title Warning:`,
                topicTitleValidation.warning
              );
            }
            if (topicDescValidation.warning) {
              console.warn(
                `Prime Specialties Topic ${index} Description Warning:`,
                topicDescValidation.warning
              );
            }

            return {
              title: topicTitleValidation.value,
              description: topicDescValidation.value,
            };
          }),
        };
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<PrimeSpecialtiesSection>(
        userPrompt
      );

      const topics = ensureArray<PrimeSpecialtyTopic>(
        parsed.topics,
        "specialties.topics"
      );
      ensureCondition(
        topics.length === 9,
        "specialties.topics must have exactly 9 items"
      );

      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        180,
        "specialties.title"
      );

      if (titleValidation.warning) {
        console.warn(
          "Prime Specialties Title Warning:",
          titleValidation.warning
        );
      }

      return {
        title: titleValidation.value,
        topics: topics.map((topic, index) => {
          const topicTitleValidation = validateMaxLengthWithWarning(
            topic.title,
            60,
            `specialties.topics[${index}].title`
          );
          const topicDescValidation = validateMaxLengthWithWarning(
            topic.description,
            140,
            `specialties.topics[${index}].description`
          );

          if (topicTitleValidation.warning) {
            console.warn(
              `Prime Specialties Topic ${index} Title Warning:`,
              topicTitleValidation.warning
            );
          }
          if (topicDescValidation.warning) {
            console.warn(
              `Prime Specialties Topic ${index} Description Warning:`,
              topicDescValidation.warning
            );
          }

          return {
            title: topicTitleValidation.value,
            description: topicDescValidation.value,
          };
        }),
      };
    } catch (error) {
      console.error("Prime Specialties Generation Error:", error);
      throw error;
    }
  }

  private async generateProcessSteps(data: PrimeThemeData) {
    const userPrompt = `Crie processo premium personalizado para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON válido com:
{
  "introduction": "Frase introdutória com EXATAMENTE 120 caracteres",
  "title": "Título do processo com EXATAMENTE 50 caracteres",
  "topics": [
    {
      "title": "Nome da etapa com EXATAMENTE 45 caracteres",
      "description": "Descrição detalhada com EXATAMENTE 260 caracteres"
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- introduction: EXATAMENTE 120 caracteres
- title: EXATAMENTE 50 caracteres
- topics: EXATAMENTE 6 etapas
- Cada topic.title: EXATAMENTE 45 caracteres
- Cada topic.description: EXATAMENTE 260 caracteres
- Personalize o processo conforme o projeto
- Use linguagem premium e profissional
- Responda APENAS com o JSON válido.`;

    const expectedFormat = `{
  "introduction": "string (max 120 characters)",
  "title": "string (max 50 characters)",
  "topics": [
    {
      "title": "string (max 45 characters)",
      "description": "string (max 260 characters)"
    }
  ]
}`;

    try {
      const moaResult =
        await this.moaService.generateWithRetry<PrimeProcessStepsSection>(
          userPrompt,
          this.agent?.systemPrompt || "You are a premium proposal specialist.",
          expectedFormat,
          this.agent?.systemPrompt || "You are a premium proposal specialist."
        );

      if (moaResult.success && moaResult.result) {
        console.log("✅ MoA Prime ProcessSteps generated successfully");
        const parsed = moaResult.result;

        const topics = ensureArray<PrimeStepsTopic>(
          parsed.topics,
          "steps.topics"
        );
        ensureCondition(
          topics.length === 6,
          "steps.topics must have exactly 6 items"
        );

        const introValidation = validateMaxLengthWithWarning(
          parsed.introduction,
          120,
          "steps.introduction"
        );
        const titleValidation = validateMaxLengthWithWarning(
          parsed.title,
          50,
          "steps.title"
        );

        if (introValidation.warning) {
          console.warn(
            "Prime Steps Introduction Warning:",
            introValidation.warning
          );
        }
        if (titleValidation.warning) {
          console.warn("Prime Steps Title Warning:", titleValidation.warning);
        }

        return {
          introduction: introValidation.value,
          title: titleValidation.value,
          topics: topics.map((topic, index) => {
            const topicTitleValidation = validateMaxLengthWithWarning(
              topic.title,
              45,
              `steps.topics[${index}].title`
            );
            const topicDescValidation = validateMaxLengthWithWarning(
              topic.description,
              260,
              `steps.topics[${index}].description`
            );

            if (topicTitleValidation.warning) {
              console.warn(
                `Prime Steps Topic ${index} Title Warning:`,
                topicTitleValidation.warning
              );
            }
            if (topicDescValidation.warning) {
              console.warn(
                `Prime Steps Topic ${index} Description Warning:`,
                topicDescValidation.warning
              );
            }

            return {
              title: topicTitleValidation.value,
              description: topicDescValidation.value,
            };
          }),
        };
      }

      // Fallback to single model if MoA fails
      console.warn("MoA failed, falling back to single model");
      const parsed = await this.runLLMWithJSONRetry<PrimeProcessStepsSection>(
        userPrompt
      );

      const topics = ensureArray<PrimeStepsTopic>(
        parsed.topics,
        "steps.topics"
      );
      ensureCondition(
        topics.length === 6,
        "steps.topics must have exactly 6 items"
      );

      const introValidation = validateMaxLengthWithWarning(
        parsed.introduction,
        120,
        "steps.introduction"
      );
      const titleValidation = validateMaxLengthWithWarning(
        parsed.title,
        50,
        "steps.title"
      );

      if (introValidation.warning) {
        console.warn(
          "Prime Steps Introduction Warning:",
          introValidation.warning
        );
      }
      if (titleValidation.warning) {
        console.warn("Prime Steps Title Warning:", titleValidation.warning);
      }

      return {
        introduction: introValidation.value,
        title: titleValidation.value,
        topics: topics.map((topic, index) => {
          const topicTitleValidation = validateMaxLengthWithWarning(
            topic.title,
            45,
            `steps.topics[${index}].title`
          );
          const topicDescValidation = validateMaxLengthWithWarning(
            topic.description,
            260,
            `steps.topics[${index}].description`
          );

          if (topicTitleValidation.warning) {
            console.warn(
              `Prime Steps Topic ${index} Title Warning:`,
              topicTitleValidation.warning
            );
          }
          if (topicDescValidation.warning) {
            console.warn(
              `Prime Steps Topic ${index} Description Warning:`,
              topicDescValidation.warning
            );
          }

          return {
            title: topicTitleValidation.value,
            description: topicDescValidation.value,
          };
        }),
      };
    } catch (error) {
      console.error("Prime ProcessSteps Generation Error:", error);
      throw error;
    }
  }

  private async generateScope(data: PrimeThemeData) {
    const userPrompt = `Crie escopo premium personalizado para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Crie o conteúdo da seção "Escopo do Projeto" (EXATAMENTE 400 caracteres):
- Integre benefícios do investimento e entregas principais
- Foque em transformação, crescimento e previsibilidade
- Personalize conforme as necessidades do cliente e projeto
- Linguagem natural, ativa, confiante e premium
- Seja conciso e direto ao ponto

Retorne APENAS um JSON válido com:
{
  "content": "Texto descritivo com EXATAMENTE 400 caracteres"
}

REGRAS OBRIGATÓRIAS:
- content: EXATAMENTE 400 caracteres
- Personalize conforme o projeto do cliente
- Use linguagem premium e profissional
- Responda APENAS com o JSON válido.`;

    try {
      const parsed = await this.runLLMWithJSONRetry<PrimeScopeSection>(
        userPrompt
      );

      // Validate with max length warning instead of throwing error
      const validation = validateMaxLengthWithWarning(
        parsed.content,
        400,
        "scope.content"
      );

      if (validation.warning) {
        console.warn("Prime Scope Generation Warning:", validation.warning);
      }

      return { content: validation.value };
    } catch (error) {
      console.error("Prime Scope Generation Error:", error);
      // Return a fallback instead of throwing
      return {
        content:
          "Nosso projeto premium reúne estratégias digitais avançadas que elevam sua autoridade e ampliam suas oportunidades de crescimento sustentável. Através de campanhas inteligentes, conteúdos direcionados e automações otimizadas, entregamos resultados sólidos, aceleramos a conquista de clientes e fortalecemos o posicionamento no mercado de forma consistente e mensurável.",
      };
    }
  }

  private async generateInvestment(data: PrimeThemeData) {
    const userPrompt = `Crie seção de investimento premium personalizada para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON válido com:
{
  "title": "Título de investimento com EXATAMENTE 95 caracteres",
  "deliverables": [
    {
      "title": "Nome da entrega com EXATAMENTE 35 caracteres",
      "description": "Descrição detalhada com EXATAMENTE 350 caracteres"
    }
  ],
  "plans": [
    {
      "title": "Nome do plano com EXATAMENTE 25 caracteres",
      "description": "Descrição do plano com EXATAMENTE 110 caracteres",
      "value": "R$X.XXX",
      "topics": ["Benefício com até 50 caracteres"]
    }
  ]
}

REGRAS OBRIGATÓRIAS:
- title: EXATAMENTE 95 caracteres
- deliverables: Mínimo 3 entregas
- Cada deliverable.title: EXATAMENTE 35 caracteres
- Cada deliverable.description: EXATAMENTE 350 caracteres
- plans: EXATAMENTE 3 planos
- Cada plan.title: EXATAMENTE 25 caracteres
- Cada plan.description: EXATAMENTE 110 caracteres
- Cada plan deve ter 4 a 6 topics (cada topic até 50 caracteres)
- Personalize conforme o projeto do cliente
- Use linguagem premium e profissional
- Responda APENAS com o JSON válido.`;

    const parsed = await this.runLLMWithJSONRetry<PrimeInvestmentSection>(
      userPrompt
    );

    const deliverables = ensureArray<PrimeDeliverable>(
      parsed.deliverables,
      "investment.deliverables"
    );
    ensureCondition(
      deliverables.length >= 3,
      "investment.deliverables must contain at least 3 items"
    );

    const plans = ensureArray<PrimePlan>(parsed.plans, "investment.plans");
    ensureCondition(
      plans.length === 3,
      "investment.plans must contain exactly 3 items"
    );

    const titleValidation = validateMaxLengthWithWarning(
      parsed.title,
      95,
      "investment.title"
    );

    if (titleValidation.warning) {
      console.warn("Prime Investment Title Warning:", titleValidation.warning);
    }

    return {
      title: titleValidation.value,
      deliverables: deliverables.map((deliverable, index) => {
        const deliverableTitleValidation = validateMaxLengthWithWarning(
          deliverable.title,
          35,
          `investment.deliverables[${index}].title`
        );
        const deliverableDescValidation = validateMaxLengthWithWarning(
          deliverable.description,
          350,
          `investment.deliverables[${index}].description`
        );

        if (deliverableTitleValidation.warning) {
          console.warn(
            `Prime Investment Deliverable ${index} Title Warning:`,
            deliverableTitleValidation.warning
          );
        }
        if (deliverableDescValidation.warning) {
          console.warn(
            `Prime Investment Deliverable ${index} Description Warning:`,
            deliverableDescValidation.warning
          );
        }

        return {
          title: deliverableTitleValidation.value,
          description: deliverableDescValidation.value,
        };
      }),
      plans: plans.map((plan, index) => {
        const planTitleValidation = validateMaxLengthWithWarning(
          plan.title,
          25,
          `investment.plans[${index}].title`
        );
        const planDescValidation = validateMaxLengthWithWarning(
          plan.description,
          110,
          `investment.plans[${index}].description`
        );

        if (planTitleValidation.warning) {
          console.warn(
            `Prime Investment Plan ${index} Title Warning:`,
            planTitleValidation.warning
          );
        }
        if (planDescValidation.warning) {
          console.warn(
            `Prime Investment Plan ${index} Description Warning:`,
            planDescValidation.warning
          );
        }

        ensureMatchesRegex(
          plan.value,
          currencyRegex,
          `investment.plans[${index}].value`
        );
        ensureCondition(
          plan.includedItems.length >= 4 && plan.includedItems.length <= 6,
          `investment.plans[${index}].includedItems must contain 4 to 6 items`
        );

        return {
          title: planTitleValidation.value,
          description: planDescValidation.value,
          value: plan.value,
          planPeriod: "mensal", // Add default plan period
          buttonTitle: "Contratar", // Add default button title
          recommended: index === 1, // Mark middle plan as recommended
          hideTitleField: false,
          hideDescription: false,
          hidePrice: false,
          hidePlanPeriod: false,
          hideButtonTitle: false,
          sortOrder: index,
          includedItems: plan.includedItems.map((item, itemIndex) => ({
            item: item.item,
            hideItem: false,
            sortOrder: itemIndex,
          })),
        };
      }),
    };
  }

  private async generateTerms(data: PrimeThemeData) {
    const userPrompt = `Crie termos e condições premium personalizados para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON array com termos e condições:
[
  {
    "title": "Nome do termo com EXATAMENTE 35 caracteres",
    "description": "Descrição do termo com EXATAMENTE 200 caracteres"
  }
]

REGRAS OBRIGATÓRIAS:
- Mínimo 1 e máximo 5 termos
- Cada title: EXATAMENTE 35 caracteres
- Cada description: EXATAMENTE 200 caracteres
- Personalize conforme o tipo de projeto
- Use linguagem premium e profissional
- Responda APENAS com o JSON válido.`;

    const parsed = await this.runLLMWithJSONRetry<
      Array<{ title: string; description: string }>
    >(userPrompt);
    const terms = ensureArray<{ title: string; description: string }>(
      parsed,
      "terms"
    );

    ensureLengthBetween(terms, 1, 5, "terms");

    return terms.map((term, index) => {
      const titleValidation = validateMaxLengthWithWarning(
        term.title,
        35,
        `terms[${index}].title`
      );
      const descValidation = validateMaxLengthWithWarning(
        term.description,
        200,
        `terms[${index}].description`
      );

      if (titleValidation.warning) {
        console.warn(
          `Prime Terms ${index} Title Warning:`,
          titleValidation.warning
        );
      }
      if (descValidation.warning) {
        console.warn(
          `Prime Terms ${index} Description Warning:`,
          descValidation.warning
        );
      }

      return {
        title: titleValidation.value,
        description: descValidation.value,
      };
    });
  }

  private async generateFAQ(data: PrimeThemeData) {
    const userPrompt = `Crie FAQ premium personalizado para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON array com perguntas frequentes:
[
  {
    "question": "Pergunta relevante com até 120 caracteres",
    "answer": "Resposta detalhada com até 320 caracteres"
  }
]

REGRAS OBRIGATÓRIAS:
- EXATAMENTE 8 perguntas
- Cada question: Máximo 120 caracteres
- Cada answer: Máximo 320 caracteres
- Perguntas devem ser relevantes ao projeto e setor
- Respostas devem ser detalhadas e profissionais
- Personalize conforme o tipo de projeto do cliente
- Use linguagem premium e clara
- Responda APENAS com o JSON válido.`;

    const parsed = await this.runLLMWithJSONRetry<PrimeFAQSection>(userPrompt);
    const faq = ensureArray<PrimeFAQItem>(parsed, "faq");

    ensureCondition(faq.length === 8, "faq must contain exactly 8 items");

    return faq.map((item, index) => {
      const questionValidation = validateMaxLengthWithWarning(
        item.question,
        120,
        `faq[${index}].question`
      );
      const answerValidation = validateMaxLengthWithWarning(
        item.answer,
        320,
        `faq[${index}].answer`
      );

      if (questionValidation.warning) {
        console.warn(
          `Prime FAQ ${index} Question Warning:`,
          questionValidation.warning
        );
      }
      if (answerValidation.warning) {
        console.warn(
          `Prime FAQ ${index} Answer Warning:`,
          answerValidation.warning
        );
      }

      return {
        question: questionValidation.value,
        answer: answerValidation.value,
      };
    });
  }

  private async generateFooter(data: PrimeThemeData) {
    const userPrompt = `Crie footer premium personalizado para o projeto.

DADOS DO PROJETO:
- Cliente: ${data.clientName}
- Projeto: ${data.projectName}
- Descrição: ${data.projectDescription}
- Sobre o Cliente: ${data.clientDescription || "Não informado"}
- Empresa: ${data.companyInfo}

Retorne APENAS um JSON válido com:
{
  "callToAction": "Frase call-to-action com até 60 caracteres",
  "contactInfo": "Texto com informações de contato com até 150 caracteres"
}

REGRAS OBRIGATÓRIAS:
- callToAction: Máximo 60 caracteres
- contactInfo: Máximo 150 caracteres
- Personalize conforme o projeto
- Use linguagem premium, convidativa e profissional
- Responda APENAS com o JSON válido.`;

    const parsed = await this.runLLMWithJSONRetry<PrimeFooterSection>(
      userPrompt
    );

    const callToActionValidation = validateMaxLengthWithWarning(
      parsed.callToAction,
      60,
      "footer.callToAction"
    );
    const contactInfoValidation = validateMaxLengthWithWarning(
      parsed.contactInfo,
      150,
      "footer.contactInfo"
    );

    if (callToActionValidation.warning) {
      console.warn(
        "Prime Footer CallToAction Warning:",
        callToActionValidation.warning
      );
    }
    if (contactInfoValidation.warning) {
      console.warn(
        "Prime Footer ContactInfo Warning:",
        contactInfoValidation.warning
      );
    }

    return {
      callToAction: callToActionValidation.value,
      contactInfo: contactInfoValidation.value,
    };
  }

  private async runLLM(userPrompt: string): Promise<string> {
    const systemPrompt = this.agent?.systemPrompt ?? "";
    const response = await client.chat.completions.create({
      model: this.model,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.4,
      presence_penalty: 0.3,
      stop: ["```", "```json", "```JSON", "\n\n\n"],
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const result = response.choices[0]?.message?.content;
    ensureCondition(
      result !== undefined && result !== null,
      "LLM returned an empty response"
    );

    return result!.trim();
  }

  private async runLLMWithJSONRetry<T>(
    userPrompt: string,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: string = "";
    let lastResponse: string = "";

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.runLLM(
          attempt === 0
            ? userPrompt
            : generateJSONRetryPrompt(userPrompt, lastError, lastResponse)
        );

        console.log({ response });
        const parseResult = safeJSONParse<T>(response);

        if (parseResult.success && parseResult.data) {
          return parseResult.data;
        }

        lastError = parseResult.error || "Unknown JSON parsing error";
        lastResponse = parseResult.rawResponse || response;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }

    throw new Error(
      `Failed to parse JSON after ${
        maxRetries + 1
      } attempts. Last error: ${lastError}`
    );
  }
}
