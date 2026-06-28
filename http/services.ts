import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addTicketInventoryItem,
  completeJobcard,
  getAsset,
  getAssetsList,
  getAssetsSearchCustomer,
  getAssetsSearchFleet,
  getCalendarDayData,
  getCalendarHorizontalData,
  getCalendarWeekData,
  getContractShow,
  getContractsList,
  getCustomer,
  getCustomerAsset,
  getCustomerAssetsByCustomerId,
  getCustomerAssetsList,
  getCustomerAssetsSearch,
  getCustomerMetadata,
  getCustomersList,
  getCustomersSearch,
  getDashboardStats,
  getInventoryList,
  getJobcardMetadata,
  getJobcardShow,
  getJobcardsList,
  getLocation,
  getLocationsByEntity,
  getLocationsMap,
  getRunningTimers,
  getSalesTeam,
  getServiceKit,
  getServiceKitsList,
  getServiceSchedule,
  getServiceSchedulesList,
  getServiceTicket,
  getServiceTicketsList,
  getSettings,
  getTechnicianShow,
  getTechniciansList,
  getTimerEvents,
  getTimersList,
  getUser,
  getUsersList,
  scheduleInspection,
  searchInventory,
  updateSettings,
  updateTicketInventoryItem,
} from "./actions";
import type {
  CalendarFilterParams,
  JobcardListParams,
  ServiceTicketListParams,
  TechnicianShowResponse,
} from "./actions";
import type { User } from "@/types/users";
import type {
  ApiCalendarHData,
  ApiCalendarWeekData,
  ApiLocationsMapResponse,
  ApiUsersShow,
  CustomerMetadataParams,
  CustomerMetadataResponse,
} from "@/types/http";
import type { Jobcard } from "@/types/jobcard";
import type { Technician } from "@/types/technicians";
import type { Customer, CustomerWithLocations } from "@/types/customer";
import type { Asset } from "@/types/asset";
import type { LocationAsset } from "@/types/location-asset";
import type { Inventory } from "@/types/inventory";
import type { TimerJobcard } from "@/types/timer-jobcard";
import type { TimerEvent } from "@/types/timer-event";
import type { CompleteJobcardPayload } from "@/types/jobcard-complete";
import type {
  Contract,
  ContractShowResponse,
  DashboardStats,
} from "@/types/contract";
import type { ServiceSchedule } from "@/types/service-schedule";
import type { ServiceKit } from "@/types/service-kit";
import type { ServiceTicket } from "@/types/service-ticket";
import type { AppSettings } from "@/types/settings";
import type { ScheduleInspectionRequest } from "@/lib/validators/validate-schedule-inspection";

// Temporary toast shim until mobile toast is wired
const toast = {
  success: (message: string) => console.warn("[toast success]", message),
  error: (message: string) => console.warn("[toast error]", message),
};

/**
 * Query keys:
 * exported to be used in invalidation functions
 */
