import * as SecureStore from "expo-secure-store";
import type { AuthUser } from "@/types/auth";

const SESSION_KEY = "auth_session";
const USER_KEY = "auth_user";

export async function persistSession(
  user: AuthUser,
  sessionToken: string,
): Promise<void> {
  try {
    await SecureStore.setItemAsync(SESSION_KEY, sessionToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // SecureStore can throw if not available
  }
}

export async function loadPersistedSession(): Promise<{
  user: AuthUser;
  sessionToken: string;
} | null> {
  try {
    const token = await SecureStore.getItemAsync(SESSION_KEY);
    const userRaw = await SecureStore.getItemAsync(USER_KEY);
    if (!token || !userRaw) return null;

    const user: AuthUser = JSON.parse(userRaw);
    if (!user.id || !user.email) return null;

    return { user, sessionToken: token };
  } catch {
    return null;
  }
}

export async function clearPersistedSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // ignore
  }
}

export async function getSessionToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
