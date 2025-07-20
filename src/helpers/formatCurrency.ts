/**
 * Formats a value as Brazilian Real currency
 * @param value - The value to format (can be string or number)
 * @returns string - The formatted currency value (e.g., "R$ 1.234,56")
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
 * @returns string - The formatted currency value (e.g., "1.234,56")
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
