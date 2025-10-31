/**
 * Simplified project data service using unified proposal_data
 */
import { cache } from "react";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";
import type { TemplateData } from "#/types/template-data";

export const getProjectData = cache(
  async (
    userName: string,
    projectURL: string
  ): Promise<TemplateData | null> => {
    try {
      // Fetch project with user and proposal data
      const result = await db
        .select({
          id: projectsTable.id,
          personId: projectsTable.personId,
          projectName: projectsTable.projectName,
          projectSentDate: projectsTable.projectSentDate,
          projectValidUntil: projectsTable.projectValidUntil,
          projectStatus: projectsTable.projectStatus,
          projectVisualizationDate: projectsTable.projectVisualizationDate,
          templateType: projectsTable.templateType,
          mainColor: projectsTable.mainColor,
          projectUrl: projectsTable.projectUrl,
          pagePassword: projectsTable.pagePassword,
          isPublished: projectsTable.isPublished,
          isProposalGenerated: projectsTable.isProposalGenerated,
          proposalData: projectsTable.proposalData,
          buttonConfig: projectsTable.buttonConfig,
          updated_at: projectsTable.updated_at,
          created_at: projectsTable.created_at,
          deleted_at: projectsTable.deleted_at,
          userName: personUserTable.userName,
          companyName: personUserTable.firstName,
        })
        .from(projectsTable)
        .innerJoin(
          personUserTable,
          eq(projectsTable.personId, personUserTable.id)
        )
        .where(
          and(
            eq(personUserTable.userName, userName),
            eq(projectsTable.projectUrl, projectURL)
          )
        )
        .limit(1);

      if (!result || result.length === 0) {
        return null;
      }

      const project = result[0];

      // Convert Date objects to strings for TemplateData interface
      const formatDate = (
        date: Date | null | undefined
      ): string | null | undefined => {
        if (!date) return date ?? null;
        return date.toISOString();
      };

      const projectResult: TemplateData = {
        id: project.id,
        personId: project.personId,
        projectName: project.projectName,
        projectSentDate: formatDate(project.projectSentDate) ?? null,
        projectValidUntil: formatDate(project.projectValidUntil) ?? undefined,
        projectStatus: project.projectStatus as TemplateData["projectStatus"],
        projectVisualizationDate:
          formatDate(project.projectVisualizationDate) ?? null,
        templateType: project.templateType as TemplateData["templateType"],
        mainColor: project?.mainColor ?? "",
        projectUrl: project?.projectUrl ?? undefined,
        pagePassword: project?.pagePassword ?? undefined,
        isPublished: project.isPublished ?? false,
        isProposalGenerated: project.isProposalGenerated ?? true,
        proposalData: (project.proposalData ?? undefined) as unknown as
          | TemplateData["proposalData"]
          | undefined,
        buttonConfig: project.buttonConfig as TemplateData["buttonConfig"],
        userName: project.userName ?? "",
        companyName: project.companyName ?? "",
        updated_at: formatDate(project.updated_at) ?? undefined,
        created_at: formatDate(project.created_at) ?? undefined,
        deleted_at: formatDate(project.deleted_at) ?? null,
      };

      return projectResult;
    } catch (error) {
      console.error("Error fetching project data:", error);
      return null;
    }
  }
);
