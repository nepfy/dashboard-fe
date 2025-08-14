import { NextRequest, NextResponse } from "next/server";
import {
  ProposalWorkflow,
  type ProposalWorkflowData,
} from "#/lib/ai/parallel-workflow";
import { ServiceType, getAgentByService } from "#/modules/ai-generator/agents";
import {
  FlashTemplateWorkflow,
  type FlashThemeData,
} from "#/modules/ai-generator/themes/flash";
import {
  PrimeTemplateWorkflow,
  type PrimeThemeData,
  PrimeWorkflowResult,
} from "#/modules/ai-generator/themes/prime";
import { NepfyAIRequestData, ProposalResult } from "./route";
import {
  serviceMapping,
  generateDefaultCompanyInfo,
  generatePlanOptionsByCount,
  generateDefaultPlans,
  generateDefaultPlanDetails,
} from "#/modules/ai-generator/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      companyInfo,
      selectedPlan,
      selectedPlans = [],
      planDetails = "",
      includeTerms = false,
      includeFAQ = false,
      templateType,
      mainColor,
    } = body as NepfyAIRequestData;

    // Validate required fields
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

    // Map to internal agent service ID
    const agentServiceId = serviceMapping[selectedService];
    if (!agentServiceId) {
      return NextResponse.json(
        { error: `Service not found: ${selectedService}` },
        { status: 400 }
      );
    }

    // Get agent for the service
    const agent = getAgentByService(agentServiceId as ServiceType);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent not found for service: ${agentServiceId}` },
        { status: 400 }
      );
    }

    // Use provided company info or generate default
    const defaultCompanyInfo =
      companyInfo || generateDefaultCompanyInfo(agentServiceId);

    // Determine plans to use
    let defaultPlans: string[];
    if (selectedPlan && typeof selectedPlan === "number") {
      defaultPlans = generatePlanOptionsByCount(agentServiceId, selectedPlan);
    } else if (selectedPlans.length > 0) {
      defaultPlans = selectedPlans;
    } else {
      defaultPlans = generateDefaultPlans(agentServiceId);
    }

    // FLASH TEMPLATE WORKFLOW
    if (templateType === "flash") {
      const flashData: FlashThemeData = {
        selectedService: agentServiceId as ServiceType,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        selectedPlans: defaultPlans,
        planDetails:
          planDetails ||
          generateDefaultPlanDetails(agentServiceId, defaultPlans),
        includeTerms,
        includeFAQ,
        templateType: "flash",
        mainColor,
      };

      const flashWorkflow = new FlashTemplateWorkflow();
      let result: ProposalResult;
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
        // Fallback to dynamic generation (15s timeout)
        try {
          const dynamicTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Flash dynamic generation timeout")),
              15000
            );
          });
          // @ts-expect-error: Accessing private method for fallback
          const dynamicPromise = flashWorkflow.generateFlashProposal(
            flashData
          ) as Promise<ProposalResult>;
          result = await Promise.race([dynamicPromise, dynamicTimeoutPromise]);
          generationType = "flash-dynamic-generation";
        } catch {
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
      const primeData: PrimeThemeData = {
        selectedService: agentServiceId as ServiceType,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        selectedPlans: defaultPlans,
        planDetails:
          planDetails ||
          generateDefaultPlanDetails(agentServiceId, defaultPlans),
        includeTerms,
        includeFAQ,
        templateType: "prime",
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
        // Fallback to dynamic generation (15s timeout)
        try {
          const dynamicTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Prime dynamic generation timeout")),
              15000
            );
          });
          const dynamicPromise =
            primeWorkflow.generateTemplateProposal(primeData);
          const proposal = await Promise.race([
            dynamicPromise,
            dynamicTimeoutPromise,
          ]);
          result = {
            success: true,
            templateType: "prime",
            data: proposal,
            metadata: {
              service: agentServiceId,
              agent: agent.name,
              timestamp: new Date().toISOString(),
              generationType: "prime-dynamic-generation",
            },
          };
          generationType = "prime-dynamic-generation";
        } catch {
          return NextResponse.json(
            {
              error: "Failed to generate prime proposal",
              details: "Both prime AI workflow and dynamic generation failed",
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
    const workflowData: ProposalWorkflowData = {
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

    const workflow = new ProposalWorkflow();
    let result: ProposalResult;
    let generationType = "ai-workflow";

    try {
      // 25s timeout for main AI workflow
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("AI timeout")), 25000);
      });
      const aiPromise = workflow.execute(workflowData);
      result = await Promise.race([aiPromise, timeoutPromise]);
      generationType = "ai-workflow";
    } catch {
      // Fallback to local/dynamic generation (15s timeout)
      try {
        const dynamicTimeoutPromise = new Promise<never>((_, reject) => {
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
      } catch {
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
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
