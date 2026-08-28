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
  technician_signature_name?: string | null;
  customer_signature_name?: string | null;
}

export interface TicketCreatePayload {
  subject: string;
  description: string;
  customer_id?: number | null;
  asset_id?: number | null;
  asset_type?: string | null;
  jobcard_id?: number | null;
  priority?: "low" | "normal" | "high" | "urgent";
}
