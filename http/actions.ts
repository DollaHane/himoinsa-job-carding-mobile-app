import { apiFetch } from "./core";
import type { AuthUser } from "@/types/auth";
import type { User } from "@/types/users";
import type { Technician } from "@/types/technicians";
import type {
  ApiCalendarHData,
  ApiCalendarWeekData,
  ApiJobcardMetadata,
  ApiLocationsMapResponse,
  ApiUsersShow,
  CustomerMetadataParams,
  CustomerMetadataResponse,
  Response,
} from "@/types/http";
import type { Customer, CustomerWithLocations } from "@/types/customer";
import type { Jobcard } from "@/types/jobcard";
import type { CompleteJobcardPayload } from "@/types/jobcard-complete";
import type { Asset } from "@/types/asset";
import type { LocationAsset } from "@/types/location-asset";
import type { Inventory } from "@/types/inventory";
import type { TimerJobcard } from "@/types/timer-jobcard";
import type { TimerEvent } from "@/types/timer-event";
import type {
  Contract,
  ContractShowResponse,
  DashboardStats,
} from "@/types/contract";
import type { ServiceSchedule } from "@/types/service-schedule";
import type { ServiceKit } from "@/types/service-kit";
import type {
  InventoryTicketItem,
  ServiceTicket,
} from "@/types/service-ticket";
import type { AppSettings, SettingEntry } from "@/types/settings";
import type { ScheduleInspectionRequest } from "@/lib/validators/validate-schedule-inspection";

const route_prefix = "api/hjc/v1/";

/**
 * List of Himoinsa Hiredesk API endpoints
 */
export const HimoinsaAPI = {
  // Auth
  example: "api/v1/example",
  api_login: "api/v1/login",
  api_logout: "api/v1/logout",
  api_verify: "api/v1/verify",

  // Users
  api_users_list: `${route_prefix}users/list`,
  api_users_show: `${route_prefix}users/show`,
  api_users_update: `${route_prefix}users/update`,
  api_users_sales_team: `${route_prefix}users/sales-team`,

  // Customers
  api_customers_list: `${route_prefix}customers/list`,
  api_customers_search: `${route_prefix}customers/search`,
  api_customers_show: `${route_prefix}customers/show`,
  api_customers_update: `${route_prefix}customers/update`,
  api_customers_store: `${route_prefix}customers/store`,

  // Assets
  api_assets_list: `${route_prefix}assets/list`,
  api_assets_show: `${route_prefix}assets/show`,
  api_assets_search_customer: `${route_prefix}assets/search-customer`,
  api_assets_search_fleet: `${route_prefix}assets/search-fleet`,

  // Customer Assets
  api_customer_assets_list: `${route_prefix}customer-assets/list`,
  api_customer_assets_show: `${route_prefix}customer-assets/show`,
  api_customer_assets_store: `${route_prefix}customer-assets/store`,
  api_customer_assets_update: `${route_prefix}customer-assets/update`,
  api_customer_assets_by_customer: `${route_prefix}customer-assets/show-customer-assets`,

  // Technicians
  api_technicians_list: `${route_prefix}technicians/list`,
  api_technicians_show: `${route_prefix}technicians/show`,

  // Locations
  api_locations_map: `${route_prefix}locations/map`,
  api_locations_store: `${route_prefix}locations/store`,
  api_locations_list: `${route_prefix}locations/list`,
  api_locations_show: `${route_prefix}locations/show`,
  api_locations_update: `${route_prefix}locations/update`,
  api_locations_delete: `${route_prefix}locations/delete`,

  // Resources
  api_settings_customers_meta: `${route_prefix}resources/customer-resources`,

  // Jobcards
  api_jobcards_list: `${route_prefix}jobcards/list`,
  api_jobcards_show: `${route_prefix}jobcards/show`,
  api_jobcards_store: `${route_prefix}jobcards/store`,
  api_jobcards_update: `${route_prefix}jobcards/update`,
  api_jobcards_metadata: `${route_prefix}jobcards/metadata`,
  api_jobcards_complete: `${route_prefix}jobcards/complete`,

  // Calendars
  api_calendar_horizontal_show: `${route_prefix}calendar/horizontal-show`,
  api_calendar_day_show: `${route_prefix}calendar/day-show`,
  api_calendar_week_show: `${route_prefix}calendar/week-show`,

  // Inventory
  api_inventory_list: `${route_prefix}inventory/list`,
  api_inventory_search: `${route_prefix}inventory/search`,

  // Timers
  api_timers_start: `${route_prefix}timers/start`,
  api_timers_stop: `${route_prefix}timers/stop`,
  api_timers_running: `${route_prefix}timers/running`,
  api_timers_list: `${route_prefix}timers/list`,
  api_timers_events: `${route_prefix}timers/events`,

  // Contracts
  api_contracts_list: `${route_prefix}contracts/list`,
  api_contracts_show: `${route_prefix}contracts/show`,

  // Dashboard
  api_dashboard_stats: `${route_prefix}dashboard/stats`,

  // Service Schedules
  api_service_schedules_list: `${route_prefix}service-schedules/list`,
  api_service_schedules_show: `${route_prefix}service-schedules/show`,

  // Service Kits
  api_service_kits_list: `${route_prefix}service-kits/list`,
  api_service_kits_show: `${route_prefix}service-kits/show`,

  // Service Tickets
  api_service_tickets_list: `${route_prefix}service-tickets/list`,
  api_service_tickets_show: `${route_prefix}service-tickets/show`,
  api_service_tickets_store: `${route_prefix}service-tickets/store`,
  api_service_tickets_update_stage: `${route_prefix}service-tickets/update-stage`,
  api_service_tickets_destroy: `${route_prefix}service-tickets/destroy`,
  api_service_tickets_schedule_inspection: `${route_prefix}service-tickets/schedule-inspection`,
  api_service_tickets_inventory_add: `${route_prefix}service-tickets`,

  // Settings
  api_settings: `${route_prefix}settings`,
};

