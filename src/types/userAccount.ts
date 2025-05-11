export interface CompanyUserAccount {
  id?: string;
  personId?: string;
  name?: string; // Company Name
  cnpj?: string;
  phone?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  cep?: string;
  additionalAddress?: string; //Complemento
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface UserAccount {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  cpf?: string;
  phone: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  state?: string;
  city?: string;
  cep?: string;
  additionalAddress?: string;
  created_at?: string;
  updated_at?: string;
  companyData?: CompanyUserAccount;
}

export interface UserState {
  userData: UserAccount | null;
  isLoading: boolean;
  error: string | null;

  fetchUserData: () => Promise<void>;
  clearUserData: () => void;
  updateUserData: (data: Partial<UserAccount>) => Promise<void>;
}
