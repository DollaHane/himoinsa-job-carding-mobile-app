import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import CardGroup from "@/components/ui/groups/card-group";
import InfoGroup from "@/components/ui/groups/info-group";
import { formatDateLabel } from "@/lib/helpers/date-functions";
import type { Jobcard } from "@/types/jobcard";
import {
  Hash,
  Building2,
  FileText,
  Briefcase,
  Calendar,
  Wrench,
  Boxes,
  ClipboardList,
} from "lucide-react-native";

interface ComJobcardDetailReadonlyProps {
  jobcard: Jobcard;
}

export default function ComJobcardDetailReadonly({
  jobcard,
}: ComJobcardDetailReadonlyProps) {
  return (
    <View className="flex flex-col gap-4">
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

      <CardGroup title="Assets" icon={Wrench}>
        {jobcard.assets && jobcard.assets.length > 0 ? (
          jobcard.assets.map((asset, index) => (
            <View key={asset.id} className="py-1">
              <Text className="text-foreground">
                {asset.asset?.fleet_number ??
                  asset.asset?.description ??
                  `Asset ${index + 1}`}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {asset.asset_type ?? "Unknown type"}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-muted-foreground">No assets linked.</Text>
        )}
      </CardGroup>

      <CardGroup title="Tasks" icon={ClipboardList}>
        {jobcard.tasks && jobcard.tasks.length > 0 ? (
          jobcard.tasks.map((task) => (
            <View key={task.id} className="py-1">
              <Text className="text-foreground">
                {task.task_step}. {task.description}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {task.status ?? "Pending"}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-muted-foreground">No tasks.</Text>
        )}
      </CardGroup>

      <CardGroup title="Inventory" icon={Boxes}>
        {jobcard.inventory && jobcard.inventory.length > 0 ? (
          jobcard.inventory.map((item) => (
            <View key={item.id} className="py-1">
              <Text className="text-foreground">
                {item.inventory?.stock_code ?? `Item #${item.inventory_id}`}
              </Text>
              <Text className="text-xs text-muted-foreground">
                Requested: {item.quantity_requested ?? 0} | Used:{" "}
                {item.quantity_used ?? 0}
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-muted-foreground">No inventory.</Text>
        )}
      </CardGroup>
    </View>
  );
}