/**
 * Build a URL with query parameters
 */
function buildUrl(
  baseUrl: string,
  params?: Record<
    string,
    string | number | undefined | null | Array<string | number>
  >,
): string {
  if (!params) return baseUrl;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Get request functions used in useQuery function
 */

export type VerifySessionResponse = {
  user: AuthUser;
  session: string;
  action: string | null;
};

export async function verifySession(): Promise<VerifySessionResponse> {
  const response = await apiFetch(HimoinsaAPI.api_verify, "POST");
  const json = (await response.json()) as Response<VerifySessionResponse>;
  if (!response.ok)
    throw new Error(json.message ?? "Session verification failed.");
  if (!json.data) throw new Error("No session data returned.");
  return json.data;
}

/** *******************
 * Users
 *
 */
export async function getUsersList(): Promise<Array<User>> {
  const response = await apiFetch(HimoinsaAPI.api_users_list, "GET");
  const json = (await response.json()) as Response<Array<User>>;
  if (!json.data) throw new Error("Failed to fetch user list.");
  return json.data;
}

export async function getSalesTeam(): Promise<Array<User>> {
  const response = await apiFetch(HimoinsaAPI.api_users_sales_team, "GET");
  const json = (await response.json()) as Response<Array<User>>;
  if (!json.data) throw new Error("Failed to fetch sales team.");
  return json.data;
}

export async function getUser(id: string): Promise<ApiUsersShow> {
  const response = await apiFetch(`${HimoinsaAPI.api_users_show}/${id}`, "GET");
  const json = (await response.json()) as Response<ApiUsersShow>;
  if (!json.data) throw new Error(`Failed to fetch user by id:${id}`);
  return json.data;
}

/** *******************
 * Customers
 *
 */
export async function getCustomersList(): Promise<
  Array<CustomerWithLocations>
> {
  const response = await apiFetch(HimoinsaAPI.api_customers_list, "GET");
  const json = (await response.json()) as Response<
    Array<CustomerWithLocations>
  >;
  if (!json.data) throw new Error("Failed to fetch customers list.");
  return json.data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_customers_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<Customer>;
  if (!json.data) throw new Error(`Failed to fetch customer by id:${id}`);
  return json.data;
}

export async function getCustomersSearch(
  filter?: string,
): Promise<Array<CustomerWithLocations>> {
  const url = buildUrl(
    HimoinsaAPI.api_customers_search,
    filter ? { filter } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<
    Array<CustomerWithLocations>
  >;
  if (!json.data) throw new Error("Failed to fetch customers.");
  return json.data;
}

/** *******************
 * Assets
 *
 */
export async function getAssetsList(): Promise<Array<Asset>> {
  const response = await apiFetch(HimoinsaAPI.api_assets_list, "GET");
  const json = (await response.json()) as Response<Array<Asset>>;
  if (!json.data) throw new Error("Failed to fetch asset list.");
  return json.data;
}

export async function getAsset(id: string): Promise<Asset> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_assets_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<Asset>;
  if (!json.data) throw new Error(`Failed to fetch asset by id:${id}`);
  return json.data;
}

export async function getAssetsSearchCustomer(
  filter?: string,
): Promise<Array<Asset>> {
  const url = buildUrl(
    HimoinsaAPI.api_assets_search_customer,
    filter ? { filter } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<Asset>>;
  if (!json.data) throw new Error("Failed to fetch customer assets.");
  return json.data;
}

export async function getAssetsSearchFleet(
  filter?: string,
): Promise<Array<Asset>> {
  const url = buildUrl(
    HimoinsaAPI.api_assets_search_fleet,
    filter ? { filter } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<Asset>>;
  if (!json.data) throw new Error("Failed to fetch fleet assets.");
  return json.data;
}

/** *******************
 * Customer Assets
 *
 */
export async function getCustomerAssetsList(): Promise<Array<Asset>> {
  const response = await apiFetch(HimoinsaAPI.api_customer_assets_list, "GET");
  const json = (await response.json()) as Response<Array<Asset>>;
  if (!json.data) throw new Error("Failed to fetch customer assets list.");
  return json.data;
}

export async function getCustomerAssetsSearch(
  filter?: string,
): Promise<Array<Asset>> {
  const url = buildUrl(
    HimoinsaAPI.api_assets_search_customer,
    filter ? { filter } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<Asset>>;
  if (!json.data) throw new Error("Failed to fetch customer assets.");
  return json.data;
}

export async function getCustomerAsset(id: string): Promise<Asset> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_customer_assets_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<Asset>;
  if (!json.data) throw new Error(`Failed to fetch customer asset by id:${id}`);
  return json.data;
}

export async function getCustomerAssetsByCustomerId(
  customerId: string,
): Promise<Array<Asset>> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_customer_assets_by_customer}/${customerId}`,
    "GET",
  );
  const json = (await response.json()) as Response<Array<Asset>>;
  if (!json.data) throw new Error("Failed to fetch customer assets.");
  return json.data;
}

/** *******************
 * Technicians
 *
 */
export async function getTechniciansList(): Promise<Array<Technician>> {
  const response = await apiFetch(HimoinsaAPI.api_technicians_list, "GET");
  const json = (await response.json()) as Response<Array<Technician>>;
  if (!json.data) throw new Error("Failed to fetch technician list.");
  return json.data;
}

export type TechnicianStats = {
  total: number;
  by_status: Record<string, number>;
  monthly: Array<{ month: string; count: number }>;
};

export type TechnicianShowResponse = {
  technician: Technician;
  stats: TechnicianStats;
};

export async function getTechnicianShow(
  id: string,
): Promise<TechnicianShowResponse> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_technicians_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<TechnicianShowResponse>;
  if (!json.data) throw new Error(`Failed to fetch technician id:${id}`);
  return json.data;
}

/** *******************
 * Jobcards
 *
 */
export type JobcardListParams = {
  search?: string | null;
  status_id?: Array<number> | null;
  date_from?: string | null;
  date_to?: string | null;
  sort_field?: string | null;
  sort_direction?: string | null;
  technician_id?: number | null;
};

export async function getJobcardsList(
  params?: JobcardListParams,
): Promise<Array<Jobcard>> {
  const url = buildUrl(HimoinsaAPI.api_jobcards_list, params);
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<Jobcard>>;
  if (!json.data) throw new Error("Failed to fetch jobcard list.");
  return json.data;
}

export async function getJobcardShow(id: string): Promise<Jobcard> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_jobcards_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<Jobcard>;
  if (!json.data) throw new Error(`Failed to fetch jobcard by id:${id}`);
  return json.data;
}

export async function getJobcardMetadata(): Promise<ApiJobcardMetadata> {
  const response = await apiFetch(HimoinsaAPI.api_jobcards_metadata, "GET");
  const json = (await response.json()) as Response<ApiJobcardMetadata>;
  if (!json.data) throw new Error("Failed to fetch jobcard metadata.");
  return json.data;
}

export async function completeJobcard(
  jobcardId: number,
  payload: CompleteJobcardPayload,
): Promise<Jobcard> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_jobcards_complete}/${jobcardId}`,
    "POST",
    payload,
  );
  const json = (await response.json()) as Response<Jobcard>;
  if (!json.data) throw new Error("Failed to complete jobcard.");
  return json.data;
}

