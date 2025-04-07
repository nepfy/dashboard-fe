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
interface FormData {
  fullName: string;
  cpf: string;
  phone: string;
  jobType: string[];
  discoverySource: string[];
  usedBefore: string;
}

// Define the context type
interface FormContextType {
  formData: FormData;
  currentStep: number;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMultiSelect: (name: keyof FormData, value: string) => void;
  handleSingleSelect: (name: keyof FormData, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: SetStateAction<number>) => void;
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
  currentStep: 1,
  handleChange: () => {},
  handleMultiSelect: () => {},
  handleSingleSelect: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
});

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    cpf: "",
    phone: "",
    jobType: [],
    discoverySource: [],
    usedBefore: "",
  });

  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMultiSelect = (name: keyof FormData, value: string) => {
    const currentValues = formData[name] as string[];

    setFormData((prevData) => ({
      ...prevData,
      [name]: currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    }));
  };

  const handleSingleSelect = (name: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (step: SetStateAction<number>) => {
    setCurrentStep(step);
  };

  const value: FormContextType = {
    formData,
    currentStep,
    handleChange,
    handleMultiSelect,
    handleSingleSelect,
    nextStep,
    prevStep,
    goToStep,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
