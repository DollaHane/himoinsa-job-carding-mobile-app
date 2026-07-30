export const ROLES = {
  1: "Sales Person",
  2: "Sales Engineer",
  3: "Sales Support",
  4: "General Manager",
  5: "Operations Manager",
  6: "Director",
  7: "Managing Director",
  8: "Driver",
  9: "Rental Desk Administrator",
  10: "Workshop Service",
  11: "Finance",
  12: "Head of Sales Retail",
  13: "Projects",
  14: "Service Team Leader",
  15: "Delivery Point",
} as const;

export type Roles = typeof ROLES;
export type RoleId = keyof Roles;
export type RoleName = Roles[RoleId];

export type User = {
  account_active: 0 | 1;
  branch: string | null;
  country: string | null;
  created_at: string;
  date_of_birth: string | null;
  deleted_at: string | null;
  email: string;
  email_verified_at: string | null;
  first_name: string;
  id: number;
  is_accounts: 0 | 1;
  is_admin: 0 | 1;
  is_delivery_point: 0 | 1;
  is_hiredesk_admin: 0 | 1;
  is_sales_dashboard: 0 | 1;
  is_sales_manager: 0 | 1;
  is_sales_person: 0 | 1;
  is_workshop: 0 | 1;
  last_name: string;
  mobile_number: string | null;
  monthly_contracts_value_target: number;
  monthly_quotations_value_target: number;
  password_reset_token: string | null;
  position: RoleId;
  profile_image: string | null;
  receive_admin_emails: 0 | 1;
  updated_at: string;
  user_number: string | null;
  username: string | null;
  verification_token: string | null;
};
