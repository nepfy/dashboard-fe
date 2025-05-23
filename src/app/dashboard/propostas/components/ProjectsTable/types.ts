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
    | "expired";
  projectValidUntil?: string;
  projectVisualizationDate?: string;
  state?: string;
  street?: string;
  updated_at?: string;
}

export interface TableProps {
  data?: ProjectsDataProps[];
  onRowSelect?: (selectedIds: string[]) => void;
  isLoading?: boolean;
}
