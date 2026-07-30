import type { Asset } from "./asset";

export interface Contract {
  id: number;
  quotation?: number | null;
  contract_number?: string | null;
  status?: number | null;
  contract_value?: string | null;
  contract_active_date?: string | null;
  contract_end_date?: string | null;
  opening_complete?: boolean | null;
  opening_complete_date?: string | null;
  closing_complete?: boolean | null;
  closing_complete_date?: string | null;
  contract_closed?: boolean | null;
  contract_closed_date?: string | null;
  reference?: string | null;
  registered_name?: string | null;
  registration_number?: string | null;
  vat_number?: string | null;
  delivery_address?: string | null;
  delivery_suburb?: string | null;
  delivery_city?: string | null;
  contact_person?: string | null;
  contact_telephone?: string | null;
  contact_position?: string | null;
  contact_email?: string | null;
  contact_mobile?: string | null;
  customer?: number | null;
  customer_name?: string | null;
  status_name?: string | null;
}

export interface ContractAsset {
  id: number;
  contract: number;
  asset: number;
  delivery_date?: string | null;
  upliftment_date?: string | null;
  decommission?: boolean | null;
  asset_details?: Asset | null;
}

export interface ContractShowResponse {
  contract: Contract;
  assets: ContractAsset[];
}

export interface DashboardStats {
  closed_pct: number;
  open_count: number;
  scheduled_count: number;
  overdue_count: number;
}
