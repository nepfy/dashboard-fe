import { cache } from "react";
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
import type {
  CompleteProjectData,
  ProjectPlan,
} from "#/app/project/types/project";

/**
 * Unified function to fetch project data with different levels of detail
 * Cached to prevent duplicate calls in the same request
 */
export const getProjectData = cache(
  async (
    userName: string,
    projectUrl: string
  ): Promise<CompleteProjectData | null> => {
    try {
      const projectWithUser = await db
        .select({
          id: projectsTable.id,
          projectName: projectsTable.projectName,
          hideClientName: projectsTable.hideClientName,
          clientName: projectsTable.clientName,
          hideClientPhoto: projectsTable.hideClientPhoto,
          clientPhoto: projectsTable.clientPhoto,
          projectSentDate: projectsTable.projectSentDate,
          projectValidUntil: projectsTable.projectValidUntil,
          projectStatus: projectsTable.projectStatus,
          projectVisualizationDate: projectsTable.projectVisualizationDate,
          templateType: projectsTable.templateType,
          mainColor: projectsTable.mainColor,
          companyName: projectsTable.companyName,
          companyEmail: projectsTable.companyEmail,
          ctaButtonTitle: projectsTable.ctaButtonTitle,
          pageTitle: projectsTable.pageTitle,
          pageSubtitle: projectsTable.pageSubtitle,
          hidePageSubtitle: projectsTable.hidePageSubtitle,
          services: projectsTable.services,
          hideServices: projectsTable.hideServices,
          hideAboutUsSection: projectsTable.hideAboutUsSection,
          aboutUsTitle: projectsTable.aboutUsTitle,
          hideAboutUsSubtitle1: projectsTable.hideAboutUsSubtitle1,
          hideAboutUsSubtitle2: projectsTable.hideAboutUsSubtitle2,
          aboutUsSubtitle1: projectsTable.aboutUsSubtitle1,
          aboutUsSubtitle2: projectsTable.aboutUsSubtitle2,
          hideAboutYourTeamSection: projectsTable.hideAboutYourTeamSection,
          ourTeamSubtitle: projectsTable.ourTeamSubtitle,
          hideExpertiseSection: projectsTable.hideExpertiseSection,
          expertiseSubtitle: projectsTable.expertiseSubtitle,
          hideResultsSection: projectsTable.hideResultsSection,
          resultsSubtitle: projectsTable.resultsSubtitle,
          hideClientsSection: projectsTable.hideClientsSection,
          clientSubtitle: projectsTable.clientSubtitle,
          hideProcessSection: projectsTable.hideProcessSection,
          hideProcessSubtitle: projectsTable.hideProcessSubtitle,
          processSubtitle: projectsTable.processSubtitle,
          hideCTASection: projectsTable.hideCTASection,
          ctaBackgroundImage: projectsTable.ctaBackgroundImage,
          hideTestimonialsSection: projectsTable.hideTestimonialsSection,
          hideInvestmentSection: projectsTable.hideInvestmentSection,
          investmentTitle: projectsTable.investmentTitle,
          hideIncludedServicesSection:
            projectsTable.hideIncludedServicesSection,
          hidePlansSection: projectsTable.hidePlansSection,
          hideTermsSection: projectsTable.hideTermsSection,
          hideFaqSection: projectsTable.hideFaqSection,
          hideFaqSubtitle: projectsTable.hideFaqSubtitle,
          faqSubtitle: projectsTable.faqSubtitle,
          hideFinalMessageSection: projectsTable.hideFinalMessageSection,
          hideFinalMessageSubtitle: projectsTable.hideFinalMessageSubtitle,
          endMessageTitle: projectsTable.endMessageTitle,
          endMessageTitle2: projectsTable.endMessageTitle2,
          endMessageDescription: projectsTable.endMessageDescription,
          projectUrl: projectsTable.projectUrl,
          pagePassword: projectsTable.pagePassword,
          isPublished: projectsTable.isPublished,
          isProposalGenerated: projectsTable.isProposalGenerated,
          createdAt: projectsTable.created_at,
          updatedAt: projectsTable.updated_at,
          userName: personUserTable.userName,
        })
        .from(projectsTable)
        .innerJoin(
          personUserTable,
          eq(projectsTable.personId, personUserTable.id)
        )
        .where(
          and(
            eq(personUserTable.userName, userName),
            eq(projectsTable.projectUrl, projectUrl)
          )
        )
        .limit(1);

      if (!projectWithUser[0]) {
        return null;
      }

      const project = projectWithUser[0];

      const [
        teamMembers,
        expertise,
        results,
        clients,
        processSteps,
        testimonials,
        includedServices,
        plansWithDetails,
        termsConditions,
        faq,
      ] = await Promise.all([
        db
          .select()
          .from(projectTeamMembersTable)
          .where(eq(projectTeamMembersTable.projectId, project.id))
          .orderBy(projectTeamMembersTable.sortOrder),

        db
          .select()
          .from(projectExpertiseTable)
          .where(eq(projectExpertiseTable.projectId, project.id))
          .orderBy(projectExpertiseTable.sortOrder),

        db
          .select()
          .from(projectResultsTable)
          .where(eq(projectResultsTable.projectId, project.id))
          .orderBy(projectResultsTable.sortOrder),

        db
          .select()
          .from(projectClientsTable)
          .where(eq(projectClientsTable.projectId, project.id))
          .orderBy(projectClientsTable.sortOrder),

        db
          .select()
          .from(projectProcessStepsTable)
          .where(eq(projectProcessStepsTable.projectId, project.id))
          .orderBy(projectProcessStepsTable.sortOrder),

        db
          .select()
          .from(projectTestimonialsTable)
          .where(eq(projectTestimonialsTable.projectId, project.id))
          .orderBy(projectTestimonialsTable.sortOrder),

        db
          .select()
          .from(projectServicesTable)
          .where(eq(projectServicesTable.projectId, project.id))
          .orderBy(projectServicesTable.sortOrder),

        db
          .select({
            id: projectPlansTable.id,
            title: projectPlansTable.title,
            description: projectPlansTable.description,
            isBestOffer: projectPlansTable.isBestOffer,
            price: projectPlansTable.price,
            pricePeriod: projectPlansTable.pricePeriod,
            ctaButtonTitle: projectPlansTable.ctaButtonTitle,
            sortOrder: projectPlansTable.sortOrder,
            planDetailId: projectPlanDetailsTable.id,
            planDetailDescription: projectPlanDetailsTable.description,
            planDetailSortOrder: projectPlanDetailsTable.sortOrder,
          })
          .from(projectPlansTable)
          .leftJoin(
            projectPlanDetailsTable,
            eq(projectPlansTable.id, projectPlanDetailsTable.planId)
          )
          .where(eq(projectPlansTable.projectId, project.id))
          .orderBy(
            projectPlansTable.sortOrder,
            projectPlanDetailsTable.sortOrder
          ),

        db
          .select()
          .from(projectTermsConditionsTable)
          .where(eq(projectTermsConditionsTable.projectId, project.id))
          .orderBy(projectTermsConditionsTable.sortOrder),

        db
          .select()
          .from(projectFaqTable)
          .where(eq(projectFaqTable.projectId, project.id))
          .orderBy(projectFaqTable.sortOrder),
      ]);

      const plansMap = new Map<string, ProjectPlan>();
      plansWithDetails.forEach((row) => {
        if (!plansMap.has(row.id)) {
          plansMap.set(row.id, {
            id: row.id,
            title: row.title,
            description: row.description,
            isBestOffer: row.isBestOffer,
            price: row.price,
            pricePeriod: row.pricePeriod,
            ctaButtonTitle: row.ctaButtonTitle,
            sortOrder: row.sortOrder,
            planDetails: [],
          });
        }

        if (row.planDetailId) {
          plansMap.get(row.id)!.planDetails.push({
            id: row.planDetailId,
            description: row.planDetailDescription || "",
            sortOrder: row.planDetailSortOrder,
          });
        }
      });

      const plans = Array.from(plansMap.values());

      const completeProjectData: CompleteProjectData = {
        ...project,
        teamMembers: teamMembers || [],
        expertise: expertise || [],
        results: results || [],
        hideAboutUsSubtitle1: project.hideAboutUsSubtitle1,
        hideAboutUsSubtitle2: project.hideAboutUsSubtitle2,
        clients: clients || [],
        processSteps: processSteps || [],
        testimonials: testimonials || [],
        includedServices: includedServices || [],
        plans: plans || [],
        termsConditions: termsConditions || [],
        faq: faq || [],
      };

      return completeProjectData;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return null;
    }
  }
);
