import { config } from "@/app-config";
import {
  getSessionToken,
  clearPersistedSession,
} from "@/providers/Auth/AuthStorage";

let storedRouter: { replace: (path: any) => void } | null = null;

export function setNavigateForAuth(router: { replace: (path: any) => void }) {
  storedRouter = router;
}

export const domain = config.domain || "http://localhost:3000/";

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
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...headers,
    },
  });

  if (response.status === 401 && hasToken) {
    await clearPersistedSession();
    if (storedRouter) storedRouter.replace("/");
  }

  return response;
};

export const getDocumentPath = {
  user: (file_name: DocumentName) =>
    `${config.backend_domain}user/${file_name}`,
};
