/**
 * Project name handling utilities
 * Ensures proper case handling and prevents CAPS leakage
 */

/**
 * Convert project name from CAPS to proper case
 */
export function normalizeProjectName(projectName: string): string {
  if (!projectName || typeof projectName !== "string") {
    return projectName;
  }

  // If the entire string is uppercase and has more than one character, convert to proper case
  if (projectName === projectName.toUpperCase() && projectName.length > 1) {
    return projectName
      .toLowerCase()
      .split(" ")
      .map((word) => {
        // Handle common acronyms and special cases
        if (
          word === "seo" ||
          word === "api" ||
          word === "ui" ||
          word === "ux" ||
          word === "mvp"
        ) {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  return projectName;
}

/**
 * Validate and clean project name for use in proposals
 */
export function cleanProjectNameForProposal(projectName: string): string {
  const normalized = normalizeProjectName(projectName);

  // Remove any meta instructions that might have leaked
  return normalized
    .replace(/\(máximo \d+ caracteres?\)/gi, "")
    .replace(/\(max \d+ chars?\)/gi, "")
    .replace(/\(até \d+ caracteres?\)/gi, "")
    .replace(/\(limite \d+\)/gi, "")
    .replace(/\(máx\. \d+\)/gi, "")
    .replace(/\(max \d+\)/gi, "")
    .replace(/\(chars?\)/gi, "")
    .replace(/\(caracteres?\)/gi, "")
    .trim();
}

/**
 * Generate project name variations for different contexts
 */
export function generateProjectNameVariations(projectName: string): {
  short: string;
  medium: string;
  long: string;
  possessive: string;
} {
  const cleaned = cleanProjectNameForProposal(projectName);

  return {
    short: cleaned.length > 30 ? cleaned.substring(0, 27) + "..." : cleaned,
    medium: cleaned.length > 50 ? cleaned.substring(0, 47) + "..." : cleaned,
    long: cleaned.length > 100 ? cleaned.substring(0, 97) + "..." : cleaned,
    possessive: cleaned.toLowerCase(),
  };
}
