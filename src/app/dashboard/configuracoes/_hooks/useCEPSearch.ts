import { useState } from "react";
import {
  fetchAddressByCep,
  formatCep,
  validateCep,
} from "#/helpers/cepService";

/**
 * Custom hook to handle CEP search functionality
 *
 * @param onAddressFound - Callback function to handle the address data when found
 * @returns Object with state and handlers for CEP search
 */
export const useCepSearch = (
  onAddressFound: (addressData: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }) => void
) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  /**
   * Handle CEP input change and formatting
   *
   * @param value - The CEP input value
   * @returns Formatted CEP value
   */
  const handleCepChange = (value: string): string => {
    // Clear previous error
    setSearchError(null);

    // Format the CEP
    return formatCep(value);
  };

  /**
   * Search for address using the provided CEP
   *
   * @param cep - The CEP value to search
   */
  const searchAddressByCep = async (cep: string): Promise<void> => {
    // Clear previous error
    setSearchError(null);

    // Check if CEP is valid
    if (!validateCep(cep.replace(/\D/g, ""))) {
      setSearchError("CEP inválido");
      return;
    }

    try {
      setIsSearching(true);
      const addressData = await fetchAddressByCep(cep);

      if (!addressData) {
        setSearchError("CEP não encontrado");
        return;
      }

      // Call the callback with the found address data
      onAddressFound({
        street: addressData.logradouro,
        neighborhood: addressData.bairro,
        city: addressData.localidade,
        state: addressData.uf,
      });
    } catch (error) {
      setSearchError("Erro ao buscar CEP");
      console.error("Error searching CEP:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    searchError,
    handleCepChange,
    searchAddressByCep,
  };
};
