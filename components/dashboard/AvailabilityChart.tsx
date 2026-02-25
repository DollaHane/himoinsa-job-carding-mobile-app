import { BarChart } from "react-native-gifted-charts";
import { FleetControlData } from "@/types/dashboard";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";

interface AvailabilityChartProps {
  data?: FleetControlData;
  isLoading?: boolean;
}

export function AvailabilityChart({ data, isLoading }: AvailabilityChartProps) {
  if (isLoading) {
    return (
      <VStack className="w-full" space="md">
        <Heading className="text-center text-lg font-bold text-primary">
          Monthly Average Availability (%)
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
  const availabilityValues = data.chart_data.datasets[0].total_availability;
  
  const chartData = kvaLabels
    .map((label, index) => ({
      value: availabilityValues[index],
      label: label,
      topLabelComponent: () => (
        <Text className="text-[10px] font-semibold text-sky-600">{availabilityValues[index]}%</Text>
      ),
      sortKey: parseInt(label) || 0,
    }))
    .sort((a, b) => a.sortKey - b.sortKey);

  const currentDate = data.current_date || '';

  return (
    <Box className="rounded-lg border border-border bg-background p-4">
      <VStack className="w-full" space="md">
        <Heading className="text-center text-lg font-bold text-primary">
          Monthly Average Availability (%)
        </Heading>
        <Text className="text-center text-xs text-sky-500">
          {currentDate}
        </Text>
        <Box className="pt-6">
          <BarChart
            barWidth={50}
            noOfSections={3}
            maxValue={100}
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
