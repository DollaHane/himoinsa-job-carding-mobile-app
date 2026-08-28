import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { pingTechnicianLocation } from "@/http/actions";

export const LOCATION_TASK_NAME = "himoinsa-technician-location-task";

// Registered at module scope (imported for its side effect from
// app/_layout.tsx) so the OS can wake and re-evaluate this task even when
// the app was relaunched headlessly purely to service a location update —
// a task defined inside a component would never be reachable in that case.
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) return;

  const locations = (data as { locations?: Array<Location.LocationObject> } | undefined)
    ?.locations;
  const loc = locations?.[locations.length - 1];
  if (!loc) return;

  try {
    await pingTechnicianLocation(
      loc.coords.latitude,
      loc.coords.longitude,
      loc.coords.accuracy ?? undefined,
    );
  } catch {
    // Swallow — the next tick retries with a fresher fix regardless.
  }
});

/**
 * Starts continuous location pinging, including while the app is
 * backgrounded — the technician's location should be visible to dispatch
 * whenever they're logged in, on whichever device, not just while a timer
 * is running or the app is in the foreground.
 */
export async function startBackgroundLocationTracking(): Promise<boolean> {
  try {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.status !== "granted") return false;

    const background = await Location.requestBackgroundPermissionsAsync();
    if (background.status !== "granted") return false;

    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
      return true;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 60000,
      distanceInterval: 25,
      foregroundService: {
        notificationTitle: "Himoinsa Workshop",
        notificationBody: "Sharing your location while you're logged in.",
      },
      showsBackgroundLocationIndicator: true,
      pausesUpdatesAutomatically: false,
    });

    return true;
  } catch {
    // Never throw: a missing Info.plist usage-description (stale dev-client
    // build) or a denied OS permission must not crash the app on login.
    return false;
  }
}

export async function stopBackgroundLocationTracking(): Promise<void> {
  try {
    if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch {
    // ignore — nothing to clean up.
  }
}
