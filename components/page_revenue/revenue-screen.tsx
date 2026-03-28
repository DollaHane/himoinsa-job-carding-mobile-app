import React, { useState } from "react";
import { ScrollView } from "../ui/scroll-view";
import { Center } from "../ui/center";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { DatePicker } from "../form/date-picker";
import { KvaRevenueSummary } from "./kva-revenue-summary";
import { KvaRevenueTable } from "./kva-revenue-table";
import { formatDate } from "@/utils/helpers";
import { KvaRevenueData } from "@/types/revenue";

interface RevenueScreenProps {
  startDate: Date | null;
  endDate: Date | null;
  setStartDateCallback: (date: Date | null) => void;
  setEndDateCallback: (date: Date | null) => void;
  data: KvaRevenueData | undefined;
}

export default function RevenueScreen({
  startDate,
  endDate,
  setStartDateCallback,
  setEndDateCallback,
  data,
}: RevenueScreenProps) {
  if (!data) {
    return null;
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
                  onChange={(date) => setStartDateCallback(new Date(date))}
                />

                <DatePicker
                  name="endDate"
                  placeholder="Select end date"
                  value={endDate?.toISOString()}
                  onChange={(date) => setEndDateCallback(new Date(date))}
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
