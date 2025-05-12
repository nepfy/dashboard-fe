import { useState, useEffect } from "react";
import { useUserAccount } from "#/hooks/useUserAccount";
import { CompanyFormValues } from "../types";
import { maskPhone, maskCNPJ } from "#/helpers";

/**
 * Custom hook to manage personal data form state and logic
 *
 * This hook encapsulates all form-related functionality for the personal data form, including:
 * - State management for form values and tracking changes
 * - Data synchronization with backend user data
 * - Form submission and cancellation logic
 * - Address search by CEP
 *
 * @param isEditing - Boolean indicating if the form is in edit mode
 * @returns Form state and handler functions
 */
export const useCompanyForm = (isEditing: boolean) => {
  const { userData, updateUserData } = useUserAccount();

  const [hasChanges, setHasChanges] = useState(false);

  const [formValues, setFormValues] = useState<CompanyFormValues>({
    companyName: "",
    cnpj: "",
    phone: "",
    cep: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
    number: "",
    additionalAddress: "",
  });

  const [originalValues, setOriginalValues] = useState<CompanyFormValues>({
    companyName: "",
    cnpj: "",
    phone: "",
    cep: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
    number: "",
    additionalAddress: "",
  });

  /**
   * Initialize form values when user data is loaded from the server
   * Sets both current form values and original values for comparison
   */
  useEffect(() => {
    if (userData?.companyData) {
      const formattedCnpj = userData.companyData.cnpj
        ? maskCNPJ(userData.companyData.cnpj)
        : "";
      const formattedPhone = userData.companyData.phone
        ? maskPhone(userData.companyData.phone)
        : "";

      const newValues = {
        companyName: userData.companyData.name || "",
        cnpj: formattedCnpj, // Use the masked CNPJ
        phone: formattedPhone, // Use the masked phone
        cep: userData.companyData.cep || "",
        street: userData.companyData.street || "",
        neighborhood: userData.companyData.neighborhood || "",
        state: userData.companyData.state || "",
        city: userData.companyData.city || "",
        number: userData.companyData.number || "",
        additionalAddress: userData.companyData.additionalAddress || "",
      };

      setFormValues(newValues);
      setOriginalValues(newValues);
    }
  }, [userData]);

  /**
   * Detect changes between current form values and original values
   * Updates hasChanges state which controls the save button state
   */
  useEffect(() => {
    if (isEditing) {
      const hasFormChanges = Object.keys(formValues).some(
        (key) =>
          formValues[key as keyof CompanyFormValues] !==
          originalValues[key as keyof CompanyFormValues]
      );

      // Consider either form field changes
      setHasChanges(hasFormChanges);
    }
  }, [formValues, isEditing, originalValues]);

  /**
   * Handle input field changes
   * Special handling for fullName which needs to be split into firstName and lastName
   *
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newValues = {
      ...formValues,
      [name]: value,
    };

    setFormValues(newValues);
    updateHasChanges(newValues);
  };

  /**
   * Update multiple form fields at once
   * Useful for filling address fields after CEP search
   *
   * @param values - Partial form values to update
   */
  const updateFormValues = (values: Partial<CompanyFormValues>) => {
    const newValues = { ...formValues, ...values };
    setFormValues(newValues);
    updateHasChanges(newValues);
  };

  /**
   * Helper function to update hasChanges state based on new form values
   * Called immediately after form values change to ensure UI responds right away
   *
   * @param newValues - The updated form values to compare against originals
   */
  const updateHasChanges = (newValues: CompanyFormValues) => {
    const hasFormChanges = Object.keys(newValues).some(
      (key) =>
        newValues[key as keyof CompanyFormValues] !==
        originalValues[key as keyof CompanyFormValues]
    );
    setHasChanges(hasFormChanges);
  };

  /**
   * Submit form changes to the server
   * Updates original values to match current values after successful save
   * Resets hasChanges state
   *
   * @returns Promise that resolves on success or rejects on error
   */
  const handleSubmit = async (): Promise<void> => {
    try {
      const cleanCnpj = formValues.cnpj
        ? formValues.cnpj.replace(/\D/g, "")
        : "";
      const cleanPhone = formValues.phone
        ? formValues.phone.replace(/\D/g, "")
        : "";

      await updateUserData({
        companyData: {
          name: formValues.companyName,
          cnpj: cleanCnpj, // Send the clean CNPJ
          phone: cleanPhone, // Send the clean phone
          cep: formValues.cep,
          street: formValues.street,
          neighborhood: formValues.neighborhood,
          state: formValues.state,
          city: formValues.city,
          number: formValues.number,
          additionalAddress: formValues.additionalAddress,
        },
      });

      // After successful save, update original values and reset states
      setOriginalValues({ ...formValues });
      setHasChanges(false);

      return Promise.resolve();
    } catch (error) {
      console.error("Error updating user data:", error);
      return Promise.reject(error);
    }
  };

  /**
   * Cancel all form changes
   * Resets form values to original values from server
   * Clears hasChanges state
   */
  const handleCancel = (): void => {
    setFormValues({ ...originalValues });
    setHasChanges(false);
  };

  return {
    formValues, // Current form field values
    hasChanges, // Whether form has unsaved changes (controls save button)
    handleChange, // Handler for form input changes
    updateFormValues, // Function to update multiple form fields at once
    handleSubmit, // Function to save changes to server
    handleCancel, // Function to discard changes
  };
};
