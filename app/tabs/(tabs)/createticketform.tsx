import React, { useState } from "react";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ScrollView } from "@/components/ui/scroll-view";
import { useAuth } from "@/contexts/AuthContext";
import { DatePicker } from "@/components/form/date-picker";
import { KvaRevenueSummary } from "@/components/page_revenue/kva-revenue-summary";
import { KvaRevenueTable } from "@/components/page_revenue/kva-revenue-table";
import { useKvaRevenueData } from "@/http/services";
import ErrorScreen from "@/components/placeholders/error-screen";
import AuthLoading from "@/components/auth/auth-loading";
import RevenueScreenPlaceholder from "@/components/placeholders/revenue-screen-placeholder";
import RevenueScreen from "@/components/page_revenue/revenue-screen";
import NoData from "@/components/placeholders/no-data";
import { formatDate } from "@/utils/helpers";

export default function CreateTicketForm() {
  const [startDate, setStartDate] = useState<Date | null>(new Date("2026-02-01"),);
  const [endDate, setEndDate] = useState<Date | null>(new Date("2026-02-28"));
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data, isLoading, error, refetch } = useKvaRevenueData({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
  });

  function setStartDateCallback(date: Date | null) {
    setStartDate(date);
  }

  function setEndDateCallback(date: Date | null) {
    setEndDate(date);
  }

  return (
    <>
      <RevenueScreenPlaceholder isLoading={isLoading} />
      <AuthLoading authLoading={authLoading} isAuthenticated={isAuthenticated} />
      <ErrorScreen error={error} refetch={refetch} />
      <NoData data={data} />
      <RevenueScreen
        startDate={startDate}
        endDate={endDate}
        setStartDateCallback={setStartDateCallback}
        setEndDateCallback={setEndDateCallback}
        data={data}
      />
    </>
  );
}
