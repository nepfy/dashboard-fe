import { useEffect, useRef, useState } from "react";
import { Box } from "#/modules/ai-generator/components/box/Box";
import { PageURLSection } from "#/modules/ai-generator/components/final-steps-section/PageURLSection";
import { PasswordSection } from "#/modules/ai-generator/components/final-steps-section/PasswordSection";
import { ValidUntilSection } from "#/modules/ai-generator/components/final-steps-section/ValidUntilSection";
import { Label } from "#/components/Label";

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
  clientName?: string;
  projectName?: string;
}

const MIN_URL_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 6;

interface UrlValidationState {
  isChecking: boolean;
  isDuplicate: boolean;
  message?: string;
}

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
  onSlugEdited,
  clientName,
  setClientName,
  projectName,
  setProjectName,
  isCustomTemplateFlow,
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
  onSlugEdited?: () => void;
  clientName: string;
  setClientName: (name: string) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  isCustomTemplateFlow?: boolean;
}) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [urlValidationState, setUrlValidationState] =
    useState<UrlValidationState>({
      isChecking: false,
      isDuplicate: false,
      message: undefined,
    });
  const lastValidationMessageRef = useRef<string | undefined>(undefined);

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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (originalPageUrl?.length === 0) {
      newErrors.originalPageUrl = "O campo 'URL personalizada' é obrigatório";
    } else if (originalPageUrl?.length < MIN_URL_LENGTH) {
      newErrors.originalPageUrl = "A URL deve ter pelo menos 3 caracteres";
    } else if (urlValidationState.isDuplicate) {
      newErrors.originalPageUrl =
        "Você já está usando essa URL em outra proposta";
    } else if (urlValidationState.message) {
      newErrors.originalPageUrl = urlValidationState.message;
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

    if (isCustomTemplateFlow) {
      if (!clientName || clientName.trim().length === 0) {
        newErrors.clientName = "O campo 'Nome do cliente' é obrigatório";
      }
      if (!projectName || projectName.trim().length === 0) {
        newErrors.projectName = "O campo 'Nome da proposta' é obrigatório";
      }
    }

    return newErrors;
  };

  const isFormValid =
    originalPageUrl &&
    originalPageUrl.length >= MIN_URL_LENGTH &&
    pagePassword &&
    isPasswordValid(validatePassword(pagePassword)) &&
    validUntil &&
    (!isCustomTemplateFlow ||
      (!!clientName &&
        clientName.trim().length > 0 &&
        !!projectName &&
        projectName.trim().length > 0));

  return (
    <div className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center">
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
        disabled={
          !isFormValid ||
          urlValidationState.isDuplicate ||
          urlValidationState.isChecking ||
          Boolean(urlValidationState.message)
        }
        step={step}
      >
        {isCustomTemplateFlow && (
          <div className="mb-6 space-y-4">
            <div className="space-y-1">
              <Label htmlFor="clientName">Nome do cliente</Label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(event) => {
                  setClientName(event.target.value);
                  clearError("clientName");
                }}
                className="focus:border-primary-light-400 w-full rounded-[10px] border border-gray-300 px-4 py-2 text-sm focus:outline-none"
              />
              {errors.clientName && (
                <p className="text-xs text-red-500">{errors.clientName}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="projectName">Nome da proposta</Label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value);
                  clearError("projectName");
                }}
                className="focus:border-primary-light-400 w-full rounded-[10px] border border-gray-300 px-4 py-2 text-sm focus:outline-none"
              />
              {errors.projectName && (
                <p className="text-xs text-red-500">{errors.projectName}</p>
              )}
            </div>
          </div>
        )}

        <PageURLSection
          isPublished={false}
          userName={userName}
          originalPageUrl={originalPageUrl}
          setOriginalPageUrl={setOriginalPageUrl}
          clearError={(field: string) => clearError(field as keyof FormErrors)}
          errorMessage={errors.originalPageUrl}
          onValidationStateChange={(state) => {
            setUrlValidationState(state);
          }}
          onUserEdit={onSlugEdited}
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
