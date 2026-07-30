import type { TimerEvent } from "./timer-event";
import type { User } from "./users";
import type { Jobcard } from "./jobcard";

export interface TimerJobcard {
  id: number;
  technician_id?: number | null;
  jobcard_id?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  event_id?: number | null;
  event_timestamp?: string | null;
  lat?: number | null;
  lng?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  event?: TimerEvent | null;
  technician?: {
    id: number;
    user_id: number;
    is_active: 0 | 1;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user?: User | null;
  } | null;
  jobcard?: Jobcard | null;
}
