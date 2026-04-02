import React, { useState } from "react";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { ScrollView } from "@/components/ui/scroll-view";
import { useAuth } from "@/contexts/AuthContext";
import { useKvaRevenueData } from "@/http/services";
import ErrorScreen from "@/components/placeholders/error-screen";
import AuthLoading from "@/components/auth/auth-loading";
import RevenueScreenPlaceholder from "@/components/placeholders/revenue-screen-placeholder";
import RevenueScreen from "@/components/page_revenue/revenue-screen";
import NoData from "@/components/placeholders/no-data";
import { formatDate } from "@/utils/helpers";

export default function CreateTicketForm() {
  const now = new Date();
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  );
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data, isPending, error, refetch } = useKvaRevenueData({
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
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <Center>
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">
              Revenue
            </Heading>
          </VStack>
          <RevenueScreenPlaceholder isLoading={isPending} />
          <AuthLoading
            authLoading={authLoading}
            isAuthenticated={isAuthenticated}
          />
          <ErrorScreen error={error} refetch={refetch} />
          <NoData data={data} isLoading={isPending} />
          <RevenueScreen
            startDate={startDate}
            endDate={endDate}
            setStartDateCallback={setStartDateCallback}
            setEndDateCallback={setEndDateCallback}
            data={data}
          />
        </Box>
      </Center>
    </ScrollView>
  );
}
