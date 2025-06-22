import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
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

import convertDecimal from "#/helpers/convertDecimal";
import {
  TeamMember,
  Expertise,
  Result,
  Client,
  ProcessStep,
  Testimonial,
  Service,
  Plan,
  PlanDetail,
  TermsCondition,
  FAQ,
} from "#/types/project";

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Não autorizado" },
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

    const body = await request.json();
    const { formData, templateType, projectId } = body;

    // Get the user's person ID
    const personResult = await db
      .select({
        id: personUserTable.id,
      })
      .from(personUserTable)
      .where(eq(personUserTable.email, emailAddress));

    if (!personResult[0]?.id) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const userId = personResult[0].id;

    // Validate required fields for finishing
    if (!formData?.step16?.pageUrl || !formData?.step16?.pagePassword) {
      return NextResponse.json(
        {
          success: false,
          error: "URL e senha são obrigatórios para finalizar",
        },
        { status: 400 }
      );
    }

    // Convert form data to database format
    const projectData = {
      personId: userId,
      projectName:
        formData.step1?.projectName ||
        `Proposta ${new Date().toLocaleDateString()}`,
      clientName: formData.step1?.clientName || "Cliente não informado",
      templateType: templateType || "flash",
      mainColor: formData.step1?.mainColor,
      companyName: formData.step1?.companyName,
      companyEmail: formData.step1?.companyEmail,
      ctaButtonTitle: formData.step1?.ctaButtonTitle,
      pageTitle: formData.step1?.pageTitle,
      pageSubtitle: formData.step1?.pageSubtitle,
      services: Array.isArray(formData.step1?.services)
        ? formData.step1.services.join(",")
        : formData.step1?.services,

      hideAboutUsSection: formData.step2?.hideAboutUsSection || false,
      aboutUsTitle: formData.step2?.aboutUsTitle,
      aboutUsSubtitle1: formData.step2?.aboutUsSubtitle1,
      aboutUsSubtitle2: formData.step2?.aboutUsSubtitle2,

      hideAboutYourTeamSection:
        formData.step3?.hideAboutYourTeamSection || false,
      ourTeamSubtitle: formData.step3?.ourTeamSubtitle,

      hideExpertiseSection: formData.step4?.hideExpertiseSection || false,
      expertiseSubtitle: formData.step4?.expertiseSubtitle,

      hideResultsSection: formData.step5?.hideResultsSection || false,
      resultsSubtitle: formData.step5?.resultsSubtitle,

      hideClientsSection: formData.step6?.hideClientsSection || false,
      hideLogoField: formData.step6?.hideLogoField || false,

      hideProcessSection: formData.step7?.hideProcessSection || false,
      hideProcessSubtitle: formData.step7?.hideProcessSubtitle || false,
      processSubtitle: formData.step7?.processSubtitle,

      hideCTASection: formData.step8?.hideCTASection || false,
      ctaBackgroundImage: formData.step8?.ctaBackgroundImage,

      hideTestimonialsSection: formData.step9?.hideTestimonialsSection || false,

      hideInvestmentSection: formData.step10?.hideInvestmentSection || false,
      investmentTitle: formData.step10?.investmentTitle,

      hideIncludedServicesSection:
        formData.step11?.hideIncludedServicesSection || false,

      hidePlansSection: formData.step12?.hidePlansSection || false,

      hideFaqSection: formData.step14?.hideFaqSection || false,

      hideTermsSection: formData.step13?.hideTermsSection || false,
      termsTitle: formData.step13?.termsTitle,

      hideFinalMessageSection:
        formData.step15?.hideFinalMessageSection || false,
      endMessageTitle: formData.step15?.endMessageTitle,
      endMessageTitle2: formData.step15?.endMessageTitle2,
      endMessageDescription: formData.step15?.endMessageDescription,

      projectUrl: formData.step16?.pageUrl,
      pagePassword: formData.step16?.pagePassword,
      projectValidUntil: formData.step16?.projectValidUntil
        ? new Date(formData.step16.projectValidUntil)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

      projectStatus: "draft",
      isProposalGenerated: true,
      projectSentDate: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    let savedProject;

    if (projectId) {
      // Update existing project
      savedProject = await db
        .update(projectsTable)
        .set({
          ...projectData,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(projectsTable.id, projectId),
            eq(projectsTable.personId, userId)
          )
        )
        .returning();
    } else {
      // Create new project
      savedProject = await db
        .insert(projectsTable)
        .values(projectData)
        .returning();
    }

    if (savedProject.length === 0) {
      return NextResponse.json(
        { success: false, error: "Falha ao finalizar projeto" },
        { status: 500 }
      );
    }

    const finalProjectId = savedProject[0].id;

    if (
      formData.step3?.teamMembers &&
      Array.isArray(formData.step3.teamMembers)
    ) {
      // Delete existing team members for this project
      await db
        .delete(projectTeamMembersTable)
        .where(eq(projectTeamMembersTable.projectId, finalProjectId));

      // Insert new team members
      if (formData.step3.teamMembers.length > 0) {
        const teamMembersToInsert = formData.step3.teamMembers.map(
          (member: TeamMember, index: number) => ({
            projectId: finalProjectId,
            name: member.name || "",
            role: member.role || "",
            photo: member.photo || null,
            sortOrder: member.sortOrder || index,
          })
        );

        await db.insert(projectTeamMembersTable).values(teamMembersToInsert);
      }
    }

    if (formData.step4?.expertise && Array.isArray(formData.step4.expertise)) {
      // Delete existing expertise for this project
      await db
        .delete(projectExpertiseTable)
        .where(eq(projectExpertiseTable.projectId, finalProjectId));

      // Insert new expertise
      if (formData.step4.expertise.length > 0) {
        const expertiseToInsert = formData.step4.expertise.map(
          (expertise: Expertise, index: number) => ({
            projectId: finalProjectId,
            title: expertise.title || "",
            description: expertise.description || "",
            icon: expertise.icon || null,
            sortOrder: expertise.sortOrder || index,
          })
        );

        await db.insert(projectExpertiseTable).values(expertiseToInsert);
      }
    }

    if (formData.step5?.results && Array.isArray(formData.step5.results)) {
      // Delete existing results for this project
      await db
        .delete(projectResultsTable)
        .where(eq(projectResultsTable.projectId, finalProjectId));

      if (formData.step5.results.length > 0) {
        const resultsToInsert = formData.step5.results.map(
          (result: Result, index: number) => {
            // Convert and validate values
            const convertedInvestment = convertDecimal(
              result.investment || "0"
            );
            const convertedRoi = convertDecimal(result.roi || "0");

            // Additional validation - check if values are within reasonable bounds
            const investmentNum = parseFloat(convertedInvestment);
            const roiNum = parseFloat(convertedRoi);

            // Log problematic values for debugging
            if (investmentNum > 1000000000000) {
              // 1 trillion
              console.warn(
                `Large investment value detected for result ${index}: ${investmentNum}`
              );
            }
            if (roiNum > 1000000000000) {
              // 1 trillion
              console.warn(
                `Large ROI value detected for result ${index}: ${roiNum}`
              );
            }

            return {
              projectId: finalProjectId,
              photo: result.photo || null,
              client: result.client || "",
              subtitle: result.subtitle || "",
              investment: convertedInvestment,
              roi: convertedRoi,
              sortOrder: result.sortOrder || index,
            };
          }
        );

        try {
          await db.insert(projectResultsTable).values(resultsToInsert);
        } catch (insertError) {
          console.error("Error inserting project results:", insertError);
          console.error("Values attempted to insert:", resultsToInsert);
          throw insertError;
        }
      }
    }

    if (formData.step6?.clients && Array.isArray(formData.step6.clients)) {
      // Delete existing clients for this project
      await db
        .delete(projectClientsTable)
        .where(eq(projectClientsTable.projectId, finalProjectId));

      // Insert new clients
      if (formData.step6.clients.length > 0) {
        const clientsToInsert = formData.step6.clients.map(
          (client: Client, index: number) => ({
            projectId: finalProjectId,
            logo: client.logo || null,
            name: client.name || "",
            sortOrder: client.sortOrder || index,
          })
        );

        await db.insert(projectClientsTable).values(clientsToInsert);
      }
    }

    if (
      formData.step7?.processSteps &&
      Array.isArray(formData.step7.processSteps)
    ) {
      // Delete existing process steps for this project
      await db
        .delete(projectProcessStepsTable)
        .where(eq(projectProcessStepsTable.projectId, finalProjectId));

      // Insert new process steps
      if (formData.step7.processSteps.length > 0) {
        const processStepsToInsert = formData.step7.processSteps.map(
          (processStep: ProcessStep, index: number) => ({
            projectId: finalProjectId,
            stepCounter: processStep.stepCounter || index + 1,
            stepName: processStep.stepName || "",
            description: processStep.description || null,
            sortOrder: processStep.sortOrder || index,
          })
        );

        await db.insert(projectProcessStepsTable).values(processStepsToInsert);
      }
    }

    if (
      formData.step9?.testimonials &&
      Array.isArray(formData.step9.testimonials)
    ) {
      // Delete existing testimonials for this project
      await db
        .delete(projectTestimonialsTable)
        .where(eq(projectTestimonialsTable.projectId, finalProjectId));

      // Insert new testimonials
      if (formData.step9.testimonials.length > 0) {
        const testimonialsToInsert = formData.step9.testimonials.map(
          (testimonial: Testimonial, index: number) => ({
            projectId: finalProjectId,
            testimonial: testimonial.testimonial || "",
            name: testimonial.name || "",
            role: testimonial.role || null,
            photo: testimonial.photo || null,
            sortOrder: testimonial.sortOrder || index,
          })
        );

        await db.insert(projectTestimonialsTable).values(testimonialsToInsert);
      }
    }

    if (
      formData.step11?.includedServices &&
      Array.isArray(formData.step11.includedServices)
    ) {
      // Delete existing services for this project
      await db
        .delete(projectServicesTable)
        .where(eq(projectServicesTable.projectId, finalProjectId));

      // Insert new services
      if (formData.step11.includedServices.length > 0) {
        const servicesToInsert = formData.step11.includedServices.map(
          (service: Service, index: number) => ({
            projectId: finalProjectId,
            title: service.title || "",
            description: service.description || "",
            sortOrder: service.sortOrder || index,
          })
        );

        await db.insert(projectServicesTable).values(servicesToInsert);
      }
    }

    if (
      formData.step11?.includedServices &&
      Array.isArray(formData.step11.includedServices)
    ) {
      // Delete existing services for this project
      await db
        .delete(projectServicesTable)
        .where(eq(projectServicesTable.projectId, finalProjectId));

      // Insert new services
      if (formData.step11.includedServices.length > 0) {
        const servicesToInsert = formData.step11.includedServices.map(
          (service: Service, index: number) => ({
            projectId: finalProjectId,
            title: service.title || "",
            description: service.description || "",
            sortOrder: service.sortOrder || index,
          })
        );

        await db.insert(projectServicesTable).values(servicesToInsert);
      }
    }

    if (formData.step12?.plans && Array.isArray(formData.step12.plans)) {
      // Delete existing plans and their details for this project
      await db
        .delete(projectPlansTable)
        .where(eq(projectPlansTable.projectId, finalProjectId));
      // Note: projectPlanDetailsTable will be deleted automatically due to cascade

      // Insert new plans
      if (formData.step12.plans.length > 0) {
        for (let index = 0; index < formData.step12.plans.length; index++) {
          const plan: Plan = formData.step12.plans[index];

          // Insert the plan first
          const insertedPlans = await db
            .insert(projectPlansTable)
            .values({
              projectId: finalProjectId,
              title: plan.title || "",
              description: plan.description || null,
              isBestOffer: plan.isBestOffer || false,
              price: convertDecimal(plan.price || 0),
              pricePeriod: plan.pricePeriod || "one-time",
              ctaButtonTitle: plan.ctaButtonTitle || null,
              sortOrder: plan.sortOrder || index,
            })
            .returning();

          const insertedPlanId = insertedPlans[0].id;

          // Insert plan details if they exist
          if (plan.planDetails && plan.planDetails.length > 0) {
            const planDetailsToInsert = plan.planDetails.map(
              (detail: PlanDetail, detailIndex: number) => ({
                planId: insertedPlanId,
                description: detail.description || "",
                sortOrder: detail.sortOrder || detailIndex,
              })
            );

            await db
              .insert(projectPlanDetailsTable)
              .values(planDetailsToInsert);
          }
        }
      }
    }

    if (
      formData.step13?.termsConditions &&
      Array.isArray(formData.step13.termsConditions)
    ) {
      // Delete existing terms conditions for this project
      await db
        .delete(projectTermsConditionsTable)
        .where(eq(projectTermsConditionsTable.projectId, finalProjectId));

      // Insert new terms conditions
      if (formData.step13.termsConditions.length > 0) {
        const termsConditionsToInsert = formData.step13.termsConditions.map(
          (termsCondition: TermsCondition, index: number) => ({
            projectId: finalProjectId,
            title: termsCondition.title || `Termo ${index + 1}`, // Fallback se title estiver vazio
            description: termsCondition.description || "",
            sortOrder: termsCondition.sortOrder || index,
          })
        );

        await db
          .insert(projectTermsConditionsTable)
          .values(termsConditionsToInsert);
      }
    }

    if (formData.step14?.faq && Array.isArray(formData.step14.faq)) {
      // Delete existing FAQ for this project
      await db
        .delete(projectFaqTable)
        .where(eq(projectFaqTable.projectId, finalProjectId));

      // Insert new FAQ
      if (formData.step14.faq.length > 0) {
        const faqToInsert = formData.step14.faq.map(
          (faq: FAQ, index: number) => ({
            projectId: finalProjectId,
            question: faq.question || "",
            answer: faq.answer || "",
            sortOrder: faq.sortOrder || index,
          })
        );

        await db.insert(projectFaqTable).values(faqToInsert);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Projeto finalizado com sucesso",
      data: {
        ...savedProject[0],
        projectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${formData.step16.pageUrl}`,
      },
    });
  } catch (error) {
    console.error("Error finishing project:", error);
    return NextResponse.json(
      { success: false, error: `Erro interno do servidor: ${error}` },
      { status: 500 }
    );
  }
}
