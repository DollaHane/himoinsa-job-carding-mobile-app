import { BarChart } from "react-native-gifted-charts";
import { FleetControlData } from "@/types/dashboard";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";

interface KvaUtilisationChartProps {
  data?: FleetControlData;
  isLoading?: boolean;
}

export function KvaUtilisationChart({ data, isLoading }: KvaUtilisationChartProps) {
  if (isLoading) {
    return (
      <VStack className="w-full" space="md">
        <Heading className="text-center text-lg font-bold text-primary">
          kVA Utilisation (%)
        </Heading>
        <Text className="text-center text-primary">Loading...</Text>
      </VStack>
    );
  }

  if (!data) {
    return null;
  }

  // Map the dashboard data to chart format and sort by kVA size (label)
  // Use chart_data.labels (kVA filters) with datasets[0].kva_utilisation
  const kvaLabels = data.chart_data.labels;
  const utilisationValues = data.chart_data.datasets[0].kva_utilisation;
  
  const chartData = kvaLabels
    .map((label, index) => ({
      value: utilisationValues[index],
      label: label,
      topLabelComponent: () => (
        <Text className="text-[10px] font-semibold text-sky-600">{utilisationValues[index]}%</Text>
      ),
    }))
    .sort((a, b) => b.value - a.value);

  const currentDate = data.current_date || '';

  return (
    <Box className="rounded-lg border border-border bg-background p-4">
      <VStack className="w-full" space="md">
        <Heading className="text-center text-lg font-bold text-primary">
          kVA Utilisation (%)
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
