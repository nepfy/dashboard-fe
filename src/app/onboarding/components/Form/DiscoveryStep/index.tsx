import { useState, useEffect } from "react";

import FormLoader from "#/components/FormLoader";
import ErrorMessage from "#/components/ErrorMessage";

import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "#/app/onboarding/components/StepHeader";
import SelectionGridContext from "#/app/onboarding/components/SelectionGrid";

const DiscoveryStep = () => {
  const { formData, enableNextStepDiscoverySource } = useFormContext();
  const [discover, setDiscover] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    enableNextStepDiscoverySource();
  }, [formData.discoverySource, enableNextStepDiscoverySource]);

  useEffect(() => {
    const fetchDiscover = async () => {
      try {
        const response = await fetch("/api/onboarding/discover-step");
        const result = await response.json();

        if (result.success) {
          setDiscover(result.data);
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
        title="Como você descobriu a Nepfy?"
        description="Escolha as alternativas que se aplicam a você."
      />

      {isLoading ? (
        <FormLoader />
      ) : (
        <SelectionGridContext
          options={discover}
          fieldName="discoverySource"
          isMultiSelect={true}
        />
      )}
    </div>
  );
};

export default DiscoveryStep;
