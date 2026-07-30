import { Platform } from "react-native";
import { config } from "@/app-config";
import {
  getSessionToken,
  getSessionUser,
  clearPersistedSession,
  persistSession,
} from "@/providers/Auth/AuthStorage";

let storedRouter: { replace: (path: any) => void } | null = null;

export function setNavigateForAuth(router: { replace: (path: any) => void }) {
  storedRouter = router;
}

export const domain = config.domain || "http://localhost:3000/";

export interface DeviceFingerprint {
  user_agent: string;
  language: string;
  timezone: string;
  screen_resolution: string;
  color_depth: number;
  platform: string;
}

export type DocumentName = string | null | undefined;

export type METHOD = "POST" | "GET" | "PUT" | "DELETE";

export type ResponseAction =
  | "account_inactive"
  | "invalid_credentials"
  | "validation_error"
  | "verify_device"
  | "device_error"
  | "redirect_to_login";

export const apiFetch = async (
  url: string,
  method: METHOD,
  payload?: Record<string, any>,
  headers?: Record<string, string>,
) => {
  const sessionToken = await getSessionToken();
  const sessionUser = await getSessionUser();
  const fullUrl = `${config.backend_domain}${url}`;
  const hasToken = !!sessionToken;

  const response = await fetch(fullUrl, {
    method,
    body:
      method !== "DELETE" && method !== "GET" && payload
        ? JSON.stringify(payload)
        : undefined,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Device-Fingerprint": JSON.stringify(getDeviceFingerprint()),
      ...(sessionUser ? { "X-Session-User": JSON.stringify(sessionUser) } : {}),
      ...(sessionToken ? { "X-Session-Token": sessionToken } : {}),
      ...headers,
    },
  });

  const newToken = response.headers.get("X-Session-Token");
  if (newToken && sessionUser) {
    try {
      await persistSession(sessionUser, newToken);
    } catch {}
  }

  if (response.status === 401 && hasToken) {
    await clearPersistedSession();
    if (storedRouter) storedRouter.replace("/");
  }

  return response;
};

export const getDeviceFingerprint = (): DeviceFingerprint => ({
  user_agent: `MobileApp/${Platform.OS}`,
  language: Intl.DateTimeFormat().resolvedOptions().locale,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  screen_resolution: `${0}x${0}`,
  color_depth: 24,
  platform: Platform.OS,
});

export const getDocumentPath = {
  user: (file_name: DocumentName) =>
    `${config.backend_domain}user/${file_name}`,
};
