import React from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "../../StepHeader";
import SelectionGrid from "#/app/onboarding/components/SelectionGrid";

interface UsedBeforeStepProps {
  onComplete?: () => Promise<void>;
}

const UsedBeforeStep: React.FC<UsedBeforeStepProps> = ({ onComplete }) => {
  const { formData } = useFormContext();

  const usageOptions = [
    { id: "many", label: "Sim, muitas vezes" },
    { id: "some", label: "Sim, algumas vezes" },
    { id: "never", label: "Não, é a minha primeira vez" },
  ];

  // Check if an option is selected to enable the complete button
  const isOptionSelected = !!formData.usedBefore;

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

      {isOptionSelected && onComplete && (
        <div className="mt-8">
          <button
            onClick={onComplete}
            className="w-full px-6 py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Finalizar cadastro
          </button>
        </div>
      )}
    </div>
  );
};

export default UsedBeforeStep;
