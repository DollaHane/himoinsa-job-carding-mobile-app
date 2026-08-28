import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import MapView, { Marker, Polyline, Circle } from "react-native-maps";
import { Text } from "@/components/ui/text";
import { useGetJobcardEta, useGetTechnicianLocations } from "@/http/services";
import { useLocationSnapshot } from "@/hooks/use-location";
import { useAuth } from "@/contexts/AuthContext";
import { decodePolyline } from "@/lib/helpers/polyline";
import { resolveTechnicianPinState } from "@/lib/helpers/technician-pin-state";
import type { Jobcard } from "@/types/jobcard";

interface MapPoint {
  key: string;
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export default function ComJobcardMap({ jobcard }: { jobcard: Jobcard }) {
  const { user } = useAuth();
  const myTechnicianId = user?.technician_id ?? null;
  const { location: myLocation, getSnapshot } = useLocationSnapshot();

  // Grab an accurate device-GPS fix as soon as the map opens — this is the
  // technician's own position, sourced from the phone directly, so it never
  // depends on the backend "technician-location" read permission.
  useEffect(() => {
    getSnapshot();
  }, [getSnapshot]);

  const mapPoints = useMemo<MapPoint[]>(() => {
    const points: MapPoint[] = [];

    for (const a of jobcard.assets ?? []) {
      const loc = a.asset_location;
      if (loc?.lat != null && loc?.lng != null) {
        points.push({
          key: `asset-${a.id}`,
          latitude: Number(loc.lat),
          longitude: Number(loc.lng),
          name: loc.name || a.asset?.description || a.asset?.fleet_number,
          address: loc.address,
        });
      }
    }

    // Fall back to the customer's chosen location so the map isn't empty
    // when the assets have no registered site coordinates.
    const customerLoc = jobcard.location_customer;
    if (
      points.length === 0 &&
      customerLoc?.lat != null &&
      customerLoc?.lng != null
    ) {
      points.push({
        key: "customer-location",
        latitude: Number(customerLoc.lat),
        longitude: Number(customerLoc.lng),
        name:
          customerLoc.name ||
          jobcard.customer?.company_name ||
          "Customer Location",
        address: customerLoc.address ?? undefined,
      });
    }

    return points;
  }, [jobcard]);

  const technicianIds = useMemo(
    () => (jobcard.technicians ?? []).map((t) => t.technician_id),
    [jobcard],
  );

  const onTheWayTechnicianIds = useMemo(() => {
    return new Set(
      (jobcard.timers ?? [])
        .filter((t) => !t.end_time && t.event?.name === "On The Way")
        .map((t) => t.technician_id),
    );
  }, [jobcard]);

  const showEta = onTheWayTechnicianIds.size > 0;

  const { data: technicianLocations } = useGetTechnicianLocations(
    technicianIds,
    technicianIds.length > 0,
  );

  const { data: etaResponse } = useGetJobcardEta(jobcard.id, showEta);
  const eta = etaResponse?.data ?? null;

  const isCompleted = jobcard.status?.name?.toLowerCase() === "completed";
  const isCancelled = jobcard.status?.name?.toLowerCase() === "cancelled";

  const initialRegion = useMemo(() => {
    if (mapPoints.length > 0) {
      return {
        latitude: mapPoints[0].latitude,
        longitude: mapPoints[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return undefined;
  }, [mapPoints]);

  const hasAnything =
    mapPoints.length > 0 ||
    (technicianLocations?.length ?? 0) > 0 ||
    !!myLocation;

  if (!hasAnything) {
    return (
      <View className="h-40 items-center justify-center rounded-lg border border-border bg-background-subtle">
        <Text className="text-sm text-text-muted">No location available</Text>
      </View>
    );
  }

  return (
    <View className="overflow-hidden rounded-lg border border-border">
      <MapView
        style={{ width: "100%", height: 220 }}
        initialRegion={initialRegion}
      >
        {mapPoints.map((p) => (
          <Marker
            key={p.key}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={p.address}
            pinColor="red"
          />
        ))}

        {(technicianLocations ?? []).map((loc) => {
          // The logged-in technician's own position comes from the device
          // GPS below (always accurate, no backend permission needed), so
          // skip their backend-pinged entry to avoid a duplicate dot.
          if (loc.technician_id === myTechnicianId) return null;

          const pin = resolveTechnicianPinState({
            eventName: onTheWayTechnicianIds.has(loc.technician_id)
              ? "On The Way"
              : null,
            locationUpdatedAt: loc.updated_at,
            accuracyMeters: loc.accuracy_meters,
            isCompleted,
            isCancelled,
          });

          return (
            <React.Fragment key={loc.technician_id}>
              {pin.isImprecise && loc.accuracy_meters ? (
                <Circle
                  center={{ latitude: loc.lat, longitude: loc.lng }}
                  radius={loc.accuracy_meters}
                  strokeColor="#3b82f6"
                  strokeWidth={1}
                  fillColor="rgba(59,130,246,0.1)"
                />
              ) : null}
              <Marker
                coordinate={{ latitude: loc.lat, longitude: loc.lng }}
                title={pin.label}
              >
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: pin.color,
                    borderWidth: 2,
                    borderColor: pin.color,
                    borderStyle: pin.isImprecise ? "dashed" : "solid",
                  }}
                />
              </Marker>
            </React.Fragment>
          );
        })}

        {myLocation && (
          <Marker
            coordinate={{ latitude: myLocation.lat, longitude: myLocation.lng }}
            title="You"
          >
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: "#3b82f6",
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.95)",
              }}
            />
          </Marker>
        )}

        {eta?.destination && (
          <Marker
            coordinate={{
              latitude: eta.destination.lat,
              longitude: eta.destination.lng,
            }}
            pinColor="red"
          />
        )}

        {eta?.polyline && (
          <Polyline
            coordinates={decodePolyline(eta.polyline)}
            strokeColor="#3b82f6"
            strokeWidth={4}
          />
        )}
      </MapView>

      {eta && (
        <View className="flex-row items-center gap-2 px-3 py-2">
          <Text className="text-xs font-medium text-info">
            ETA: {eta.eta_minutes} min
          </Text>
        </View>
      )}
    </View>
  );
}
