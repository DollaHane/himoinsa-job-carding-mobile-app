import React from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboardStats, useGetJobcardsList } from "@/http/services";
import ComDashboardStats from "@/components/page-dashboard/com-dashboard-stats";
import ComDashboardJobcards from "@/components/page-dashboard/com-dashboard-jobcards";
import ModCreateQuickJobcard from "@/components/page-dashboard/mod-create-quick-jobcard";
import ErrorScreen from "@/components/placeholders/error-screen";

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
        <Text className="text-2xl font-bold text-foreground mb-4">
          Dashboard
        </Text>

        <ErrorScreen error={statsError ?? listError} refetch={handleRefresh} />

        <ComDashboardStats stats={stats} />

        <View className="my-4">
          <ModCreateQuickJobcard />
        </View>

        <ComDashboardJobcards jobcards={jobcards ?? []} onPress={handlePress} />
      </ScrollView>
    </SafeAreaView>
  );
}
