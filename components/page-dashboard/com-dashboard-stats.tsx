import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
  CheckCircle2,
  Clock,
  CalendarRange,
  AlertTriangle,
  Loader2,
} from "lucide-react-native";
import type { DashboardStats } from "@/types/contract";

interface ComDashboardStatsProps {
  stats?: DashboardStats | null;
  isLoading?: boolean;
}

const statItems = [
  {
    key: "closed_pct" as keyof DashboardStats,
    label: "Closed",
    icon: CheckCircle2,
    format: (v: number) => `${Math.round(v)}%`,
    textColor: "text-success",
    bgColor: "bg-success/10",
  },
  {
    key: "open_count" as keyof DashboardStats,
    label: "Open",
    icon: Clock,
    format: (v: number) => String(v),
    textColor: "text-info",
    bgColor: "bg-info/10",
  },
  {
    key: "scheduled_count" as keyof DashboardStats,
    label: "Scheduled",
    icon: CalendarRange,
    format: (v: number) => String(v),
    textColor: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    key: "overdue_count" as keyof DashboardStats,
    label: "Overdue",
    icon: AlertTriangle,
    format: (v: number) => String(v),
    textColor: "text-error",
    bgColor: "bg-error/10",
  },
];

export default function ComDashboardStats({
  stats,
  isLoading = false,
}: ComDashboardStatsProps) {
  return (
    <View className="flex flex-row flex-wrap -mx-1">
      {statItems.map((item) => {
        const IconComponent = item.icon;
        const value = stats?.[item.key] ?? 0;

        return (
          <View key={item.key} className="w-1/2 px-1 mb-2">
            <Card className={`overflow-hidden border-border ${item.bgColor}`}>
              <View className="flex flex-col items-center justify-center gap-1 py-4 px-2">
                <Icon as={IconComponent} size="lg" className={item.textColor} />
                <Text className="text-xs font-medium tracking-wider text-text-muted uppercase">
                  {item.label}
                </Text>
                {isLoading ? (
                  <Icon
                    as={Loader2}
                    size="lg"
                    className="animate-spin text-text-muted"
                  />
                ) : (
                  <Text
                    className={`text-3xl font-bold ${item.textColor}`}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item.format(value as number)}
                  </Text>
                )}
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
