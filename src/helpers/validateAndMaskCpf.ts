/**
 * Validates if a CPF number is legitimate according to the Brazilian rules
 * @param cpf - The CPF string to validate (can include formatting characters)
 * @returns boolean - True if CPF is valid, false otherwise
 */
export const validateCPF = (cpf: string): boolean => {
  // Remove any non-numeric characters
  const cleanCPF: string = cpf.replace(/\D/g, "");

  // Check if it has 11 digits
  if (cleanCPF.length !== 11) return false;

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validate first check digit
  let sum: number = 0;
  for (let i: number = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder: number = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Validate second check digit
  sum = 0;
  for (let i: number = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
};

/**
 * Applies formatting mask to a CPF number
 * @param value - The input value to be masked
 * @returns string - The masked CPF in format 000.000.000-00
 */
export const maskCPF = (value: string): string => {
  const cleanValue: string = value.replace(/\D/g, "");
  if (cleanValue.length === 0) return "";
  if (cleanValue.length <= 3) return cleanValue;
  if (cleanValue.length <= 6)
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
  if (cleanValue.length <= 9)
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(
      3,
      6
    )}.${cleanValue.slice(6)}`;
  return `${cleanValue.slice(0, 3)}.${cleanValue.slice(
    3,
    6
  )}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
};
