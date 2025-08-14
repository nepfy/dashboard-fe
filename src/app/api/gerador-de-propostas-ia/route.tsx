import { NextRequest, NextResponse } from "next/server";
import { WorkflowResult } from "#/lib/ai/parallel-workflow";
import { getAgentByService, ServiceType } from "#/modules/ai-generator/agents";
import { FlashWorkflowResult } from "#/modules/ai-generator/themes/flash";
import { PrimeWorkflowResult } from "#/modules/ai-generator/themes/prime";
import { serviceMapping } from "#/modules/ai-generator/utils";

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
