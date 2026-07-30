export interface InventoryJobcard {
  id: number;
  inventory_id?: number | null;
  jobcard_id?: number | null;
  proforma_jobcard_id?: number | null;
  requested_by?: number | null;
  quantity_requested?: number | null;
  quantity_used?: number | null;
  date_requested?: string | null;
  estimated_arrival_date?: string | null;
  date_supplied?: string | null;
  was_incorrect?: boolean | null;
  incorrect_reason?: string | null;
  notes?: string | null;
  created_at?: string | null;
  deleted_at?: string | null;
}
