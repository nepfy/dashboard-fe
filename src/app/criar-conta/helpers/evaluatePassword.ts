// Type definition for password strength
export type PasswordStrength = {
  strength: "none" | "fraca" | "moderada" | "forte";
  score: number;
};

/**
 * Evaluates password strength based on length and character variety
 * @param password - The password to evaluate
 * @returns Object containing strength level and score
 */
export const evaluatePasswordStrength = (
  password: string
): PasswordStrength => {
  if (!password) return { strength: "none", score: 0 };

  // Basic length check
  const length = password.length;

  // Check for different character types
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    password
  );

  // Count the types of characters used
  const typesCount = [
    hasLowercase,
    hasUppercase,
    hasNumbers,
    hasSpecialChars,
  ].filter(Boolean).length;

  // Calculate score based on length and character types
  let score = 0;

  // Length contribution
  if (length > 7) score += 1;
  if (length > 10) score += 1;

  // Character types contribution
  score += typesCount;

  // Determine strength level
  let strength: "none" | "fraca" | "moderada" | "forte" = "fraca";
  if (score >= 4) strength = "forte";
  else if (score >= 3) strength = "moderada";

  return { strength, score };
};
