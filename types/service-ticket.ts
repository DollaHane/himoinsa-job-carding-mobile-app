import type { Asset } from "./asset";
import type { Inventory } from "./inventory";
import type { Jobcard } from "./jobcard";
import type { ServiceSchedule } from "./service-schedule";

export type TicketStage =
  | "inspection"
  | "ordering"
  | "shipping"
  | "delivered"
  | "service_scheduled"
  | "completed";

export const TICKET_STAGES: Array<TicketStage> = [
  "inspection",
  "ordering",
  "shipping",
  "delivered",
  "service_scheduled",
  "completed",
];

export interface InventoryTicketItem {
  id?: number;
  service_ticket_id?: number;
  inventory_id: number;
  inventory?: Inventory | null;
  quantity: number;
  date_ordered?: string | null;
  shipping_confirmation?: string | null;
  estimated_arrival_date?: string | null;
  notes?: string | null;
}

export interface ServiceTicket {
  id: number;
  ticket_number: string;
  asset_id: number;
  asset?: Asset | null;
  service_schedule_id?: number | null;
  service_schedule?: ServiceSchedule | null;
  stage: TicketStage;
  inspection_jobcard_id?: number | null;
  inspection_jobcard?: Jobcard | null;
  service_jobcard_id?: number | null;
  service_jobcard?: Jobcard | null;
  inventory?: Array<InventoryTicketItem>;
  notes?: string | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}
