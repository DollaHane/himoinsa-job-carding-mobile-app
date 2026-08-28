import React, { useMemo, useState } from "react";
import { ScrollView, View, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useGetJobcardShow } from "@/http/services";
import ComJobcardTimer from "@/components/page-jobcards/com-jobcard-timer";
import ComJobcardTimerHistory from "@/components/page-jobcards/com-jobcard-timer-history";
import ComJobcardCompletedView from "@/components/page-jobcards/com-jobcard-completed-view";
import ComJobcardMap from "@/components/page-jobcards/com-jobcard-map";
import { Button, ButtonText } from "@/components/ui/button";
import CardGroup from "@/components/ui/groups/card-group";
import InfoGroup from "@/components/ui/groups/info-group";
import { formatDateLabel, formatSeconds } from "@/lib/helpers/date-functions";
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
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Gauge,
  AlertTriangle,
  Lightbulb,
} from "lucide-react-native";

const TABS = ["Timer", "Assets", "Tasks", "Inventory"] as const;

function StatusBadge({ jobcard }: { jobcard: Jobcard }) {
  if (!jobcard.status?.name) return null;
  const status = jobcard.status.name.toLowerCase();
  const actionMap: Record<string, "warning" | "info" | "success" | "error"> = {
    pending: "warning",
    "in progress": "info",
    completed: "success",
    cancelled: "error",
  };
  return (
    <Badge action={actionMap[status] ?? "muted"}>
      <BadgeText>{jobcard.status.name}</BadgeText>
    </Badge>
  );
}

function TotalDuration({ jobcard }: { jobcard: Jobcard }) {
  const travel = jobcard.travel_time ?? 0;
  const tasks = (jobcard.tasks ?? []).reduce(
    (acc, t) => acc + (t.duration ?? 0),
    0,
  );
  const total = travel + tasks;
  if (total <= 0) return null;
  return (
    <InfoGroup
      label="Total Duration"
      data={formatSeconds(total)}
      icon={Clock}
    />
  );
}