export const QueryKeys = {
  example: (id: string | null): Array<string> => ["example", id ?? ""],

  // Users
  user_list: ["users-list"] as const,
  user_show: (id: string | null): Array<string> => ["user-show", id ?? ""],
  sales_team: ["sales-team"] as const,

  // Customers
  customers_list: ["customers-list"] as const,
  customer_show: (id: string | null): Array<string> => [
    "customer-show",
    id ?? "",
  ],
  customers_search: (filter: string): Array<string> => [
    "customers-search",
    filter,
  ],

  // Assets
  assets_list: ["assets-list"] as const,
  asset_show: (id: string): Array<string> => ["asset-show", id],
  assets_search_customer: (filter: string): Array<string> => [
    "assets-search-customer",
    filter,
  ],
  assets_search_fleet: (filter: string): Array<string> => [
    "assets-search-fleet",
    filter,
  ],

  // Customer Assets
  customer_assets_by_customer: (customerId: string): Array<string> => [
    "customer-assets-by-customer",
    customerId,
  ],
  customer_assets_list: ["customer-assets-list"] as const,
  customer_asset_show: (id: string): Array<string> => [
    "customer-asset-show",
    id,
  ],
  customer_assets_search: (filter: string): Array<string> => [
    "customer-assets-search",
    filter,
  ],

  // Technicians
  technicians_list: ["technicians-list"] as const,
  technician_show: (id: string | null): Array<string> => [
    "technician-show",
    id ?? "",
  ],
  // Jobcards
  jobcards_list: ["jobcards-list"] as const,
  jobcards_list_filtered: (
    params?: JobcardListParams,
  ): Array<string | JobcardListParams> => ["jobcards-list", params ?? {}],
  jobcards_show: (id: string | null): Array<string> => [
    "jobcard-show",
    id ?? "",
  ],
  jobcards_metadata: ["jobcards-metadata"] as const,

  // Calendar
  calendar_h_show: (date?: string): Array<string> => [
    "calendar-h-show",
    date ?? "",
  ],
  calendar_day_show: (
    date?: string,
    params?: CalendarFilterParams,
  ): Array<string | CalendarFilterParams> => [
    "calendar-day-show",
    date ?? "",
    params ?? {},
  ],
  calendar_week_show: (
    date?: string,
    params?: CalendarFilterParams,
  ): Array<string | CalendarFilterParams> => [
    "calendar-week-show",
    date ?? "",
    params ?? {},
  ],

  // Locations
  locations_by_entity: (
    entityId: string,
    entityType: string,
  ): Array<string> => ["locations-by-entity", entityId, entityType],
  location_show: (id: string): Array<string> => ["location-show", id],
  locations_map: ["locations-map"] as const,

  // Settings
  customers_meta: (params: CustomerMetadataParams) =>
    ["customers-meta", JSON.stringify(params)] as const,

  // Inventory
  inventory_list: (search?: string): Array<string> => [
    "inventory-list",
    search ?? "",
  ],
  inventory_search: (search: string): Array<string> => [
    "inventory-search",
    search,
  ],

  // Timers
  timers_running: ["timers-running"] as const,
  timers_events: ["timers-events"] as const,
  timers_list: (params?: {
    technician_id?: number;
    jobcard_id?: number;
    date_from?: string;
    date_to?: string;
  }): Array<string | Record<string, unknown>> => ["timers-list", params ?? {}],

  // Contracts
  contracts_list: (params?: {
    search?: string;
    status?: number;
  }): Array<string | Record<string, unknown>> => [
    "contracts-list",
    params ?? {},
  ],
  contracts_show: (id: string): Array<string> => ["contracts-show", id],

  // Dashboard
  dashboard_stats: ["dashboard-stats"] as const,

  // Service Schedules
  service_schedules_list: (assetId?: number): Array<string | number> => [
    "service-schedules-list",
    assetId ?? 0,
  ],
  service_schedule_show: (id: string | null): Array<string> => [
    "service-schedule-show",
    id ?? "",
  ],

  // Service Kits
  service_kits_list: (assetTypeId?: number): Array<string | number> => [
    "service-kits-list",
    assetTypeId ?? 0,
  ],
  service_kit_show: (id: string | null): Array<string> => [
    "service-kit-show",
    id ?? "",
  ],

  // Service Tickets
  service_tickets_list: (
    params?: ServiceTicketListParams,
  ): Array<string | ServiceTicketListParams> => [
    "service-tickets-list",
    params ?? {},
  ],
  service_ticket_show: (id: string | null): Array<string> => [
    "service-ticket-show",
    id ?? "",
  ],
  service_ticket_inventory: (
    ticketId: number | null,
    itemId: number | null,
  ): Array<string> => [
    "service-ticket-inventory",
    String(ticketId ?? ""),
    String(itemId ?? ""),
  ],

  // Settings
  settings: ["app-settings"] as const,
};

/**
 * useQuery Functions
 */

/** *******************
 * Users
 *
 */
export function useGetUsersList() {
  return useQuery<Array<User>>({
    queryKey: QueryKeys.user_list,
    queryFn: () => getUsersList(),
  });
}

