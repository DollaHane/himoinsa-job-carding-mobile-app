import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
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
  if (!data) return null;

  return (
    <VStack space="md">
      {/* Date Filter Section */}
        <VStack space="lg">
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
        </VStack>

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
  );
}
