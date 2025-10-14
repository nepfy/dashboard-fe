/**
 * Helper functions for working with unified proposal data
 * This simplifies the interaction with the proposalData JSON field
 */

import type { ProposalData, PartialProposalData } from "#/types/proposal-data";
import { db } from "#/lib/db";
import { projectsTable } from "#/lib/db/schema/projects";
import { eq } from "drizzle-orm";

/**
 * Get proposal data for a project
 */
export async function getProposalData(
  projectId: string
): Promise<ProposalData | null> {
  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.id, projectId),
    columns: {
      proposalData: true,
    },
  });

  return (project?.proposalData as ProposalData) || null;
}

/**
 * Update entire proposal data for a project
 */
export async function updateProposalData(
  projectId: string,
  proposalData: ProposalData
): Promise<void> {
  await db
    .update(projectsTable)
    .set({
      proposalData: proposalData as unknown as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, projectId));
}

/**
 * Partially update proposal data (merge with existing data)
 * This is useful for updating individual sections without affecting others
 */
export async function mergeProposalData(
  projectId: string,
  partialData: PartialProposalData
): Promise<void> {
  const currentData = await getProposalData(projectId);
  const mergedData = {
    ...(currentData || {}),
    ...partialData,
  };

  await updateProposalData(projectId, mergedData);
}

/**
 * Update a specific section of the proposal
 * Example: updateProposalSection(projectId, 'introduction', { title: 'New Title' })
 */
export async function updateProposalSection<K extends keyof ProposalData>(
  projectId: string,
  sectionKey: K,
  sectionData: ProposalData[K]
): Promise<void> {
  const currentData = await getProposalData(projectId);
  const updatedData = {
    ...(currentData || {}),
    [sectionKey]: sectionData,
  };

  await updateProposalData(projectId, updatedData);
}

/**
 * Get a specific section from proposal data
 */
export async function getProposalSection<K extends keyof ProposalData>(
  projectId: string,
  sectionKey: K
): Promise<ProposalData[K] | null> {
  const proposalData = await getProposalData(projectId);
  return proposalData?.[sectionKey] || null;
}

/**
 * Delete a specific section from proposal data
 */
export async function deleteProposalSection(
  projectId: string,
  sectionKey: keyof ProposalData
): Promise<void> {
  const currentData = await getProposalData(projectId);
  if (!currentData) return;

  const { [sectionKey]: _, ...remainingData } = currentData;

  await updateProposalData(projectId, remainingData as ProposalData);
}

/**
 * Initialize empty proposal data for a new project
 */
export async function initializeProposalData(projectId: string): Promise<void> {
  await db
    .update(projectsTable)
    .set({
      proposalData: {} as unknown as Record<string, unknown>,
    })
    .where(eq(projectsTable.id, projectId));
}

/**
 * Check if proposal data exists for a project
 */
export async function hasProposalData(projectId: string): Promise<boolean> {
  const proposalData = await getProposalData(projectId);
  return proposalData !== null && Object.keys(proposalData).length > 0;
}

/**
 * Example usage with AI generation:
 *
 * // Generate and save introduction section
 * const introData = await generateIntroductionWithAI(projectDetails);
 * await updateProposalSection(projectId, 'introduction', introData);
 *
 * // Get introduction data for editing
 * const intro = await getProposalSection(projectId, 'introduction');
 *
 * // Update entire proposal at once
 * const fullProposal = await generateFullProposalWithAI(projectDetails);
 * await updateProposalData(projectId, fullProposal);
 */
