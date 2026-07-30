import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  CalendarRange,
  AlertTriangle,
  Pause,
  XCircle,
} from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import type { TechnicianStats } from "@/http/actions";

interface ComTechnicianStatsProps {
  stats?: TechnicianStats | null;
}

const STATUS_COLORS: { check: (s: string) => boolean; text: string; bg: string; icon: LucideIcon }[] = [
  { check: (s) => s.toLowerCase().includes("complete"),   text: "text-success",   bg: "bg-success/10",   icon: CheckCircle2 },
  { check: (s) => s.toLowerCase().includes("open"),       text: "text-info",      bg: "bg-info/10",      icon: Clock },
  { check: (s) => s.toLowerCase().includes("scheduled"),  text: "text-warning",   bg: "bg-warning/10",   icon: CalendarRange },
  { check: (s) => s.toLowerCase().includes("overdue"),    text: "text-error",     bg: "bg-error/10",     icon: AlertTriangle },
  { check: (s) => s.toLowerCase().includes("pending"),    text: "text-warning",   bg: "bg-warning/10",   icon: Clock },
  { check: (s) => s.toLowerCase().includes("progress"),   text: "text-info",      bg: "bg-info/10",      icon: Clock },
  { check: (s) => s.toLowerCase().includes("hold"),       text: "text-warning",   bg: "bg-warning/10",   icon: Pause },
  { check: (s) => s.toLowerCase().includes("cancel"),     text: "text-error",     bg: "bg-error/10",     icon: XCircle },
];

function getStatusColor(status: string) {
  return STATUS_COLORS.find((c) => c.check(status));
}

export default function ComTechnicianStats({ stats }: ComTechnicianStatsProps) {
  const entries = Object.entries(stats?.by_status ?? {});

  return (
    <View className="flex flex-row flex-wrap -mx-1">
      <View className="w-1/2 px-1 mb-2">
        <Card className="overflow-hidden border-border bg-info/10">
          <View className="flex flex-col items-center justify-center gap-1 py-4 px-2">
            <Icon as={BarChart3} size="lg" className="text-info" />
            <Text className="text-xs font-medium tracking-wider text-text-muted uppercase">
              Total
            </Text>
            <Text className="text-3xl font-bold text-info">
              {stats?.total ?? 0}
            </Text>
          </View>
        </Card>
      </View>

      {entries.map(([status, count]) => {
        const config = getStatusColor(status);
        const textClass = config?.text ?? "text-text";
        const bgClass = config?.bg ?? "bg-background-subtle";
        const IconComponent = config?.icon ?? BarChart3;
        return (
          <View key={status} className="w-1/2 px-1 mb-2">
            <Card className={`overflow-hidden border-border ${bgClass}`}>
              <View className="flex flex-col items-center justify-center gap-1 py-4 px-2">
                <Icon as={IconComponent} size="lg" className={textClass} />
                <Text className="text-xs font-medium tracking-wider text-text-muted uppercase">
                  {status}
                </Text>
                <Text
                  className={`text-3xl font-bold ${textClass}`}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {count}
                </Text>
              </View>
            </Card>
          </View>
        );
      })}
    </View>
  );
}
