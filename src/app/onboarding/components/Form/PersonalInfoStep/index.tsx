import { ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "#/app/onboarding/components/StepHeader";
import { TextField } from "#/components/Inputs";
import { validateCPF, maskCPF, maskPhone } from "#/helpers";
import { checkCPFExists } from "#/app/actions/onboarding/check-cpf-exists";

const PersonalInfoStep = () => {
  const {
    formData,
    formErrors,
    handleChange,
    setFieldError,
    enableNextStepPersonalInfo,
    setCpfValidated,
  } = useFormContext();

  const [isCheckingCPF, setIsCheckingCPF] = useState(false);

  useEffect(() => {
    enableNextStepPersonalInfo();
  }, [
    formData.fullName,
    formData.cpf,
    formData.phone,
    enableNextStepPersonalInfo,
  ]);

  const handleCPFChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const maskedValue = maskCPF(value);

    setCpfValidated(false);

    handleChange({ name: "cpf", value: maskedValue });

    if (formErrors.cpf) {
      setFieldError("cpf", "");
    }
  };

  const validateCPFOnBlur = async () => {
    const cleanCPF = formData.cpf.replace(/\D/g, "");

    if (cleanCPF.length === 0) {
      setCpfValidated(false);
      return;
    }

    if (cleanCPF.length !== 11) {
      setFieldError("cpf", "CPF deve conter 11 dígitos");
      setCpfValidated(false);
      return;
    }

    if (!validateCPF(cleanCPF)) {
      setFieldError("cpf", "CPF inválido");
      setCpfValidated(false);
      return;
    }

    setIsCheckingCPF(true);
    try {
      const result = await checkCPFExists(cleanCPF);

      if (result.error) {
        setFieldError("cpf", result.error);
        setCpfValidated(false);
      } else if (result.exists) {
        setFieldError("cpf", "Este CPF já está cadastrado no sistema");
        setCpfValidated(false);
      } else {
        setFieldError("cpf", "");
        setCpfValidated(true);
      }
    } catch (error) {
      console.error("Erro ao verificar CPF:", error);
      setFieldError("cpf", "Erro ao verificar CPF. Tente novamente.");
      setCpfValidated(false);
    } finally {
      setIsCheckingCPF(false);
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = maskPhone(value);

    handleChange({ name: "phone", value: formattedValue });
  };

  return (
    <div>
      <StepHeader
        title="Configure sua conta"
        description="Quase lá! Em menos de 2 minutos, sua conta estará pronta para transformar propostas em fechamentos!"
      />

      <div className="mb-4">
        <TextField
          id="fullName"
          inputName="fullName"
          label="Nome completo *"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
          type="text"
          required
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap sm:space-x-4 mb-4">
        <div className="w-full mb-4 sm:mb-0 sm:w-1/2">
          <TextField
            id="cpf"
            inputName="cpf"
            label="CPF *"
            value={formData.cpf}
            onChange={handleCPFChange}
            onBlur={validateCPFOnBlur}
            placeholder="000.000.000-00"
            type="text"
            error={formErrors.cpf}
            required
            disabled={isCheckingCPF}
          />
          {isCheckingCPF && (
            <div className="mt-1 text-sm text-gray-500">Verificando CPF...</div>
          )}
        </div>

        <div className="w-full sm:w-1/2">
          <TextField
            id="phone"
            inputName="phone"
            label="Telefone *"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="(DDD) 90000-0000"
            type="text"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
