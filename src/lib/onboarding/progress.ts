import type {
  OnboardingFormData,
  OnboardingProgress,
} from "#/types/onboarding";

export const TOTAL_ONBOARDING_STEPS = 5;

export type PartialOnboardingFormData = Partial<OnboardingFormData>;

export function sanitizeOnboardingStep(step: unknown): number {
  if (typeof step !== "number" || Number.isNaN(step)) {
    return 1;
  }

  const normalized = Math.floor(step);
  return Math.min(Math.max(normalized, 1), TOTAL_ONBOARDING_STEPS);
}

export function sanitizeOnboardingFormData(
  formData: unknown
): PartialOnboardingFormData {
  if (!formData || typeof formData !== "object") {
    return {};
  }

  const data = formData as Record<string, unknown>;
  const sanitized: PartialOnboardingFormData = {};

  if (typeof data.fullName === "string" && data.fullName.trim() !== "") {
    sanitized.fullName = data.fullName;
  }

  if (typeof data.userName === "string" && data.userName.trim() !== "") {
    sanitized.userName = data.userName;
  }

  if (typeof data.cpf === "string" && data.cpf.trim() !== "") {
    sanitized.cpf = data.cpf;
  }

  if (typeof data.phone === "string" && data.phone.trim() !== "") {
    sanitized.phone = data.phone;
  }

  if (
    Array.isArray(data.jobType) &&
    data.jobType.every(
      (item) => typeof item === "string" && item.trim() !== ""
    )
  ) {
    sanitized.jobType = data.jobType;
  }

  if (
    Array.isArray(data.discoverySource) &&
    data.discoverySource.every(
      (item) => typeof item === "string" && item.trim() !== ""
    )
  ) {
    sanitized.discoverySource = data.discoverySource;
  }

  if (typeof data.usedBefore === "string" && data.usedBefore.trim() !== "") {
    sanitized.usedBefore = data.usedBefore;
  }

  return sanitized;
}

export function parseOnboardingProgress(
  value: unknown
): OnboardingProgress | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as {
    currentStep?: unknown;
    formData?: unknown;
    updatedAt?: unknown;
  };

  if (typeof raw.updatedAt !== "string") {
    return null;
  }

  return {
    currentStep: sanitizeOnboardingStep(raw.currentStep),
    formData: sanitizeOnboardingFormData(raw.formData),
    updatedAt: raw.updatedAt,
  };
}

export function mergeOnboardingFormData(
  base: OnboardingFormData,
  patch: PartialOnboardingFormData
): OnboardingFormData {
  return {
    ...base,
    ...patch,
  };
}

export function isProgressMoreRecent(
  first: OnboardingProgress | null | undefined,
  second: OnboardingProgress | null | undefined
): boolean {
  if (!first) {
    return false;
  }
  if (!second) {
    return true;
  }

  const firstTime = Date.parse(first.updatedAt);
  const secondTime = Date.parse(second.updatedAt);

  if (Number.isNaN(firstTime) || Number.isNaN(secondTime)) {
    return false;
  }

  return firstTime > secondTime;
}

