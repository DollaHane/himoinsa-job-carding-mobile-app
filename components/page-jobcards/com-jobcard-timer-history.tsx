import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useGetTimerEvents } from "@/http/services";
import type { TimerJobcard } from "@/types/timer-jobcard";

interface ComJobcardTimerHistoryProps {
  timers: TimerJobcard[];
}

export default function ComJobcardTimerHistory({
  timers,
}: ComJobcardTimerHistoryProps) {
  const { data: timerEvents } = useGetTimerEvents();

  const toDate = (unixSeconds?: string | number | null): Date | null => {
    if (unixSeconds == null) return null;
    const s = Number(unixSeconds);
    if (isNaN(s)) return null;
    return new Date(s * 1000);
  };

  const formatTime = (unixSeconds?: string | number | null): string => {
    const d = toDate(unixSeconds);
    if (!d) return "-";
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (unixSeconds?: string | number | null): string => {
    const d = toDate(unixSeconds);
    if (!d) return "";
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const getDuration = (
    start?: string | number | null,
    end?: string | number | null,
  ): string => {
    if (start == null || end == null) return "-";
    const s = Number(start);
    const e = Number(end);
    if (isNaN(s) || isNaN(e)) return "-";
    const delta = e - s; // seconds
    if (delta < 0) return "-";
    const h = Math.floor(delta / 3600);
    const m = Math.floor((delta % 3600) / 60);
    const se = delta % 60;
    return `${h}h ${m}m ${se}s`;
  };

  const getEventName = (timer: TimerJobcard) => {
    if (timer.event?.name) return timer.event.name;
    if (timer.event_id && timerEvents) {
      return timerEvents.find((e) => e.id === timer.event_id)?.name ?? "";
    }
    return "";
  };

  if (!timers || timers.length === 0) {
    return (
      <View className="py-3">
        <Text className="text-text-muted text-sm">No timer history</Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {timers.map((timer) => (
        <Card key={timer.id} className="p-3 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-text font-medium">
              {getEventName(timer) || "Timer"}
            </Text>
            <Text className="text-text-muted text-xs">
              {formatDate(timer.start_time) || formatDate(timer.created_at)}
            </Text>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-text-muted text-xs">Started</Text>
              <Text className="text-text text-sm">
                {formatTime(timer.start_time)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-muted text-xs">Ended</Text>
              <Text className="text-text text-sm">
                {formatTime(timer.end_time)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-muted text-xs">Duration</Text>
              <Text className="text-text text-sm">
                {getDuration(timer.start_time, timer.end_time)}
              </Text>
            </View>
          </View>

          {(timer.lat != null || timer.lng != null) && (
            <Text className="text-text-muted text-xs">
              {timer.lat != null && !isNaN(Number(timer.lat)) && `Lat: ${Number(timer.lat).toFixed(5)}`}
              {timer.lng != null && !isNaN(Number(timer.lng)) && `  Lng: ${Number(timer.lng).toFixed(5)}`}
            </Text>
          )}
        </Card>
      ))}
    </View>
  );
}
