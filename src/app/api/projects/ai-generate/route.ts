import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { WorkflowResult } from "#/lib/ai/parallel-workflow";
import { getAgentByService, ServiceType } from "#/modules/ai-generator/agents";
import { FlashWorkflowResult } from "#/modules/ai-generator/themes/flash";
import { PrimeWorkflowResult } from "#/modules/ai-generator/themes/prime";
import {
  serviceMapping,
  flashServiceMapping,
  primeServiceMapping,
} from "#/modules/ai-generator/utils";
import { db } from "#/lib/db";
import { eq } from "drizzle-orm/expressions";
import {
  projectsTable,
  projectTeamMembersTable,
  projectExpertiseTable,
  projectResultsTable,
  projectClientsTable,
  projectProcessStepsTable,
  projectTestimonialsTable,
  projectServicesTable,
  projectPlansTable,
  projectPlanDetailsTable,
  projectTermsConditionsTable,
  projectFaqTable,
} from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

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

async function getUserIdFromEmail(
  emailAddress: string
): Promise<string | null> {
  const personResult = await db
    .select({ id: personUserTable.id })
    .from(personUserTable)
    .where(eq(personUserTable.email, emailAddress));

  return personResult[0]?.id || null;
}

type AIResult =
  | FlashWorkflowResult
  | PrimeWorkflowResult
  | WorkflowResult
  | Record<string, unknown>;

