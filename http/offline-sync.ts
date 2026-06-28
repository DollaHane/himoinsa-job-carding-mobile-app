import { useCallback } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Network from "expo-network";
import Toast from "react-native-toast-message";
import {
  enqueuePending,
  getPendingQueue,
  removePending,
  incrementRetry,
  type PendingRecord,
  type PendingType,
} from "@/http/offline-queue";
import { apiFetch, HimoinsaAPI } from "@/http";
import { useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/http/services";

export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    return state.isConnected ?? false;
  } catch {
    return false;
  }
}

export function useOfflineMutation(type: PendingType) {
  const route =
    type === "create"
      ? HimoinsaAPI.api_jobcards_store
      : HimoinsaAPI.api_jobcards_complete;

  const method = "POST";

  const enqueue = useCallback(
    async (payload: Record<string, any>) => {
      const online = await isOnline();
      if (online) {
        return await apiFetch(route, method, payload);
      }

      await enqueuePending(type, payload);
      Toast.show({
        type: "success",
        text1: "Saved offline",
        text2:
          type === "create"
            ? "Jobcard queued and will sync when connection returns."
            : "Completion queued and will sync when connection returns.",
      });
      return null;
    },
    [route, type],
  );

  return enqueue;
}

export async function syncPendingQueue(
  queryClient: ReturnType<typeof useQueryClient>,
): Promise<void> {
  const online = await isOnline();
  if (!online) return;

  const pending = await getPendingQueue();
  if (pending.length === 0) return;

  let synced = 0;
  for (const record of pending) {
    try {
      const payload = JSON.parse(record.payload);
      const route =
        record.type === "create"
          ? HimoinsaAPI.api_jobcards_store
          : `${HimoinsaAPI.api_jobcards_complete}/${payload.id ?? ""}`;

      const response = await apiFetch(
        route,
        "POST",
        record.type === "complete"
          ? Object.fromEntries(
              Object.entries(payload).filter(([k]) => k !== "id"),
            )
          : payload,
      );

      if (response.ok) {
        await removePending(record.id);
        synced++;
      } else {
        await incrementRetry(record.id);
      }
    } catch {
      await incrementRetry(record.id);
    }
  }

  if (synced > 0) {
    queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
    queryClient.invalidateQueries({ queryKey: QueryKeys.timers_running });
    Toast.show({
      type: "success",
      text1: "Synced",
      text2: `${synced} pending item(s) synced.`,
    });
  }
}

let appStateRef = AppState.currentState;

export function registerSyncOnForeground(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  let currentState: string = AppState.currentState;
  const sub = AppState.addEventListener(
    "change",
    (nextState: AppStateStatus) => {
      if (/inactive|background/.test(currentState) && nextState === "active") {
        syncPendingQueue(queryClient);
      }
      currentState = nextState;
    },
  );
  return () => sub.remove();
}
