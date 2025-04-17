import { useEffect } from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "../../StepHeader";
import SelectionGrid from "#/app/onboarding/components/SelectionGrid";

const UsedBeforeStep: React.FC = () => {
  const { formData, enableNextStepUsedBefore } = useFormContext();

  useEffect(() => {
    enableNextStepUsedBefore();
  }, [formData.usedBefore, enableNextStepUsedBefore]);

  const usageOptions = [
    { id: "many", label: "Sim, muitas vezes" },
    { id: "some", label: "Sim, algumas vezes" },
    { id: "never", label: "Não, é a minha primeira vez" },
  ];

  return (
    <div>
      <StepHeader
        title="Você já usou a Nepfy antes?"
        description="Escolha apenas um"
      />

      <SelectionGrid
        options={usageOptions}
        fieldName="usedBefore"
        checkmark={true}
        isMultiSelect={false}
      />
    </div>
  );
};

export default UsedBeforeStep;
