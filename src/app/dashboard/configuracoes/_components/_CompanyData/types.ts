export interface CompanyDataProps {
  isEditing: boolean;
  successMessage?: boolean;
}

export interface CompanyDataRef {
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
  hasChanges: boolean;
}

export interface CompanyFormValues {
  companyName?: string;
  cnpj?: string;
  phone?: string;
  cep?: string;
  street?: string;
  neighborhood?: string;
  state?: string;
  number?: string;
  city?: string;
  additionalAddress?: string; // Complemento
}
