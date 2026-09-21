import type { Customer } from "./customer";

export interface QuotationService {
  id: number;
  quotation_id: number;
  name: string;
  work_description?: string | null;
  trigger_type?: string | null;
  frequency?: string | null;
  occurrences: number;
  travel_rate_per_km?: number | null;
  travel_qty?: number | null;
  travel_line_total?: number | null;
  unit_total?: number | null;
  line_total?: number | null;
}

export interface Quotation {
  id: number;
  ref: string;
  customer_id?: number | null;
  customer_asset_id?: number | null;
  customer_location_id?: number | null;
  service_branch_id?: number | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  company_name?: string | null;
  status: "draft" | "sent" | "active" | "expired" | "cancelled";
  signed_at?: string | null;
  signed_by_name?: string | null;
  signature?: string | null;
  approval_token?: string | null;
  term_start?: string | null;
  term_end?: string | null;
  term_months?: number | null;
  vat_pct?: number | string | null;
  round_trip_km?: number | string | null;
  subtotal?: number | string | null;
  vat_amount?: number | string | null;
  total?: number | string | null;
  asset_type?: string | null;
  asset_type_name?: string | null;
  asset_description?: string | null;
  asset_kva?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
  customer?: Customer | null;
  services?: Array<QuotationService>;
}
