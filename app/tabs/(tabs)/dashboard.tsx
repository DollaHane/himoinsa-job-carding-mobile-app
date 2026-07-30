import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import CardGroup from "@/components/ui/groups/card-group";
import { Plus, Timer, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetDashboardStats,
  useGetJobcardsList,
  useGetRunningTimers,
} from "@/http/services";
import ComDashboardStats from "@/components/page-dashboard/com-dashboard-stats";
import ComDashboardJobcards from "@/components/page-dashboard/com-dashboard-jobcards";
import ErrorScreen from "@/components/placeholders/error-screen";
import { formatSeconds } from "@/lib/helpers/date-functions";

function ActiveTimerBanner() {
  const { data: timers } = useGetRunningTimers();
  const activeTimer = timers?.[0];
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!activeTimer) {
      setElapsed(0);
      return;
    }

    function tick() {
      const start = new Date(activeTimer!.start_time).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - start) / 1000));
      setElapsed(diff);
    }

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTimer?.id, activeTimer?.start_time]);

  if (!activeTimer) return null;

  return (
    <CardGroup title="Active Timer" icon={Timer}>
      <View className="flex-row items-center gap-3">
        <Icon as={Clock} size="lg" className="text-primary" />
        <View>
          <Text className="text-text-muted text-sm">JC #{activeTimer.jobcard_id}</Text>
          <Text className="text-2xl font-bold text-primary">
            {formatSeconds(elapsed)}
          </Text>
        </View>
      </View>
    </CardGroup>
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
