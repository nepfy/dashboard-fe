export interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

export interface FormErrors {
  originalPageUrl?: string;
  pagePassword?: string;
  pageValidity?: string;
  general?: string;
}

export interface Template {
  id: string;
  title: string;
  colorsList: string[];
}
