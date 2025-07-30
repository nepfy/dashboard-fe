/**
 * Formats a phone number for WhatsApp links
 * Removes all non-numeric characters and ensures proper format
 * @param phone - The phone number to format
 * @returns Formatted phone number for WhatsApp or null if invalid
 */
export function formatPhoneForWhatsApp(
  phone: string | null | undefined
): string | null {
  if (!phone) return null;

  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, "");

  // Check if it's a valid Brazilian phone number (10-11 digits)
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return null;
  }

  // If it's 10 digits, assume it's missing the 9th digit (mobile)
  if (cleanPhone.length === 10) {
    return `55${cleanPhone}`;
  }

  // If it's 11 digits, add country code
  return `55${cleanPhone}`;
}
