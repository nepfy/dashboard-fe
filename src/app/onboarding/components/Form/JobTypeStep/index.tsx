import { useState, useEffect } from "react";

import FormLoader from "#/components/FormLoader";
import ErrorMessage from "#/components/ErrorMessage";

import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "#/app/onboarding/components/StepHeader";
import SelectionGrid from "#/app/onboarding/components/SelectionGrid";

const JobTypeStep = () => {
  const { formData, enableNextStepJobType } = useFormContext();
  const [jobTypes, setJobTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    enableNextStepJobType();
  }, [formData.jobType, enableNextStepJobType]);

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const response = await fetch("/api/onboarding/job-types-step");
        const result = await response.json();

        if (result.success) {
          setJobTypes(result.data);
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

    fetchJobTypes();
  }, []);

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div>
      <StepHeader
        title="Que tipo de trabalho você faz?"
        description="Escolha todas as alternativas que se aplicam a você."
      />

      {isLoading ? (
        <FormLoader />
      ) : (
        <SelectionGrid
          options={jobTypes}
          fieldName="jobType"
          isMultiSelect={true}
        />
      )}
    </div>
  );
};

export default JobTypeStep;
