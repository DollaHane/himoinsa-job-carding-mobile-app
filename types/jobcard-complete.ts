export interface AssetSmrEntry {
  asset_id: number;
  asset_type: string;
  date: string;
  smr_reading: string;
  equipment_condition?: string | null;
  recommendations?: string | null;
}

export interface TaskCompletionEntry {
  id: number;
  completed: boolean;
  incomplete_reason?: string | null;
}

export interface InventoryUsageEntry {
  id: number;
  quantity_used: number;
  reason_not_used?: string | null;
}

export interface SlotImage {
  slot: string;
  path: string;
  url: string;
}

export interface CompleteJobcardPayload {
  asset_smr: AssetSmrEntry[];
  tasks: TaskCompletionEntry[];
  inventory: InventoryUsageEntry[];
  inspection_checklists?: Array<{
    id: number;
    items: Array<{
      step: number;
      checked: boolean;
      notes?: string | null;
    }>;
  }>;
  vehicle_arrival_mileage?: number | null;
}
