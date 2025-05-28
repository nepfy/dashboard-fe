// src/hooks/useProjectForm.ts
import { useState } from "react";
import { ProposalFormData, TemplateType } from "#/types/project";

interface UseProjecGeneratorReturn {
  formData: ProposalFormData;
  currentStep: number;
  templateType: TemplateType | null;
  updateFormData: <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => void;
  setTemplateType: (template: TemplateType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

const initialFormData: ProposalFormData = {
  step1: {},
  step2: {},
  step3: {},
  step4: {},
  step5: {},
  step6: {},
  step7: {},
  step8: {},
  step9: {},
  step10: {},
  step11: {},
  step12: {},
  step13: {},
  step14: {},
  step15: {},
  step16: {},
};

export function useProjectGenerator(): UseProjecGeneratorReturn {
  const [formData, setFormData] = useState<ProposalFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0); // 0 for template selection
  const [templateType, setTemplateTypeState] = useState<TemplateType | null>(
    null
  );

  const updateFormData = <T extends keyof ProposalFormData>(
    step: T,
    data: ProposalFormData[T]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const setTemplateType = (template: TemplateType) => {
    setTemplateTypeState(template);
    setCurrentStep(1); // Move to first step after template selection
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 16));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 16)));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setTemplateTypeState(null);
  };

  return {
    formData,
    currentStep,
    templateType,
    updateFormData,
    setTemplateType,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
  };
}
