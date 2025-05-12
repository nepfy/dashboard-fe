/**
 * Applies formatting mask to a CNPJ number
 * @param value - The input value to be masked
 * @returns string - The masked CNPJ in format 00.000.000/0000-00
 */
export const maskCNPJ = (cnpj: string): string => {
  if (!cnpj) return "";

  const cleanValue = cnpj.replace(/\D/g, "");

  if (cleanValue.length === 0) return "";
  if (cleanValue.length <= 2) return cleanValue;
  if (cleanValue.length <= 5)
    return `${cleanValue.slice(0, 2)}.${cleanValue.slice(2)}`;
  if (cleanValue.length <= 8)
    return `${cleanValue.slice(0, 2)}.${cleanValue.slice(
      2,
      5
    )}.${cleanValue.slice(5)}`;
  if (cleanValue.length <= 12)
    return `${cleanValue.slice(0, 2)}.${cleanValue.slice(
      2,
      5
    )}.${cleanValue.slice(5, 8)}/${cleanValue.slice(8)}`;

  return `${cleanValue.slice(0, 2)}.${cleanValue.slice(
    2,
    5
  )}.${cleanValue.slice(5, 8)}/${cleanValue.slice(8, 12)}-${cleanValue.slice(
    12,
    14
  )}`;
};
