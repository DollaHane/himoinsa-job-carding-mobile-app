import React, { useMemo } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Text } from "@/components/ui/text";
import CardGroup from "@/components/ui/groups/card-group";
import type { TechnicianStats } from "@/http/actions";

interface ComTechnicianChartProps {
  monthly?: TechnicianStats["monthly"];
}

export default function ComTechnicianChart({
  monthly = [],
}: ComTechnicianChartProps) {
  const data = useMemo(
    () =>
      monthly.map((entry) => ({
        value: entry.count,
        label: entry.month,
        frontColor: "#3b82f6",
      })),
      [monthly],
    );

  return (
    <CardGroup title="Monthly Jobcards" icon={undefined}>
      {data.length === 0 ? (
        <Text className="text-text-muted text-center py-8">
          No monthly data.
        </Text>
      ) : (
        <View className="items-center">
          <BarChart
            data={data}
            width={280}
            height={200}
            barWidth={22}
            spacing={16}
            noOfSections={4}
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisTextStyle={{ color: "#a3a3a3", fontSize: 10 }}
            xAxisLabelTextStyle={{ color: "#a3a3a3", fontSize: 10 }}
          />
        </View>
      )}
    </CardGroup>
  );
}