function BasicDetails({ jobcard }: { jobcard: Jobcard }) {
  return (
    <CardGroup title="Jobcard" icon={Hash}>
      <View className="flex flex-col gap-2">
        <View className="flex-row items-center justify-between">
          <InfoGroup
            label="JC Number"
            data={jobcard.jc_number ?? `JC #${jobcard.id}`}
            icon={Hash}
          />
          <StatusBadge jobcard={jobcard} />
        </View>
        <InfoGroup
          label="Type"
          data={jobcard.is_fleet_jc ? "Fleet" : "Customer"}
          icon={Briefcase}
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
        <TotalDuration jobcard={jobcard} />
        {jobcard.smr_reading && (
          <InfoGroup
            label="SMR Reading"
            data={jobcard.smr_reading}
            icon={Gauge}
          />
        )}
        {jobcard.equipment_condition && (
          <InfoGroup
            label="Equipment Condition"
            data={jobcard.equipment_condition}
            icon={AlertTriangle}
          />
        )}
        {jobcard.recommendations && (
          <InfoGroup
            label="Recommendations"
            data={jobcard.recommendations}
            icon={Lightbulb}
          />
        )}
        {jobcard.parent_jobcard && (
          <TouchableOpacity
            onPress={() =>
              jobcard.parent_jobcard &&
              (globalThis as any)?.navigate?.(
                `/tabs/job-cards/${jobcard.parent_jobcard.id}`,
              )
            }
          >
            <Text className="text-primary text-sm font-medium">
              Parent: {jobcard.parent_jobcard.jc_number ??
                `JC #${jobcard.parent_jobcard.id}`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </CardGroup>
  );
}

function TechnicianBadge({ jobcard }: { jobcard: Jobcard }) {
  const techs = jobcard.technicians ?? [];
  if (techs.length === 0) return null;
  const names = techs
    .map((t) => {
      const first = t.technician?.first_name ?? "";
      const last = t.technician?.last_name ?? "";
      return `${first} ${last}`.trim();
    })
    .join(", ");
  return (
    <InfoGroup label="Technicians" data={names || "—"} icon={User} />
  );
}

function CustomerDetails({ jobcard }: { jobcard: Jobcard }) {
  const customer = jobcard.customer;
  if (!customer) return null;
  return (
    <CardGroup title="Customer" icon={Building2}>
      <View className="flex flex-col gap-2">
        <InfoGroup
          label="Company"
          data={customer.company_name}
          icon={Building2}
        />
        <TechnicianBadge jobcard={jobcard} />
        {customer.contact_person && (
          <InfoGroup
            label="Contact Person"
            data={customer.contact_person}
            icon={User}
          />
        )}
        {customer.contact_number && (
          <InfoGroup
            label="Phone"
            data={customer.contact_number}
            icon={Phone}
          />
        )}
        {customer.contact_email && (
          <InfoGroup
            label="Email"
            data={customer.contact_email}
            icon={Mail}
          />
        )}
        {(customer.physical_address ||
          customer.physical_suburb ||
          customer.physical_city) && (
          <InfoGroup
            label="Address"
            data={
              [
                customer.physical_address,
                customer.physical_suburb,
                customer.physical_city,
              ]
                .filter(Boolean)
                .join(", ") || "—"
            }
            icon={MapPin}
          />
        )}
      </View>
    </CardGroup>
  );
}

function ContractDetails({ jobcard }: { jobcard: Jobcard }) {
  const contract = jobcard.contract;
  if (!jobcard.is_fleet_jc || !contract) return null;
  return (
    <CardGroup title="Contract" icon={FileText}>
      <View className="flex flex-col gap-2">
        <InfoGroup
          label="Contract Number"
          data={contract.contract_number ?? "N/A"}
          icon={FileText}
        />
        {contract.contract_value && (
          <InfoGroup
            label="Contract Value"
            data={contract.contract_value}
            icon={FileText}
          />
        )}
        {contract.contract_active_date && (
          <InfoGroup
            label="Active Date"
            data={formatDateLabel(contract.contract_active_date)}
            icon={Calendar}
          />
        )}
        {contract.contract_end_date && (
          <InfoGroup
            label="End Date"
            data={formatDateLabel(contract.contract_end_date)}
            icon={Calendar}
          />
        )}
        {contract.registered_name && (
          <InfoGroup
            label="Registered Name"
            data={contract.registered_name}
            icon={Building2}
          />
        )}
        {contract.contact_person && (
          <InfoGroup
            label="Contact Person"
            data={contract.contact_person}
            icon={User}
          />
        )}
        {contract.contact_telephone && (
          <InfoGroup
            label="Phone"
            data={contract.contact_telephone}
            icon={Phone}
          />
        )}
        {contract.contact_email && (
          <InfoGroup
            label="Email"
            data={contract.contact_email}
            icon={Mail}
          />
        )}
      </View>
    </CardGroup>
  );
}

function BranchDetails({ jobcard }: { jobcard: Jobcard }) {
  if (!jobcard.is_fleet_jc) return null;
  const firstAsset = jobcard.assets?.[0];
  const branch = firstAsset?.branch_details;
  if (!branch) return null;
  return (
    <CardGroup title="Branch" icon={Building2}>
      <View className="flex flex-col gap-2">
        <InfoGroup label="Name" data={branch.name} icon={Building2} />
        <InfoGroup label="Code" data={branch.code} icon={Hash} />
        {branch.telephone && (
          <InfoGroup label="Phone" data={branch.telephone} icon={Phone} />
        )}
        {branch.email && (
          <InfoGroup label="Email" data={branch.email} icon={Mail} />
        )}
        {branch.physical_address && (
          <InfoGroup
            label="Address"
            data={branch.physical_address}
            icon={MapPin}
          />
        )}
      </View>
    </CardGroup>
  );
}

function AssetsTab({ jobcard }: { jobcard: Jobcard }) {
  if (!jobcard.assets || jobcard.assets.length === 0) {
    return <Text className="text-text-muted py-4">No assets linked.</Text>;
  }
  return (
    <View className="py-2">
      {jobcard.assets.map((asset, index) => {
        const loc = asset.asset_location;
        const addr = loc?.address ?? loc?.name;
        return (
          <View
            key={asset.id}
            className="flex-row items-center justify-between py-3 border-b border-border"
          >
            <View className="flex-1">
              <Text className="text-text">
                {asset.asset?.fleet_number ??
                  asset.asset?.description ??
                  `Asset ${index + 1}`}
              </Text>
              {asset.asset?.description && (
                <Text className="text-xs text-text-muted">
                  {asset.asset.description}
                </Text>
              )}
              {addr && (
                <View className="flex-row items-center gap-1 mt-1">
                  <Icon as={MapPin} size="xs" className="text-text-muted" />
                  <Text className="text-xs text-text-muted">{addr}</Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-text-muted">
              {asset.asset_type ?? ""}
            </Text>
          </View>
        );
      })}
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
            <Text className="text-xs text-text-muted">
              {task.status ?? "Pending"}
            </Text>
            {task.duration != null && (
              <Text className="text-xs text-text-muted">
                Est: {Math.floor(task.duration / 3600)}h{" "}
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
            {item.date_requested && (
              <Text className="text-xs text-text-muted">
                Req: {formatDateLabel(item.date_requested)}
              </Text>
            )}
            {item.estimated_arrival_date && (
              <Text className="text-xs text-text-muted">
                ETA: {formatDateLabel(item.estimated_arrival_date)}
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
                  onPress={() =>
                    router.push(`/tabs/job-cards/${id}/complete` as any)
                  }
                  className="w-full bg-tertiary"
                >
                  <ButtonText>Complete Jobcard</ButtonText>
                </Button>
              </View>
            )}

            <View className="flex flex-col gap-4 mb-4">
              <BasicDetails jobcard={jobcard} />
              <CustomerDetails jobcard={jobcard} />
              <ContractDetails jobcard={jobcard} />
              <BranchDetails jobcard={jobcard} />
              <CardGroup title="Map" icon={MapPin}>
                <ComJobcardMap jobcard={jobcard} />
              </CardGroup>
            </View>

            {isCompleted && <ComJobcardCompletedView jobcard={jobcard} />}

            {!isCompleted && (
              <>
                <View className="flex-row border-b border-border mb-4">
                  {TABS.map((label, i) => (
                    <TouchableOpacity
                      key={label}
                      onPress={() => setTab(i)}
                      className={`flex-1 py-3 ${
                        tab === i ? "border-b-2 border-primary" : ""
                      }`}
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
                      <ComJobcardTimer
                        jobcardId={jobcard.id}
                        technicianId={technicianId}
                      />
                      <View className="mt-4">
                        <ComJobcardTimerHistory
                          timers={jobcard.timers ?? []}
                        />
                      </View>
                    </View>
                  )}
                  {tab === 1 && <AssetsTab jobcard={jobcard} />}
                  {tab === 2 && <TasksTab jobcard={jobcard} />}
                  {tab === 3 && <InventoryTab jobcard={jobcard} />}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
