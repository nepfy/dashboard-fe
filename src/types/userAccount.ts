export interface UserAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
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
}

export interface UserState {
  userData: UserAccount | null;
  isLoading: boolean;
  error: string | null;

  fetchUserData: () => Promise<void>;
  clearUserData: () => void;
  updateUserData: (data: Partial<UserAccount>) => Promise<void>;
}