export function useGetUser(id: string | null) {
  return useQuery<ApiUsersShow>({
    queryKey: QueryKeys.user_show(id),
    queryFn: () => getUser(id!),
    enabled: !!id,
  });
}

export function useGetSalesTeam() {
  return useQuery<Array<User>>({
    queryKey: QueryKeys.sales_team,
    queryFn: () => getSalesTeam(),
  });
}

/** *******************
 * Customers
 *
 */
export function useGetCustomersList() {
  return useQuery<Array<CustomerWithLocations>>({
    queryKey: QueryKeys.customers_list,
    queryFn: () => getCustomersList(),
  });
}

export function useGetCustomer(id: string) {
  return useQuery<Customer>({
    queryKey: QueryKeys.customer_show(id),
    queryFn: () => getCustomer(id),
  });
}

export function useSearchCustomers(filter: string = "") {
  return useQuery({
    queryKey: QueryKeys.customers_search(filter),
    queryFn: () => getCustomersSearch(filter || undefined),
  });
}

/** *******************
 * Assets
 *
 */
export function useGetAssetsList() {
  return useQuery<Array<Asset>>({
    queryKey: QueryKeys.assets_list,
    queryFn: () => getAssetsList(),
  });
}

export function useGetAsset(id: string) {
  return useQuery<Asset>({
    queryKey: QueryKeys.asset_show(id),
    queryFn: () => getAsset(id),
  });
}

export function useSearchCustomerAssets(filter: string = "") {
  return useQuery({
    queryKey: QueryKeys.assets_search_customer(filter),
    queryFn: () => getAssetsSearchCustomer(filter || undefined),
    enabled: filter.length > 0,
  });
}

export function useSearchFleetAssets(filter: string = "") {
  return useQuery({
    queryKey: QueryKeys.assets_search_fleet(filter),
    queryFn: () => getAssetsSearchFleet(filter || undefined),
  });
}

/** *******************
 * Customer Assets
 *
 */
export function useGetCustomerAssetsList() {
  return useQuery<Array<Asset>>({
    queryKey: QueryKeys.customer_assets_list,
    queryFn: () => getCustomerAssetsList(),
  });
}

export function useSearchCustomerAssetsForJobcard(filter: string = "") {
  return useQuery({
    queryKey: QueryKeys.customer_assets_search(filter),
    queryFn: () => getCustomerAssetsSearch(filter || undefined),
    enabled: filter.length > 0,
  });
}

export function useGetCustomerAsset(id: string) {
  return useQuery<Asset>({
    queryKey: QueryKeys.customer_asset_show(id),
    queryFn: () => getCustomerAsset(id),
  });
}

export function useGetCustomerAssetsByCustomerId(customerId: string) {
  return useQuery<Array<Asset>>({
    queryKey: QueryKeys.customer_assets_by_customer(customerId),
    queryFn: () => getCustomerAssetsByCustomerId(customerId),
    enabled: !!customerId,
  });
}

/** *******************
 * Technicians
 *
 */
export function useGetTechniciansList() {
  return useQuery<Array<Technician>>({
    queryKey: QueryKeys.technicians_list,
    queryFn: () => getTechniciansList(),
  });
}

export function useGetTechnicianShow(id: string | null) {
  return useQuery<TechnicianShowResponse>({
    queryKey: QueryKeys.technician_show(id),
    queryFn: () => getTechnicianShow(id!),
    enabled: !!id,
  });
}

/** *******************
 * Jobcards
 *
 */
export function useGetJobcardsList(params?: JobcardListParams) {
  return useQuery<Array<Jobcard>>({
    queryKey: QueryKeys.jobcards_list_filtered(params),
    queryFn: () => getJobcardsList(params),
  });
}

export function useGetJobcardShow(id: string | null) {
  return useQuery({
    queryKey: QueryKeys.jobcards_show(id),
    queryFn: () => getJobcardShow(id!),
    enabled: !!id,
  });
}

export function useGetJobcardMetadata() {
  return useQuery({
    queryKey: QueryKeys.jobcards_metadata,
    queryFn: () => getJobcardMetadata(),
  });
}

