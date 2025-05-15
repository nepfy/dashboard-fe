import { useState, useEffect } from "react";
import { useUserAccount } from "#/hooks/useUserAccount";
import { PersonalFormValues } from "../types";
import { maskCPF } from "#/helpers/validateAndMaskCpf";
import { maskPhone } from "#/helpers";

/**
 * Custom hook to manage personal data form state and logic
 *
 * This hook encapsulates all form-related functionality for the personal data form, including:
 * - State management for form values and tracking changes
 * - Data synchronization with backend user data
 * - Form submission and cancellation logic
 * - Image preview handling
 * - Address search by CEP
 *
 * @param isEditing - Boolean indicating if the form is in edit mode
 * @returns Form state and handler functions
 */
export const usePersonalForm = (isEditing: boolean) => {
  const { userData, updateUserData } = useUserAccount();

  const [hasChanges, setHasChanges] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formValues, setFormValues] = useState<PersonalFormValues>({
    fullName: "",
    firstName: "",
    lastName: "",
    userName: "",
    cpf: "",
    phone: "",
    cep: "",
    street: "",
    neighborhood: "",
    state: "",
    city: "",
    number: "",
    additionalAddress: "",
  });

  const [originalValues, setOriginalValues] = useState<PersonalFormValues>({
    fullName: "",
    firstName: "",
    lastName: "",
    userName: "",
    cpf: "",
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
    if (userData) {
      const fullName = `${userData.firstName || ""} ${
        userData.lastName || ""
      }`.trim();

      const formattedCpf = userData.cpf ? maskCPF(userData.cpf) : "";
      const formattedPhone = userData.phone ? maskPhone(userData.phone) : "";

      const newValues = {
        fullName,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        cpf: formattedCpf,
        phone: formattedPhone,
        cep: userData.cep || "",
        street: userData.street || "",
        neighborhood: userData.neighborhood || "",
        state: userData.state || "",
        city: userData.city || "",
        number: userData.number || "",
        additionalAddress: userData.additionalAddress || "",
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
          formValues[key as keyof PersonalFormValues] !==
          originalValues[key as keyof PersonalFormValues]
      );

      // setHasChanges gets called from ImageUpload, so avoid overriding that
      if (!imagePreview) {
        setHasChanges(hasFormChanges);
      }
    }
  }, [formValues, imagePreview, isEditing, originalValues]);

  /**
   * Handle input field changes
   * Special handling for fullName which needs to be split into firstName and lastName
   *
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "fullName") {
      // Split full name into first and last name
      const nameParts = value.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const newValues = {
        ...formValues,
        fullName: value,
        firstName,
        lastName,
      };

      setFormValues(newValues);
      updateHasChanges(newValues);
    } else {
      // Handle regular field changes
      const newValues = { ...formValues, [name]: value };
      setFormValues(newValues);
      updateHasChanges(newValues);
    }
  };

  /**
   * Update multiple form fields at once
   * Useful for filling address fields after CEP search
   *
   * @param values - Partial form values to update
   */
  const updateFormValues = (values: Partial<PersonalFormValues>) => {
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
  const updateHasChanges = (newValues: PersonalFormValues) => {
    const hasFormChanges = Object.keys(newValues).some(
      (key) =>
        newValues[key as keyof PersonalFormValues] !==
        originalValues[key as keyof PersonalFormValues]
    );
    setHasChanges(hasFormChanges || imagePreview !== null);
  };

  /**
   * Submit form changes to the server
   * Updates original values to match current values after successful save
   * Resets hasChanges state and image preview
   *
   * @returns Promise that resolves on success or rejects on error
   */
  const handleSubmit = async (): Promise<void> => {
    try {
      const cleanCpf = formValues.cpf ? formValues.cpf.replace(/\D/g, "") : "";
      const cleanPhone = formValues.phone
        ? formValues.phone.replace(/\D/g, "")
        : "";

      // Send updated user data to server
      await updateUserData({
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        cpf: cleanCpf,
        phone: cleanPhone,
        cep: formValues.cep,
        street: formValues.street,
        neighborhood: formValues.neighborhood,
        state: formValues.state,
        city: formValues.city,
        number: formValues.number,
        additionalAddress: formValues.additionalAddress,
      });

      // After successful save, update original values and reset states
      setOriginalValues({ ...formValues });
      setImagePreview(null);
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
   * Clears image preview and hasChanges state
   */
  const handleCancel = (): void => {
    setFormValues({ ...originalValues });
    setImagePreview(null);
    setHasChanges(false);
  };

  return {
    formValues, // Current form field values
    hasChanges, // Whether form has unsaved changes (controls save button)
    imagePreview, // Preview of selected profile image
    setImagePreview, // Function to update image preview
    handleChange, // Handler for form input changes
    updateFormValues, // Function to update multiple form fields at once
    handleSubmit, // Function to save changes to server
    handleCancel, // Function to discard changes
    setHasChanges, // Function to track image changes
  };
};
