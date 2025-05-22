// Define the data type for table rows
export interface TableRow {
  id: string;
  cliente: string;
  projeto: string;
  visualizado: string; // Could be a date string
  validade: string; // Could be a date string
  status:
    | "active"
    | "approved"
    | "negotiation"
    | "rejected"
    | "draft"
    | "expired";
}

export interface TableProps {
  data: TableRow[];
  onRowSelect?: (selectedIds: string[]) => void;
}
