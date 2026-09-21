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
import type { JobcardInspectionChecklist } from "./inspection-checklist";

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
  travel_mileage?: number | null;
  travel_rate?: number | string | null;
  labour_rate?: number | string | null;
  technician_signature_name?: string | null;
  customer_signature_name?: string | null;
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
  inspection_checklists?: Array<JobcardInspectionChecklist> | null;
  sla_jobcards?: Array<{
    id: number;
    sla_id: number;
    sla_service_id?: number | null;
    jobcard_id: number;
  }> | null;
  quotation_jobcards?: Array<{
    id: number;
    quotation_id: number;
    jobcard_id: number;
    quotation?: {
      id: number;
      ref?: string | null;
      company_name?: string | null;
      contact_name?: string | null;
      contact_email?: string | null;
      contact_phone?: string | null;
      asset_type?: string | null;
      asset_type_name?: string | null;
      asset_description?: string | null;
      asset_kva?: number | string | null;
      customer?: Customer | null;
    } | null;
  }> | null;
  quotation_contact?: {
    company_name?: string | null;
    contact_name?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
  } | null;
  technician_branch_distance?: {
    branch_name: string;
    distance_meters: number;
    duration_seconds: number | null;
  } | null;
  mileage_status_reason?: string | null;
}
