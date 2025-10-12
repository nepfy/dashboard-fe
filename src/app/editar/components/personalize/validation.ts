import { PasswordValidation, FormErrors } from "./types";
import { MIN_URL_LENGTH, MIN_PASSWORD_LENGTH } from "./constants";

export const validatePassword = (password: string): PasswordValidation => ({
  minLength: password.length >= MIN_PASSWORD_LENGTH,
  hasNumber: /\d/.test(password),
  hasUppercase: /[A-Z]/.test(password),
});

export const isPasswordValid = (validation: PasswordValidation): boolean =>
  validation.minLength && validation.hasNumber && validation.hasUppercase;

export const validateForm = (
  originalPageUrl: string,
  pagePassword: string
): FormErrors => {
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

  return newErrors;
};

export const isFormValid = (
  originalPageUrl: string,
  pagePassword: string
): boolean => {
  return (
    originalPageUrl.length > 0 &&
    originalPageUrl.length >= MIN_URL_LENGTH &&
    pagePassword.length > 0 &&
    isPasswordValid(validatePassword(pagePassword))
  );
};
