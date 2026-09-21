import type { Customer } from "./customer";

export interface SlaService {
  id: number;
  sla_id: number;
  name: string;
  work_description?: string | null;
  trigger_type: "date" | "smr";
  frequency?: string | null;
  smr_interval?: number | null;
  next_service_date?: string | null;
  next_service_smr?: number | null;
  generated_count: number;
  occurrences: number;
  travel_rate_per_km?: number | null;
  travel_qty?: number | null;
  travel_line_total?: number | null;
  unit_total?: number | null;
  line_total?: number | null;
  sort_order?: number | null;
}

export interface Sla {
  id: number;
  ref: string;
  customer_id?: number | null;
  customer_asset_id?: number | null;
  customer_location_id?: number | null;
  service_branch_id?: number | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  status: "draft" | "sent" | "active" | "expired" | "cancelled";
  signed_at?: string | null;
  signed_by_name?: string | null;
  signature?: string | null;
  approval_token?: string | null;
  term_start?: string | null;
  term_end?: string | null;
  term_months?: number | null;
  escalation_pct?: number | null;
  notice_days?: number | null;
  vat_pct?: number | string | null;
  round_trip_km?: number | string | null;
  subtotal?: number | string | null;
  vat_amount?: number | string | null;
  total?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
  customer?: Customer | null;
  services?: Array<SlaService>;
}

export interface SlaServicePrefill {
  sla_id: number;
  sla_service_id: number;
  work_description?: string | null;
  asset_id?: number | null;
  tasks?: Array<{
    description: string;
    qty_hours: number;
    rate_per_hour: number;
  }>;
  parts?: Array<{
    inventory_id: number;
    qty: number;
    unit_price: number;
  }>;
  inspection_checklist_ids?: Array<number>;
}