/** *******************
 * Calendars
 *
 */
export async function getCalendarHorizontalData(
  date?: string,
): Promise<ApiCalendarHData> {
  const url = buildUrl(
    HimoinsaAPI.api_calendar_horizontal_show,
    date ? { date } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<ApiCalendarHData>;
  if (!json.data) throw new Error("Failed to fetch horizontal calendar data.");
  return json.data;
}

export interface CalendarFilterParams {
  search?: string | null;
  status_id?: Array<number> | null;
  technician_id?: Array<number> | null;
}

export async function getCalendarDayData(
  date: string,
  params?: CalendarFilterParams,
): Promise<ApiCalendarHData> {
  const url = buildUrl(HimoinsaAPI.api_calendar_day_show, { date, ...params });
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<ApiCalendarHData>;
  if (!json.data) throw new Error("Failed to fetch calendar day data.");
  return json.data;
}

export async function getCalendarWeekData(
  date: string,
  params?: CalendarFilterParams,
): Promise<ApiCalendarWeekData> {
  const url = buildUrl(HimoinsaAPI.api_calendar_week_show, { date, ...params });
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<ApiCalendarWeekData>;
  if (!json.data) throw new Error("Failed to fetch calendar week data.");
  return json.data;
}

/** *******************
 * Locations
 *
 */
export async function getLocationsMap(): Promise<ApiLocationsMapResponse> {
  const response = await apiFetch(HimoinsaAPI.api_locations_map, "GET");
  const json = (await response.json()) as Response<ApiLocationsMapResponse>;
  if (!json.data) throw new Error("Failed to fetch map locations.");
  return {
    points: json.data.points.map((p) => ({
      ...p,
      lat: Number(p.lat),
      lng: Number(p.lng),
    })),
  };
}

export async function getLocationsByEntity(
  entityId: number,
  entityType: "asset" | "customer_asset" | "customer",
): Promise<Array<LocationAsset>> {
  const url = buildUrl(HimoinsaAPI.api_locations_list, {
    entity_id: String(entityId),
    entity_type: entityType,
  });
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<LocationAsset>>;
  if (!json.data) throw new Error("Failed to fetch locations.");
  return json.data;
}

export async function getLocation(id: string): Promise<LocationAsset> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_locations_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<LocationAsset>;
  if (!json.data) throw new Error(`Failed to fetch location by id:${id}`);
  return json.data;
}

