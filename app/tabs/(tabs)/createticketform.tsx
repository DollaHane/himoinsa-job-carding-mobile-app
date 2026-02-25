import React, { useState } from "react";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { HStack } from "@/components/ui/hstack";
import { DatePicker } from "@/components/form/DatePicker";
import { KvaRevenueSummary } from "@/components/dashboard/KvaRevenueSummary";
import { KvaRevenueTable } from "@/components/dashboard/KvaRevenueTable";
import { useKvaRevenueData } from "@/http/services";

export default function CreateTicketForm() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [startDate, setStartDate] = useState<Date | null>(
    new Date("2026-02-01"),
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date("2026-02-28"));

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const { data, isLoading, error, refetch } = useKvaRevenueData({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleApply = () => {
    refetch();
  };

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <Text className="text-typography-600">Loading...</Text>
      </Box>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Spinner size="large" />
        <Text className="mt-4 text-primary">
          Loading revenue data...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">
          Error loading data: {(error as Error).message}
        </Text>
        <Button onPress={handleApply} className="mt-4">
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Text className="text-primary">No data available</Text>
      </Box>
    );
  }

  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">
              Revenue
            </Heading>
          </VStack>
          <VStack space="md">
            {/* Date Filter Section */}
            <Box className="bg-card rounded-lg p-4">
              <VStack space="xl">
                <DatePicker
                  name="startDate"
                  placeholder="Select start date"
                  value={startDate?.toISOString()}
                  onChange={(date) => setStartDate(new Date(date))}
                />

                <DatePicker
                  name="endDate"
                  placeholder="Select end date"
                  value={endDate?.toISOString()}
                  onChange={(date) => setEndDate(new Date(date))}
                />

                {/* <Button onPress={handleApply} size="sm">
                  <ButtonText>Apply</ButtonText>
                </Button> */}
              </VStack>
            </Box>

            {/* Summary Cards */}
            <KvaRevenueSummary data={data} />

            {/* Revenue Table */}
            <KvaRevenueTable
              data={data.kva_data}
              grandTotalRevenue={data.grand_total_revenue}
              grandTotalContracts={data.grand_total_contracts}
              startDate={formatDate(startDate)}
              endDate={formatDate(endDate)}
            />
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
