import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import type { Jobcard } from "@/types/jobcard";
import { isOverdue, formatDateLabel } from "@/lib/helpers/date-functions";

interface ComJobcardListItemProps {
  jobcard: Jobcard;
  showOverdueIndicator?: boolean;
}

function getStatusAction(statusName?: string | null) {
  const name = (statusName ?? "").toLowerCase();
  if (name.includes("complete") || name.includes("closed")) return "success";
  if (
    name.includes("progress") ||
    name.includes("start") ||
    name.includes("travel")
  )
    return "info";
  if (name.includes("schedule") || name.includes("open")) return "warning";
  if (name.includes("overdue") || name.includes("cancel")) return "error";
  return "muted";
}

export default function ComJobcardListItem({
  jobcard,
  showOverdueIndicator = true,
}: ComJobcardListItemProps) {
  const overdue = showOverdueIndicator && isOverdue(jobcard.scheduled_datetime);
  const statusName = jobcard.status?.name;

  return (
    <Card className="p-3 border border-border">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-semibold text-text">
            {jobcard.jc_number ?? `JC #${jobcard.id}`}
          </Text>
          <Text className="text-sm text-text-muted">
            {jobcard.customer?.company_name ?? "Unknown customer"}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {overdue && <AlertTriangle size={16} color="red" />}
          <Badge action={getStatusAction(statusName)} size="sm">
            <Text className="text-xs text-text">{statusName ?? "Unknown"}</Text>
          </Badge>
        </View>
      </View>

      <View className="flex-row items-center gap-1 mt-2">
        <Icon as={Clock} size="xs" className="text-text-muted" />
        <Text className="text-xs text-text-muted">
          {jobcard.scheduled_datetime
            ? formatDateLabel(jobcard.scheduled_datetime)
            : "No schedule"}
        </Text>
      </View>
    </Card>
  );
}
