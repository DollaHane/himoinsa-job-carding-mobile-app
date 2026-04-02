import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Pressable } from "react-native";
import { FleetStatus } from "@/components/page_fleet_control/fleet-status";
import { KvaUtilisationChart } from "@/components/page_fleet_control/kva-utilisation-chart";
import { UnitsInUseChart } from "@/components/page_fleet_control/units-in-use-chart";
import { AvailabilityChart } from "@/components/page_fleet_control/availability-chart";
import { KvaInUseChart } from "@/components/page_fleet_control/kva-in-use-chart";
import StatCards from "@/components/page_fleet_control/stat-cards";
import { DatePicker } from "@/components/form/date-picker";
import { CheckIcon, ChevronDownIcon } from "lucide-react-native";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/components/ui/checkbox";

interface FleetControlPageProps {
  dashboard_data: any;
  isLoading: boolean;
  selectedDate: string;
  selectedKva: string[];
  showPrevious: boolean;
  setSelectedDateCallback: (date: string) => void;
  setSelectedKvaCallback: (kva: string) => void;
  setShowPreviousCallback: (show: boolean) => void;
  kvaOptions?: string[] | undefined;
}

export default function FleetControlPage({
  dashboard_data,
  isLoading,
  selectedDate,
  showPrevious,
  setSelectedDateCallback,
  selectedKva,
  setSelectedKvaCallback,
  setShowPreviousCallback,
  kvaOptions,
}: FleetControlPageProps) {
  const [showKvaDropdown, setShowKvaDropdown] = useState<boolean>(false);
  if (isLoading || !dashboard_data) return null;
  return (
    <>
      {/* Filter Section */}
      <VStack space="md" className="pb-4">
        <Box className="flex flex-col gap-4">
          {/* Show Previous Year */}
          <Checkbox
            value="previous"
            isChecked={showPrevious}
            onChange={setShowPreviousCallback}
            aria-label="Show previous year"
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel className="text-sm text-primary">
              Show Previous Year
            </CheckboxLabel>
          </Checkbox>

          {/* Date Filter */}
          <VStack space="xs">
            <DatePicker
              placeholder="Select date"
              value={selectedDate}
              onChange={setSelectedDateCallback}
              maximumDate={new Date()}
            />
          </VStack>

          {/* KVA Filter - Multi Select */}
          <VStack space="xs">
            <Pressable
              onPress={() => setShowKvaDropdown(!showKvaDropdown)}
              className="w-full flex-row items-center justify-between rounded-full border border-border bg-background px-3 py-2.5"
            >
              <Text className="text-sm text-primary">
                {selectedKva.length > 0
                  ? `${selectedKva.length} selected`
                  : "Select KVA sizes"}
              </Text>
              <ChevronDownIcon size={20} color="#666" />
            </Pressable>

            {showKvaDropdown && (
              <Box className="max-h-64 rounded-lg border border-border bg-background">
                <ScrollView className="p-2">
                  <VStack space="xs">
                    {kvaOptions &&
                      kvaOptions.map((kva) => (
                        <Pressable
                          key={kva}
                          onPress={() => setSelectedKvaCallback(kva)}
                          className="flex-row items-center rounded p-2 active:bg-gray-100"
                        >
                          <Box
                            className={`mr-3 h-5 w-5 items-center justify-center rounded border ${selectedKva.includes(kva) ? "border-sky-500 bg-sky-500" : "border-border"}`}
                          >
                            {selectedKva.includes(kva) && (
                              <CheckIcon size={16} color="white" />
                            )}
                          </Box>
                          <Text className="text-sm text-primary">
                            {kva} kVA
                          </Text>
                        </Pressable>
                      ))}
                  </VStack>
                </ScrollView>
              </Box>
            )}

            {selectedKva.length > 0 && (
              <Text className="text-xs text-sky-500">
                Selected: {selectedKva.join(", ")}
              </Text>
            )}
          </VStack>
        </Box>
      </VStack>

      <VStack className="mb-4 flex gap-4">
        <StatCards data={dashboard_data} />
        <FleetStatus />
      </VStack>
      <VStack className="mb-4 gap-6">
        <KvaUtilisationChart data={dashboard_data} />
        <AvailabilityChart data={dashboard_data} />
        <KvaInUseChart data={dashboard_data} />
        <UnitsInUseChart data={dashboard_data} />
      </VStack>
    </>
  );
}
