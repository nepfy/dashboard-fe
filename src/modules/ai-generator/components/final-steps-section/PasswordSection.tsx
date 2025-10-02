import { useState, useEffect } from "react";
import { PasswordInput } from "#/components/Inputs";

// Types
interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

// Constants
const MIN_PASSWORD_LENGTH = 6;

interface PasswordSectionProps {
  pagePassword: string;
  setPagePassword: (password: string) => void;
  clearError: (field: string) => void;
}

export function PasswordSection({
  pagePassword,
  setPagePassword,
  clearError,
}: PasswordSectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      minLength: false,
      hasNumber: false,
      hasUppercase: false,
    });

  useEffect(() => {
    if (pagePassword) {
      const validation = validatePassword(pagePassword);
      setPasswordValidation(validation);
    }
  }, [pagePassword]);

  const validatePassword = (password: string): PasswordValidation => ({
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
  });

  return (
    <div className="mb-6">
      <div className="relative">
        <PasswordInput
          id="pagePassword"
          label="Crie uma senha para sua proposta"
          placeholder="Digite uma senha para a sua proposta"
          value={pagePassword}
          onChange={(e) => {
            setPagePassword(e.target.value);
            clearError("pagePassword");
          }}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
          bgLabel
          info
        />
      </div>

      {pagePassword && (
        <div className="space-y-1">
          <div
            className={`text-xs flex items-center gap-2 ${
              passwordValidation.minLength ? "text-green-500" : "text-red-500"
            }`}
          >
            <span>{passwordValidation.minLength ? "✓" : "✗"}</span>
            Pelo menos 6 caracteres
          </div>
          <div
            className={`text-xs flex items-center gap-2 ${
              passwordValidation.hasNumber ? "text-green-500" : "text-red-500"
            }`}
          >
            <span>{passwordValidation.hasNumber ? "✓" : "✗"}</span>
            Pelo menos 1 número
          </div>
          <div
            className={`text-xs flex items-center gap-2 ${
              passwordValidation.hasUppercase
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            <span>{passwordValidation.hasUppercase ? "✓" : "✗"}</span>
            Pelo menos 1 letra maiúscula
          </div>
        </div>
      )}
    </div>
  );
}
