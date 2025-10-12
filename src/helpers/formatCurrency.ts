/**
 * Formats a value as Brazilian Real currency
 * @param value - The value to format (can be string or number)
 * @returns string - The formatted currency value (e.g., "R$ 1.234")
 */
export const formatCurrency = (value: string | number): string => {
  if (!value) return "";

  // Convert to string and remove any existing formatting
  const stringValue = value.toString().replace(/\D/g, "");

  if (!stringValue) return "";

  // Convert to number and divide by 100 to handle cents
  const number = parseInt(stringValue) / 100;

  // Format as Brazilian currency
  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats a value as Brazilian Real currency without the R$ symbol
 * @param value - The value to format (can be string or number)
 * @returns string - The formatted currency value (e.g., "1.234")
 */
export const formatCurrencyValue = (value: string | number): string => {
  if (!value) return "";

  // Convert to string and remove any existing formatting
  const stringValue = value.toString().replace(/\D/g, "");

  if (!stringValue) return "";

  // Convert to number and divide by 100 to handle cents
  const number = parseInt(stringValue) / 100;

  // Format as Brazilian currency without symbol
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Formats a numeric value as Brazilian Real currency for display (without dividing by 100)
 * @param value - The value to format (can be string or number)
 * @returns string - The formatted currency value (e.g., "R$ 2.500,00")
 */
export const formatCurrencyDisplay = (value: string | number): string => {
  if (!value) return "R$ 0,00";

  // Convert to number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "R$ 0,00";

  // Format as Brazilian currency with cents
  return numValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats a numeric value as Brazilian Real currency for display without cents
 * @param value - The value to format (can be string or number)
 * @returns string - The formatted currency value (e.g., "R$ 2.500")
 */
export const formatCurrencyDisplayNoCents = (
  value: string | number
): string => {
  if (!value) return "R$ 0";

  // Convert to number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "R$ 0";

  // Format as Brazilian currency without cents
  return numValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
