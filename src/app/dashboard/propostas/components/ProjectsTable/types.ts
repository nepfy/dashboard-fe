export interface ProjectsDataProps {
  additionalAddress?: string;
  cep?: string;
  city?: string;
  clientName?: string;
  created_at?: string;
  deleted_at?: string | null;
  id: string;
  neighborhood?: string;
  number?: string;
  personId?: string;
  projectName?: string;
  projectSentDate?: string;
  projectStatus?:
    | "active"
    | "approved"
    | "negotiation"
    | "rejected"
    | "draft"
    | "expired"
    | "archived";
  projectValidUntil?: Date | string;
  projectVisualizationDate?: string;
  projectUrl?: string; // Adicionar campo projectUrl
  state?: string;
  street?: string;
  updated_at?: string;
  templateType?: "flash" | "prime" | "essencial" | "grid" | "minimal" | null;
}

export interface TableProps {
  data?: ProjectsDataProps[];
  onRowSelect?: (selectedIds: string[]) => void;
  onBulkStatusUpdate?: (projectIds: string[], status: string) => Promise<void>;
  onBulkDuplicate?: (projectIds: string[]) => Promise<void>;
  isLoading?: boolean;
  isInitialLoading?: boolean;
  isUpdating?: boolean;
  isDuplicating?: boolean;
  viewMode?: "active" | "archived";
}
