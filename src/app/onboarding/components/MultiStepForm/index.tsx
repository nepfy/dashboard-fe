import React, { useState } from "react";
import {
  useFormContext,
  FormDataProps,
} from "#/app/onboarding/helpers/FormContext";
import MultiStep from "#/app/onboarding/components/MultiStep";
import FormLayout from "#/app/onboarding/components/FormLayout";
import PersonalInfoStep from "#/app/onboarding/components/Form/PersonalInfoStep";
import JobTypeStep from "#/app/onboarding/components/Form/JobTypeStep";
import DiscoveryStep from "#/app/onboarding/components/Form/DiscoveryStep";
import UsedBeforeStep from "#/app/onboarding/components/Form/UsedBeforeStep";

interface MultiStepFormProps {
  onComplete: (formData: FormData) => Promise<void>;
}

interface FormValidationErrors {
  hasErrors: boolean;
  message: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onComplete }) => {
  const { currentStep, goToStep, formData, setFieldError } = useFormContext();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Helper function to validate form data
  const validateForm = (): FormValidationErrors => {
    // Reset any previous submission error
    setSubmissionError(null);

    // Check required fields
    const requiredFields: { [key: string]: string } = {
      fullName: "Nome completo",
      cpf: "CPF",
      phone: "Telefone",
    };

    // Check array fields
    const requiredArrayFields: { [key: string]: string } = {
      jobType: "Tipo de Trabalho",
      discoverySource: "Fonte de Descoberta",
    };

    // Check single-value fields
    for (const [field, label] of Object.entries(requiredFields)) {
      const value = formData[field as keyof FormDataProps];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        setFieldError(field, `${label} é obrigatório`);
        return {
          hasErrors: true,
          message: `Por favor, preencha os campos obrigatórios.`,
        };
      }
    }

    // Check array fields
    for (const [field, label] of Object.entries(requiredArrayFields)) {
      const value = formData[field as keyof FormDataProps];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setFieldError(field, `${label} é obrigatório`);
        return {
          hasErrors: true,
          message: `Por favor, selecione pelo menos uma opção para ${label}.`,
        };
      }
    }

    // Check usedBefore field
    if (!formData.usedBefore) {
      setFieldError("usedBefore", "Este campo é obrigatório");
      return {
        hasErrors: true,
        message:
          "Por favor, indique se já utilizou nossa plataforma anteriormente.",
      };
    }

    // Additional specific validation for CPF
    if (formData.cpf) {
      const cleanCPF = formData.cpf.replace(/\D/g, "");
      if (cleanCPF.length !== 11) {
        setFieldError("cpf", "CPF deve conter 11 dígitos");
        return {
          hasErrors: true,
          message: "O CPF informado não é válido.",
        };
      }
    }

    return { hasErrors: false, message: "" };
  };

  const handleSubmit = async () => {
    // Validate form before submission
    const validationResult = validateForm();

    if (validationResult.hasErrors) {
      setSubmissionError(validationResult.message);
      return;
    }

    // Proceed with form submission
    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submissionData.append(key, value.join(","));
      } else {
        submissionData.append(key, value.toString());
      }
    });

    try {
      await onComplete(submissionData);
    } catch (error) {
      console.log("error", error);
      setSubmissionError(
        "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente."
      );
    }
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
      content: <UsedBeforeStep />,
    },
  ];

  const isLastOptionSelected = !!formData.usedBefore;

  return (
    <FormLayout>
      {submissionError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl"
          role="alert"
        >
          <span className="block sm:inline">{submissionError}</span>
        </div>
      )}
      <MultiStep
        steps={steps}
        currentStep={currentStep}
        onChange={goToStep}
        isLastOptionSelected={isLastOptionSelected}
        onComplete={handleSubmit}
      />
    </FormLayout>
  );
};

export default MultiStepForm;
