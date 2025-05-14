// FormFields.tsx
import { TextField, CepInput } from "#/components/Inputs";
import { PersonalFormValues } from "../types";
import { useCepSearch } from "#/app/dashboard/configuracoes/_hooks/useCEPSearch";
import { validateCPF, maskCPF } from "#/helpers";

interface FormFieldsProps {
  formValues: PersonalFormValues;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateFormValues: (values: Partial<PersonalFormValues>) => void;
  isEditing: boolean;
  isLoading: boolean;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  formValues,
  handleChange,
  updateFormValues,
  isEditing,
  isLoading,
}) => {
  const { isSearching, searchError, handleCepChange, searchAddressByCep } =
    useCepSearch((addressData) => {
      updateFormValues({
        street: addressData.street,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
      });
    });

  const handleCepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = handleCepChange(value);

    updateFormValues({ [name]: formattedValue });
  };

  const handleCepSearch = () => {
    if (formValues.cep) {
      searchAddressByCep(formValues.cep);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedValue = maskCPF(value);

    updateFormValues({ [name]: maskedValue });
  };

  const validateCPFOnBlur = () => {
    if (formValues.cpf) {
      const cleanCPF = formValues.cpf.replace(/\D/g, "");

      if (cleanCPF.length > 0 && !validateCPF(cleanCPF)) {
        // You can add error handling here if needed
        console.warn("CPF inválido");
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = "";

    if (numericValue.length === 0) {
      formattedValue = "";
    } else if (numericValue.length <= 2) {
      formattedValue = `(${numericValue}`;
    } else if (numericValue.length <= 3) {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 7) {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(
        2,
        3
      )} ${numericValue.slice(3)}`;
    } else if (numericValue.length <= 11) {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(
        2,
        3
      )} ${numericValue.slice(3, 7)}-${numericValue.slice(7)}`;
    } else {
      formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(
        2,
        3
      )} ${numericValue.slice(3, 7)}-${numericValue.slice(7, 11)}`;
    }

    updateFormValues({ [name]: formattedValue });
  };

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
          onChange={handleCpfChange}
          onBlur={validateCPFOnBlur}
          value={formValues.cpf}
          disabled={true}
        />
      </div>

      <div className="py-2">
        <TextField
          label="Telefone"
          inputName="phone"
          id="phone"
          type="text"
          placeholder="Telefone"
          onChange={handlePhoneChange}
          value={formValues.phone}
          disabled={!isEditing || isLoading}
        />
      </div>

      <div className="py-2">
        <CepInput
          label="CEP"
          inputName="cep"
          id="cep"
          placeholder="00000-000"
          onChange={handleCepInputChange}
          value={formValues.cep}
          disabled={!isEditing || isLoading}
          isSearching={isSearching}
          onSearch={handleCepSearch}
          error={searchError}
        />
        {isEditing && (
          <p className="text-xs text-[var(--color-white-neutral-light-500)] mt-1">
            Digite o CEP e clique na lupa para buscar o endereço automaticamente
          </p>
        )}
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
          disabled={!isEditing || isLoading || isSearching}
        />
      </div>

      <div className="py-2">
        <TextField
          label="Bairro"
          inputName="neighborhood"
          id="neighborhood"
          type="text"
          placeholder="Bairro"
          onChange={handleChange}
          value={formValues.neighborhood}
          disabled={!isEditing || isLoading || isSearching}
        />
      </div>

      <div className="py-2 flex flex-col sm:flex-row justify-center items-center">
        <div className="py-2 w-full sm:w-2/3 sm:pr-2">
          <TextField
            label="Cidade"
            inputName="city"
            id="city"
            type="text"
            placeholder="Cidade"
            onChange={handleChange}
            value={formValues.city}
            disabled={!isEditing || isLoading || isSearching}
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
            disabled={!isEditing || isLoading || isSearching}
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