/** *******************
 * Calendars
 *
 */
export function useGetCalendarHorizontalData(date?: string) {
  return useQuery<ApiCalendarHData>({
    queryKey: QueryKeys.calendar_h_show(date),
    queryFn: () => getCalendarHorizontalData(date),
  });
}

export function useGetCalendarDayData(
  date?: string,
  params?: CalendarFilterParams,
) {
  return useQuery<ApiCalendarHData>({
    queryKey: QueryKeys.calendar_day_show(date, params),
    queryFn: () => getCalendarDayData(date!, params),
    enabled: !!date,
  });
}

export function useGetCalendarWeekData(
  date?: string,
  params?: CalendarFilterParams,
) {
  return useQuery<ApiCalendarWeekData>({
    queryKey: QueryKeys.calendar_week_show(date, params),
    queryFn: () => getCalendarWeekData(date!, params),
    enabled: !!date,
  });
}

/** *******************
 * Locations
 *
 */
export function useGetLocationsByEntity(
  entityId: number,
  entityType: "asset" | "customer_asset" | "customer",
) {
  return useQuery<Array<LocationAsset>>({
    queryKey: QueryKeys.locations_by_entity(String(entityId), entityType),
    queryFn: () => getLocationsByEntity(entityId, entityType),
    enabled: !!entityId,
  });
}

export function useGetLocation(id: string) {
  return useQuery<LocationAsset>({
    queryKey: QueryKeys.location_show(id),
    queryFn: () => getLocation(id),
    enabled: !!id,
  });
}

export function useGetLocationsMap() {
  return useQuery<ApiLocationsMapResponse>({
    queryKey: QueryKeys.locations_map,
    queryFn: () => getLocationsMap(),
  });
}

/** *******************
 * Inventory
 *
 */
export function useGetInventoryList(search?: string) {
  return useQuery<Array<Inventory>>({
    queryKey: QueryKeys.inventory_list(search),
    queryFn: () => getInventoryList(search),
  });
}

export function useSearchInventory(search: string = "") {
  return useQuery<Array<Inventory>>({
    queryKey: QueryKeys.inventory_search(search),
    queryFn: () => searchInventory(search),
    enabled: search.length > 0,
  });
}

/** *******************
 * Resources
 *
 */
export function useGetCustomerMetadata(params: CustomerMetadataParams) {
  return useQuery<CustomerMetadataResponse>({
    queryKey: QueryKeys.customers_meta(params),
    queryFn: () => getCustomerMetadata(params),
  });
}

/** *******************
 * Timers
 *
 */
export function useGetRunningTimers() {
  return useQuery<Array<TimerJobcard>>({
    queryKey: QueryKeys.timers_running,
    queryFn: () => getRunningTimers(),
  });
}

export function useGetTimerEvents() {
  return useQuery<Array<TimerEvent>>({
    queryKey: QueryKeys.timers_events,
    queryFn: () => getTimerEvents(),
    staleTime: Infinity,
  });
}

export function useGetTimersList(params?: {
  technician_id?: number;
  jobcard_id?: number;
  date_from?: string;
  date_to?: string;
}) {
  return useQuery<Array<TimerJobcard>>({
    queryKey: QueryKeys.timers_list(params),
    queryFn: () => getTimersList(params),
  });
}

/** *******************
 * Contracts
 *
 */
export function useGetContractsList(params?: {
  search?: string;
  status?: number;
}) {
  return useQuery<Array<Contract>>({
    queryKey: QueryKeys.contracts_list(params),
    queryFn: () => getContractsList(params),
  });
}

export function useGetContractShow(id: string) {
  return useQuery<ContractShowResponse>({
    queryKey: QueryKeys.contracts_show(id),
    queryFn: () => getContractShow(id),
    enabled: !!id,
  });
}

/** *******************
 * Dashboard
 *
 */
export function useGetDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: QueryKeys.dashboard_stats,
    queryFn: () => getDashboardStats(),
  });
}

/** *******************
 * Jobcard Completion
 *
 */
