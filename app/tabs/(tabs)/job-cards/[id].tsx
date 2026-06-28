import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetJobcardShow,
  useGetRunningTimers,
  useGetTimerEvents,
} from "@/http/services";
import ComJobcardDetailReadonly from "@/components/page-jobcards/com-jobcard-detail-readonly";
import ComJobcardTimer from "@/components/page-jobcards/com-jobcard-timer";
import ModCompleteJobcard from "@/components/page-jobcards/mod-complete-jobcard";
import ErrorScreen from "@/components/placeholders/error-screen";

export default function JobCardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const technicianId = user?.technician_id;

  const {
    data: jobcard,
    isLoading,
    error,
    refetch,
  } = useGetJobcardShow(id ?? null);

  useGetRunningTimers();
  useGetTimerEvents();

  const isAssigned = useMemo(() => {
    if (!jobcard || !technicianId) return false;
    if (jobcard.technician_id === technicianId) return true;
    return (
      jobcard.technicians?.some((t) => t.technician_id === technicianId) ??
      false
    );
  }, [jobcard, technicianId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="text-2xl font-bold text-foreground mb-4">
          Jobcard Detail
        </Text>

        <ErrorScreen error={error} refetch={refetch} />

        {jobcard && (
          <>
            <View className="mb-4">
              <ComJobcardTimer
                jobcardId={jobcard.id}
                technicianId={technicianId}
              />
            </View>

            {isAssigned && (
              <View className="mb-4">
                <ModCompleteJobcard jobcard={jobcard} />
              </View>
            )}

            <ComJobcardDetailReadonly jobcard={jobcard} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