/** *******************
 * Inventory
 *
 */
export async function getInventoryList(
  search?: string,
): Promise<Array<Inventory>> {
  const url = buildUrl(
    HimoinsaAPI.api_inventory_list,
    search ? { search } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<Inventory>>;
  if (!json.data) throw new Error("Failed to fetch inventory list.");
  return json.data;
}

export async function searchInventory(
  search: string,
): Promise<Array<Inventory>> {
  const response = await apiFetch(HimoinsaAPI.api_inventory_search, "POST", {
    search,
  });
  const json = (await response.json()) as Response<Array<Inventory>>;
  if (!json.data) throw new Error("Failed to search inventory.");
  return json.data;
}

/** *******************
 * Resources
 *
 */
export async function getCustomerMetadata(
  params: CustomerMetadataParams,
): Promise<CustomerMetadataResponse> {
  const includes: Array<string> = [];
  if (params.industries) includes.push("industries");
  if (params.countries) includes.push("countries");
  if (params.regions) includes.push("regions");
  if (params.asset_type) includes.push("asset_type");

  const url = buildUrl(
    HimoinsaAPI.api_settings_customers_meta,
    includes.length > 0 ? { param: includes.join(",") } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<CustomerMetadataResponse>;
  if (!json.data) throw new Error("Failed to fetch customer metadata.");
  return json.data;
}

/** *******************
 * Timers
 *
 */
export async function startTimer(
  jobcardId: number,
  lat?: number,
  lng?: number,
): Promise<TimerJobcard> {
  const response = await apiFetch(HimoinsaAPI.api_timers_start, "POST", {
    jobcard_id: jobcardId,
    ...(lat !== undefined ? { lat } : {}),
    ...(lng !== undefined ? { lng } : {}),
  });
  const json = (await response.json()) as Response<TimerJobcard>;
  if (!json.data) throw new Error("Failed to start timer.");
  return json.data;
}

export async function stopTimer(timerId: number): Promise<TimerJobcard> {
  const response = await apiFetch(HimoinsaAPI.api_timers_stop, "POST", {
    timer_id: timerId,
  });
  const json = (await response.json()) as Response<TimerJobcard>;
  if (!json.data) throw new Error("Failed to stop timer.");
  return json.data;
}

export async function getRunningTimers(): Promise<Array<TimerJobcard>> {
  const response = await apiFetch(HimoinsaAPI.api_timers_running, "GET");
  const json = (await response.json()) as Response<Array<TimerJobcard>>;
  if (!json.data) throw new Error("Failed to fetch running timers.");
  return json.data;
}

export async function getTimersList(params?: {
  technician_id?: number;
  jobcard_id?: number;
  date_from?: string;
  date_to?: string;
}): Promise<Array<TimerJobcard>> {
  const url = buildUrl(HimoinsaAPI.api_timers_list, params);
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<TimerJobcard>>;
  if (!json.data) throw new Error("Failed to fetch timers list.");
  return json.data;
}

export async function getTimerEvents(): Promise<Array<TimerEvent>> {
  const response = await apiFetch(HimoinsaAPI.api_timers_events, "GET");
  const json = (await response.json()) as Response<Array<TimerEvent>>;
  if (!json.data) throw new Error("Failed to fetch timer events.");
  return json.data;
}

/** *******************
 * Contracts
 *
 */
export async function getContractsList(params?: {
  search?: string;
  status?: number;
}): Promise<Array<Contract>> {
  const url = buildUrl(HimoinsaAPI.api_contracts_list, params);
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<Contract>>;
  if (!json.data) throw new Error("Failed to fetch contracts list.");
  return json.data;
}

export async function getContractShow(
  id: string,
): Promise<ContractShowResponse> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_contracts_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<ContractShowResponse>;
  if (!json.data) throw new Error(`Failed to fetch contract by id:${id}`);
  return json.data;
}

/** *******************
 * Dashboard
 *
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiFetch(HimoinsaAPI.api_dashboard_stats, "GET");
  const json = (await response.json()) as Response<DashboardStats>;
  if (!json.data) throw new Error("Failed to fetch dashboard stats.");
  return json.data;
}

/** *******************
 * Service Schedules
 *
 */
export async function getServiceSchedulesList(
  assetId?: number,
): Promise<Array<ServiceSchedule>> {
  const url = buildUrl(
    HimoinsaAPI.api_service_schedules_list,
    assetId ? { asset_id: assetId } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<ServiceSchedule>>;
  if (!json.data) throw new Error("Failed to fetch service schedules.");
  return json.data;
}

export async function getServiceSchedule(id: string): Promise<ServiceSchedule> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_service_schedules_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<ServiceSchedule>;
  if (!json.data)
    throw new Error(`Failed to fetch service schedule by id:${id}`);
  return json.data;
}

/** *******************
 * Service Kits
 *
 */
export async function getServiceKitsList(
  assetTypeId?: number,
): Promise<Array<ServiceKit>> {
  const url = buildUrl(
    HimoinsaAPI.api_service_kits_list,
    assetTypeId ? { asset_type_id: assetTypeId } : undefined,
  );
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<ServiceKit>>;
  if (!json.data) throw new Error("Failed to fetch service kits.");
  return json.data;
}

export async function getServiceKit(id: string): Promise<ServiceKit> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_service_kits_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<ServiceKit>;
  if (!json.data) throw new Error(`Failed to fetch service kit by id:${id}`);
  return json.data;
}

