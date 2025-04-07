import { useFormContext } from "#/app/onboarding/helpers/FormContext";
import StepHeader from "#/app/onboarding/components/StepHeader";
import { TextField } from "#/components/Inputs";

const PersonalInfoStep = () => {
  const { formData, handleChange } = useFormContext();

  return (
    <div>
      <StepHeader
        title="Configure sua conta"
        description="Quase lá! Em menos de 2 minutos, sua conta estará pronta para transformar propostas em fechamentos!"
      />

      <div className="mb-4">
        <TextField
          name="fullName"
          label="Nome completo"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
          type="text"
        />
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <TextField
            name="CPF"
            label="CPF"
            value={formData.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            type="text"
          />
        </div>

        <div className="w-1/2">
          <TextField
            name="phone"
            label="Telefone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+55 (DDD) 90000-0000"
            type="text"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
