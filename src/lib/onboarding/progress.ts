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

const normalizeStringValue = (
  value: unknown,
  { trim }: { trim?: boolean } = {}
): string | null => {
  if (typeof value === "string") {
    const normalized = trim ? value.trim() : value;
    return normalized === "" ? null : normalized;
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return null;
};

const normalizeStringArray = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) {
    return null;
  }

  const result: string[] = [];

  for (const item of value) {
    const normalized = normalizeStringValue(item);
    if (normalized) {
      result.push(normalized);
    }
  }

  return result.length > 0 ? result : null;
};

export function sanitizeOnboardingFormData(
  formData: unknown
): PartialOnboardingFormData {
  if (!formData || typeof formData !== "object") {
    return {};
  }

  const data = formData as Record<string, unknown>;
  const sanitized: PartialOnboardingFormData = {};

  const fullName = normalizeStringValue(data.fullName, { trim: true });
  if (fullName) {
    sanitized.fullName = fullName;
  }

  const userName = normalizeStringValue(data.userName, { trim: true });
  if (userName) {
    sanitized.userName = userName;
  }

  const cpf = normalizeStringValue(data.cpf);
  if (cpf) {
    sanitized.cpf = cpf;
  }

  const phone = normalizeStringValue(data.phone);
  if (phone) {
    sanitized.phone = phone;
  }

  const jobType = normalizeStringArray(data.jobType);
  if (jobType) {
    sanitized.jobType = jobType;
  }

  const discoverySource = normalizeStringArray(data.discoverySource);
  if (discoverySource) {
    sanitized.discoverySource = discoverySource;
  }

  const usedBefore = normalizeStringValue(data.usedBefore);
  if (usedBefore) {
    sanitized.usedBefore = usedBefore;
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

