import { createContext, useContext } from "react";
import type { AuthContextValue } from "@/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export function useSessionToken(): string | null {
  return useAuth().sessionToken;
}
