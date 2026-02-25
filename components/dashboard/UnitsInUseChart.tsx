import { BarChart } from "react-native-gifted-charts";
import { FleetControlData } from "@/types/dashboard";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";

interface UnitsInUseChartProps {
  data?: FleetControlData;
  isLoading?: boolean;
}

export function UnitsInUseChart({ data, isLoading }: UnitsInUseChartProps) {
  if (isLoading) {
    return (
      <VStack className="w-full">
        <Heading className="mb-2 text-center text-lg font-bold text-primary">
          Units In Use
        </Heading>
        <Text className="text-center text-primary">Loading...</Text>
      </VStack>
    );
  }

  if (!data) {
    return null;
  }

  // Map the dashboard data to chart format and sort by kVA size (label)
  const kvaLabels = data.chart_data.labels;
  const unitsInUseValues = data.chart_data.datasets[0].unit_in_use;
  
  // Apply logarithmic transformation with original value labels
  const chartData = kvaLabels
    .map((label, index) => {
      const originalValue = unitsInUseValues[index];
      // Add 1 before log to avoid log(0), and scale up for better visibility
      const logValue = Math.log10(originalValue + 1) * 20;
      return {
        value: logValue,
        label: label,
        topLabelComponent: () => (
          <Text className="text-[10px] font-semibold text-sky-600">{originalValue}</Text>
        ),
        sortKey: parseInt(label) || 0,
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  const currentDate = data.current_date || '';

  return (
    <Box className="rounded-lg border border-border bg-background p-4">
      <VStack className="w-full" space="md">
        <Heading className="text-center text-lg font-bold text-primary">
          Units In Use
        </Heading>
        <Text className="text-center text-xs text-sky-500">
          {currentDate}
        </Text>
        <Box className="pt-6">
          <BarChart
            barWidth={50}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="#38bdf8"
            data={chartData}
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules={true}
            showFractionalValues={false}
            hideYAxisText={true}
            height={200}
          />
        </Box>
      </VStack>
    </Box>
  );
}