/** *******************
 * Service Tickets
 *
 */
export type ServiceTicketListParams = {
  stage?: string | null;
  asset_id?: number | null;
  search?: string | null;
};

export async function getServiceTicketsList(
  params?: ServiceTicketListParams,
): Promise<Array<ServiceTicket>> {
  const url = buildUrl(HimoinsaAPI.api_service_tickets_list, params);
  const response = await apiFetch(url, "GET");
  const json = (await response.json()) as Response<Array<ServiceTicket>>;
  if (!json.data) throw new Error("Failed to fetch service tickets.");
  return json.data;
}

export async function getServiceTicket(id: string): Promise<ServiceTicket> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_service_tickets_show}/${id}`,
    "GET",
  );
  const json = (await response.json()) as Response<ServiceTicket>;
  if (!json.data) throw new Error(`Failed to fetch service ticket by id:${id}`);
  return json.data;
}

export async function updateTicketInventoryItem(
  ticketId: number,
  itemId: number,
  payload: Record<string, unknown>,
): Promise<InventoryTicketItem> {
  const response = await apiFetch(
    `${route_prefix}service-tickets/${ticketId}/inventory/${itemId}`,
    "PUT",
    payload,
  );
  const json = (await response.json()) as Response<InventoryTicketItem>;
  if (!json.data) throw new Error("Failed to update inventory item.");
  return json.data;
}

export async function addTicketInventoryItem(
  ticketId: number,
  payload: { inventory_id: number; quantity: number },
): Promise<InventoryTicketItem> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_service_tickets_inventory_add}/${ticketId}/inventory`,
    "POST",
    payload,
  );
  const json = (await response.json()) as Response<InventoryTicketItem>;
  if (!json.data) throw new Error("Failed to add inventory item to ticket.");
  return json.data;
}

