import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

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
    <>
      <p className="bg-[#E8E2FD4D] rounded-[8px] p-3 mb-4 text-sm mt-6 border border-[#E8E2FD]">
        Crie uma senha para sua proposta
      </p>

      <div className="relative">
        <input
          id="pagePassword"
          name="pagePassword"
          type={showPassword ? "text" : "password"}
          placeholder="Digite uma senha para a sua proposta"
          value={pagePassword}
          onChange={(e) => {
            setPagePassword(e.target.value);
            clearError("pagePassword");
          }}
          className="w-full px-4 py-3 pr-12 rounded-[var(--radius-s)] 
                        border border-white-neutral-light-300 
                        focus:outline-none focus:border-[var(--color-primary-light-400)]
                        bg-white-neutral-light-100 
                        placeholder:text-[var(--color-white-neutral-light-400)]  
                        text-white-neutral-light-800"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     text-white-neutral-light-600 hover:text-white-neutral-light-800 
                     focus:outline-none transition-colors duration-200 cursor-pointer"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Password validation indicators */}
      {pagePassword && (
        <div className="mt-3 space-y-1">
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
    </>
  );
}
