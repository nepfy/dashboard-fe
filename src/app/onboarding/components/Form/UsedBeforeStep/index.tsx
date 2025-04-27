import { useState, useEffect } from "react";

import FormLoader from "#/components/FormLoader";
import ErrorMessage from "#/components/ErrorMessage";

import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "../../StepHeader";
import SelectionGrid from "#/app/onboarding/components/SelectionGrid";

const UsedBeforeStep: React.FC = () => {
  const { formData, enableNextStepUsedBefore } = useFormContext();
  const [usedBeforeList, setUsedBeforeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    enableNextStepUsedBefore();
  }, [formData.usedBefore, enableNextStepUsedBefore]);

  useEffect(() => {
    const fetchDiscover = async () => {
      try {
        const response = await fetch("/api/onboarding/used-before-step");
        const result = await response.json();

        if (result.success) {
          setUsedBeforeList(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Erro ao carregar lista. ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscover();
  }, []);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div>
      <StepHeader
        title="Você já usou a Nepfy antes?"
        description="Escolha apenas um"
      />

      {isLoading ? (
        <FormLoader />
      ) : (
        <SelectionGrid
          options={usedBeforeList}
          fieldName="usedBefore"
          checkmark={true}
          isMultiSelect={false}
        />
      )}
    </div>
  );
};

export default UsedBeforeStep;
