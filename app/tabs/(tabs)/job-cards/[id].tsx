import React, { useMemo, useState } from "react";
import { ScrollView, View, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useGetJobcardShow } from "@/http/services";
import ComJobcardTimer from "@/components/page-jobcards/com-jobcard-timer";
import ComJobcardTimerHistory from "@/components/page-jobcards/com-jobcard-timer-history";
import { Button, ButtonText } from "@/components/ui/button";
import CardGroup from "@/components/ui/groups/card-group";
import InfoGroup from "@/components/ui/groups/info-group";
import { formatDateLabel } from "@/lib/helpers/date-functions";
import ErrorScreen from "@/components/placeholders/error-screen";
import type { Jobcard } from "@/types/jobcard";
import {
  Hash,
  FileText,
  Briefcase,
  Calendar,
  Building2,
  Wrench,
  ClipboardList,
  Boxes,
} from "lucide-react-native";

const TABS = ["Timer", "Assets", "Tasks", "Inventory"] as const;

function BasicDetails({ jobcard }: { jobcard: Jobcard }) {
  return (
    <CardGroup title="Jobcard" icon={Hash}>
      <View className="flex flex-col gap-2">
        <InfoGroup
          label="JC Number"
          data={jobcard.jc_number ?? `JC #${jobcard.id}`}
          icon={Hash}
        />
        <InfoGroup
          label="Work Description"
          data={jobcard.work_description}
          icon={FileText}
        />
        <InfoGroup
          label="Service Type"
          data={jobcard.service_type?.name}
          icon={Briefcase}
        />
        <InfoGroup
          label="Scheduled"
          data={
            jobcard.scheduled_datetime
              ? formatDateLabel(jobcard.scheduled_datetime)
              : "Not scheduled"
          }
          icon={Calendar}
        />
      </View>
    </CardGroup>
  );
}

function CustomerDetails({ jobcard }: { jobcard: Jobcard }) {
  return (
    <CardGroup title="Customer" icon={Building2}>
      <InfoGroup
        label="Company"
        data={jobcard.customer?.company_name}
        icon={Building2}
      />
      <InfoGroup
        label="Contract"
        data={jobcard.contract?.contract_number ?? "N/A"}
        icon={FileText}
      />
    </CardGroup>
  );
}

function AssetsTab({ jobcard }: { jobcard: Jobcard }) {
  if (!jobcard.assets || jobcard.assets.length === 0) {
    return <Text className="text-text-muted py-4">No assets linked.</Text>;
  }
  return (
    <View className="py-2">
      {jobcard.assets.map((asset, index) => (
        <View key={asset.id} className="flex-row items-center justify-between py-3 border-b border-border">
          <View className="flex-1">
            <Text className="text-text">
              {asset.asset?.fleet_number ??
                asset.asset?.description ??
                `Asset ${index + 1}`}
            </Text>
            {asset.asset?.description && (
              <Text className="text-xs text-text-muted">{asset.asset.description}</Text>
            )}
          </View>
          <Text className="text-xs text-text-muted">{asset.asset_type ?? ""}</Text>
        </View>
      ))}
    </View>
  );
}

function TasksTab({ jobcard }: { jobcard: Jobcard }) {
  if (!jobcard.tasks || jobcard.tasks.length === 0) {
    return <Text className="text-text-muted py-4">No tasks.</Text>;
  }
  return (
    <View className="py-2">
      {jobcard.tasks.map((task) => (
        <View key={task.id} className="py-3 border-b border-border">
          <Text className="text-text">
            {task.task_step}. {task.description}
          </Text>
          <View className="flex-row gap-4 mt-1">
            <Text className="text-xs text-text-muted">{task.status ?? "Pending"}</Text>
            {task.duration != null && (
              <Text className="text-xs text-text-muted">
                {Math.floor(task.duration / 3600)}h{" "}
                {Math.floor((task.duration % 3600) / 60)}m
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function InventoryTab({ jobcard }: { jobcard: Jobcard }) {
  if (!jobcard.inventory || jobcard.inventory.length === 0) {
    return <Text className="text-text-muted py-4">No inventory.</Text>;
  }
  return (
    <View className="py-2">
      {jobcard.inventory.map((item) => (
        <View key={item.id} className="py-3 border-b border-border">
          <Text className="text-text">
            {item.inventory?.stock_code ?? `Item #${item.inventory_id}`}
          </Text>
          <View className="flex-row gap-4 mt-1">
            <Text className="text-xs text-text-muted">
              Req: {item.quantity_requested ?? 0}
            </Text>
            {item.quantity_used != null && (
              <Text className="text-xs text-text-muted">
                Used: {item.quantity_used}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function JobCardDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const technicianId = user?.technician_id;
  const [tab, setTab] = useState<number>(0);

  const {
    data: jobcard,
    isLoading,
    error,
    refetch,
  } = useGetJobcardShow(id ?? null);

  const isAssigned = useMemo(() => {
    if (!jobcard || !technicianId) return false;
    if (jobcard.technician_id === technicianId) return true;
    return (
      jobcard.technicians?.some((t) => t.technician_id === technicianId) ?? false
    );
  }, [jobcard, technicianId]);

  const isCompleted = useMemo(() => {
    if (!jobcard?.status?.name) return false;
    return jobcard.status.name.toLowerCase() === "completed";
  }, [jobcard]);

  const showComplete = isAssigned && !isCompleted;

  const jobcardLabel = jobcard
    ? `${jobcard.jc_number ?? jobcard.id}`
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
          headerShown: false,
        }}
      />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center gap-3 py-4">
          <Pressable onPress={() => router.back()} className="p-1">
            <Icon as={ArrowLeft} size="lg" className="text-text" />
          </Pressable>
          <Text className="text-lg font-bold text-text">{jobcardLabel}</Text>
        </View>

        <ErrorScreen error={error} refetch={refetch} />

        {jobcard && (
          <>
            {showComplete && (
              <View className="mt-4 mb-4">
                <Button
                  onPress={() => router.push(`/tabs/job-cards/${id}/complete` as any)}
                  className="w-full bg-tertiary"
                >
                  <ButtonText>Complete Jobcard</ButtonText>
                </Button>
              </View>
            )}

            <View className="flex flex-col gap-4 mb-4">
              <BasicDetails jobcard={jobcard} />
              <CustomerDetails jobcard={jobcard} />
            </View>

            <View className="flex-row border-b border-border mb-4">
              {TABS.map((label, i) => (
                <TouchableOpacity
                  key={label}
                  onPress={() => setTab(i)}
                  className={`flex-1 py-3 ${tab === i ? "border-b-2 border-primary" : ""}`}
                >
                  <Text
                    className={`text-center text-sm font-medium ${
                      tab === i ? "text-primary" : "text-text-muted"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="pb-4">
              {tab === 0 && (
                <View>
                  <ComJobcardTimer jobcardId={jobcard.id} technicianId={technicianId} />
                  <View className="mt-4">
                    <ComJobcardTimerHistory timers={jobcard.timers ?? []} />
                  </View>
                </View>
              )}
              {tab === 1 && <AssetsTab jobcard={jobcard} />}
              {tab === 2 && <TasksTab jobcard={jobcard} />}
              {tab === 3 && <InventoryTab jobcard={jobcard} />}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
