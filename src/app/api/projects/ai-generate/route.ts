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
import { eq } from "drizzle-orm";
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

interface AIResult {
  pageTitle?: string;
  pageSubtitle?: string;
  services?: string;
  aboutUsTitle?: string;
  aboutUsSubtitle1?: string;
  aboutUsSubtitle2?: string;
  ourTeamSubtitle?: string;
  expertiseSubtitle?: string;
  resultsSubtitle?: string;
  clientSubtitle?: string;
  processSubtitle?: string;
  investmentTitle?: string;
  faqSubtitle?: string;
  endMessageTitle?: string;
  endMessageTitle2?: string;
  endMessageDescription?: string;
  teamMembers?: Array<{
    name?: string;
    role?: string;
    photo?: string;
  }>;
  expertise?: Array<{
    title?: string;
    description?: string;
    icon?: string;
  }>;
  results?: Array<{
    client?: string;
    subtitle?: string;
    investment?: string | number;
    roi?: string | number;
    photo?: string;
  }>;
  clients?: Array<{
    name?: string;
    logo?: string;
  }>;
  processSteps?: Array<{
    stepName?: string;
    description?: string;
  }>;
  testimonials?: Array<{
    testimonial?: string;
    name?: string;
    role?: string;
    photo?: string;
  }>;
  servicesList?: Array<{
    title?: string;
    description?: string;
  }>;
  plans?: Array<{
    title?: string;
    description?: string;
    price?: string | number;
    pricePeriod?: string;
    isBestOffer?: boolean;
    ctaButtonTitle?: string;
  }>;
  planDetails?: Array<{
    features?: string[];
  }>;
  terms?: Array<{
    title?: string;
    description?: string;
  }>;
  faq?: Array<{
    question?: string;
    answer?: string;
  }>;
}

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
    pageTitle: aiResult.pageTitle || requestData.projectName,
    pageSubtitle: aiResult.pageSubtitle || requestData.projectDescription,
    services: aiResult.services || requestData.projectDescription,
    hideServices: false,
    hideAboutUsSection: false,
    hideAboutUsTitle: false,
    hideAboutUsSubtitle1: false,
    hideAboutUsSubtitle2: false,
    aboutUsTitle: aiResult.aboutUsTitle || "Sobre Nós",
    aboutUsSubtitle1:
      aiResult.aboutUsSubtitle1 ||
      requestData.companyInfo ||
      "Empresa especializada em soluções premium",
    aboutUsSubtitle2: aiResult.aboutUsSubtitle2 || "",
    hideAboutYourTeamSection: false,
    ourTeamSubtitle: aiResult.ourTeamSubtitle || "Nossa Equipe",
    hideExpertiseSection: false,
    expertiseSubtitle: aiResult.expertiseSubtitle || "Nossa Expertise",
    hideResultsSection: false,
    resultsSubtitle: aiResult.resultsSubtitle || "Resultados",
    hideClientsSection: false,
    clientSubtitle: aiResult.clientSubtitle || "Nossos Clientes",
    hideProcessSection: false,
    hideProcessSubtitle: false,
    processSubtitle: aiResult.processSubtitle || "Nosso Processo",
    hideCTASection: false,
    hideTestimonialsSection: false,
    hideInvestmentSection: false,
    investmentTitle: aiResult.investmentTitle || "Investimento",
    hideIncludedServicesSection: false,
    hidePlansSection: false,
    hideTermsSection: !requestData.includeTerms,
    hideFaqSection: !requestData.includeFAQ,
    hideFaqSubtitle: false,
    faqSubtitle: aiResult.faqSubtitle || "Perguntas Frequentes",
    hideFinalMessageSection: false,
    hideFinalMessageSubtitle: false,
    endMessageTitle: aiResult.endMessageTitle || "Vamos Conversar?",
    endMessageTitle2: aiResult.endMessageTitle2 || "Entre em contato conosco",
    endMessageDescription:
      aiResult.endMessageDescription ||
      "Estamos prontos para transformar sua ideia em realidade. Entre em contato para começarmos.",
    isProposalGenerated: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const [newProject] = await db
    .insert(projectsTable)
    .values(projectData)
    .returning();

  const projectId = newProject.id;

  // Create team members if available
  if (aiResult.teamMembers && Array.isArray(aiResult.teamMembers)) {
    const teamMembersData = aiResult.teamMembers.map(
      (member, index: number) => ({
        projectId,
        name: member.name || `Membro ${index + 1}`,
        role: member.role || "Especialista",
        photo: member.photo || "",
        sortOrder: index,
        created_at: new Date(),
        updated_at: new Date(),
      })
    );

    if (teamMembersData.length > 0) {
      await db.insert(projectTeamMembersTable).values(teamMembersData);
    }
  }

  // Create expertise if available
  if (aiResult.expertise && Array.isArray(aiResult.expertise)) {
    const expertiseData = aiResult.expertise.map((exp, index: number) => ({
      projectId,
      title: exp.title || `Expertise ${index + 1}`,
      description: exp.description || "",
      icon: exp.icon || "",
      sortOrder: index,
      hideExpertiseIcon: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (expertiseData.length > 0) {
      await db.insert(projectExpertiseTable).values(expertiseData);
    }
  }

  // Create results if available
  if (aiResult.results && Array.isArray(aiResult.results)) {
    const resultsData = aiResult.results.map((result, index: number) => ({
      projectId,
      client: result.client || `Cliente ${index + 1}`,
      subtitle: result.subtitle || "",
      investment: result.investment || null,
      roi: result.roi || null,
      photo: result.photo || "",
      hidePhoto: false,
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (resultsData.length > 0) {
      await db.insert(projectResultsTable).values(resultsData);
    }
  }

  // Create clients if available
  if (aiResult.clients && Array.isArray(aiResult.clients)) {
    const clientsData = aiResult.clients.map((client, index: number) => ({
      projectId,
      name: client.name || `Cliente ${index + 1}`,
      logo: client.logo || "",
      hideLogo: false,
      hideClientName: false,
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (clientsData.length > 0) {
      await db.insert(projectClientsTable).values(clientsData);
    }
  }

  // Create process steps if available
  if (aiResult.processSteps && Array.isArray(aiResult.processSteps)) {
    const processStepsData = aiResult.processSteps.map(
      (step, index: number) => ({
        projectId,
        stepCounter: index + 1,
        stepName: step.stepName || `Passo ${index + 1}`,
        description: step.description || "",
        sortOrder: index,
        created_at: new Date(),
        updated_at: new Date(),
      })
    );

    if (processStepsData.length > 0) {
      await db.insert(projectProcessStepsTable).values(processStepsData);
    }
  }

  // Create testimonials if available
  if (aiResult.testimonials && Array.isArray(aiResult.testimonials)) {
    const testimonialsData = aiResult.testimonials.map(
      (testimonial, index: number) => ({
        projectId,
        testimonial: testimonial.testimonial || "",
        name: testimonial.name || `Cliente ${index + 1}`,
        role: testimonial.role || "",
        photo: testimonial.photo || "",
        hidePhoto: false,
        sortOrder: index,
        created_at: new Date(),
        updated_at: new Date(),
      })
    );

    if (testimonialsData.length > 0) {
      await db.insert(projectTestimonialsTable).values(testimonialsData);
    }
  }

  // Create services if available
  if (aiResult.servicesList && Array.isArray(aiResult.servicesList)) {
    const servicesData = aiResult.servicesList.map(
      (service, index: number) => ({
        projectId,
        title: service.title || `Serviço ${index + 1}`,
        description: service.description || "",
        sortOrder: index,
        created_at: new Date(),
        updated_at: new Date(),
      })
    );

    if (servicesData.length > 0) {
      await db.insert(projectServicesTable).values(servicesData);
    }
  }

  // Create plans if available
  if (aiResult.plans && Array.isArray(aiResult.plans)) {
    const plansData = aiResult.plans.map((plan, index: number) => ({
      projectId,
      title: plan.title || `Plano ${index + 1}`,
      description: plan.description || "",
      price: plan.price || null,
      pricePeriod: plan.pricePeriod || "one-time",
      isBestOffer: plan.isBestOffer || false,
      ctaButtonTitle: plan.ctaButtonTitle || "Começar Agora",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (plansData.length > 0) {
      const [insertedPlans] = await db
        .insert(projectPlansTable)
        .values(plansData)
        .returning();

      // Create plan details if available
      if (aiResult.planDetails && Array.isArray(aiResult.planDetails)) {
        for (let i = 0; i < insertedPlans.length; i++) {
          const plan = insertedPlans[i];
          const planDetail = aiResult.planDetails[i];

          if (
            planDetail &&
            planDetail.features &&
            Array.isArray(planDetail.features)
          ) {
            const planDetailsData = planDetail.features.map(
              (feature, index: number) => ({
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
    aiResult.terms &&
    Array.isArray(aiResult.terms)
  ) {
    const termsData = aiResult.terms.map((term, index: number) => ({
      projectId,
      title: term.title || `Termo ${index + 1}`,
      description: term.description || "",
      sortOrder: index,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    if (termsData.length > 0) {
      await db.insert(projectTermsConditionsTable).values(termsData);
    }
  }

  // Create FAQ if available
  if (requestData.includeFAQ && aiResult.faq && Array.isArray(aiResult.faq)) {
    const faqData = aiResult.faq.map((faqItem, index: number) => ({
      projectId,
      question: faqItem.question || `Pergunta ${index + 1}`,
      answer: faqItem.answer || "",
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
          : selectedPlans.length > 0
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
