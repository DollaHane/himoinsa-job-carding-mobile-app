import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "@/components/ui/scroll-view";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming, Easing } from "react-native-reanimated";
import { FleetStatus } from "@/components/page_fleet_control/fleet-status";
import { KvaUtilisationChart } from "@/components/page_fleet_control/kva-utilisation-chart";
import { UnitsInUseChart } from "@/components/page_fleet_control/units-in-use-chart";
import { AvailabilityChart } from "@/components/page_fleet_control/availability-chart";
import { KvaInUseChart } from "@/components/page_fleet_control/kva-in-use-chart";
import StatCards from "@/components/page_fleet_control/stat-cards";
import { DatePicker } from "@/components/form/date-picker";
import { CheckIcon, ChevronDownIcon, Filter } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";


interface FleetControlPageProps {
  dashboard_data: any;
  selectedDate: string;
  selectedKva: string[];
  setSelectedDateCallback?: (date: string) => void;
  toggleKva: (kva: string) => void;
  kvaOptions?: string[] | undefined;
}

export default function FleetControlPage({ dashboard_data, selectedDate, setSelectedDateCallback, selectedKva, toggleKva, kvaOptions }: FleetControlPageProps) {

    const scaleFilter = useSharedValue(0);
    const [showKvaDropdown, setShowKvaDropdown] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const animatedStyleFilter = useAnimatedStyle(() => ({
      opacity: scaleFilter.value,
      maxHeight: scaleFilter.value * 500,
      paddingHorizontal: scaleFilter.value * 16,
      paddingTop: scaleFilter.value * 56,  // Space for the absolute icon
      paddingBottom: scaleFilter.value * 16,
    }));
  
    const animatedContainerStyle = useAnimatedStyle(() => ({
      width: 44 + (scaleFilter.value * 300),  // 44 to 344
      minHeight: 44 + (scaleFilter.value * 120), // Minimum height animates
      // height: scaleFilter.value === 1 ? undefined : undefined, // Auto height when open, fixed when closed
      borderRadius: 24 - (scaleFilter.value * 12), // 24 to 12
      overflow: scaleFilter.value === 1 ? 'visible' : 'hidden', // Show dropdowns when fully open
    }));

      // Animate filter visibility
      useEffect(() => {
        scaleFilter.value = withTiming(showFilters ? 1 : 0, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Smooth cubic bezier
        });
      }, [showFilters, scaleFilter]);

  return (
        <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">Dashboard</Heading>
          </VStack>
          
          {/* Filter Section */}
          <Animated.View style={[{ alignSelf: 'flex-end', marginBottom: 24 }, animatedContainerStyle]} className="relative bg-background border border-border">
            <VStack space="md">
                <Pressable 
                  onPress={() => setShowFilters(!showFilters)}
                  className="absolute top-0 right-0 w-12 h-12 items-center justify-center z-10"
                >
                  <Icon as={Filter} size="xl" className="text-primary" />
                </Pressable>

              <Animated.View style={animatedStyleFilter} className="flex flex-col gap-4">
                {/* Show Previous Year */}
                {/* <Checkbox
                  value="previous"
                  isChecked={showPrevious}
                  onChange={setShowPrevious}
                  aria-label="Show previous year"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-sm text-primary">Show Previous Year</CheckboxLabel>
                </Checkbox> */}

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
                      {selectedKva.length > 0 ? `${selectedKva.length} selected` : "Select KVA sizes"}
                    </Text>
                    <ChevronDownIcon size={20} color="#666" />
                  </Pressable>
                  
                  {showKvaDropdown && (
                  <Box className="max-h-64 rounded-lg border border-border bg-background">
                      <ScrollView className="p-2">
                        <VStack space="xs">
                          {kvaOptions && kvaOptions.map((kva) => (
                            <Pressable
                              key={kva}
                              onPress={() => toggleKva(kva)}
                              className="flex-row items-center rounded p-2 active:bg-gray-100"
                            >
                              <Box className={`mr-3 h-5 w-5 items-center justify-center rounded border ${selectedKva.includes(kva) ? 'border-sky-500 bg-sky-500' : 'border-border'}`}>
                                {selectedKva.includes(kva) && (
                                  <CheckIcon size={16} color="white" />
                                )}
                              </Box>
                              <Text className="text-sm text-primary">{kva} kVA</Text>
                            </Pressable>
                          ))}
                        </VStack>
                      </ScrollView>
                    </Box>
                  )}
                  
                  {selectedKva.length > 0 && (
                    <Text className="text-xs text-sky-500">
                      Selected: {selectedKva.join(', ')}
                    </Text>
                  )}
                </VStack>
              </Animated.View>
              
            </VStack>
          </Animated.View>

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
        </Box>
      </Center>
    </ScrollView>
  )
}
