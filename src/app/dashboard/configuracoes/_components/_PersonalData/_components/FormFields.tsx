// FormFields.tsx
import { TextField } from "#/components/Inputs";
import { PersonalFormValues } from "../types";

interface FormFieldsProps {
  formValues: PersonalFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formValues,
  handleChange,
  isEditing,
  isLoading,
}) => {
  return (
    <>
      <div className="pb-2">
        <TextField
          label="Nome Completo"
          inputName="fullName"
          id="fullName"
          type="text"
          placeholder="Nome Completo"
          onChange={handleChange}
          value={formValues.fullName}
          disabled={!isEditing || isLoading}
        />
      </div>

      <div className="py-2">
        <TextField
          label="CPF"
          inputName="cpf"
          id="cpf"
          type="text"
          placeholder="CPF"
          onChange={handleChange}
          value={formValues.cpf}
          disabled={!isEditing || isLoading}
        />
      </div>

      <div className="py-2">
        <TextField
          label="Telefone"
          inputName="phone"
          id="phone"
          type="text"
          placeholder="Telefone"
          onChange={handleChange}
          value={formValues.phone}
          disabled={!isEditing || isLoading}
        />
      </div>

      <div className="py-2">
        <TextField
          label="CEP"
          inputName="cep"
          id="cep"
          type="text"
          placeholder="CEP"
          onChange={handleChange}
          value={formValues.cep}
          disabled={!isEditing || isLoading}
        />
      </div>

      <div className="py-2">
        <TextField
          label="Endereço"
          inputName="street"
          id="street"
          type="text"
          placeholder="Endereço"
          onChange={handleChange}
          value={formValues.street}
          disabled={!isEditing || isLoading}
        />
      </div>

      <div className="py-2 flex flex-col sm:flex-row justify-center items-center">
        <div className="py-2 w-full sm:w-2/3 sm:pr-2">
          <TextField
            label="Bairro"
            inputName="neighborhood"
            id="neighborhood"
            type="text"
            placeholder="Bairro"
            onChange={handleChange}
            value={formValues.neighborhood}
            disabled={!isEditing || isLoading}
          />
        </div>
        <div className="py-2 w-full sm:w-1/3">
          <TextField
            label="UF"
            inputName="state"
            id="state"
            type="text"
            placeholder="UF"
            onChange={handleChange}
            value={formValues.state}
            disabled={!isEditing || isLoading}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center pb-2">
        <div className="py-2 sm:py-0 w-full sm:w-1/3 sm:pr-2">
          <TextField
            label="Número"
            inputName="number"
            id="number"
            type="text"
            placeholder="Número"
            onChange={handleChange}
            value={formValues.number}
            disabled={!isEditing || isLoading}
          />
        </div>
        <div className="py-2 sm:py-0 w-full sm:w-2/3">
          <TextField
            label="Complemento"
            inputName="additionalAddress"
            id="additionalAddress"
            type="text"
            placeholder="Complemento"
            onChange={handleChange}
            value={formValues.additionalAddress}
            disabled={!isEditing || isLoading}
          />
        </div>
      </div>
    </>
  );
};
