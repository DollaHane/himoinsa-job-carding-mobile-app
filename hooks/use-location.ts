import { useState, useCallback, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { AppState, AppStateStatus } from "react-native";

interface LocationResult {
  lat: number;
  lng: number;
}

export function useLocationSnapshot() {
  const [permission, setPermission] = useState(false);
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          if (intervalRef.current) {
            startPeriodicUpdates();
          }
        } else if (nextState.match(/inactive|background/)) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
        appStateRef.current = nextState;
      },
    );
    return () => sub.remove();
  }, []);

  async function requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermission(status === "granted");
    } catch {
      setPermission(false);
    }
  }

  const getSnapshot = useCallback(async (): Promise<LocationResult | null> => {
    if (!permission) {
      setError("Location permission not granted.");
      return null;
    }
    try {
      setPending(true);
      setError(null);
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const result: LocationResult = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setLocation(result);
      return result;
    } catch (err: any) {
      setError(err?.message ?? "Failed to get location.");
      return null;
    } finally {
      setPending(false);
    }
  }, [permission]);

  function startPeriodicUpdates(intervalMs = 60000) {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      getSnapshot();
    }, intervalMs);
  }

  function stopPeriodicUpdates() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return {
    permission,
    location,
    error,
    pending,
    getSnapshot,
    startPeriodicUpdates,
    stopPeriodicUpdates,
  };
}
