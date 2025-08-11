import { NextRequest, NextResponse } from "next/server";
import {
  ProposalWorkflow,
  type ProposalWorkflowData,
} from "#/lib/ai/parallel-workflow";
import { getAgentByService } from "#/modules/ai-generator/agents";
import {
  FlashTemplateWorkflow,
  type FlashTemplateData,
} from "#/modules/ai-generator/themes/flash";

const serviceMapping: Record<string, string> = {
  "marketing-digital": "marketing",
  designer: "design",
  desenvolvedor: "development",
  arquiteto: "architecture",
  fotografo: "photography",
  medicos: "medical",
};

interface NepfyAIRequestData {
  selectedService: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  companyInfo?: string;
  selectedPlans?: string[];
  planDetails?: string;
  includeTerms?: boolean;
  includeFAQ?: boolean;
  templateType?: string;
  mainColor?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      companyInfo,
      selectedPlans = [],
      planDetails = "",
      includeTerms = false,
      includeFAQ = false,
      templateType,
      mainColor,
    } = body as NepfyAIRequestData;

    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const agentServiceId = serviceMapping[selectedService];
    if (!agentServiceId) {
      return NextResponse.json(
        { error: `Service not found: ${selectedService}` },
        { status: 400 }
      );
    }

    const agent = getAgentByService(agentServiceId);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent not found for service: ${agentServiceId}` },
        { status: 400 }
      );
    }

    const defaultCompanyInfo =
      companyInfo || generateDefaultCompanyInfo(agentServiceId);

    const defaultPlans =
      selectedPlans.length > 0
        ? selectedPlans
        : generateDefaultPlans(agentServiceId);

    // Check if this is a flash template request
    if (templateType === "flash") {
      const flashData: FlashTemplateData = {
        selectedService: agentServiceId,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        selectedPlans: defaultPlans,
        planDetails: planDetails || generateDefaultPlanDetails(agentServiceId),
        includeTerms,
        includeFAQ,
        templateType: "flash",
        mainColor,
      };

      const flashWorkflow = new FlashTemplateWorkflow();
      let result;
      let generationType = "flash-workflow";

      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Flash AI timeout")), 25000);
        });

        const flashPromise = flashWorkflow.execute(flashData);

        result = await Promise.race([flashPromise, timeoutPromise]);
        generationType = "flash-workflow";
      } catch (flashError) {
        console.error("Flash Workflow Error:", flashError);

        try {
          const dynamicTimeoutPromise = new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error("Flash dynamic generation timeout")),
              15000
            );
          });

          const dynamicPromise =
            flashWorkflow.generateTemplateProposal(flashData);

          result = await Promise.race([dynamicPromise, dynamicTimeoutPromise]);
          generationType = "flash-dynamic-generation";
        } catch (dynamicError) {
          console.error("Flash Dynamic Generation Error:", dynamicError);

          return NextResponse.json(
            {
              error: "Failed to generate flash proposal",
              details: "Both flash AI workflow and dynamic generation failed",
              generationType: "failed",
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: Object.assign(
          {},
          typeof result === "object" && result !== null ? result : {},
          {
            pageData: {
              templateType,
              mainColor,
              originalServiceId: selectedService,
            },
          }
        ),
        metadata: {
          service: agentServiceId,
          agent: agent.name,
          timestamp: new Date().toISOString(),
          mappedFrom: selectedService,
          generationType,
        },
      });
    }

    // Regular proposal workflow for non-flash templates
    const workflowData: ProposalWorkflowData = {
      selectedService: agentServiceId,
      companyInfo: defaultCompanyInfo,
      clientName,
      projectName,
      projectDescription,
      selectedPlans: defaultPlans,
      planDetails: planDetails || generateDefaultPlanDetails(agentServiceId),
      includeTerms,
      includeFAQ,
    };

    const workflow = new ProposalWorkflow();
    let result;
    let generationType = "ai-workflow";

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("AI timeout")), 25000);
      });

      const aiPromise = workflow.execute(workflowData);

      result = await Promise.race([aiPromise, timeoutPromise]);
      generationType = "ai-workflow";
    } catch (aiError) {
      console.error("AI Workflow Error:", aiError);

      try {
        const dynamicTimeoutPromise = new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error("Dynamic generation timeout")),
            15000
          );
        });

        const dynamicPromise = workflow.generateLocalProposal(
          workflowData,
          agent,
          Date.now()
        );

        result = await Promise.race([dynamicPromise, dynamicTimeoutPromise]);
        generationType = "dynamic-generation";
      } catch (dynamicError) {
        console.error("Dynamic Generation Error:", dynamicError);

        return NextResponse.json(
          {
            error: "Failed to generate proposal",
            details: "Both AI workflow and dynamic generation failed",
            generationType: "failed",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: Object.assign(
        {},
        typeof result === "object" && result !== null ? result : {},
        {
          pageData: {
            templateType,
            mainColor,
            originalServiceId: selectedService,
          },
        }
      ),
      metadata: {
        service: agentServiceId,
        agent: agent.name,
        timestamp: new Date().toISOString(),
        mappedFrom: selectedService,
        generationType,
      },
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    if (service) {
      const agentServiceId = serviceMapping[service] || service;

      const agent = getAgentByService(agentServiceId);
      if (!agent) {
        return NextResponse.json(
          { error: `Service not found: ${service}` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          agent,
          availableServices: getAllServices(),
          serviceMapping,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        availableServices: getAllServices(),
        serviceMapping,
        totalServices: Object.keys(getAllServices()).length,
      },
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function getAllServices() {
  return {
    "marketing-digital": "Marketing Digital",
    designer: "Design e Identidade Visual",
    desenvolvedor: "Desenvolvimento de Software",
    arquiteto: "Arquitetura e Design de Espaços",
    fotografo: "Fotografia Profissional",
    medicos: "Área da Saúde",
  };
}

function generateDefaultCompanyInfo(serviceId: string): string {
  const companyTemplates = {
    marketing:
      "Somos uma agência de marketing digital especializada em crescimento de negócios online. Com anos de experiência, ajudamos empresas a aumentar suas vendas através de estratégias digitais personalizadas. Nossa equipe é composta por especialistas em SEO, Google Ads, redes sociais e automação de marketing.",
    design:
      "Studio de design criativo focado em criar identidades visuais impactantes. Especializamos em branding, design de websites e material gráfico para startups e empresas em crescimento. Nossa missão é transformar ideias em experiências visuais memoráveis.",
    development:
      "Empresa de desenvolvimento de software especializada em aplicações web e mobile. Utilizamos tecnologias modernas para criar soluções escaláveis e eficientes. Nossa equipe é composta por desenvolvedores experientes em React, Node.js e React Native.",
    architecture:
      "Escritório de arquitetura especializado em projetos residenciais e comerciais. Combinamos funcionalidade, estética e sustentabilidade em todos os nossos projetos. Nossa experiência inclui aprovações, acompanhamento de obra e design de interiores.",
    photography:
      "Estúdio de fotografia profissional com experiência em diversos segmentos. Especializamos em fotografia corporativa, de produtos, eventos e retratos. Nossa equipe utiliza equipamentos de alta qualidade e técnicas avançadas de pós-produção.",
    medical:
      "Clínica médica especializada em atendimento personalizado e de qualidade. Oferecemos consultas, exames diagnósticos e procedimentos com foco na saúde e bem-estar dos pacientes. Nossa equipe médica é altamente qualificada e experiente.",
  };

  return (
    companyTemplates[serviceId as keyof typeof companyTemplates] ||
    companyTemplates.marketing
  );
}

function generateDefaultPlans(serviceId: string): string[] {
  const planTemplates = {
    marketing: ["basic", "premium"],
    design: ["logo", "complete"],
    development: ["web-app", "mobile-app"],
    architecture: ["project", "complete"],
    photography: ["session", "package"],
    medical: ["consultation", "checkup"],
  };

  return (
    planTemplates[serviceId as keyof typeof planTemplates] || [
      "basic",
      "premium",
    ]
  );
}

function generateDefaultPlanDetails(serviceId: string): string {
  const planDetailsTemplates = {
    marketing:
      "Plano Basic: Gestão de redes sociais + Google Ads. Plano Premium: Estratégia completa incluindo SEO, email marketing e automação.",
    design:
      "Plano Logo: Criação de logotipo e aplicações básicas. Plano Complete: Identidade visual completa com manual de marca e material gráfico.",
    development:
      "Plano Web App: Desenvolvimento de aplicação web responsiva. Plano Mobile App: Aplicativo mobile nativo ou híbrido.",
    architecture:
      "Plano Project: Projeto arquitetônico básico. Plano Complete: Projeto completo com acompanhamento de obra.",
    photography:
      "Plano Session: Sessão fotográfica com edição básica. Plano Package: Pacote completo com múltiplas sessões e edição avançada.",
    medical:
      "Plano Consultation: Consulta médica especializada. Plano Checkup: Checkup completo com exames e laudos.",
  };

  return (
    planDetailsTemplates[serviceId as keyof typeof planDetailsTemplates] ||
    "Planos personalizados conforme necessidade do projeto."
  );
}
