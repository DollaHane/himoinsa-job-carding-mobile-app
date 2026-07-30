import type { LocationAsset } from "./location-asset";

export interface AssetClassification {
  id: number;
  name?: string | null;
}

export interface AssetType {
  id: number;
  name?: string | null;
  classification?: number | null;
  classificationName?: AssetClassification | null;
}

export interface AssetStatus {
  id: number;
  name?: string | null;
}

export interface Asset {
  id: number;
  customer_id?: number | null;
  fleet_number?: string | null;
  kva?: string | null;
  serial_number?: string | null;
  description?: string | null;
  item_code?: string | null;
  registration_number?: string | null;
  engine_number?: string | null;
  next_service_rate?: string | null;
  asset_type?: number | null;
  assetType?: AssetType | null;
  first_operation_date?: string | null;
  status?: number | null;
  statusName?: AssetStatus | null;
  customer_name?: string | null;
  location?: Array<LocationAsset> | null;
}

export interface CustomerAsset {
  id: number;
  customer_id: number;
  description: string;
  serial_number: string;
  kva?: number | null;
  item_code?: string | null;
  asset_type?: number | null;
  registration_number?: string | null;
  engine_number?: string | null;
  next_service_rate?: string | null;
  assetType?: AssetType | null;
  location?: Array<LocationAsset> | null;
}
