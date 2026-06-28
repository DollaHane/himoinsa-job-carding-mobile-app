import React, { useMemo } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetJobcardShow,
  useGetRunningTimers,
  useGetTimerEvents,
} from "@/http/services";
import ComJobcardDetailReadonly from "@/components/page-jobcards/com-jobcard-detail-readonly";
import ComJobcardTimer from "@/components/page-jobcards/com-jobcard-timer";
import { Button, ButtonText } from "@/components/ui/button";
import ErrorScreen from "@/components/placeholders/error-screen";

export default function JobCardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
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

  const isCompleted = useMemo(() => {
    if (!jobcard?.status?.name) return false;
    return jobcard.status.name.toLowerCase() === "completed";
  }, [jobcard]);

  const showComplete = isAssigned && !isCompleted;

  const jobcardLabel = jobcard
    ? `JC #${jobcard.jc_number ?? jobcard.id}`
    : "Jobcard Detail";

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: jobcardLabel,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-4 p-1">
              <Icon as={ArrowLeft} size="lg" className="text-foreground" />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ErrorScreen error={error} refetch={refetch} />

        {jobcard && (
          <>
            <View className="mb-4">
              <ComJobcardTimer
                jobcardId={jobcard.id}
                technicianId={technicianId}
              />
            </View>

            {showComplete && (
              <View className="mb-4">
                <Button
                  action="positive"
                  onPress={() =>
                    router.push(`/tabs/job-cards/${id}/complete` as any)
                  }
                  className="w-full"
                >
                  <ButtonText>Complete Jobcard</ButtonText>
                </Button>
              </View>
            )}

            <ComJobcardDetailReadonly jobcard={jobcard} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
