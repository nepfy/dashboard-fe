import { ChangeEvent, useEffect } from "react";
import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "#/app/onboarding/components/StepHeader";
import { TextField } from "#/components/Inputs";
import { validateCPF, maskCPF, maskPhone } from "#/helpers";

const PersonalInfoStep = () => {
  const {
    formData,
    formErrors,
    handleChange,
    setFieldError,
    enableNextStepPersonalInfo,
  } = useFormContext();

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

    handleChange({ name: "cpf", value: maskedValue });
  };

  const validateCPFOnBlur = () => {
    const cleanCPF = formData.cpf.replace(/\D/g, "");

    if (cleanCPF.length > 0) {
      if (cleanCPF.length !== 11) {
        setFieldError("cpf", "CPF deve conter 11 dígitos");
      } else if (!validateCPF(cleanCPF)) {
        setFieldError("cpf", "CPF inválido");
      } else {
        setFieldError("cpf", "");
      }
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

      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
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
          />
        </div>

        <div className="w-1/2">
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
