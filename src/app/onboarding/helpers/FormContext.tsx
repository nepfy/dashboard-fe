import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  SetStateAction,
} from "react";

export interface FormDataProps {
  fullName: string;
  userName: string;
  cpf: string;
  phone: string;
  jobType: string[];
  discoverySource: string[];
  usedBefore: string;
}

interface FormErrors {
  [key: string]: string;
}

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
  enableNextStepUserName: () => void;
}

const FormContext = createContext<FormContextType>({
  formData: {
    fullName: "",
    userName: "",
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
  enableNextStepUserName: () => {},
});

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    fullName: "",
    userName: "",
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
    if ("target" in e) {
      e.preventDefault();
      const { name, value } = e.target;
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
      !formErrors.cpf;

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
    // Username must be between 3 and 10 characters, and can only contain letters and numbers
    const isValid =
      formData.userName.trim() !== "" &&
      formData.userName.length >= 3 &&
      formData.userName.length <= 10 &&
      /^[a-zA-Z0-9]+$/.test(formData.userName) &&
      !formErrors.userName;

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
    enableNextStepUserName,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
