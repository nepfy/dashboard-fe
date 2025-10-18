import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { WorkflowResult } from "#/lib/ai/parallel-workflow";
import {
  getAgentByServiceAndTemplate,
  ServiceType,
  TemplateType,
} from "#/modules/ai-generator/agents";
import { FlashWorkflowResult } from "#/modules/ai-generator/themes/flash";
import { PrimeWorkflowResult } from "#/modules/ai-generator/themes/prime";
import {
  serviceMapping,
  flashServiceMapping,
  primeServiceMapping,
} from "#/modules/ai-generator/utils";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm/expressions";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import {
  saveFlashTemplateData,
  savePrimeTemplateData,
} from "#/lib/db/proposal-save-handler";

export interface NepfyAIRequestData {
  userName: string;
  userEmail: string;
  selectedService: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  clientDescription?: string;
  companyInfo?: string;
  selectedPlan?: number;
  selectedPlans?: number;
  planDetails?: string;
  includeTerms?: boolean;
  includeFAQ?: boolean;
  templateType?: string;
  mainColor?: string;
  originalPageUrl?: string;
  pagePassword?: string;
  validUntil?: string;
}

export type ProposalResult =
  | FlashWorkflowResult
  | PrimeWorkflowResult
  | WorkflowResult;

async function getUserIdFromEmail(emailAddress: string): Promise<{
  id: string;
  firstName: string | null;
  lastName: string | null;
} | null> {
  const personResult = await db
    .select({
      id: personUserTable.id,
      firstName: personUserTable.firstName,
      lastName: personUserTable.lastName,
    })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]
    ? {
        id: personResult[0].id,
        firstName: personResult[0].firstName,
        lastName: personResult[0].lastName,
      }
    : null;
}

type AIResult =
  | FlashWorkflowResult
  | PrimeWorkflowResult
  | WorkflowResult
  | Record<string, unknown>;

