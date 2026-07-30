export interface DashBoardFilter {
    date: string | null | undefined,
    kva: string | string[] | null | undefined,
    show_previous: boolean
}

// Asset Type definitions
export interface AssetType {
  id: number;
  name: string;
  is_service_item: number;
  classification: number;
  deleted_at: string | null;
}

export interface Asset {
  id: number;
  zoho_id: string | null;
  description: string;
  fleet_number: string;
  serial_number: string | null;
  leased_from_hesid: number;
  is_hsa_owned: number;
  land_cost: string | null;
  insurance_value: string | null;
  first_operation_date: string | null;
  kva: string | null;
  item_code: string;
  card: string;
  registration_number: string | null;
  unit_of_measure: string | null;
  asset_branch: number;
  asset_type: AssetType;
  country: string | null;
  status: number;
  deleted_at: string | null;
  hes_price: string | null;
  non_inventory: number;
  comment: string | null;
  engine_number: string | null;
  dse_web: string | null;
  next_service_rate: string | null;
  last_service_date: string | null;
  first_service_date: string | null;
  smr: string | null;
  has_reading: string | null;
  last_service: string | null;
  prior_smr: string | null;
  current_smr: string | null;
  next_service: string | null;
  hours_to_go: string | null;
  days_to_go: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

// Chart Data types
export interface AssetDetail {
  asset_id: number;
  fleet_number: string;
  customer: string | null;
  contract_id: number | null;
  contract_number: string | null;
  contract_type: string | null;
  start_date: string | null;
  end_date: string | null;
  kva_size: number;
  kva_in_use: number;
  type: string | null;
}

export interface ChartDataset {
  labels: string[];
  asset_details: AssetDetail[][];
  total_kva: number[];
  kva_in_use: number[];
  kva_in_use_prev: number[];
  kva_utilisation: number[];
  kva_utilisation_prev: number[];
  total_units: number[];
  unit_in_use: number[];
  unit_in_use_prev: number[];
  units_utilisation: number[];
  units_utilisation_prev: number[];
  background_color: string[];
  availability: number[];
  availability_prev: number[];
  total_availability: number[];
  total_availability_prev: number[];
}

export interface ChartData {
  kva_filter: string[];
  labels: string[];
  total_generators: number;
  total_other: number;
  contracts_short_term: number;
  contracts_long_term: number;
  in_repair: number;
  combined_total_kva: number;
  combined_kva_in_use: number;
  combined_units_in_use: number;
  combined_utilisation: number;
  hsa_owned_generator: number;
  hse_owned_generator: number;
  hsa_owned_other: number;
  hse_owned_other: number;
  datasets: ChartDataset[];
}

// Fleet Control Response types
export interface FleetControlData {
  assets: Asset[];
  chart_data: ChartData;
  current_date: string;
  previous_date: string;
  selected_kva: string[] | null;
  show_previous_year: boolean;
}

export interface FleetControlResponse {
  status: string;
  data: FleetControlData;
}
