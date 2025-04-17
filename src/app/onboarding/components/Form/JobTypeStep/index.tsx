import { useEffect } from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "#/app/onboarding/components/StepHeader";
import SelectionGrid from "#/app/onboarding/components/SelectionGrid";

const JobTypeStep = () => {
  const { formData, enableNextStepJobType } = useFormContext();

  useEffect(() => {
    enableNextStepJobType();
  }, [formData.jobType, enableNextStepJobType]);

  const jobOptions = [
    {
      id: "agencia-de-marketing",
      label: "Agência de Marketing Digital",
    },
    {
      id: "freelancer",
      label: "Freelancer",
    },
    {
      id: "branding",
      label: "Branding",
    },
    {
      id: "agencia-de-desenvolvimento",
      label: "Agência de Desenvolvimento",
    },
    {
      id: "saas",
      label: "SaaS",
    },
    {
      id: "outro",
      label: "Outro...",
    },
  ];

  return (
    <div>
      <StepHeader
        title="Que tipo de trabalho você faz?"
        description="Escolha todas as alternativas que se aplicam a você."
      />

      <SelectionGrid
        options={jobOptions}
        fieldName="jobType"
        isMultiSelect={true}
      />
    </div>
  );
};

export default JobTypeStep;
