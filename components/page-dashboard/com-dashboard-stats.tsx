import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types/contract";

interface ComDashboardStatsProps {
  stats?: DashboardStats | null;
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string | number;
  variant: "primary" | "success" | "warning" | "destructive";
}) {
  const variantClasses = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  return (
    <Card className={`flex-1 p-3 ${variantClasses[variant]}`}>
      <Text className="text-2xl font-bold text-white">{value}</Text>
      <Text className="text-xs text-white/90">{label}</Text>
    </Card>
  );
}

export default function ComDashboardStats({ stats }: ComDashboardStatsProps) {
  return (
    <View className="flex flex-row flex-wrap gap-2">
      <StatCard
        label="Closed %"
        value={`${stats?.closed_pct ?? 0}%`}
        variant="success"
      />
      <StatCard label="Open" value={stats?.open_count ?? 0} variant="primary" />
      <StatCard
        label="Scheduled"
        value={stats?.scheduled_count ?? 0}
        variant="warning"
      />
      <StatCard
        label="Overdue"
        value={stats?.overdue_count ?? 0}
        variant="destructive"
      />
    </View>
  );
}
