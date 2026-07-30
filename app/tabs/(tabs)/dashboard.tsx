import React from "react";
import { ScrollView, View, RefreshControl, Pressable } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Plus, Timer, Clock, Square } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetDashboardStats,
  useGetJobcardsList,
  useGetRunningTimers,
  QueryKeys,
} from "@/http/services";
import ComDashboardStats from "@/components/page-dashboard/com-dashboard-stats";
import ComDashboardJobcards from "@/components/page-dashboard/com-dashboard-jobcards";
import ErrorScreen from "@/components/placeholders/error-screen";
import { useElapsedTime } from "@/hooks/use-elapsed-time";
import { useMutationHandler } from "@/hooks/mutation";
import { useLocationSnapshot } from "@/hooks/use-location";
import { HimoinsaAPI } from "@/http/actions";

function ActiveTimerBanner() {
  const { data: timers, refetch: refetchRunning } = useGetRunningTimers();
  const activeTimer = timers?.[0];
  const elapsed = useElapsedTime(
    activeTimer?.event_timestamp ?? activeTimer?.start_time,
  );
  const { stopPeriodicUpdates, getSnapshot } = useLocationSnapshot();
  const router = useRouter();

  const { handleMutation: stopTimer, isPending: isStopping } =
    useMutationHandler({
      route: HimoinsaAPI.api_timers_stop,
      method: "POST",
      success_message: "Timer stopped.",
      query_keys: [QueryKeys.timers_running],
      onSuccess: () => refetchRunning(),
    });

  async function handleStop() {
    if (!activeTimer) return;
    stopPeriodicUpdates();
    const pos = await getSnapshot();
    stopTimer({
      timer_id: activeTimer.id,
      ...(pos ? { lat: pos.lat, lng: pos.lng } : {}),
    });
  }

  if (!activeTimer) return null;

  const jcLabel =
    activeTimer.jobcard?.jc_number ?? `JC #${activeTimer.jobcard_id}`;
  const jcId = activeTimer.jobcard_id;

  function handlePress() {
    router.push(`/tabs/job-cards/${jcId}` as any);
  }

  return (
    <Card className="p-4 mb-4">
      <View className="items-center gap-3">
        <View className="flex-row items-center gap-2">
          <Icon as={Timer} size="lg" className="text-primary" />
          <Text className="text-sm text-text-muted">Timer running on</Text>
          <Pressable onPress={handlePress}>
            <Text className="text-sm font-semibold text-primary underline">
              {jcLabel}
            </Text>
          </Pressable>
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
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const technicianId = user?.technician_id;

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetDashboardStats();

  const {
    data: jobcards,
    isLoading: listLoading,
    error: listError,
    refetch: refetchJobcards,
  } = useGetJobcardsList({
    technician_id: technicianId ? [technicianId] : null,
  } as any);

  function handlePress(id: number) {
    router.push(`/tabs/job-cards/${id}` as any);
  }

  function handleRefresh() {
    refetchStats();
    refetchJobcards();
  }

  function handleCreate() {
    router.push("/tabs/job-cards/create" as any);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={statsLoading || listLoading}
            onRefresh={handleRefresh}
          />
        }
      >
        <Text className="text-2xl font-bold text-text mb-4">Dashboard</Text>

        <ErrorScreen error={statsError ?? listError} refetch={handleRefresh} />

        <ActiveTimerBanner />

        <View className="mt-4">
          <ComDashboardStats stats={stats} isLoading={statsLoading} />
        </View>

        <View className="my-4">
          <Button onPress={handleCreate}>
            <ButtonIcon as={Plus} className="mr-1" />
            <ButtonText>Open New Jobcard</ButtonText>
          </Button>
        </View>

        <ComDashboardJobcards jobcards={jobcards ?? []} onPress={handlePress} />
      </ScrollView>
    </SafeAreaView>
  );
}
