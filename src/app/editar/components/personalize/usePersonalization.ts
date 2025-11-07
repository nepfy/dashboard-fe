import { useState, useEffect, useRef } from "react";
import { FormErrors } from "./types";
import { validateSection } from "../../helpers/validation";
import { TEMPLATES } from "./constants";
import { useEditor } from "../../contexts/EditorContext";

interface UrlValidationState {
  isChecking: boolean;
  isDuplicate: boolean;
  message?: string;
}

interface InitialValues {
  selectedColor: string;
  originalPageUrl: string;
  pagePassword: string;
}

export const usePersonalizeForm = (isModalOpen: boolean) => {
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
  const initialValuesRef = useRef<InitialValues | null>(null);
  const [urlValidationState, setUrlValidationState] =
    useState<UrlValidationState>({
      isChecking: false,
      isDuplicate: false,
      message: undefined,
    });
  const lastValidationMessageRef = useRef<string | undefined>(undefined);

  // Update local state when projectData changes
  useEffect(() => {
    if (projectData) {
      setOriginalPageUrl(projectData.projectUrl || "");
      setPagePassword(projectData.pagePassword || "");
      setSelectedColor(projectData.mainColor || TEMPLATES[0].colorsList[0]);
    }
  }, [projectData]);

  // Track initial values when modal opens
  useEffect(() => {
    if (isModalOpen) {
      initialValuesRef.current = {
        selectedColor: projectData?.mainColor || TEMPLATES[0].colorsList[0],
        originalPageUrl: projectData?.projectUrl || "",
        pagePassword: projectData?.pagePassword || "",
      };
    } else {
      // Reset initial values when modal closes
      initialValuesRef.current = null;
    }
  }, [isModalOpen, projectData]);

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      if (field === "originalPageUrl") {
        lastValidationMessageRef.current = undefined;
        setUrlValidationState((prev) => ({
          ...prev,
          message: undefined,
          isDuplicate: false,
        }));
      }
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

    if (urlValidationState.isChecking) {
      setErrors((prev) => ({
        ...prev,
        originalPageUrl: "Aguarde a verificação da URL",
      }));
      return;
    }

    if (urlValidationState.isDuplicate || urlValidationState.message) {
      const validationMessage =
        urlValidationState.message || "Você já está usando essa URL";
      setErrors((prev) => ({
        ...prev,
        originalPageUrl: validationMessage,
      }));
      return;
    }

    // Update the context with new values (this will now be redundant for mainColor, but keep for consistency)
    updatePersonalization({
      projectUrl: originalPageUrl,
      pagePassword,
      mainColor: selectedColor,
    });

    // Clear any existing errors
    setErrors({});
  };

  const handleClose = () => {
    setSelectedColor(projectData?.mainColor || TEMPLATES[0].colorsList[0]);
    setOriginalPageUrl(projectData?.projectUrl || "");
    setPagePassword(projectData?.pagePassword || "");
    initialValuesRef.current = null;
  };

  const isFormValid =
    originalPageUrl.length >= 3 &&
    pagePassword.length >= 6 &&
    /^#[0-9A-Fa-f]{6}$/.test(selectedColor) &&
    !urlValidationState.isDuplicate &&
    !urlValidationState.isChecking &&
    !urlValidationState.message;

  // Check if there are changes from initial values
  // Use useEffect to update hasChanges state when values change
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!initialValuesRef.current) {
      setHasChanges(false);
      return;
    }

    const changed =
      selectedColor !== initialValuesRef.current.selectedColor ||
      originalPageUrl !== initialValuesRef.current.originalPageUrl ||
      pagePassword !== initialValuesRef.current.pagePassword;

    setHasChanges(changed);
  }, [selectedColor, originalPageUrl, pagePassword]);

  useEffect(() => {
    setErrors((prev) => {
      const lastMessage = lastValidationMessageRef.current;

      if (urlValidationState.message) {
        lastValidationMessageRef.current = urlValidationState.message;

        if (prev.originalPageUrl === urlValidationState.message) {
          return prev;
        }

        return {
          ...prev,
          originalPageUrl: urlValidationState.message,
        };
      }

      if (lastMessage && prev.originalPageUrl === lastMessage) {
        const rest = { ...prev };
        delete rest.originalPageUrl;
        lastValidationMessageRef.current = undefined;
        return rest;
      }

      lastValidationMessageRef.current = undefined;
      return prev;
    });
  }, [urlValidationState.message]);

  const handleUrlValidationStateChange = (state: UrlValidationState) => {
    setUrlValidationState(state);
  };

  return {
    projectData,
    errors,
    originalPageUrl,
    setOriginalPageUrl,
    pagePassword,
    setPagePassword,
    selectedColor,
    setSelectedColor,
    clearError,
    handleSave,
    handleClose,
    updatePersonalization,
    isFormValid,
    hasChanges,
    handleUrlValidationStateChange,
  };
};
