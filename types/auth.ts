export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  technician_id?: number | null;
  is_admin?: number | null;
}

export interface AuthSession {
  user: AuthUser | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthSession {
  setSession: (user: AuthUser, sessionToken: string) => void;
  clearSession: () => void;
}
