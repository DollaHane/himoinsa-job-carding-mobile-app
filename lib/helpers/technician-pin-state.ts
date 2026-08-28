// >10 min since the last ping is treated as stale — the technician may have
// lost signal or backgrounded the app without it telling us.
const STALE_AFTER_MS = 10 * 60_000;

// A fix this coarse is IP/network-based, not GPS/WiFi — still shown, but
// marked "approximate" rather than presented as precise.
export const IMPRECISE_ACCURACY_METERS = 50_000;

export interface TechnicianPinState {
  color: string;
  label: string;
  isStale: boolean;
  isImprecise: boolean;
  showEta: boolean;
  showRoute: boolean;
}

export function resolveTechnicianPinState(params: {
  eventName: string | null;
  locationUpdatedAt: string | null | undefined;
  accuracyMeters?: number | null;
  isCompleted: boolean;
  isCancelled: boolean;
}): TechnicianPinState {
  const {
    eventName,
    locationUpdatedAt,
    accuracyMeters,
    isCompleted,
    isCancelled,
  } = params;

  const isStale =
    !locationUpdatedAt ||
    Date.now() - new Date(locationUpdatedAt).getTime() > STALE_AFTER_MS;
  const isImprecise =
    !!accuracyMeters && accuracyMeters > IMPRECISE_ACCURACY_METERS;

  if (isCompleted || isCancelled) {
    return {
      color: "#94a3b8",
      label: isCompleted ? "Completed" : "Cancelled",
      isStale,
      isImprecise,
      showEta: false,
      showRoute: false,
    };
  }

  if (eventName === "On The Way") {
    return {
      color: "#3b82f6",
      label: "On The Way",
      isStale,
      isImprecise,
      showEta: true,
      showRoute: true,
    };
  }

  if (eventName === "Arrived") {
    return {
      color: "#10b981",
      label: "Arrived",
      isStale,
      isImprecise,
      showEta: false,
      showRoute: false,
    };
  }

  if (eventName === "Started" || eventName === "Resumed") {
    return {
      color: "#22c55e",
      label: "Working",
      isStale,
      isImprecise,
      showEta: false,
      showRoute: false,
    };
  }

  if (eventName === "Paused") {
    return {
      color: "#f59e0b",
      label: "Paused",
      isStale,
      isImprecise,
      showEta: false,
      showRoute: false,
    };
  }

  return {
    color: "#94a3b8",
    label: "Idle",
    isStale,
    isImprecise,
    showEta: false,
    showRoute: false,
  };
}
