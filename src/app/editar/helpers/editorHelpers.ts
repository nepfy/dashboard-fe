import { Plan, TeamMember, TemplateData } from "#/types/template-data";

export interface SaveProjectResponse {
  success: boolean;
  message?: string;
  data?: TemplateData;
}

export interface SaveProjectError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Saves project data to the API
 */
export async function saveProject(
  projectId: string,
  data: TemplateData
): Promise<SaveProjectResponse> {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to save project: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: "Project saved successfully",
      data: result.data || data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Deep merge utility for updating nested objects
 */
export function mergeUpdates<T extends Record<string, unknown>>(
  current: T,
  updates: Partial<T>
): T {
  const result = { ...current } as T;

  Object.keys(updates).forEach((key) => {
    const currentValue = current[key];
    const updateValue = updates[key];

    if (
      updateValue !== undefined &&
      currentValue !== null &&
      typeof currentValue === "object" &&
      !Array.isArray(currentValue) &&
      typeof updateValue === "object" &&
      !Array.isArray(updateValue)
    ) {
      result[key as keyof T] = mergeUpdates(
        currentValue as Record<string, unknown>,
        updateValue as Record<string, unknown>
      ) as T[keyof T];
    } else {
      result[key as keyof T] = updateValue as T[keyof T];
    }
  });

  return result;
}

/**
 * Validates a section's data structure
 */
export function validateSection(
  sectionType: string,
  data: TemplateData
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation - check if data exists
  if (!data || typeof data !== "object") {
    errors.push(`${sectionType} data is required`);
    return { isValid: false, errors };
  }

  // Section-specific validation can be added here
  switch (sectionType) {
    case "introduction":
      if (
        !data.proposalData?.introduction?.title &&
        data.proposalData?.introduction?.title !== ""
      ) {
        errors.push("Title is required");
      }
      break;

    case "plans":
      if (
        data.proposalData?.plans?.plansItems &&
        Array.isArray(data.proposalData?.plans?.plansItems)
      ) {
        data.proposalData?.plans?.plansItems.forEach(
          (plan: Plan, index: number) => {
            if (!plan.title) {
              errors.push(`Plan ${index + 1}: Title is required`);
            }
            if (!plan.value || parseFloat(plan.value) <= 0) {
              errors.push(`Plan ${index + 1}: Valid price is required`);
            }
          }
        );
      }
      break;

    case "team":
      if (
        data.proposalData?.team?.members &&
        Array.isArray(data.proposalData?.team?.members)
      ) {
        data.proposalData?.team?.members.forEach(
          (member: TeamMember, index: number) => {
            if (!member.name) {
              errors.push(`Team member ${index + 1}: Name is required`);
            }
          }
        );
      }
      break;

    default:
      // Generic validation for other sections
      break;
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Error handling utilities
 */
export class EditorError extends Error {
  constructor(message: string, public code?: string, public details?: unknown) {
    super(message);
    this.name = "EditorError";
  }
}

/**
 * Retry utility for API calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (i === maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError!;
}

/**
 * Debounce utility for auto-save functionality
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if project data has unsaved changes
 */
export function hasUnsavedChanges(
  original: TemplateData,
  current: TemplateData
): boolean {
  return JSON.stringify(original) !== JSON.stringify(current);
}

/**
 * Extract section visibility state from project data
 */
export function getSectionVisibilityFromData(
  data: TemplateData
): Record<string, boolean> {
  const visibility: Record<string, boolean> = {};

  if (!data.proposalData) return visibility;

  const proposalData = data.proposalData;

  // Map each section to its visibility state
  Object.keys(proposalData).forEach((key) => {
    const section = proposalData[key as keyof typeof proposalData];
    if (section && typeof section === "object" && "hideSection" in section) {
      visibility[key] = !!section.hideSection;
    }
  });

  return visibility;
}
