import React from "react";
import { StatCard } from "./stat-card";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FleetControlData } from "@/types/dashboard";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";

interface StatCardsProps {
  data?: FleetControlData;
  isLoading?: boolean;
}

export default function StatCards({ data, isLoading }: StatCardsProps) {
  if (isLoading) {
    return (
      <VStack space="md">
        <HStack space="md">
          <Box className="flex-1">
            <StatCard label="Total kVA" value="..." borderColor="#f59e0b" />
          </Box>
          <Box className="flex-1">
            <StatCard label="Total kVA In Use" value="..." borderColor="#38bdf8" />
          </Box>
        </HStack>
        <HStack space="md">
          <Box className="flex-1">
            <StatCard label="Total kVA Utilisation" value="..." borderColor="#34d399" />
          </Box>
          <Box className="flex-1">
            <StatCard label="Total Units" value="..." borderColor="#f59e0b" />
          </Box>
        </HStack>
        <HStack space="md">
          <Box className="flex-1">
            <StatCard label="Units In Use" value="..." borderColor="#38bdf8" />
          </Box>
          <Box className="flex-1">
            <StatCard label="Available Units" value="..." borderColor="#34d399" />
          </Box>
        </HStack>
      </VStack>
    );
  }

  if (!data) {
    return null;
  }

  const totalKva = data.chart_data.combined_total_kva.toLocaleString();
  const kvaInUse = data.chart_data.combined_kva_in_use.toLocaleString();
  const utilisation = Math.round(data.chart_data.combined_utilisation);
  const totalUnits = data.chart_data.total_generators;
  const unitsInUse = data.chart_data.combined_units_in_use;
  const availableUnits = totalUnits - unitsInUse;

  return (
    <VStack space="md">
      <HStack space="md">
        <Box className="flex-1">
          <StatCard label="Total kVA" value={`${totalKva} kVA`} borderColor="#f59e0b" />
        </Box>
        <Box className="flex-1">
          <StatCard label="Total Units" value={`${totalUnits} Units`} borderColor="#f59e0b" />
        </Box>
      </HStack>
      <HStack space="md">
        <Box className="flex-1">
          <StatCard label="Total kVA Utilisation" value={`${utilisation}%`} borderColor="#38bdf8" />
        </Box>
        <Box className="flex-1">
          <StatCard label="Total kVA In Use" value={`${kvaInUse} kVA`} borderColor="#38bdf8" />
        </Box>
      </HStack>
      <HStack space="md">
        <Box className="flex-1">
          <StatCard label="Units In Use" value={`${unitsInUse} Units`} borderColor="#34d399" />
        </Box>
        <Box className="flex-1">
          <StatCard label="Available Units" value={`${availableUnits} Units`} borderColor="#34d399" />
        </Box>
      </HStack>
    </VStack>
  );
}
