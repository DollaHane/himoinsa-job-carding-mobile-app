import React, { useMemo } from "react";
import { View } from "react-native";
import { Control, useWatch } from "react-hook-form";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Badge, BadgeText } from "@/components/ui/badge";
import { useGetJobcardMetadata } from "@/http/services";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStepSummaryProps {
  control: Control<JobcardCreationRequest>;
  isPending: boolean;
  customerName?: string;
  contractLabel?: string | null;
}

export default function TabStepSummary({
  control,
  isPending: _isPending,
  customerName,
  contractLabel,
}: TabStepSummaryProps) {
  const values = useWatch({ control });
  const { data: metadata } = useGetJobcardMetadata();

  const serviceTypeLabel = useMemo(() => {
    if (!values.service_type || !metadata) return "Not selected";
    const found = metadata.service_types.find(
      (st) => String(st.id) === String(values.service_type)
    );
    return found?.name ?? String(values.service_type);
  }, [values.service_type, metadata]);

  const getCustomerLabel = (id: unknown) => {
    if (customerName) return customerName;
    if (typeof id === "number" || (typeof id === "string" && id !== "")) {
      return String(id);
    }
    return "Not selected";
  };

  const tasks = (values.tasks ?? []) as Array<{
    task_step: number;
    description: string;
    duration: number | null;
  }>;

  const inventoryItems = (values.inventory ?? []) as Array<{
    inventory_id: number;
    quantity_requested: number;
    date_requested: string;
    estimated_arrival_date: string | null;
    notes: string | null;
  }>;

  const totalTaskDuration = tasks.reduce(
    (sum, task) => sum + (task.duration || 0),
    0
  );

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
      <View className="flex flex-col gap-5">
        {/* Job Info */}
        <View className="rounded-lg border border-input p-4">
          <Text className="mb-3 font-medium text-text">Job Info</Text>
          <View className="mb-2">
            <Badge action="muted" variant="solid" size="sm">
              <BadgeText>
                {values.is_fleet_jc ? "Fleet Jobcard" : "Customer Jobcard"}
              </BadgeText>
            </Badge>
          </View>

          {values.is_fleet_jc ? (
            <View className="gap-1">
              {values.contract_id && (
                <Text className="text-sm text-text-muted">
                  Contract:{" "}
                  <Text className="text-text">
                    {contractLabel ?? String(values.contract_id)}
                  </Text>
                </Text>
              )}
            </View>
          ) : (
            <View className="gap-1">
              <Text className="text-sm text-text-muted">
                Customer:{" "}
                <Text className="text-text">
                  {getCustomerLabel(values.customer_id)}
                </Text>
              </Text>
              <Text className="text-sm text-text-muted">
                Location:{" "}
                <Text className="text-text">
                  {values.customer_location_id
                    ? String(values.customer_location_id)
                    : "Not selected"}
                </Text>
              </Text>
            </View>
          )}

          <View className="mt-2">
            <Text className="text-sm text-text-muted">Assets:</Text>
            {(values.assets ?? []).map((a, i) => (
              <Text key={i} className="text-sm text-text">
                Asset #{a.asset_id} — Location #{a.asset_location_id}
              </Text>
            ))}
          </View>
        </View>

        {/* Scheduling */}
        <View className="rounded-lg border border-input p-4">
          <Text className="mb-3 font-medium text-text">Scheduling</Text>
          <View className="gap-1">
            <Text className="text-sm text-text-muted">
              Service Type:{" "}
              <Text className="text-text">{serviceTypeLabel}</Text>
            </Text>
            <Text className="text-sm text-text-muted">
              Scheduled:{" "}
              <Text className="text-text">
                {values.scheduled_datetime
                  ? new Date(values.scheduled_datetime as Date).toLocaleString()
                  : "Not set"}
              </Text>
            </Text>
            {values.technicians && values.technicians.length > 0 && (
              <Text className="text-sm text-text-muted">
                Technicians:{" "}
                <Text className="text-text">
                  {values.technicians.length} assigned
                </Text>
              </Text>
            )}
          </View>
        </View>

        {/* Tasks */}
        <View className="rounded-lg border border-input p-4">
          <Text className="mb-3 font-medium text-text">Tasks</Text>
          <View className="mb-2">
            <Text className="text-sm text-text-muted">
              Work Description:
            </Text>
            <Text className="mt-1 text-sm text-text">
              {String(values.work_description || "") || "No description"}
            </Text>
          </View>
          {tasks.length > 0 && (
            <View className="mt-3">
              <View className="flex-row border-b border-input pb-2">
                <Text className="w-12 text-xs font-medium text-text-muted">
                  Step
                </Text>
                <Text className="flex-1 text-xs font-medium text-text-muted">
                  Description
                </Text>
                <Text className="w-20 text-xs font-medium text-text-muted">
                  Duration
                </Text>
              </View>
              {tasks.map((t, i) => (
                <View
                  key={i}
                  className="flex-row border-b border-input py-2 last:border-0"
                >
                  <Text className="w-12 text-sm text-text">
                    {t.task_step}
                  </Text>
                  <Text className="flex-1 text-sm text-text">
                    {t.description}
                  </Text>
                  <Text className="w-20 text-sm text-text">
                    {formatDuration(t.duration ?? 0)}
                  </Text>
                </View>
              ))}
              <View className="flex-row py-2">
                <Text className="w-12 text-sm font-medium text-text-muted" />
                <Text className="flex-1 text-sm font-medium text-text-muted">
                  Total
                </Text>
                <Text className="w-20 text-sm font-medium text-text">
                  {formatDuration(totalTaskDuration)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Inventory */}
        {inventoryItems.length > 0 && (
          <View className="rounded-lg border border-input p-4">
            <Text className="mb-3 font-medium text-text">Inventory</Text>
            <View className="flex-row border-b border-input pb-2">
              <Text className="flex-1 text-xs font-medium text-text-muted">
                Item
              </Text>
              <Text className="w-12 text-xs font-medium text-text-muted">
                Qty
              </Text>
              <Text className="w-24 text-xs font-medium text-text-muted">
                Requested
              </Text>
              <Text className="w-24 text-xs font-medium text-text-muted">
                Est. Arrival
              </Text>
            </View>
            {inventoryItems.map((item, i) => (
              <View
                key={i}
                className="flex-row border-b border-input py-2 last:border-0"
              >
                <Text className="flex-1 text-sm text-text">
                  Item #{item.inventory_id}
                </Text>
                <Text className="w-12 text-sm text-text">
                  {item.quantity_requested}
                </Text>
                <Text className="w-24 text-sm text-text">
                  {item.date_requested?.slice(0, 10) ?? "-"}
                </Text>
                <Text className="w-24 text-sm text-text">
                  {item.estimated_arrival_date?.slice(0, 10) ?? "-"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
  );
}
