import { type Branch } from "./branch";
import { type Country } from "./country";
import type { User } from "./users";
import { type Role } from "./role";
import type { JobcardServiceType } from "./jobcard-service-type";
import type { JobcardStatus } from "./jobcard-status";
import type { RecurringInterval } from "./recurring-interval";
import type { CustomerWithLocations } from "./customer";
import type { Asset, AssetType } from "./asset";
import type { Jobcard } from "./jobcard";
import type { TimerEvent } from "./timer-event";

export interface Response<T = unknown> {
  message: string | null;
  data: T | null;
  action: string | null;
}

// Users
export type ApiUsersShow = {
  user: User;
  branches: Branch[];
  countries: Country[];
  roles: Role[];
  is_technician: boolean;
};

// Jobcards
export type ApiJobcardMetadata = {
  service_types: JobcardServiceType[];
  recurring_intervals: RecurringInterval[];
  statuses: JobcardStatus[];
  timer_events: TimerEvent[];
};

export type ApiCustomersSearch = {
  customers: CustomerWithLocations[];
};

export type ApiAssetsSearch = {
  assets: Asset[];
};

export type CalendarHRow = {
  id: string;
  label: string;
  capacity: number;
  technician_id: string;
  user: User;
};

export type CalendarHSlot = {
  id: string;
  rowId: string;
  startTime: string;
  duration: number;
  title: string;
  type: string;
  attendees: number;
  jobcard_id: number;
  jobcard: Jobcard;
};

export interface ApiCalendarHData {
  rows: CalendarHRow[];
  slots: CalendarHSlot[];
}

export interface CalendarWeekDay {
  date: string;
  slots: CalendarHSlot[];
}

export interface ApiCalendarWeekData {
  rows: CalendarHRow[];
  days: CalendarWeekDay[];
}

export type MapLocationType =
  | "customer"
  | "customer_asset"
  | "fleet_asset"
  | "asset";

export interface MapLocationPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  type: MapLocationType;
  customer_id?: number | null;
  asset_id?: number | null;
  contact_person?: string | null;
  contact_number?: string | null;
  contact_email?: string | null;
  fleet_number?: string | null;
  serial_number?: string | null;
  kva?: string | null;
  description?: string | null;
  company_name?: string | null;
  website?: string | null;
}

export interface ApiLocationsMapResponse {
  points: MapLocationPoint[];
}

// Settings
export interface IndustrySimple {
  id: number;
  name: string;
}

export interface CountrySimple {
  id: number;
  name: string;
}

export interface RegionSimple {
  id: number;
  name: string;
}

export interface AssetTypeSimple {
  id: number;
  name: string;
}

export interface CustomerMetadataParams {
  industries?: boolean;
  countries?: boolean;
  regions?: boolean;
  asset_type?: boolean;
}

export interface CustomerMetadataResponse {
  industries: IndustrySimple[] | null;
  countries: CountrySimple[] | null;
  regions: RegionSimple[] | null;
  asset_type: AssetTypeSimple[] | null;
}
