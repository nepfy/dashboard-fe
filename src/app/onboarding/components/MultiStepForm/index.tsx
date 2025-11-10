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
import UserNameStep from "../Form/UserNameStep";

interface MultiStepFormProps {
  onComplete: (formData: FormData) => Promise<{ error?: string } | void>;
  error?: string;
  infoMessage?: string;
}

interface FormValidationErrors {
  hasErrors: boolean;
  message: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  onComplete,
  error,
  infoMessage,
}) => {
  const { currentStep, goToStep, formData, setFieldError } = useFormContext();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const errorMessage = error || submissionError;

  const validateForm = (): FormValidationErrors => {
    setSubmissionError(null);

    const requiredFields: { [key: string]: string } = {
      fullName: "Nome completo",
      cpf: "CPF",
      phone: "Telefone",
    };

    const requiredArrayFields: { [key: string]: string } = {
      jobType: "Tipo de Trabalho",
      discoverySource: "Fonte de Descoberta",
    };

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

    if (!formData.usedBefore) {
      setFieldError("usedBefore", "Este campo é obrigatório");
      return {
        hasErrors: true,
        message:
          "Por favor, indique se já utilizou nossa plataforma anteriormente.",
      };
    }

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
    const validationResult = validateForm();

    if (validationResult.hasErrors) {
      setSubmissionError(validationResult.message);
      return;
    }

    const submissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        submissionData.append(key, value.join(","));
      } else {
        submissionData.append(key, value.toString());
      }
    });

    try {
      const result = await onComplete(submissionData);

      if (result?.error) {
        setSubmissionError(result.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSubmissionError(
          "Ocorreu um erro ao enviar o formulário. Por favor, tente novamente."
        );
      }
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
    {
      name: "Nome de Usuário",
      content: <UserNameStep />,
    },
  ];

  const isLastOptionSelected = !!formData.userName;

  return (
    <FormLayout>
      {infoMessage && (
        <div className="border bg-blue-50 border-blue-200 text-blue-700 px-4 py-3 rounded-md my-8">
          {infoMessage}
        </div>
      )}
      {errorMessage && (
        <div className="border bg-red-50 border-red-200 text-red-700 px-4 py-3 rounded-md my-8">
          {submissionError || error}
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
