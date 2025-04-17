// FormContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  SetStateAction,
} from "react";

// Define types for form data
export interface FormDataProps {
  fullName: string;
  cpf: string;
  phone: string;
  jobType: string[];
  discoverySource: string[];
  usedBefore: string;
}

// Define type for form errors
interface FormErrors {
  [key: string]: string;
}

// Define the context type
interface FormContextType {
  formData: FormDataProps;
  formErrors: FormErrors;
  currentStep: number;
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
}

// Create the context with default values
const FormContext = createContext<FormContextType>({
  formData: {
    fullName: "",
    cpf: "",
    phone: "",
    jobType: [],
    discoverySource: [],
    usedBefore: "",
  },
  formErrors: {},
  currentStep: 1,
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
});

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    fullName: "",
    cpf: "",
    phone: "",
    jobType: [],
    discoverySource: [],
    usedBefore: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [enableNextStep, setEnableNextStep] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    // Check if e is an event or a custom object
    if ("target" in e) {
      e.preventDefault();
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // Clear error when field is changed
      if (formErrors[name]) {
        setFormErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
    } else {
      // Handle the custom object format { name, value }
      const { name, value } = e;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      // Clear error when field is changed
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
    const currentValues = formData[name] as string[];

    setFormData((prevData) => ({
      ...prevData,
      [name]: currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    }));

    // Clear error when field is changed
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
      [name]: value,
    }));

    // Clear error when field is changed
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

  // Modify the nextStep and prevStep functions to reset enableNextStep
  const nextStep = () => {
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

  // Update the enableNextStep functions to validate form data
  const enableNextStepPersonalInfo = () => {
    const isValid =
      formData.fullName.trim() !== "" &&
      formData.cpf.trim() !== "" &&
      formData.phone.trim() !== "" &&
      !formErrors.cpf; // Check if there are no errors for CPF

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

  const value: FormContextType = {
    formData,
    formErrors,
    currentStep,
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
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
