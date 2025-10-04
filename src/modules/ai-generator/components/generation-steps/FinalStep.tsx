import { useState } from "react";
import { Box } from "#/modules/ai-generator/components/box/Box";
import { PageURLSection } from "#/modules/ai-generator/components/final-steps-section/PageURLSection";
import { PasswordSection } from "#/modules/ai-generator/components/final-steps-section/PasswordSection";
import { ValidUntilSection } from "#/modules/ai-generator/components/final-steps-section/ValidUntilSection";

interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

interface FormErrors {
  originalPageUrl?: string;
  pagePassword?: string;
  pageValidity?: string;
  general?: string;
}

const MIN_URL_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

export function FinalStep({
  handleGenerateProposal,
  handleBack,
  userName = "usuário",
  step,
  originalPageUrl,
  setOriginalPageUrl,
  pagePassword,
  setPagePassword,
  validUntil,
  setValidUntil,
}: {
  handleGenerateProposal: () => void;
  handleBack: () => void;
  userName: string;
  step: string;
  originalPageUrl: string;
  setOriginalPageUrl: (url: string) => void;
  pagePassword: string;
  setPagePassword: (password: string) => void;
  validUntil: string;
  setValidUntil: (date: string) => void;
}) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validatePassword = (password: string): PasswordValidation => ({
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  });

  const isPasswordValid = (validation: PasswordValidation): boolean =>
    validation.minLength && validation.hasNumber && validation.hasUppercase;

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (originalPageUrl?.length === 0) {
      newErrors.originalPageUrl = "O campo 'URL personalizada' é obrigatório";
    } else if (originalPageUrl?.length < MIN_URL_LENGTH) {
      newErrors.originalPageUrl = "A URL deve ter pelo menos 3 caracteres";
    }

    if (pagePassword?.length === 0) {
      newErrors.pagePassword = "O campo 'Senha' é obrigatório";
    } else if (!isPasswordValid(validatePassword(pagePassword))) {
      newErrors.pagePassword =
        "A senha deve atender todos os requisitos de segurança";
    }

    if (!validUntil) {
      newErrors.pageValidity = "O campo 'Válido até' é obrigatório";
    }

    return newErrors;
  };

  const isFormValid =
    originalPageUrl &&
    originalPageUrl.length >= MIN_URL_LENGTH &&
    pagePassword &&
    isPasswordValid(validatePassword(pagePassword)) &&
    validUntil;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      <Box
        title="Acesso"
        description="Personalize e proteja sua proposta com segurança"
        handleBack={handleBack}
        handleNext={() => {
          setErrors({});
          const validationErrors = validateForm();

          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
          handleGenerateProposal();
        }}
        disabled={!isFormValid}
        step={step}
      >
        <PageURLSection
          userName={userName}
          originalPageUrl={originalPageUrl}
          setOriginalPageUrl={setOriginalPageUrl}
          clearError={(field: string) => clearError(field as keyof FormErrors)}
        />

        <PasswordSection
          pagePassword={pagePassword}
          setPagePassword={setPagePassword}
          clearError={(field: string) => clearError(field as keyof FormErrors)}
        />

        <ValidUntilSection
          validUntil={validUntil}
          setValidUntil={setValidUntil}
          errors={errors.pageValidity || ""}
        />
      </Box>
    </div>
  );
}
