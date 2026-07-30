import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Play, Square, Timer } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useGetRunningTimers } from "@/http/services";
import { useMutationHandler } from "@/hooks/mutation";
import { useLocationSnapshot } from "@/hooks/use-location";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
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

  const elapsed = useElapsedTime(
    activeTimer?.event_timestamp ?? activeTimer?.start_time,
  );

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
    <View>
      {activeTimer ? (
        <View className="w-full items-center gap-3">
          <View className="flex-row items-center gap-2">
            <Icon as={Timer} size="lg" className="text-primary" />
            <Text className="text-sm text-text-muted">Timer running</Text>
          </View>
          <Text className="font-mono text-4xl font-bold text-primary tabular-nums">
            {elapsed}
          </Text>
          <Button
            action="negative"
            onPress={handleStop}
            isDisabled={isStopping}
            className="flex-row items-center gap-2"
          >
            <Square size={16} color="white" />
            <ButtonText>{isStopping ? "Stopping..." : "Stop Timer"}</ButtonText>
          </Button>
        </View>
      ) : (
        <Button
          action="positive"
          onPress={handleStart}
          isDisabled={isStarting}
          className="w-full flex-row items-center gap-2"
        >
          <Play size={16} color="white" />
          <ButtonText>{isStarting ? "Starting..." : "Start Timer"}</ButtonText>
        </Button>
      )}
    </View>
  );
}
