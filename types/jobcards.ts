export interface JobcardTask {
  id: number;
  jobcard_id?: number | null;
  proforma_jobcard_id?: number | null;
  status?: string | null;
  task_step: number;
  description: string;
  duration: number | null;
  note?: string | null;
  incomplete_reason?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface JobcardInventoryItem {
  id: number;
  inventory_id: number;
  jobcard_id?: number | null;
  proforma_jobcard_id?: number | null;
  requested_by?: number | null;
  quantity_requested: number;
  quantity_used: number;
  date_requested: string;
  estimated_arrival_date?: string | null;
  date_supplied?: string | null;
  was_incorrect?: boolean | null;
  incorrect_reason?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  inventory?: {
    id: number;
    stock_code?: string;
    warehouse_code?: string;
    barcode?: string;
    serial_number?: string;
  };
}

export interface JobcardAsset {
  id: number;
  jobcard_id?: number | null;
  proforma_jobcard_id?: number | null;
  smr_id?: number | null;
  asset_type?: string | null;
  asset_id: number;
  asset_location_id: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  asset?: { fleet_number?: string; description?: string };
  asset_location?: {
    name?: string;
    address?: string;
    lat?: number | null;
    lng?: number | null;
    place_id?: string | null;
  };
}