async function createOrUpdateProjectFromAIResult(
  userId: string,
  aiResult: AIResult,
  requestData: NepfyAIRequestData
) {
  console.log("Debug - createOrUpdateProjectFromAIResult called with:", {
    userId,
    requestDataClientName: requestData.clientName,
    requestDataProjectName: requestData.projectName,
    requestDataTemplateType: requestData.templateType,
  });

  // Check if a draft exists with matching clientName and projectName
  const existingDrafts = await db
    .select()
    .from(projectsTable)
    .where(
      and(
        eq(projectsTable.personId, userId),
        eq(projectsTable.clientName, requestData.clientName),
        eq(projectsTable.projectName, requestData.projectName),
        eq(projectsTable.projectStatus, "draft")
      )
    )
    .limit(1);

  const projectData = {
    personId: userId,
    clientName: requestData.clientName,
    projectName: requestData.projectName,
    projectSentDate: null,
    projectValidUntil: requestData.validUntil
      ? new Date(requestData.validUntil)
      : null,
    projectStatus: "draft",
    projectVisualizationDate: null,
    templateType: requestData.templateType || "flash",
    mainColor: requestData.mainColor || "#3B82F6",
    projectUrl: requestData.originalPageUrl || null,
    pagePassword: requestData.pagePassword || null,
    isPublished: false,
    isProposalGenerated: true,
  };

  let project;

  if (existingDrafts.length > 0) {
    // Update existing draft
    console.log(
      "Debug - Found existing draft, updating:",
      existingDrafts[0].id
    );
    const [updatedProject] = await db
      .update(projectsTable)
      .set({
        ...projectData,
        updated_at: new Date(),
      })
      .where(eq(projectsTable.id, existingDrafts[0].id))
      .returning();

    project = updatedProject;
    console.log("Debug - Project updated successfully:", project);
  } else {
    // Create new project
    console.log("Debug - No existing draft found, creating new project");
    const [newProject] = await db
      .insert(projectsTable)
      .values(projectData)
      .returning();

    project = newProject;
    console.log("Debug - Project inserted successfully:", project);
  }

  // Save template-specific data based on template type
  if (requestData.templateType === "flash" && "proposal" in aiResult) {
    await saveFlashTemplateData(
      project.id,
      aiResult as FlashWorkflowResult,
      requestData
    );
  } else if (requestData.templateType === "prime" && "data" in aiResult) {
    await savePrimeTemplateData(
      project.id,
      aiResult as PrimeWorkflowResult,
      requestData
    );
  }

  return project;
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const emailAddress = user?.emailAddresses[0]?.emailAddress;
    if (!emailAddress) {
      return NextResponse.json(
        { success: false, error: "Email não encontrado" },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromEmail(emailAddress);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const body: NepfyAIRequestData = await request.json();
    console.log("Debug - Request body received:", body);

    const {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      clientDescription,
      companyInfo,
      selectedPlan,
      planDetails = "",
      includeTerms = true,
      includeFAQ = true,
      templateType = "flash",
      mainColor = "#3B82F6",
    } = body;

    console.log("Debug - Extracted values:", {
      selectedService,
      clientName,
      projectName,
      projectDescription,
      companyInfo,
      templateType,
      mainColor,
    });

    // Validate required fields
    console.log("Debug - Validating required fields:", {
      selectedService: !!selectedService,
      clientName: !!clientName,
      projectName: !!projectName,
      projectDescription: !!projectDescription,
      clientNameValue: clientName,
      projectNameValue: projectName,
    });

    if (
      !selectedService ||
      !clientName ||
      !projectName ||
      !projectDescription
    ) {
      console.log("Debug - Validation failed, missing fields");
      return NextResponse.json(
        {
          error: "Missing required fields",
          details:
            "selectedService, clientName, projectName, and projectDescription are required",
        },
        { status: 400 }
      );
    }

    console.log("Debug - Validation passed successfully");

    // Map service to agent service ID based on template type
    let agentServiceId: string;
    let originalServiceId: string;

    if (templateType === "flash") {
      // For flash, use base service mapping first, then agent lookup will handle "Flash - X" naming
      agentServiceId = serviceMapping[selectedService] || selectedService;
      originalServiceId = selectedService; // Keep original for template workflows
    } else if (templateType === "prime") {
      // For prime, use base service mapping first, then agent lookup will handle "Prime - X" naming
      agentServiceId = serviceMapping[selectedService] || selectedService;
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

    // Get agent based on template type
    const agent = await getAgentByServiceAndTemplate(
      agentServiceId as ServiceType,
      templateType as TemplateType
    );

    if (!agent) {
      return NextResponse.json(
        {
          error: "Service not found",
          details: `No agent found for service: ${selectedService} and template: ${templateType}`,
        },
        { status: 404 }
      );
    }

    // Default values
    const defaultCompanyInfo =
      companyInfo || "Empresa especializada em soluções premium";
    const defaultPlans = selectedPlan || 1;

    let aiResult: AIResult;
    let generationType: string;

    // FLASH TEMPLATE WORKFLOW
    if (templateType === "flash") {
      const { FlashTemplateWorkflow } = await import(
        "#/modules/ai-generator/themes/flash"
      );
      const flashData = {
        selectedService: agentServiceId as ServiceType,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        clientDescription,
        selectedPlans: defaultPlans as number,
        planDetails: planDetails,
        includeTerms,
        includeFAQ,
        templateType: "flash" as const,
        mainColor,
        userName: `${userId.firstName} ${userId.lastName}`,
        userEmail: emailAddress,
      };

      const flashWorkflow = new FlashTemplateWorkflow();
      let result: FlashWorkflowResult;

      try {
        // 45s timeout for main flash workflow (increased for new models)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Flash AI timeout")), 45000);
        });
        const flashPromise = flashWorkflow.execute(flashData);
        result = await Promise.race([flashPromise, timeoutPromise]);
        generationType = "flash-workflow";
      } catch (workflowError) {
        console.error("Flash workflow error:", workflowError);
        // Fallback to simple generation (30s timeout)
        try {
          const simpleTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Flash simple generation timeout")),
              30000
            );
          });
          const simplePromise = flashWorkflow.execute(flashData);
          result = await Promise.race([simplePromise, simpleTimeoutPromise]);
          generationType = "flash-simple-generation";
        } catch (simpleError) {
          console.error("Flash simple generation error:", simpleError);
          return NextResponse.json(
            {
              error: "Failed to generate flash proposal",
              details: `Workflow error: ${
                workflowError instanceof Error
                  ? workflowError.message
                  : "Unknown"
              }. Fallback error: ${
                simpleError instanceof Error ? simpleError.message : "Unknown"
              }`,
              generationType: "failed",
            },
            { status: 500 }
          );
        }
      }

      // Validate flash result before continuing
      if (!result.success || !result.proposal) {
        return NextResponse.json(
          {
            error: "Failed to generate flash proposal",
            details:
              result.error ||
              "Flash AI workflow did not return a valid proposal",
            generationType: "failed",
          },
          { status: 500 }
        );
      }

      aiResult = result;
    }

    // PRIME TEMPLATE WORKFLOW
    else if (templateType === "prime") {
      const { PrimeTemplateWorkflow } = await import(
        "#/modules/ai-generator/themes/prime"
      );
      const primeData = {
        selectedService: agentServiceId as ServiceType, // Use mapped service ID instead of originalServiceId
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        clientDescription,
        selectedPlans: defaultPlans,
        planDetails,
        includeTerms,
        includeFAQ,
        templateType: "prime" as const,
        mainColor,
      };

      const primeWorkflow = new PrimeTemplateWorkflow();
      let result: PrimeWorkflowResult;

      try {
        // 45s timeout for main prime workflow (increased for new models)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Prime AI timeout")), 45000);
        });
        const primePromise = primeWorkflow.execute(primeData);
        result = await Promise.race([primePromise, timeoutPromise]);
        generationType = "prime-workflow";
      } catch (workflowError) {
        console.error("Prime workflow error:", workflowError);
        // Fallback to simple generation (30s timeout)
        try {
          const simpleTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(
              () => reject(new Error("Prime simple generation timeout")),
              30000
            );
          });
          const simplePromise = primeWorkflow.execute(primeData);
          result = await Promise.race([simplePromise, simpleTimeoutPromise]);
          generationType = "prime-simple-generation";
        } catch (simpleError) {
          console.error("Prime simple generation error:", simpleError);
          return NextResponse.json(
            {
              error: "Failed to generate prime proposal",
              details: `Workflow error: ${
                workflowError instanceof Error
                  ? workflowError.message
                  : "Unknown"
              }. Fallback error: ${
                simpleError instanceof Error ? simpleError.message : "Unknown"
              }`,
              generationType: "failed",
            },
            { status: 500 }
          );
        }
      }

      // Validate prime result before continuing
      if (!result.success || !result.data) {
        return NextResponse.json(
          {
            error: "Failed to generate prime proposal",
            details: "Prime AI workflow did not return valid data",
            generationType: "failed",
          },
          { status: 500 }
        );
      }

      aiResult = result;
    }

    // REGULAR PROPOSAL WORKFLOW
    else {
      const { ProposalWorkflow } = await import("#/lib/ai/parallel-workflow");
      const workflowData = {
        selectedService: agentServiceId,
        companyInfo: defaultCompanyInfo,
        clientName,
        projectName,
        projectDescription,
        selectedPlans: defaultPlans,
        planDetails,
        includeTerms,
        includeFAQ,
        templateType: templateType as TemplateType,
      };

      const workflow = new ProposalWorkflow();
      let result: WorkflowResult;

      try {
        // 30s timeout for main workflow
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("AI timeout")), 30000);
        });
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

      aiResult = result;
    }

    // Create project in database
    console.log("Debug - Creating project with data:", {
      userId,
      clientName: body.clientName,
      projectName: body.projectName,
      templateType: body.templateType,
      mainColor: body.mainColor,
    });

    const newProject = await createOrUpdateProjectFromAIResult(
      userId.id,
      aiResult,
      body
    );

    console.log("Debug - Project created successfully:", {
      projectId: newProject.id,
      projectName: newProject.projectName,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...(typeof aiResult === "object" && aiResult !== null ? aiResult : {}),
        pageData: {
          templateType,
          mainColor,
          originalServiceId: selectedService,
        },
        project: {
          id: newProject.id,
          projectName: newProject.projectName,
          templateType: newProject.templateType,
          mainColor: newProject.mainColor,
        },
      },
      metadata: {
        service: agentServiceId,
        agent: agent.name,
        timestamp: new Date().toISOString(),
        mappedFrom: selectedService,
        generationType,
        planCount: defaultPlans,
        planGenerationMethod: selectedPlan
          ? `count-${selectedPlan}`
          : selectedPlan && selectedPlan > 0
          ? "array"
          : "default",
        projectCreated: true,
        projectId: newProject.id,
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
