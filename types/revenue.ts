export interface KvaRevenueItem {
  kva: number;
  total_revenue: number;
  total_contracts: number;
  percentage: number;
  avg_revenue: number;
  top_industry: string;
}

export interface PopularIndustry {
  name: string;
  total_contracts: number;
}

export interface KvaRevenueData {
  start_date: string;
  end_date: string;
  kva_data: KvaRevenueItem[];
  grand_total_revenue: number;
  grand_total_contracts: number;
  top_revenue_kva: KvaRevenueItem | null;
  most_popular_kva: KvaRevenueItem | null;
  most_popular_industry: PopularIndustry | null;
}

export interface KvaContractDetail {
  contract_id: number;
  contract_number: string;
  customer: string;
  industry: string;
  contract_value: number;
  start_date: string;
  end_date: string;
}

export interface KvaContractDetailsResponse {
  kva: number;
  contracts: KvaContractDetail[];
}