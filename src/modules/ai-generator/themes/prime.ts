import assert from "node:assert";
import Together from "together-ai";
import { getAgentByService, type AgentConfig } from "../agents";
import {
  getPrimeAgentByService,
  type PrimeAgentConfig,
} from "../templates/prime/agent";

// Initialize TogetherAI client with proper error handling
const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

const client = new Together({ apiKey });

export interface PrimeTemplateData {
  selectedService: string;
  companyInfo: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  selectedPlans: string[];
  planDetails: string;
  includeTerms: boolean;
  includeFAQ: boolean;
  templateType: "prime";
  mainColor?: string;
}

export interface PrimeSection {
  id: string;
  name: string;
  content: string;
  editable: boolean;
  aiGenerated: boolean;
  characterLimit?: number;
  visible: boolean;
}

export interface PrimeProposal {
  // Introduction Section
  introduction: {
    title: string; // 60 chars, AI-generated
    subtitle: string; // 100 chars, AI-generated
    services: string[]; // 4 max, 30 chars each, AI-generated
    validity: string; // Not editable
    buttonText: string; // 20 chars, no AI
  };

  // About Us Section
  aboutUs: {
    title: string; // 155 chars, AI-generated
    supportText: string; // 70 chars, AI-generated
    subtitle: string; // 250 chars, AI-generated
  };

  // Specialties Section
  specialties: {
    title: string; // 40 chars, AI-generated
    topics: Array<{
      title: string; // 50 chars
      description: string; // 100 chars
    }>; // 9 max
  };

  // Process Steps Section
  steps: {
    introduction: string; // 100 chars, AI-generated
    title: string; // Fixed, not editable
    topics: Array<{
      title: string; // 40 chars
      description: string; // 240 chars
    }>; // 5 max, AI-generated
  };

  // Investment Section
  investment: {
    title: string; // 85 chars, AI-generated
    deliverables: Array<{
      title: string; // 30 chars
      description: string; // 330 chars
    }>;
    plans: Array<{
      title: string; // 20 chars
      description: string; // 95 chars
      value: string; // 11 chars
      topics: string[]; // 6 max, 45 chars each
    }>; // 3 max, AI-generated
  };

  // Terms and Conditions (optional)
  terms?: Array<{
    title: string; // 30 chars
    description: string; // 180 chars
  }>;

  // FAQ (optional)
  faq?: Array<{
    question: string; // 100 chars
    answer: string; // 200 chars
  }>;

