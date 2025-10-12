import { useState } from "react";
import { FormErrors } from "./types";
import { validateForm, isFormValid as checkFormValidity } from "./validation";
import { TEMPLATES } from "./constants";

export const usePersonalizeForm = () => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [originalPageUrl, setOriginalPageUrl] = useState("");
  const [pagePassword, setPagePassword] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    TEMPLATES[0].colorsList[0]
  );

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    const validationErrors = validateForm(originalPageUrl, pagePassword);
    console.log(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Close modal is now handled by parent
  };

  const isFormValid = checkFormValidity(originalPageUrl, pagePassword);

  return {
    errors,
    originalPageUrl,
    setOriginalPageUrl,
    pagePassword,
    setPagePassword,
    selectedColor,
    setSelectedColor,
    clearError,
    handleSave,
    isFormValid,
  };
};
