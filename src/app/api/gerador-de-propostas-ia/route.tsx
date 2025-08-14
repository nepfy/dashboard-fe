import { NextRequest, NextResponse } from "next/server";
import { WorkflowResult } from "#/lib/ai/parallel-workflow";
import { getAgentByService, ServiceType } from "#/modules/ai-generator/agents";
import { FlashWorkflowResult } from "#/modules/ai-generator/themes/flash";
import { PrimeWorkflowResult } from "#/modules/ai-generator/themes/prime";
import {
  serviceMapping,
  flashServiceMapping,
  primeServiceMapping,
} from "#/modules/ai-generator/utils";

export interface NepfyAIRequestData {
  selectedService: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  companyInfo?: string;
  selectedPlan?: number;
  selectedPlans?: string[];
  planDetails?: string;
  includeTerms?: boolean;
  includeFAQ?: boolean;
  templateType?: string;
  mainColor?: string;
}

export type ProposalResult =
  | FlashWorkflowResult
  | PrimeWorkflowResult
  | WorkflowResult;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    if (service) {
      const agentServiceId = serviceMapping[service] || service;
      const agent = getAgentByService(agentServiceId as ServiceType);
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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: NepfyAIRequestData = await request.json();
    const {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      companyInfo,
      selectedPlan,
      selectedPlans,
      planDetails,
      includeTerms = true,
      includeFAQ = true,
      templateType = "flash",
      mainColor = "#3B82F6",
    } = body;

    // Validate required fields
    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details:
            "selectedService, clientName, projectName, and projectDescription are required",
        },
        { status: 400 }
      );
    }

    // Map service to agent service ID based on template type
    let agentServiceId: string;
    let originalServiceId: string;

    if (templateType === "flash") {
      agentServiceId = flashServiceMapping[selectedService] || selectedService;
      originalServiceId = selectedService; // Keep original for template workflows
    } else if (templateType === "prime") {
      agentServiceId = primeServiceMapping[selectedService] || selectedService;
      originalServiceId = selectedService; // Keep original for template workflows
    } else {
      agentServiceId = serviceMapping[selectedService] || selectedService;
      originalServiceId = agentServiceId;
    }

    console.log("Debug - Service mapping:", {
      selectedService,
      templateType,
      agentServiceId,
      originalServiceId,
      flashServiceMapping: flashServiceMapping[selectedService],
      primeServiceMapping: primeServiceMapping[selectedService],
    });

    const agent = getAgentByService(agentServiceId as ServiceType);

    if (!agent) {
      return NextResponse.json(
        {
          error: "Service not found",
          details: `No agent found for service: ${selectedService}`,
        },
        { status: 404 }
      );
    }

    // Default values
    const defaultCompanyInfo =
      companyInfo || "Empresa especializada em soluções premium";
    const defaultPlans = selectedPlans ?? [
      "Plano Essencial",
      "Plano Executivo",
    ];

    // Generate default plan details if not provided
    function generateDefaultPlanDetails(serviceId: string, plans: string[]) {
      return plans
        .map((plan) => `${plan}: Soluções personalizadas com qualidade premium`)
        .join("\n");
    }

    // FLASH TEMPLATE WORKFLOW
    if (templateType === "flash") {
      const { FlashTemplateWorkflow } = await import(
        "#/modules/ai-generator/themes/flash"
      );
      const flashData = {
        selectedService: originalServiceId as ServiceType,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        selectedPlans: defaultPlans,
        planDetails:
          planDetails ||
          generateDefaultPlanDetails(originalServiceId, defaultPlans),
        includeTerms,
        includeFAQ,
        templateType: "flash" as const,
        mainColor,
      };

      const flashWorkflow = new FlashTemplateWorkflow();
      let result: FlashWorkflowResult;
      let generationType = "flash-workflow";

      try {
        // 25s timeout for main flash workflow
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Flash AI timeout")), 25000);
        });
        const flashPromise = flashWorkflow.execute(flashData);
        result = await Promise.race([flashPromise, timeoutPromise]);
        generationType = "flash-workflow";
      } catch {
        // Fallback to simple generation (15s timeout)
        try {
          const simpleTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Flash simple generation timeout")),
              15000
            );
          });
          const simplePromise = flashWorkflow.execute(flashData);
          result = await Promise.race([simplePromise, simpleTimeoutPromise]);
          generationType = "flash-simple-generation";
        } catch {
          return NextResponse.json(
            {
              error: "Failed to generate flash proposal",
              details: "Both flash AI workflow and simple generation failed",
              generationType: "failed",
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...(typeof result === "object" && result !== null ? result : {}),
          pageData: {
            templateType,
            mainColor,
            originalServiceId: selectedService,
          },
        },
        metadata: {
          service: agentServiceId,
          agent: agent.name,
          timestamp: new Date().toISOString(),
          mappedFrom: selectedService,
          generationType,
          planCount: defaultPlans.length,
          planGenerationMethod: selectedPlan
            ? `count-${selectedPlan}`
            : selectedPlans.length > 0
            ? "array"
            : "default",
        },
      });
    }

    // PRIME TEMPLATE WORKFLOW
    if (templateType === "prime") {
      const { PrimeTemplateWorkflow } = await import(
        "#/modules/ai-generator/themes/prime"
      );
      const primeData = {
        selectedService: originalServiceId as ServiceType,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        selectedPlans: defaultPlans,
        planDetails:
          planDetails ||
          generateDefaultPlanDetails(originalServiceId, defaultPlans),
        includeTerms,
        includeFAQ,
        templateType: "prime" as const,
        mainColor,
      };

      const primeWorkflow = new PrimeTemplateWorkflow();
      let result: PrimeWorkflowResult;
      let generationType = "prime-workflow";

      try {
        // 25s timeout for main prime workflow
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Prime AI timeout")), 25000);
        });
        const primePromise = primeWorkflow.execute(primeData);
        result = await Promise.race([primePromise, timeoutPromise]);
        generationType = "prime-workflow";
      } catch {
        // Fallback to simple generation (15s timeout)
        try {
          const simpleTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Prime simple generation timeout")),
              15000
            );
          });
          const simplePromise = primeWorkflow.execute(primeData);
          result = await Promise.race([simplePromise, simpleTimeoutPromise]);
          generationType = "prime-simple-generation";
        } catch {
          return NextResponse.json(
            {
              error: "Failed to generate prime proposal",
              details: "Both prime AI workflow and simple generation failed",
              generationType: "failed",
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          ...(typeof result === "object" && result !== null ? result : {}),
          pageData: {
            templateType,
            mainColor,
            originalServiceId: selectedService,
          },
        },
        metadata: {
          service: agentServiceId,
          agent: agent.name,
          timestamp: new Date().toISOString(),
          mappedFrom: selectedService,
          generationType,
          planCount: defaultPlans.length,
          planGenerationMethod: selectedPlan
            ? `count-${selectedPlan}`
            : selectedPlans.length > 0
            ? "array"
            : "default",
        },
      });
    }

    // REGULAR PROPOSAL WORKFLOW
    const { ProposalWorkflow } = await import("#/lib/ai/parallel-workflow");
    const workflowData = {
      selectedService: agentServiceId,
      companyInfo: defaultCompanyInfo,
      clientName,
      projectName,
      projectDescription,
      selectedPlans: defaultPlans,
      planDetails:
        planDetails || generateDefaultPlanDetails(agentServiceId, defaultPlans),
      includeTerms,
      includeFAQ,
    };

    let result: WorkflowResult;
    let generationType = "parallel-workflow";

    try {
      // 30s timeout for main workflow
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("AI timeout")), 30000);
      });
      const workflow = new ProposalWorkflow();
      const workflowPromise = workflow.execute(workflowData);
      result = await Promise.race([workflowPromise, timeoutPromise]);
      generationType = "parallel-workflow";
    } catch {
      // Fallback to simple generation (10s timeout)
      try {
        const simpleTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error("Simple generation timeout")),
            10000
          );
        });
        const workflow = new ProposalWorkflow();
        const simplePromise = workflow.execute(workflowData);
        result = await Promise.race([simplePromise, simpleTimeoutPromise]);
        generationType = "simple-workflow";
      } catch {
        return NextResponse.json(
          {
            error: "Failed to generate proposal",
            details: "Both AI workflow and simple generation failed",
            generationType: "failed",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...(typeof result === "object" && result !== null ? result : {}),
        pageData: {
          templateType,
          mainColor,
          originalServiceId: selectedService,
        },
      },
      metadata: {
        service: agentServiceId,
        agent: agent.name,
        timestamp: new Date().toISOString(),
        mappedFrom: selectedService,
        generationType,
        planCount: defaultPlans.length,
        planGenerationMethod: selectedPlan
          ? `count-${selectedPlan}`
          : selectedPlans.length > 0
          ? "array"
          : "default",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
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