/** *******************
 * Settings
 *
 */
export async function getSettings(): Promise<AppSettings> {
  const response = await apiFetch(HimoinsaAPI.api_settings, "GET");
  const json = (await response.json()) as Response<
    | AppSettings
    | { settings: AppSettings }
    | { settings: Record<string, SettingEntry> }
    | Array<
        SettingEntry & { id: number; title: string; description: string | null }
      >
  >;
  const data = json.data;
  if (!data) throw new Error("Failed to fetch settings.");
  if (Array.isArray(data)) {
    return Object.fromEntries(data.map((e) => [e.slug, String(e.value)]));
  }
  if ("settings" in data && data.settings) {
    const settingsVal = data.settings;
    if (typeof settingsVal === "object" && !Array.isArray(settingsVal)) {
      const entries = Object.values(settingsVal) as Array<SettingEntry>;
      if (entries.length > 0 && "slug" in entries[0]) {
        return Object.fromEntries(
          entries.map((e: SettingEntry) => [e.slug, String(e.value)]),
        );
      }
    }
    return settingsVal as AppSettings;
  }
  return data as AppSettings;
}

export async function updateSettings(
  payload: Partial<AppSettings>,
): Promise<AppSettings> {
  const settings: Record<string, { slug: string; value: string }> = {};
  for (const [slug, value] of Object.entries(payload)) {
    settings[slug] = { slug, value: String(value) };
  }
  const response = await apiFetch(HimoinsaAPI.api_settings, "PUT", {
    settings,
  });
  const json = (await response.json()) as Response<AppSettings>;
  if (!json.data) throw new Error("Failed to update settings.");
  return json.data;
}

/** *******************
 * Schedule Inspection
 *
 */
export async function scheduleInspection(
  ticketId: number,
  payload: ScheduleInspectionRequest,
): Promise<ServiceTicket> {
  const response = await apiFetch(
    `${HimoinsaAPI.api_service_tickets_schedule_inspection}/${ticketId}`,
    "POST",
    payload,
  );
  const json = (await response.json()) as Response<ServiceTicket>;
  if (!json.data) throw new Error("Failed to schedule inspection for ticket.");
  return json.data;
}
