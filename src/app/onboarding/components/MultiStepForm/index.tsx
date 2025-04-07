import React from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import MultiStep from "#/app/onboarding/components/MultiStep";
import FormLayout from "#/app/onboarding/components/FormLayout";
import PersonalInfoStep from "#/app/onboarding/components/Form/PersonalInfoStep";
import JobTypeStep from "#/app/onboarding/components/Form/JobTypeStep";
import DiscoveryStep from "#/app/onboarding/components/Form/DiscoveryStep";
import UsedBeforeStep from "#/app/onboarding/components/Form/UsedBeforeStep";

interface MultiStepFormProps {
  onComplete: (formData: FormData) => Promise<void>;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onComplete }) => {
  const { currentStep, goToStep, formData } = useFormContext();

  const handleSubmit = async () => {
    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submissionData.append(key, value.join(","));
      } else {
        submissionData.append(key, value.toString());
      }
    });

    await onComplete(submissionData);
  };

  const steps = [
    {
      name: "Informações Pessoais",
      content: <PersonalInfoStep />,
    },
    {
      name: "Tipo de Trabalho",
      content: <JobTypeStep />,
    },
    {
      name: "Descoberta",
      content: <DiscoveryStep />,
    },
    {
      name: "Experiência Prévia",
      content: <UsedBeforeStep onComplete={handleSubmit} />,
    },
  ];

  return (
    <FormLayout>
      <MultiStep steps={steps} currentStep={currentStep} onChange={goToStep} />
    </FormLayout>
  );
};

export default MultiStepForm;
