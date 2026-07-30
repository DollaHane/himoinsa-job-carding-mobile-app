import type { User } from "./users";

export type Technician = {
  id: number;
  user_id: number;
  is_active: 0 | 1;
  first_name: string;
  last_name: string;
  username: string | null;
  user_number: string | null;
  email: string;
  mobile_number: string | null;
  position: string | null;
  position_name: string | null;
  branch: string | null;
  branch_name: string | null;
  country: string | null;
  profile_image: string | null;
};

export interface JobcardTechnician {
  id: number;
  jobcard_id: number;
  technician_id: number;
  proforma_jobcard_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  technician: Technician & { user: User };
}
