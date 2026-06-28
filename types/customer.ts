import type { LocationCustomer } from "./location-customer";
import type { Country } from "./country";
import type { User } from "./users";

export interface Customer {
  id: number;
  registration_number?: string | null;
  vat_number?: string | null;
  company_name: string;
  contact_number?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  physical_address?: string | null;
  physical_suburb?: string | null;
  physical_city?: string | null;
  physical_region?: number | null;
  physical_country?: number | null;
  delivery_address?: string | null;
  delivery_suburb?: string | null;
  delivery_city?: string | null;
  delivery_region?: number | null;
  delivery_country?: number | null;
  website?: string | null;
  industry?: number | null;
  trading_as?: string | null;
  account_number?: string | null;
  default_salesman?: number | null;
  bank_guarantee?: string | null;
  cesce_coverage?: string | null;
  incidents?: string | null;
  accounts_email_address?: string | null;
  contact_mobile_number?: string | null;
  contact_position?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  // Eager loaded relationships
  industry_name?: Industry;
  physical_region_name?: Region;
  physical_country_name?: Country;
  postal_region_name?: Region;
  postal_country_name?: Country;
  default_salesman_details?: User;
}

export interface CustomerWithLocations extends Customer {
  location?: LocationCustomer[];
}

// Related types for relationships
export interface Industry {
  id: number;
  name: string;
  description?: string | null;
}

export interface Region {
  id: number;
  name: string;
  code?: string | null;
  country_id?: number | null;
}
