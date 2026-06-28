import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Play, Square, MapPin } from "lucide-react-native";
import { useGetRunningTimers, useGetTimerEvents } from "@/http/services";
import { useMutationHandler } from "@/hooks/mutation";
import { useLocationSnapshot } from "@/hooks/use-location";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys } from "@/http/services";

interface ComJobcardTimerProps {
  jobcardId: number;
  technicianId?: number | null;
}

export default function ComJobcardTimer({
  jobcardId,
  technicianId,
}: ComJobcardTimerProps) {
  const { data: runningTimers, refetch: refetchRunning } =
    useGetRunningTimers();
  const { data: timerEvents } = useGetTimerEvents();
  const { getSnapshot, startPeriodicUpdates, stopPeriodicUpdates } =
    useLocationSnapshot();

  const activeTimer = useMemo(() => {
    return (runningTimers ?? []).find(
      (t) =>
        t.jobcard_id === jobcardId &&
        t.technician_id === technicianId &&
        !t.end_time,
    );
  }, [runningTimers, jobcardId, technicianId]);

  const currentEventName = useMemo(() => {
    if (!activeTimer?.event_id) return null;
    return timerEvents?.find((e) => e.id === activeTimer.event_id)?.name;
  }, [activeTimer, timerEvents]);

  const { handleMutation: startTimer, isPending: isStarting } =
    useMutationHandler({
      route: HimoinsaAPI.api_timers_start,
      method: "POST",
      success_message: "Timer started.",
      query_keys: [
        QueryKeys.timers_running,
        QueryKeys.jobcards_show(String(jobcardId)),
      ],
      onSuccess: () => refetchRunning(),
    });

  const { handleMutation: stopTimer, isPending: isStopping } =
    useMutationHandler({
      route: HimoinsaAPI.api_timers_stop,
      method: "POST",
      success_message: "Timer stopped.",
      query_keys: [
        QueryKeys.timers_running,
        QueryKeys.jobcards_show(String(jobcardId)),
      ],
      onSuccess: () => refetchRunning(),
    });

  async function handleStart() {
    const pos = await getSnapshot();
    startPeriodicUpdates(60000);
    startTimer({
      jobcard_id: jobcardId,
      ...(pos ? { lat: pos.lat, lng: pos.lng } : {}),
    });
  }

  async function handleStop() {
    if (!activeTimer) return;
    stopPeriodicUpdates();
    const pos = await getSnapshot();
    stopTimer({
      timer_id: activeTimer.id,
      ...(pos ? { lat: pos.lat, lng: pos.lng } : {}),
    });
  }

  if (!technicianId) return null;

  return (
    <View className="flex flex-row items-center gap-3">
      {activeTimer ? (
        <>
          <View className="flex-1">
            <Text className="text-sm text-muted-foreground">Timer running</Text>
            {currentEventName && (
              <Text className="text-foreground font-medium">
                {currentEventName}
              </Text>
            )}
          </View>
          <Button
            action="negative"
            onPress={handleStop}
            isDisabled={isStopping}
            className="flex-row items-center gap-2"
          >
            <Square size={16} color="white" />
            <ButtonText>{isStopping ? "Stopping..." : "Stop Timer"}</ButtonText>
          </Button>
        </>
      ) : (
        <Button
          action="positive"
          onPress={handleStart}
          isDisabled={isStarting}
          className="flex-row items-center gap-2"
        >
          <Play size={16} color="white" />
          <ButtonText>{isStarting ? "Starting..." : "Start Timer"}</ButtonText>
        </Button>
      )}
    </View>
  );
}
