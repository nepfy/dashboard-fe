export interface PersonalDataProps {
  isEditing: boolean;
}

export interface PersonalDataRef {
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
  hasChanges: boolean;
}

export interface PersonalFormValues {
  fullName: string;
  firstName: string;
  lastName: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  neighborhood: string;
  state: string;
  number: string;
  additionalAddress: string;
}
