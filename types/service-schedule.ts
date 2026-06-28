import type { Asset } from "./asset";
import type { ServiceKit } from "./service-kit";

export interface ServiceSchedule {
  id: number;
  asset_id: number;
  asset_type: number;
  asset?: Asset | null;
  service_kit_id: number;
  service_kit?: ServiceKit | null;
  milestone_name: string;
  scheduled_date: string;
  smr_milestone?: number | null;
  is_active: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
