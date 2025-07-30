import { formatCep, validateCep, fetchAddressByCep } from "./cepService";
import { evaluatePasswordStrength, PasswordStrength } from "./evaluatePassword";
import { maskPhone } from "./maskPhone";
import { maskCNPJ } from "./validateAndMaskCNPJ";
import { validateCPF, maskCPF } from "./validateAndMaskCpf";
import { formatCurrency, formatCurrencyValue } from "./formatCurrency";
import { formatPhoneForWhatsApp } from "./formatPhoneForWhatsApp";

export {
  formatCep,
  validateCep,
  fetchAddressByCep,
  evaluatePasswordStrength,
  maskPhone,
  maskCNPJ,
  validateCPF,
  maskCPF,
  formatCurrency,
  formatCurrencyValue,
  formatPhoneForWhatsApp,
};
export type { PasswordStrength };
