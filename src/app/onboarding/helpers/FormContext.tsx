import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  ChangeEvent,
  SetStateAction,
} from "react";
import { trackOnboardingQuestionAnswered } from "#/lib/analytics/track";
import {
  DEFAULT_ONBOARDING_FORM_DATA,
  type OnboardingFormData,
} from "#/types/onboarding";

const normalizeStringValue = (
  value: unknown,
  { trim }: { trim?: boolean } = {}
): string => {
  if (typeof value === "string") {
    return trim ? value.trim() : value;
  }

  if (typeof value === "number" && !Number.isNaN(value)) {
    return String(value);
  }

  return "";
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const result: string[] = [];

  for (const item of value) {
    const normalized = normalizeStringValue(item);
    if (normalized !== "") {
      result.push(normalized);
    }
  }

  return result;
};

export type FormDataProps = OnboardingFormData;

interface FormErrors {
  [key: string]: string;
}

interface FormContextType {
  formData: FormDataProps;
  formErrors: FormErrors;
  currentStep: number;
  cpfValidated: boolean;
  setCpfValidated: (validated: boolean) => void;
  handleChange: (
    e: ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => void;
  handleMultiSelect: (name: keyof FormDataProps, value: string) => void;
  handleSingleSelect: (name: keyof FormDataProps, value: string) => void;
  setFieldError: (field: string, error: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: SetStateAction<number>) => void;
  enableNextStep: boolean;
  enableNextStepPersonalInfo: () => void;
  enableNextStepJobType: () => void;
  enableNextStepDiscoverySource: () => void;
  enableNextStepUsedBefore: () => void;
  resetEnableNextStep: () => void;
  enableNextStepUserName: () => void;
}

const FormContext = createContext<FormContextType>({
  formData: DEFAULT_ONBOARDING_FORM_DATA,
  formErrors: {},
  currentStep: 1,
  cpfValidated: false,
  setCpfValidated: () => {},
  handleChange: () => {},
  handleMultiSelect: () => {},
  handleSingleSelect: () => {},
  setFieldError: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  enableNextStep: false,
  enableNextStepPersonalInfo: () => {},
  enableNextStepJobType: () => {},
  enableNextStepDiscoverySource: () => {},
  enableNextStepUsedBefore: () => {},
  resetEnableNextStep: () => {},
  enableNextStepUserName: () => {},
});

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
  children: ReactNode;
  initialFormData?: Partial<FormDataProps>;
  initialStep?: number;
}

const TOTAL_STEPS = 5;

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialFormData,
  initialStep,
}) => {
  const [formData, setFormData] = useState<FormDataProps>(
    DEFAULT_ONBOARDING_FORM_DATA
  );

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [enableNextStep, setEnableNextStep] = useState<boolean>(false);
  const [cpfValidated, setCpfValidated] = useState<boolean>(false);

  useEffect(() => {
    const merged = {
      ...DEFAULT_ONBOARDING_FORM_DATA,
      ...(initialFormData ?? {}),
    };

    const normalizedFormData: FormDataProps = {
      fullName: normalizeStringValue(merged.fullName, { trim: true }),
      userName: normalizeStringValue(merged.userName, { trim: true }),
      cpf: normalizeStringValue(merged.cpf),
      phone: normalizeStringValue(merged.phone),
      jobType: normalizeStringArray(merged.jobType),
      discoverySource: normalizeStringArray(merged.discoverySource),
      usedBefore: normalizeStringValue(merged.usedBefore),
    };

    setFormData(normalizedFormData);
  }, [initialFormData]);

  useEffect(() => {
    if (initialStep === undefined || initialStep === null) {
      setCurrentStep(1);
      return;
    }

    const clampedStep = Math.min(Math.max(initialStep, 1), TOTAL_STEPS);
    setCurrentStep(clampedStep);
  }, [initialStep]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    if ("target" in e) {
      e.preventDefault();
      const { name, value } = e.target;

      if (name === "cpf") {
        setCpfValidated(false);
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (formErrors[name]) {
        setFormErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      const { name, value } = e;

      if (name === "cpf") {
        setCpfValidated(false);
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]:
          typeof value === "string"
            ? value
            : normalizeStringValue(value),
      }));

      if (formErrors[name]) {
        setFormErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleMultiSelect = (name: keyof FormDataProps, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: (() => {
        const prevValuesRaw = prevData[name];
        const normalizedValue = normalizeStringValue(value);
        const prevValues = Array.isArray(prevValuesRaw)
          ? prevValuesRaw.map((item) => normalizeStringValue(item))
          : [];

        if (normalizedValue === "") {
          return prevValues;
        }

        return prevValues.includes(normalizedValue)
          ? prevValues.filter((item) => item !== normalizedValue)
          : [...prevValues, normalizedValue];
      })(),
    }));

    if (formErrors[name]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSingleSelect = (name: keyof FormDataProps, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: normalizeStringValue(value),
    }));

    if (formErrors[name]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const setFieldError = (field: string, error: string) => {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));
  };

  const resetEnableNextStep = () => {
    setEnableNextStep(false);
  };

  const nextStep = () => {
    // Track question answered when moving to next step
    const stepNameMap: { [key: number]: { name: string; field: keyof FormDataProps } } = {
      1: { name: "personal_info", field: "fullName" },
      2: { name: "job_type", field: "jobType" },
      3: { name: "discovery_source", field: "discoverySource" },
      4: { name: "used_before", field: "usedBefore" },
    };

    const stepInfo = stepNameMap[currentStep];
    if (stepInfo) {
      const answer = formData[stepInfo.field];
      trackOnboardingQuestionAnswered({
        question_step: currentStep,
        question_name: stepInfo.name,
        answer: answer,
      });
    }

    setCurrentStep((prev) => prev + 1);
    resetEnableNextStep();
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    resetEnableNextStep();
  };

  const goToStep = (step: SetStateAction<number>) => {
    setCurrentStep(step);
    resetEnableNextStep();
  };

  const enableNextStepPersonalInfo = () => {
    const isValid =
      formData.fullName.trim() !== "" &&
      formData.cpf.trim() !== "" &&
      formData.phone.trim() !== "" &&
      !formErrors.cpf &&
      cpfValidated;

    setEnableNextStep(isValid);
  };

  const enableNextStepJobType = () => {
    const isValid = formData.jobType.length > 0;
    setEnableNextStep(isValid);
  };

  const enableNextStepDiscoverySource = () => {
    const isValid = formData.discoverySource.length > 0;
    setEnableNextStep(isValid);
  };

  const enableNextStepUsedBefore = () => {
    const isValid = formData.usedBefore !== "";
    setEnableNextStep(isValid);
  };

  const enableNextStepUserName = () => {
    // Username must be between 3 and 20 characters, and can only contain letters and numbers
    const isValid =
      formData.userName.trim() !== "" &&
      formData.userName.length >= 3 &&
      formData.userName.length <= 20 &&
      /^[a-zA-Z0-9]+$/.test(formData.userName) &&
      !formErrors.userName;

    setEnableNextStep(isValid);
  };

  const value: FormContextType = {
    formData,
    formErrors,
    currentStep,
    cpfValidated,
    setCpfValidated,
    handleChange,
    handleMultiSelect,
    handleSingleSelect,
    setFieldError,
    nextStep,
    prevStep,
    goToStep,
    enableNextStep,
    enableNextStepPersonalInfo,
    enableNextStepJobType,
    enableNextStepDiscoverySource,
    enableNextStepUsedBefore,
    resetEnableNextStep,
    enableNextStepUserName,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
