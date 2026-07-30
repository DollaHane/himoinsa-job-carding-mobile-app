import { useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import {
  persistSession,
  loadPersistedSession,
  clearPersistedSession,
} from "@/providers/Auth/AuthStorage";
import { setNavigateForAuth } from "@/http";
import type { AuthUser, AuthSession } from "@/types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

async function getInitialSession(): Promise<AuthSession> {
  const persisted = await loadPersistedSession();
  if (persisted) {
    return {
      user: persisted.user,
      sessionToken: persisted.sessionToken,
      isAuthenticated: true,
    };
  }
  return { user: null, sessionToken: null, isAuthenticated: false };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    getInitialSession().then(setSessionState);
  }, []);

  useEffect(() => {
    setNavigateForAuth(router);
  }, [router]);

  const setSession = useCallback(
    async (user: AuthUser, sessionToken: string) => {
      await persistSession(user, sessionToken);
      setSessionState({ user, sessionToken, isAuthenticated: true });
    },
    [],
  );

  const clearSession = useCallback(async () => {
    await clearPersistedSession();
    setSessionState({ user: null, sessionToken: null, isAuthenticated: false });
  }, []);

  if (!session) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...session, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}
