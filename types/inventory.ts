export interface Inventory {
  id: number;
  stock_code?: string | null;
  warehouse_code?: string | null;
  barcode?: string | null;
  serial_number?: string | null;
  tax_code?: string | null;
  quantity?: number | null;
  to_process?: number | null;
  unit_price?: number | null;
  booked_out?: number | null;
  available?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}
