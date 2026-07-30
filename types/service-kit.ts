import type { AssetType } from "./asset";
import type { Inventory } from "./inventory";

export interface ServiceKitItem {
  id?: number;
  service_kit_id?: number;
  inventory_id: number;
  inventory?: Inventory | null;
  quantity: number;
  notes?: string | null;
}

export interface ServiceKit {
  id: number;
  name: string;
  asset_type_id: number;
  asset_type?: AssetType | null;
  description?: string | null;
  is_active: boolean;
  items?: Array<ServiceKitItem>;
  created_at?: string;
  updated_at?: string;
}
