import Together from "together-ai";
import { getAgentByServiceAndTemplate, type BaseAgentConfig } from "../agents";
import { BaseThemeData } from "./base-theme";
import {
  ensureArray,
  ensureCondition,
  ensureExactLength,
  ensureLengthBetween,
  ensureMatchesRegex,
  ensureMaxLength,
  ensureString,
} from "./validators";

export interface PrimeThemeData extends BaseThemeData {
  templateType: "prime";
  primeFeatures?: {
    premiumStyling: boolean;
    advancedCustomization: boolean;
    prioritySupport: boolean;
  };
}

export interface PrimeTeamSection {
  title: string;
  subtitle: string;
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
  title: string;
  description: string;
  value: string;
  topics: string[];
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

  async execute(data: PrimeThemeData): Promise<PrimeWorkflowResult> {
    const proposal = await this.generateTemplateProposal(data);

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
      this.generateAboutUs(),
      this.generateTeam(),
      this.generateSpecialties(),
      this.generateProcessSteps(),
      this.generateScope(),
      this.generateInvestment(),
      data.includeTerms ? this.generateTerms() : Promise.resolve(undefined),
      this.generateFAQ(),
      this.generateFooter(),
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
- Projeto: ${normalizedProjectName}
- Setor: ${this.agent?.sector}
- Serviços: ${this.agent?.commonServices.join(", ")}

Retorne:
{
  "title": "Frase imperativa premium, exatamente 60 caracteres",
  "subtitle": "Frase sobre valor, exclusividade e lucro, exatamente 100 caracteres",
  "services": [
    "Serviço com exatamente 30 caracteres",
    "Serviço com exatamente 30 caracteres",
    "Serviço com exatamente 30 caracteres",
    "Serviço com exatamente 30 caracteres"
  ],
  "validity": "dd/mm/aaaa",
  "buttonText": "texto"
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    const title = ensureExactLength(parsed.title, 60, "introduction.title");
    const subtitle = ensureExactLength(
      parsed.subtitle,
      100,
      "introduction.subtitle"
    );
    const services = ensureArray<string>(
      parsed.services,
      "introduction.services"
    );
    ensureCondition(
      services.length === 4,
      "introduction.services must have 4 items"
    );
    services.forEach((service, index) =>
      ensureExactLength(service, 30, `introduction.services[${index}]`)
    );

    return {
      title,
      subtitle,
      services,
      validity: ensureString(parsed.validity, "introduction.validity"),
      buttonText: ensureString(parsed.buttonText, "introduction.buttonText"),
    };
  }

  private async generateAboutUs() {
    const userPrompt = `Crie seção Sobre Nós premium. Responda somente com JSON.

Retorne:
{
  "title": "Frase com transformação e lucro, 155 caracteres",
  "supportText": "Frase de apoio sofisticada, 70 caracteres",
  "subtitle": "Descrição detalhada sem citar cliente, 250 caracteres"
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    return {
      title: ensureExactLength(parsed.title, 155, "aboutUs.title"),
      supportText: ensureExactLength(
        parsed.supportText,
        70,
        "aboutUs.supportText"
      ),
      subtitle: ensureExactLength(parsed.subtitle, 250, "aboutUs.subtitle"),
    };
  }

  private async generateTeam() {
    const userPrompt = `Crie título e subtítulo para seção Time premium. Retorne JSON.
{
  "title": "Frase com confiança e parceria, 60 caracteres",
  "subtitle": "Frase sobre dedicação e proximidade, 120 caracteres"
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    return {
      title: ensureExactLength(parsed.title, 60, "team.title"),
      subtitle: ensureExactLength(parsed.subtitle, 120, "team.subtitle"),
    };
  }

  private async generateSpecialties() {
    const userPrompt = `Crie especialidades premium. Responda com JSON.
{
  "title": "Título com autoridade e resultados, 180 caracteres",
  "topics": [
    {
      "title": "Especialidade com 60 caracteres",
      "description": "Descrição com 140 caracteres"
    }
  ]
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    const topics = ensureArray<PrimeSpecialtyTopic>(
      parsed.topics,
      "specialties.topics"
    );
    ensureCondition(
      topics.length === 9,
      "specialties.topics must have exactly 9 items"
    );

    return {
      title: ensureExactLength(parsed.title, 180, "specialties.title"),
      topics: topics.map((topic, index) => ({
        title: ensureExactLength(
          topic.title,
          60,
          `specialties.topics[${index}].title`
        ),
        description: ensureExactLength(
          topic.description,
          140,
          `specialties.topics[${index}].description`
        ),
      })),
    };
  }

  private async generateProcessSteps() {
    const userPrompt = `Crie processo premium. Retorne JSON.
{
  "introduction": "Frase com 120 caracteres",
  "title": "Frase com 50 caracteres",
  "topics": [
    {
      "title": "Etapa com 45 caracteres",
      "description": "Descrição com 260 caracteres"
    }
  ]
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    const topics = ensureArray<PrimeStepsTopic>(parsed.topics, "steps.topics");
    ensureCondition(
      topics.length === 6,
      "steps.topics must have exactly 6 items"
    );

    return {
      introduction: ensureExactLength(
        parsed.introduction,
        120,
        "steps.introduction"
      ),
      title: ensureExactLength(parsed.title, 50, "steps.title"),
      topics: topics.map((topic, index) => ({
        title: ensureExactLength(
          topic.title,
          45,
          `steps.topics[${index}].title`
        ),
        description: ensureExactLength(
          topic.description,
          260,
          `steps.topics[${index}].description`
        ),
      })),
    };
  }

  private async generateScope() {
    const userPrompt = `Crie escopo premium. Retorne JSON.
{
  "content": "Texto com exatamente 400 caracteres"
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    return {
      content: ensureExactLength(parsed.content, 400, "scope.content"),
    };
  }

  private async generateInvestment() {
    const userPrompt = `Crie seção de investimento premium. Retorne JSON.
{
  "title": "Título com 95 caracteres",
  "deliverables": [
    {
      "title": "Entrega com 35 caracteres",
      "description": "Descrição com 350 caracteres"
    }
  ],
  "plans": [
    {
      "title": "Nome do plano com 25 caracteres",
      "description": "Descrição com 110 caracteres",
      "value": "R$X.XXX",
      "topics": ["Benefício com até 50 caracteres"]
    }
  ]
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

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

    return {
      title: ensureExactLength(parsed.title, 95, "investment.title"),
      deliverables: deliverables.map((deliverable, index) => ({
        title: ensureExactLength(
          deliverable.title,
          35,
          `investment.deliverables[${index}].title`
        ),
        description: ensureExactLength(
          deliverable.description,
          350,
          `investment.deliverables[${index}].description`
        ),
      })),
      plans: plans.map((plan, index) => {
        ensureMatchesRegex(
          plan.value,
          currencyRegex,
          `investment.plans[${index}].value`
        );
        ensureCondition(
          plan.topics.length >= 4 && plan.topics.length <= 6,
          `investment.plans[${index}].topics must contain 4 to 6 items`
        );

        return {
          title: ensureExactLength(
            plan.title,
            25,
            `investment.plans[${index}].title`
          ),
          description: ensureExactLength(
            plan.description,
            110,
            `investment.plans[${index}].description`
          ),
          value: plan.value,
          topics: plan.topics.map((topic, topicIndex) =>
            ensureMaxLength(
              topic,
              50,
              `investment.plans[${index}].topics[${topicIndex}]`
            )
          ),
        };
      }),
    };
  }

  private async generateTerms() {
    const userPrompt = `Crie termos premium. Retorne JSON.
[
  {
    "title": "Termo com 35 caracteres",
    "description": "Descrição com 200 caracteres"
  }
]`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);
    const terms = ensureArray<{ title: string; description: string }>(
      parsed,
      "terms"
    );

    ensureLengthBetween(terms, 1, 5, "terms");

    return terms.map((term, index) => ({
      title: ensureExactLength(term.title, 35, `terms[${index}].title`),
      description: ensureExactLength(
        term.description,
        200,
        `terms[${index}].description`
      ),
    }));
  }

  private async generateFAQ() {
    const userPrompt = `Crie FAQ premium. Retorne JSON.
[
  {
    "question": "Pergunta com 120 caracteres",
    "answer": "Resposta com 320 caracteres"
  }
]`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);
    const faq = ensureArray<PrimeFAQItem>(parsed, "faq");

    ensureCondition(faq.length === 8, "faq must contain exactly 8 items");

    return faq.map((item, index) => ({
      question: ensureExactLength(item.question, 120, `faq[${index}].question`),
      answer: ensureExactLength(item.answer, 320, `faq[${index}].answer`),
    }));
  }

  private async generateFooter() {
    const userPrompt = `Crie footer premium. Retorne JSON.
{
  "callToAction": "Frase com 60 caracteres",
  "contactInfo": "Texto com 150 caracteres"
}`;

    const response = await this.runLLM(userPrompt);
    const parsed = JSON.parse(response);

    return {
      callToAction: ensureExactLength(
        parsed.callToAction,
        60,
        "footer.callToAction"
      ),
      contactInfo: ensureExactLength(
        parsed.contactInfo,
        150,
        "footer.contactInfo"
      ),
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
}
