import { useState, useEffect } from "react";
import { FormErrors } from "./types";
import { validateSection } from "../../helpers/validation";
import { TEMPLATES } from "./constants";
import { useEditor } from "../../contexts/EditorContext";

export const usePersonalizeForm = () => {
  const { projectData, updatePersonalization } = useEditor();
  const [errors, setErrors] = useState<FormErrors>({});
  const [originalPageUrl, setOriginalPageUrl] = useState(
    projectData?.projectUrl || ""
  );
  const [pagePassword, setPagePassword] = useState(
    projectData?.pagePassword || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    projectData?.mainColor || TEMPLATES[0].colorsList[0]
  );

  // Update local state when projectData changes
  useEffect(() => {
    if (projectData) {
      setOriginalPageUrl(projectData.projectUrl || "");
      setPagePassword(projectData.pagePassword || "");
      setSelectedColor(projectData.mainColor || TEMPLATES[0].colorsList[0]);
    }
  }, [projectData]);

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
    const validationResult = validateSection("personalization", {
      projectUrl: originalPageUrl,
      pagePassword,
      mainColor: selectedColor,
      projectName: "",
      projectSentDate: null,
      templateType: "flash",
    });

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // Update the context with new values
    updatePersonalization({
      projectUrl: originalPageUrl,
      pagePassword,
      mainColor: selectedColor,
    });

    // Clear any existing errors
    setErrors({});
  };

  const isFormValid =
    originalPageUrl.length >= 3 &&
    pagePassword.length >= 6 &&
    /^#[0-9A-Fa-f]{6}$/.test(selectedColor);

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
