/**
 * Simplified project data service using unified proposal_data
 */
import { cache } from "react";
import { db } from "#/lib/db";
import { eq, and } from "drizzle-orm";
import { projectsTable } from "#/lib/db/schema/projects";
import { personUserTable } from "#/lib/db/schema/users";

export const getProjectData = cache(
  async (userName: string, projectURL: string) => {
    try {
      // Fetch project with user and proposal data
      const result = await db
        .select({
          id: projectsTable.id,
          projectName: projectsTable.projectName,
          templateType: projectsTable.templateType,
          mainColor: projectsTable.mainColor,
          proposalData: projectsTable.proposalData,
          pagePassword: projectsTable.pagePassword,
          isPublished: projectsTable.isPublished,
          userName: personUserTable.userName,
          companyName: personUserTable.firstName, // Adjust as needed
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

      // Return unified data structure
      // TODO: Refactor FlashTemplate to use proposalData directly
      const projectResult = {
        id: project.id,
        projectName: project.projectName,
        templateType: project.templateType,
        mainColor: project.mainColor,
        proposalData: project.proposalData, // All sections in one place
        pagePassword: project.pagePassword,
        isPublished: project.isPublished,
        userName: project.userName,
        companyName: project.companyName,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return projectResult as any; // Temporary: FlashTemplate needs refactoring to use proposalData
    } catch (error) {
      console.error("Error fetching project data:", error);
      return null;
    }
  }
);
