import type { Customer } from "./customer";
import type { JobcardStatus } from "./jobcard-status";
import type { JobcardServiceType } from "./jobcard-service-type";
import type { RecurringInterval } from "./recurring-interval";
import type { LocationCustomer } from "./location-customer";
import type { LocationAsset } from "./location-asset";
import type { TimerJobcard } from "./timer-jobcard";
import type { InventoryJobcard } from "./inventory-jobcard";
import type { Inventory } from "./inventory";
import type { JobcardTask, JobcardAsset } from "./jobcards";
import type { JobcardTechnician } from "./technicians";
import type { Contract } from "./contract";

export interface Jobcard {
  id: number;
  jc_number?: string | null;
  customer_id?: number | null;
  customer_location_id?: number | null;
  asset_location_id?: number | null;
  parent_jobcard_id?: number | null;
  proforma_jobcard_id?: number | null;
  is_proforma?: boolean | null;
  work_description?: string | null;
  smr_reading?: string | null;
  equipment_condition?: string | null;
  recommendations?: string | null;
  is_recurring?: boolean | null;
  is_fleet_jc?: boolean | null;
  contract_id?: number | null;
  scheduled_datetime?: string | null;
  travel_time?: number | null;
  reminder_time?: string | null;
  technician_id?: number | null;
  estimated_duration_minutes?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;

  // Relationships
  customer?: Customer | null;
  location_customer?: LocationCustomer | null;
  location_asset?: LocationAsset | null;
  parent_jobcard?: Jobcard | null;
  timers?: Array<TimerJobcard>;
  status?: JobcardStatus | null;
  service_type?: JobcardServiceType | null;
  recurring_interval?: RecurringInterval | null;
  inventory?: Array<InventoryJobcard & { inventory?: Inventory | null }> | null;
  assets?: Array<JobcardAsset> | null;
  tasks?: Array<JobcardTask> | null;
  technicians?: Array<JobcardTechnician> | null;
  contract?: Contract | null;
}
