import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import type { TechnicianStats } from "@/http/actions";

interface ComTechnicianStatsProps {
  stats?: TechnicianStats | null;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="flex-1 p-3 bg-info">
      <Text className="text-2xl font-bold text-white">{value}</Text>
      <Text className="text-xs text-white/90">{label}</Text>
    </Card>
  );
}

export default function ComTechnicianStats({ stats }: ComTechnicianStatsProps) {
  return (
    <View className="flex flex-col gap-3">
      <View className="flex flex-row gap-2">
        <StatCard label="Total" value={stats?.total ?? 0} />
        {Object.entries(stats?.by_status ?? {})
          .slice(0, 2)
          .map(([status, count]) => (
            <StatCard key={status} label={status} value={count} />
          ))}
      </View>
      {Object.entries(stats?.by_status ?? {}).slice(2).length > 0 && (
        <View className="flex flex-row gap-2">
          {Object.entries(stats?.by_status ?? {})
            .slice(2)
            .map(([status, count]) => (
              <StatCard key={status} label={status} value={count} />
            ))}
        </View>
      )}
    </View>
  );
}