export function useCompleteJobcard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobcardId,
      payload,
    }: {
      jobcardId: number;
      payload: CompleteJobcardPayload;
    }) => completeJobcard(jobcardId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Jobcard completed");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.jobcards_show(String(variables.jobcardId)),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
      queryClient.invalidateQueries({ queryKey: QueryKeys.timers_running });
      queryClient.invalidateQueries({ queryKey: ["calendar-day-show"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-week-show"] });
    },
    onError: () => {
      toast.error("Failed to complete jobcard");
    },
  });
}

/** *******************
 * Service Schedules
 *
 */
export function useGetServiceSchedulesList(assetId?: number) {
  return useQuery<Array<ServiceSchedule>>({
    queryKey: QueryKeys.service_schedules_list(assetId),
    queryFn: () => getServiceSchedulesList(assetId),
  });
}

export function useGetServiceSchedule(id: string | null) {
  return useQuery<ServiceSchedule>({
    queryKey: QueryKeys.service_schedule_show(id),
    queryFn: () => getServiceSchedule(id!),
    enabled: !!id,
  });
}

/** *******************
 * Service Kits
 *
 */
export function useGetServiceKitsList(assetTypeId?: number) {
  return useQuery<Array<ServiceKit>>({
    queryKey: QueryKeys.service_kits_list(assetTypeId),
    queryFn: () => getServiceKitsList(assetTypeId),
  });
}

export function useGetServiceKit(id: string | null) {
  return useQuery<ServiceKit>({
    queryKey: QueryKeys.service_kit_show(id),
    queryFn: () => getServiceKit(id!),
    enabled: !!id,
  });
}

/** *******************
 * Service Tickets
 *
 */
export function useGetServiceTicketsList(params?: ServiceTicketListParams) {
  return useQuery<Array<ServiceTicket>>({
    queryKey: QueryKeys.service_tickets_list(params),
    queryFn: () => getServiceTicketsList(params),
  });
}

export function useGetServiceTicket(id: string | null) {
  return useQuery<ServiceTicket>({
    queryKey: QueryKeys.service_ticket_show(id),
    queryFn: () => getServiceTicket(id!),
    enabled: !!id,
  });
}

export function useUpdateTicketInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      itemId,
      payload,
    }: {
      ticketId: number;
      itemId: number;
      payload: Record<string, unknown>;
    }) => updateTicketInventoryItem(ticketId, itemId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Inventory item updated.");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_ticket_inventory(
          variables.ticketId,
          variables.itemId,
        ),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_ticket_show(String(variables.ticketId)),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_tickets_list(),
      });
    },
    onError: () => {
      toast.error("Failed to update inventory item.");
    },
  });
}

/** *******************
 * Settings
 *
 */
export function useGetSettings() {
  return useQuery<AppSettings>({
    queryKey: QueryKeys.settings,
    queryFn: () => getSettings(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AppSettings>) => updateSettings(payload),
    onSuccess: () => {
      toast.success("Settings updated.");
      queryClient.invalidateQueries({ queryKey: QueryKeys.settings });
    },
    onError: () => {
      toast.error("Failed to update settings.");
    },
  });
}

/** *******************
 * Schedule Inspection
 *
 */
export function useScheduleInspection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ticketId,
      payload,
    }: {
      ticketId: number;
      payload: ScheduleInspectionRequest;
    }) => scheduleInspection(ticketId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Inspection scheduled.");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_ticket_show(String(variables.ticketId)),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_tickets_list(),
      });
    },
    onError: () => {
      toast.error("Failed to schedule inspection.");
    },
  });
}

/** *******************
 * Add Inventory Item to Ticket
 *
 */
export function useAddTicketInventoryItem() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { ticketId: number; payload: { inventory_id: number; quantity: number } }
  >({
    mutationFn: ({ ticketId, payload }) =>
      addTicketInventoryItem(ticketId, payload),
    onSuccess: (_data, variables) => {
      toast.success("Part added to ticket.");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_ticket_show(String(variables.ticketId)),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.service_tickets_list(),
      });
    },
    onError: () => {
      toast.error("Failed to add part.");
    },
  });
}
