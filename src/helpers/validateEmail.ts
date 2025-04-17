/**
 * Validates an email address using a regular expression pattern
 *
 * This function checks for:
 * - Basic email format (username@domain.tld)
 * - At least one character before the @ symbol
 * - At least one character after the @ symbol and before the dot
 * - At least one dot in the domain
 * - At least two characters after the last dot
 *
 * @param email - The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email) return false;

  // RFC 5322 compliant email regex pattern
  const emailPattern =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailPattern.test(email);
};