async function createProjectFromAIResult(
  userId: string,
  aiResult: AIResult,
  requestData: NepfyAIRequestData
) {
  console.log("Debug - createProjectFromAIResult called with:", {
    userId,
    requestDataClientName: requestData.clientName,
    requestDataProjectName: requestData.projectName,
    requestDataCompanyInfo: requestData.companyInfo,
  });

  // Create main project
  const projectData = {
    personId: userId,
    projectName: requestData.projectName,
    clientName: requestData.clientName,
    projectStatus: "draft",
    templateType: requestData.templateType || "flash",
    mainColor: requestData.mainColor || "#3B82F6",
    companyName:
      requestData.companyInfo || "Empresa especializada em soluções premium",
    companyEmail: "",
    pageTitle:
      ((aiResult as Record<string, unknown>).pageTitle as string) ||
      requestData.projectName,
    pageSubtitle:
      ((aiResult as Record<string, unknown>).pageSubtitle as string) ||
      requestData.projectDescription,
    services:
      ((aiResult as Record<string, unknown>).services as string) ||
      requestData.projectDescription,
    hideServices: false,
    hideAboutUsSection: false,
    hideAboutUsTitle: false,
    hideAboutUsSubtitle1: false,
    hideAboutUsSubtitle2: false,
    aboutUsTitle:
      ((aiResult as Record<string, unknown>).aboutUsTitle as string) ||
      "Sobre Nós",
    aboutUsSubtitle1:
      ((aiResult as Record<string, unknown>).aboutUsSubtitle1 as string) ||
      requestData.companyInfo ||
      "Empresa especializada em soluções premium",
    aboutUsSubtitle2:
      ((aiResult as Record<string, unknown>).aboutUsSubtitle2 as string) || "",
    hideAboutYourTeamSection: false,
    ourTeamSubtitle:
      ((aiResult as Record<string, unknown>).ourTeamSubtitle as string) ||
      "Nossa Equipe",
    hideExpertiseSection: false,
    expertiseSubtitle:
      ((aiResult as Record<string, unknown>).expertiseSubtitle as string) ||
      "Nossa Expertise",
    hideResultsSection: false,
    resultsSubtitle:
      ((aiResult as Record<string, unknown>).resultsSubtitle as string) ||
      "Resultados",
    hideClientsSection: false,
    clientSubtitle:
      ((aiResult as Record<string, unknown>).clientSubtitle as string) ||
      "Nossos Clientes",
    hideProcessSection: false,
    hideProcessSubtitle: false,
    processSubtitle:
      ((aiResult as Record<string, unknown>).processSubtitle as string) ||
      "Nosso Processo",
    hideCTASection: false,
    hideTestimonialsSection: false,
    hideInvestmentSection: false,
    investmentTitle:
      ((aiResult as Record<string, unknown>).investmentTitle as string) ||
      "Investimento",
    hideIncludedServicesSection: false,
    hidePlansSection: false,
    hideTermsSection: !requestData.includeTerms,
    hideFaqSection: !requestData.includeFAQ,
    hideFaqSubtitle: false,
    faqSubtitle:
      ((aiResult as Record<string, unknown>).faqSubtitle as string) ||
      "Perguntas Frequentes",
    hideFinalMessageSection: false,
    hideFinalMessageSubtitle: false,
    endMessageTitle:
      ((aiResult as Record<string, unknown>).endMessageTitle as string) ||
      "Vamos Conversar?",
    endMessageTitle2:
      ((aiResult as Record<string, unknown>).endMessageTitle2 as string) ||
      "Entre em contato conosco",
    endMessageDescription:
      ((aiResult as Record<string, unknown>).endMessageDescription as string) ||
      "Estamos prontos para transformar sua ideia em realidade. Entre em contato para começarmos.",
    isProposalGenerated: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  console.log("Debug - Inserting project with data:", projectData);

  const [newProject] = await db
    .insert(projectsTable)
    .values(projectData)
    .returning();

  console.log("Debug - Project inserted successfully:", newProject);

  const projectId = newProject.id;

  // Create team members if available
  if (
    (aiResult as Record<string, unknown>).teamMembers &&
    Array.isArray((aiResult as Record<string, unknown>).teamMembers)
  ) {
    const teamMembersData = (aiResult as Record<string, unknown>)
      .teamMembers as Array<Record<string, unknown>>;
    const mappedTeamMembers = teamMembersData.map((member, index: number) => ({
      projectId,
      name: (member.name as string) || `Membro ${index + 1}`,
      role: (member.role as string) || "Especialista",
      photo: (member.photo as string) || "",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (mappedTeamMembers.length > 0) {
      await db.insert(projectTeamMembersTable).values(mappedTeamMembers);
    }
  }

  // Create expertise if available
  if (
    (aiResult as Record<string, unknown>).expertise &&
    Array.isArray((aiResult as Record<string, unknown>).expertise)
  ) {
    const expertiseData = (aiResult as Record<string, unknown>)
      .expertise as Array<Record<string, unknown>>;
    const mappedExpertise = expertiseData.map((exp, index: number) => ({
      projectId,
      title: (exp.title as string) || `Expertise ${index + 1}`,
      description: (exp.description as string) || "",
      icon: (exp.icon as string) || "",
      sortOrder: index,
      hideExpertiseIcon: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (mappedExpertise.length > 0) {
      await db.insert(projectExpertiseTable).values(mappedExpertise);
    }
  }

  // Create results if available
  if (
    (aiResult as Record<string, unknown>).results &&
    Array.isArray((aiResult as Record<string, unknown>).results)
  ) {
    const resultsData = (aiResult as Record<string, unknown>).results as Array<
      Record<string, unknown>
    >;
    const mappedResults = resultsData.map((result, index: number) => ({
      projectId,
      client: (result.client as string) || `Cliente ${index + 1}`,
      subtitle: (result.subtitle as string) || "",
      investment: (result.investment as string | null) || null,
      roi: (result.roi as string | null) || null,
      photo: (result.photo as string) || "",
      hidePhoto: false,
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (mappedResults.length > 0) {
      await db.insert(projectResultsTable).values(mappedResults);
    }
  }

  // Create clients if available
  if (
    (aiResult as Record<string, unknown>).clients &&
    Array.isArray((aiResult as Record<string, unknown>).clients)
  ) {
    const clientsData = (aiResult as Record<string, unknown>).clients as Array<
      Record<string, unknown>
    >;
    const mappedClients = clientsData.map((client, index: number) => ({
      projectId,
      name: (client.name as string) || `Cliente ${index + 1}`,
      logo: (client.logo as string) || "",
      hideLogo: false,
      hideClientName: false,
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (mappedClients.length > 0) {
      await db.insert(projectClientsTable).values(mappedClients);
    }
  }

  // Create process steps if available
  if (
    (aiResult as Record<string, unknown>).processSteps &&
    Array.isArray((aiResult as Record<string, unknown>).processSteps)
  ) {
    const processStepsData = (aiResult as Record<string, unknown>)
      .processSteps as Array<Record<string, unknown>>;
    const mappedProcessSteps = processStepsData.map((step, index: number) => ({
      projectId,
      stepCounter: index + 1,
      stepName: (step.stepName as string) || `Passo ${index + 1}`,
      description: (step.description as string) || "",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (mappedProcessSteps.length > 0) {
      await db.insert(projectProcessStepsTable).values(mappedProcessSteps);
    }
  }

  // Create testimonials if available
  if (
    (aiResult as Record<string, unknown>).testimonials &&
    Array.isArray((aiResult as Record<string, unknown>).testimonials)
  ) {
    const testimonialsData = (aiResult as Record<string, unknown>)
      .testimonials as Array<Record<string, unknown>>;
    const mappedTestimonials = testimonialsData.map(
      (testimonial, index: number) => ({
        projectId,
        testimonial: (testimonial.testimonial as string) || "",
        name: (testimonial.name as string) || `Cliente ${index + 1}`,
        role: (testimonial.role as string) || "",
        photo: (testimonial.photo as string) || "",
        hidePhoto: false,
        sortOrder: index,
        created_at: new Date(),
        updated_at: new Date(),
      })
    );

    if (mappedTestimonials.length > 0) {
      await db.insert(projectTestimonialsTable).values(mappedTestimonials);
    }
  }

  // Create services if available
  if (
    (aiResult as Record<string, unknown>).servicesList &&
    Array.isArray((aiResult as Record<string, unknown>).servicesList)
  ) {
    const servicesData = (aiResult as Record<string, unknown>)
      .servicesList as Array<Record<string, unknown>>;
    const mappedServices = servicesData.map((service, index: number) => ({
      projectId,
      title: (service.title as string) || `Serviço ${index + 1}`,
      description: (service.description as string) || "",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (mappedServices.length > 0) {
      await db.insert(projectServicesTable).values(mappedServices);
    }
  }

  // Create plans if available
  if (
    (aiResult as Record<string, unknown>).plans &&
    Array.isArray((aiResult as Record<string, unknown>).plans)
  ) {
    const plansData = (
      (aiResult as Record<string, unknown>).plans as Array<
        Record<string, unknown>
      >
    ).map((plan: Record<string, unknown>, index: number) => ({
      projectId,
      title: (plan.title as string) || `Plano ${index + 1}`,
      description: (plan.description as string) || "",
      price: (plan.price as string) || null,
      pricePeriod: (plan.pricePeriod as string) || "one-time",
      isBestOffer: (plan.isBestOffer as boolean) || false,
      ctaButtonTitle: (plan.ctaButtonTitle as string) || "Começar Agora",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (plansData.length > 0) {
      const insertedPlans = await db
        .insert(projectPlansTable)
        .values(plansData)
        .returning();

      // Create plan details if available
      if (
        (aiResult as Record<string, unknown>).planDetails &&
        Array.isArray((aiResult as Record<string, unknown>).planDetails)
      ) {
        for (let i = 0; i < insertedPlans.length; i++) {
          const plan = insertedPlans[i];
          const planDetail = (
            (aiResult as Record<string, unknown>).planDetails as Array<
              Record<string, unknown>
            >
          )[i];

          if (
            planDetail &&
            planDetail.features &&
            Array.isArray(planDetail.features)
          ) {
            const planDetailsData = (planDetail.features as Array<string>).map(
              (feature: string, index: number) => ({
                planId: plan.id,
                description: feature || "",
                sortOrder: index,
                created_at: new Date(),
                updated_at: new Date(),
              })
            );

            if (planDetailsData.length > 0) {
              await db.insert(projectPlanDetailsTable).values(planDetailsData);
            }
          }
        }
      }
    }
  }

  // Create terms and conditions if available
  if (
    requestData.includeTerms &&
    (aiResult as Record<string, unknown>).terms &&
    Array.isArray((aiResult as Record<string, unknown>).terms)
  ) {
    const termsData = (
      (aiResult as Record<string, unknown>).terms as Array<
        Record<string, unknown>
      >
    ).map((term: Record<string, unknown>, index: number) => ({
      projectId,
      title: (term.title as string) || `Termo ${index + 1}`,
      description: (term.description as string) || "",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (termsData.length > 0) {
      await db.insert(projectTermsConditionsTable).values(termsData);
    }
  }

  // Create FAQ if available
  if (
    requestData.includeFAQ &&
    (aiResult as Record<string, unknown>).faq &&
    Array.isArray((aiResult as Record<string, unknown>).faq)
  ) {
    const faqData = (
      (aiResult as Record<string, unknown>).faq as Array<
        Record<string, unknown>
      >
    ).map((faqItem: Record<string, unknown>, index: number) => ({
      projectId,
      question: (faqItem.question as string) || `Pergunta ${index + 1}`,
      answer: (faqItem.answer as string) || "",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (faqData.length > 0) {
      await db.insert(projectFaqTable).values(faqData);
    }
  }

  return newProject;
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
      companyInfo,
      selectedPlan,
      selectedPlans,
      planDetails,
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

    let aiResult: AIResult;
    let generationType: string;

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

      aiResult = result;
    }

    // PRIME TEMPLATE WORKFLOW
    else if (templateType === "prime") {
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
        planDetails:
          planDetails ||
          generateDefaultPlanDetails(agentServiceId, defaultPlans),
        includeTerms,
        includeFAQ,
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

    const newProject = await createProjectFromAIResult(userId, aiResult, body);

    console.log("Debug - Project created successfully:", {
      projectId: newProject.id,
      clientName: newProject.clientName,
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
          clientName: newProject.clientName,
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
        planCount: defaultPlans.length,
        planGenerationMethod: selectedPlan
          ? `count-${selectedPlan}`
          : selectedPlans && selectedPlans.length > 0
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
