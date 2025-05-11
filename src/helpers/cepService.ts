/**
 * Service for handling Brazilian CEP (Postal Code) operations
 */

/**
 * Interface for the address data returned by ViaCEP API
 */
export interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

/**
 * Formats a CEP string by removing non-numeric characters and adding the mask
 * @param cep - The CEP string to format
 * @returns Formatted CEP string (e.g., "12345-678")
 */
export const formatCep = (cep: string): string => {
  // Remove non-numeric characters
  const numericCep = cep.replace(/\D/g, "");

  // Format as "XXXXX-XXX"
  if (numericCep.length > 5) {
    return `${numericCep.slice(0, 5)}-${numericCep.slice(5, 8)}`;
  }

  return numericCep;
};

/**
 * Validates if a CEP is in the correct format
 * @param cep - The CEP string to validate
 * @returns Boolean indicating if the CEP is valid
 */
export const validateCep = (cep: string): boolean => {
  const cleanCep = cep.replace(/\D/g, "");
  return cleanCep.length === 8;
};

/**
 * Fetches address information based on a CEP from ViaCEP API
 * @param cep - The CEP to search for
 * @returns Promise with the address data or null if not found
 */
export const fetchAddressByCep = async (
  cep: string
): Promise<CepResponse | null> => {
  try {
    // Remove any non-numeric characters
    const cleanCep = cep.replace(/\D/g, "");

    // Check if CEP is valid
    if (!validateCep(cleanCep)) {
      return null;
    }

    // Fetch data from ViaCEP API
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    // Check if API returned an error
    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching CEP data:", error);
    return null;
  }
};
