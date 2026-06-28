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
}

export interface CompleteJobcardPayload {
  asset_smr: AssetSmrEntry[];
  tasks: TaskCompletionEntry[];
  inventory: InventoryUsageEntry[];
}
