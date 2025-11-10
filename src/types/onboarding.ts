export interface OnboardingFormData {
  fullName: string;
  userName: string;
  cpf: string;
  phone: string;
  jobType: string[];
  discoverySource: string[];
  usedBefore: string;
}

export interface OnboardingProgress {
  currentStep: number;
  formData: Partial<OnboardingFormData>;
  updatedAt: string;
}

export const DEFAULT_ONBOARDING_FORM_DATA: OnboardingFormData = {
  fullName: "",
  userName: "",
  cpf: "",
  phone: "",
  jobType: [],
  discoverySource: [],
  usedBefore: "",
};

export interface OnboardingStatusData {
  onboardingComplete: boolean;
  hasPersonRecord: boolean;
  needsOnboarding: boolean;
  progress: OnboardingProgress | null;
}

export type OnboardingStatusApiResponse =
  | { success: true; data: OnboardingStatusData }
  | { success: false; error: string };

