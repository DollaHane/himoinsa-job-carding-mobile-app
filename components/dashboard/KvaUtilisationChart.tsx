import { BarChart } from "react-native-gifted-charts";

const data = [
  { value: 20, label: "20" },
  { value: 22, label: "60" },
  { value: 20, label: "125" },
  { value: 36, label: "200" },
  { value: 20, label: "250" },
  { value: 87, label: "350" },
  { value: 50, label: "490" },
  { value: 81, label: "500" },
  { value: 50, label: "705" },
  { value: 67, label: "750" },
  { value: 50, label: "1015" },
  { value: 50, label: "1270" },
  { value: 85, label: "1275" },
];

export function KvaUtilisationChart() {
  return (
    <BarChart
      barWidth={22}
      noOfSections={3}
      barBorderRadius={4}
      frontColor="#38bdf8"
      data={data}
      yAxisThickness={0}
      xAxisThickness={0}
    />
  );
}