  // Footer Section
  footer: {
    callToAction: string; // 80 chars, AI-generated
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

export class PrimeTemplateWorkflow {
  private agent: PrimeAgentConfig | AgentConfig | null = null;

  async execute(data: PrimeTemplateData): Promise<PrimeWorkflowResult> {
    // Get the appropriate agent
    this.agent = getPrimeAgentByService(data.selectedService);
    if (!this.agent) {
      this.agent = getAgentByService(data.selectedService);
    }

    if (!this.agent) {
      throw new Error(`No agent found for service: ${data.selectedService}`);
    }

    try {
      const proposal = await this.generateTemplateProposal(data);

      return {
        success: true,
        templateType: "prime",
        data: proposal,
        metadata: {
          service: data.selectedService,
          agent: this.agent.name,
          timestamp: new Date().toISOString(),
          generationType: "prime-workflow",
        },
      };
    } catch (error) {
      console.error("Prime Template Generation Error:", error);
      throw error;
    }
  }

  async generateTemplateProposal(
    data: PrimeTemplateData
  ): Promise<PrimeProposal> {
    // Get the appropriate agent
    this.agent = getPrimeAgentByService(data.selectedService);
    if (!this.agent) {
      this.agent = getAgentByService(data.selectedService);
    }

    if (!this.agent) {
      throw new Error(`No agent found for service: ${data.selectedService}`);
    }

    try {
      // Generate all sections using AI
      const [
        introduction,
        aboutUs,
        specialties,
        steps,
        investment,
        terms,
        faq,
        footer,
      ] = await Promise.all([
        this.generateIntroduction(data),
        this.generateAboutUs(data),
        this.generateSpecialties(data),
        this.generateProcessSteps(data),
        this.generateInvestment(data),
        data.includeTerms ? this.generateTerms(data) : undefined,
        data.includeFAQ ? this.generateFAQ(data) : undefined,
        this.generateFooter(data),
      ]);

      return {
        introduction,
        aboutUs,
        specialties,
        steps,
        investment,
        terms,
        faq,
        footer,
      };
    } catch (error) {
      console.error("Prime Template Proposal Generation Error:", error);
      throw error;
    }
  }

  private async generateIntroduction(data: PrimeTemplateData) {
    const prompt = `Generate an introduction section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate the following fields with PRIME template focus on premium quality and attention to detail:

1. Title (max 60 characters): Compelling headline that emphasizes premium quality
2. Subtitle (max 100 characters): Supporting text that highlights excellence and expertise
3. Services (max 4 services, 30 chars each): Key services offered with premium positioning
4. Button Text (max 20 characters): Call-to-action button text

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the introduction section for your PRIME template proposal with a focus on premium quality and attention to detail:

**Title:** ${data.projectName} - Soluções Premium de Excelência

**Subtitle:** Transformamos sua visão em realidade com qualidade excepcional e atenção aos detalhes

**Services:**
- Design Premium
- Desenvolvimento Avançado
- Estratégia Personalizada
- Resultados Excepcionais

**Button Text:** Iniciar Projeto Premium

<|eot_id|>`,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    // Extract the generated content
    const titleMatch = content.match(/\*\*Title:\*\* (.+)/);
    const subtitleMatch = content.match(/\*\*Subtitle:\*\* (.+)/);
    const servicesMatch = content.match(
      /\*\*Services:\*\*([\s\S]*?)(?=\*\*|$)/
    );
    const buttonMatch = content.match(/\*\*Button Text:\*\* (.+)/);

    return {
      title: titleMatch?.[1]?.trim() || "Soluções Premium de Excelência",
      subtitle:
        subtitleMatch?.[1]?.trim() ||
        "Transformamos sua visão em realidade com qualidade excepcional",
      services: this.extractServices(servicesMatch?.[1] || ""),
      validity: "Válido por 30 dias",
      buttonText: buttonMatch?.[1]?.trim() || "Iniciar Projeto Premium",
    };
  }

  private async generateAboutUs(data: PrimeTemplateData) {
    const prompt = `Generate an About Us section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate the following fields with PRIME template focus on premium quality and attention to detail:

1. Title (max 155 characters): Main title emphasizing premium expertise
2. Support Text (max 70 characters): Brief supporting statement
3. Subtitle (max 250 characters): Detailed description of premium approach

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the About Us section for your PRIME template proposal:

**Title:** Somos especialistas em entregar soluções premium com atenção excepcional aos detalhes

**Support Text:** Qualidade superior em cada projeto

**Subtitle:** Nossa metodologia PRIME garante resultados excepcionais através de processos detalhados, materiais de alta qualidade e acabamentos superiores. Transformamos sua visão em realidade com excelência técnica e criatividade inovadora.

<|eot_id|>`,
      max_tokens: 500,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const titleMatch = content.match(/\*\*Title:\*\* (.+)/);
    const supportMatch = content.match(/\*\*Support Text:\*\* (.+)/);
    const subtitleMatch = content.match(/\*\*Subtitle:\*\* (.+)/);

    return {
      title:
        titleMatch?.[1]?.trim() ||
        "Somos especialistas em entregar soluções premium com atenção excepcional aos detalhes",
      supportText:
        supportMatch?.[1]?.trim() || "Qualidade superior em cada projeto",
      subtitle:
        subtitleMatch?.[1]?.trim() ||
        "Nossa metodologia PRIME garante resultados excepcionais através de processos detalhados e materiais de alta qualidade",
    };
  }

  private async generateSpecialties(data: PrimeTemplateData) {
    const prompt = `Generate a Specialties section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate up to 9 specialties with:
- Title (max 50 characters): Specialty name
- Description (max 100 characters): Brief description

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the Specialties section for your PRIME template proposal:

**Title:** Especialidades Premium

**Specialties:**
1. **Design Exclusivo** - Criação de identidades visuais únicas e memoráveis
2. **Desenvolvimento Avançado** - Soluções técnicas robustas e escaláveis
3. **Estratégia Personalizada** - Abordagens customizadas para cada projeto
4. **Qualidade Superior** - Padrões excepcionais em todos os entregáveis
5. **Atenção aos Detalhes** - Cuidado meticuloso em cada elemento
6. **Resultados Excepcionais** - Desfechos que superam expectativas
7. **Inovação Constante** - Tecnologias e metodologias de ponta
8. **Suporte Premium** - Acompanhamento contínuo e personalizado

<|eot_id|>`,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const titleMatch = content.match(/\*\*Title:\*\* (.+)/);
    const specialtiesMatch = content.match(
      /\*\*Specialties:\*\*([\s\S]*?)(?=\*\*|$)/
    );

    const specialties = this.extractSpecialties(specialtiesMatch?.[1] || "");

    return {
      title: titleMatch?.[1]?.trim() || "Especialidades Premium",
      topics: specialties,
    };
  }

  private async generateProcessSteps(data: PrimeTemplateData) {
    const prompt = `Generate Process Steps section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate up to 5 process steps with:
- Title (max 40 characters): Step name
- Description (max 240 characters): Detailed description

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the Process Steps section for your PRIME template proposal:

**Introduction:** Nossa metodologia PRIME garante excelência em cada etapa

**Steps:**
1. **Descoberta Premium** - Análise profunda das necessidades e objetivos do projeto
2. **Planejamento Estratégico** - Estratégia detalhada com foco em qualidade superior
3. **Execução Excepcional** - Desenvolvimento com atenção meticulosa aos detalhes
4. **Revisão e Refinamento** - Processo de qualidade para garantir perfeição
5. **Entrega e Acompanhamento** - Suporte contínuo e personalizado

<|eot_id|>`,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const introMatch = content.match(/\*\*Introduction:\*\* (.+)/);
    const stepsMatch = content.match(/\*\*Steps:\*\*([\s\S]*?)(?=\*\*|$)/);

    const steps = this.extractProcessSteps(stepsMatch?.[1] || "");

    return {
      introduction:
        introMatch?.[1]?.trim() ||
        "Nossa metodologia PRIME garante excelência em cada etapa",
      title: "Nosso Processo Premium",
      topics: steps,
    };
  }

  private async generateInvestment(data: PrimeTemplateData) {
    const prompt = `Generate Investment section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}
Selected Plans: ${data.selectedPlans.join(", ")}
Plan Details: ${data.planDetails}

Generate:
1. Title (max 85 characters): Investment section title
2. Deliverables (up to 3): Premium deliverables with titles and descriptions
3. Plans (up to 3): Premium plans with titles, descriptions, values, and topics

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the Investment section for your PRIME template proposal:

**Title:** Investimento em Qualidade Premium e Resultados Excepcionais

**Deliverables:**
1. **Solução Premium Completa** - Entrega integral com qualidade superior e atenção aos detalhes
2. **Suporte Contínuo** - Acompanhamento personalizado e ajustes conforme necessário
3. **Garantia de Qualidade** - Compromisso com resultados que superam expectativas

**Plans:**
1. **Plano Essencial Premium** - Soluções básicas com qualidade superior (R$ 2.890)
2. **Plano Executivo Premium** - Soluções intermediárias com atenção aos detalhes (R$ 5.740)
3. **Plano Premium Completo** - Soluções avançadas com excelência excepcional (R$ 10.140)

<|eot_id|>`,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const titleMatch = content.match(/\*\*Title:\*\* (.+)/);
    const deliverablesMatch = content.match(
      /\*\*Deliverables:\*\*([\s\S]*?)(?=\*\*|$)/
    );
    const plansMatch = content.match(/\*\*Plans:\*\*([\s\S]*?)(?=\*\*|$)/);

    return {
      title:
        titleMatch?.[1]?.trim() ||
        "Investimento em Qualidade Premium e Resultados Excepcionais",
      deliverables: this.extractDeliverables(deliverablesMatch?.[1] || ""),
      plans: this.extractPlans(plansMatch?.[1] || ""),
    };
  }

  private async generateTerms(data: PrimeTemplateData) {
    const prompt = `Generate Terms and Conditions for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate up to 5 terms with:
- Title (max 30 characters): Term name
- Description (max 180 characters): Detailed description

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the Terms and Conditions for your PRIME template proposal:

**Terms:**
1. **Qualidade Premium** - Compromisso com padrões excepcionais
2. **Atenção aos Detalhes** - Cuidado meticuloso em cada elemento
3. **Prazo de Entrega** - Cronograma detalhado e respeitado
4. **Suporte Contínuo** - Acompanhamento personalizado
5. **Garantia de Satisfação** - Resultados que superam expectativas

<|eot_id|>`,
      max_tokens: 600,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const termsMatch = content.match(/\*\*Terms:\*\*([\s\S]*?)(?=\*\*|$)/);

    return this.extractTerms(termsMatch?.[1] || "");
  }

  private async generateFAQ(data: PrimeTemplateData) {
    const prompt = `Generate FAQ section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate up to 5 FAQ items with:
- Question (max 100 characters): Common question
- Answer (max 200 characters): Detailed answer

Focus on PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the FAQ section for your PRIME template proposal:

**FAQ:**
1. **Q: O que diferencia a metodologia PRIME?** - A: Foco em qualidade premium, atenção aos detalhes e resultados excepcionais
2. **Q: Como garantem a qualidade superior?** - A: Processos detalhados, materiais de alta qualidade e acabamentos superiores
3. **Q: Qual o prazo de entrega?** - A: Cronograma detalhado respeitado com qualidade premium
4. **Q: Oferecem suporte contínuo?** - A: Acompanhamento personalizado e ajustes conforme necessário
5. **Q: Qual a garantia de satisfação?** - A: Compromisso com resultados que superam expectativas

<|eot_id|>`,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const faqMatch = content.match(/\*\*FAQ:\*\*([\s\S]*?)(?=\*\*|$)/);

    return this.extractFAQ(faqMatch?.[1] || "");
  }

  private async generateFooter(data: PrimeTemplateData) {
    const prompt = `Generate Footer section for a PRIME template proposal.

${this.agent?.systemPrompt || ""}

Company Info: ${data.companyInfo}
Client Name: ${data.clientName}
Project Name: ${data.projectName}
Project Description: ${data.projectDescription}

Generate a call-to-action (max 80 characters) that emphasizes PRIME methodology: premium quality, attention to detail, and exceptional results.`;

    const response = await client.inference({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      prompt: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are an expert proposal writer specializing in PRIME template proposals. Focus on premium quality, attention to detail, and exceptional results.

<|eot_id|>
<|start_header_id|>user<|end_header_id|>

${prompt}

<|eot_id|>
<|start_header_id|>assistant<|end_header_id|>

I'll generate the Footer section for your PRIME template proposal:

**Call to Action:** Transforme sua visão em realidade com qualidade premium e resultados excepcionais

<|eot_id|>`,
      max_tokens: 200,
      temperature: 0.7,
      top_p: 0.9,
    });

    const content = response.output?.choices?.[0]?.text || "";

    const ctaMatch = content.match(/\*\*Call to Action:\*\* (.+)/);

    return {
      callToAction:
        ctaMatch?.[1]?.trim() ||
        "Transforme sua visão em realidade com qualidade premium",
    };
  }

  // Helper methods for extracting content
  private extractServices(content: string): string[] {
    const services: string[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*/);
      if (match && services.length < 4) {
        const service = match[1].trim();
        if (service.length <= 30) {
          services.push(service);
        }
      }
    }

    return services.length > 0
      ? services
      : [
          "Design Premium",
          "Desenvolvimento Avançado",
          "Estratégia Personalizada",
          "Resultados Excepcionais",
        ];
  }

  private extractSpecialties(
    content: string
  ): Array<{ title: string; description: string }> {
    const specialties: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && specialties.length < 9) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 50 && description.length <= 100) {
          specialties.push({ title, description });
        }
      }
    }

    return specialties.length > 0
      ? specialties
      : [
          {
            title: "Design Exclusivo",
            description: "Criação de identidades visuais únicas e memoráveis",
          },
          {
            title: "Desenvolvimento Avançado",
            description: "Soluções técnicas robustas e escaláveis",
          },
          {
            title: "Estratégia Personalizada",
            description: "Abordagens customizadas para cada projeto",
          },
        ];
  }

  private extractProcessSteps(
    content: string
  ): Array<{ title: string; description: string }> {
    const steps: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && steps.length < 5) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 40 && description.length <= 240) {
          steps.push({ title, description });
        }
      }
    }

    return steps.length > 0
      ? steps
      : [
          {
            title: "Descoberta Premium",
            description:
              "Análise profunda das necessidades e objetivos do projeto",
          },
          {
            title: "Planejamento Estratégico",
            description: "Estratégia detalhada com foco em qualidade superior",
          },
          {
            title: "Execução Excepcional",
            description: "Desenvolvimento com atenção meticulosa aos detalhes",
          },
        ];
  }

  private extractDeliverables(
    content: string
  ): Array<{ title: string; description: string }> {
    const deliverables: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && deliverables.length < 3) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 30 && description.length <= 330) {
          deliverables.push({ title, description });
        }
      }
    }

    return deliverables.length > 0
      ? deliverables
      : [
          {
            title: "Solução Premium Completa",
            description:
              "Entrega integral com qualidade superior e atenção aos detalhes",
          },
          {
            title: "Suporte Contínuo",
            description:
              "Acompanhamento personalizado e ajustes conforme necessário",
          },
        ];
  }

  private extractPlans(content: string): Array<{
    title: string;
    description: string;
    value: string;
    topics: string[];
  }> {
    const plans: Array<{
      title: string;
      description: string;
      value: string;
      topics: string[];
    }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(
        /^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+?)\s*\((.+?)\)/
      );
      if (match && plans.length < 3) {
        const title = match[1].trim();
        const description = match[2].trim();
        const value = match[3].trim();

        if (
          title.length <= 20 &&
          description.length <= 95 &&
          value.length <= 11
        ) {
          plans.push({
            title,
            description,
            value,
            topics: [
              "Qualidade Premium",
              "Atenção aos Detalhes",
              "Resultados Excepcionais",
            ],
          });
        }
      }
    }

    return plans.length > 0
      ? plans
      : [
          {
            title: "Plano Essencial Premium",
            description: "Soluções básicas com qualidade superior",
            value: "R$ 2.890",
            topics: [
              "Qualidade Premium",
              "Atenção aos Detalhes",
              "Suporte Básico",
            ],
          },
        ];
  }

  private extractTerms(
    content: string
  ): Array<{ title: string; description: string }> {
    const terms: Array<{ title: string; description: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*(.+?)\*\*\s*-\s*(.+)/);
      if (match && terms.length < 5) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title.length <= 30 && description.length <= 180) {
          terms.push({ title, description });
        }
      }
    }

    return terms.length > 0
      ? terms
      : [
          {
            title: "Qualidade Premium",
            description: "Compromisso com padrões excepcionais",
          },
          {
            title: "Atenção aos Detalhes",
            description: "Cuidado meticuloso em cada elemento",
          },
        ];
  }

  private extractFAQ(
    content: string
  ): Array<{ question: string; answer: string }> {
    const faqs: Array<{ question: string; answer: string }> = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const match = line.match(/^[0-9]+\.\s*\*\*Q:\s*(.+?)\*\*\s*A:\s*(.+)/);
      if (match && faqs.length < 5) {
        const question = match[1].trim();
        const answer = match[2].trim();
        if (question.length <= 100 && answer.length <= 200) {
          faqs.push({ question, answer });
        }
      }
    }

    return faqs.length > 0
      ? faqs
      : [
          {
            question: "O que diferencia a metodologia PRIME?",
            answer:
              "Foco em qualidade premium, atenção aos detalhes e resultados excepcionais",
          },
        ];
  }
}
