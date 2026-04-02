import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/http/services";
import { DashBoardFilter } from "@/types/dashboard";
import AuthLoading from "@/components/auth/auth-loading";
import ErrorScreen from "@/components/placeholders/error-screen";
import NoData from "@/components/placeholders/no-data";
import DashboardPlaceholder from "@/components/placeholders/dashboard-placeholder";
import { getTodayLocalDate } from "@/utils/helpers";
import FleetControlPage from "@/components/page_fleet_control/fleet-control-page";
import { VStack } from "@/components/ui/vstack";
import { ScrollView } from "react-native";

export default function Tickets() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayLocalDate());
  const [selectedKva, setSelectedKva] = useState<string[]>([]);
  const [showPrevious, setShowPrevious] = useState<boolean>(false);
  const [kvaOptions, setKvaOptions] = useState<string[]>([]);

  const filters: DashBoardFilter = {
    date: selectedDate || null,
    kva: selectedKva.length > 0 ? selectedKva : null,
    show_previous: showPrevious,
  };

  const setSelectedKvaCallback = (kva: string) => {
    setSelectedKva((prev) =>
      prev.includes(kva) ? prev.filter((k) => k !== kva) : [...prev, kva],
    );
  };
  const setShowPreviousCallback = (show: boolean) => {
    setShowPrevious(show);
  };

  const {
    data: dashboard_data,
    isLoading: isDashboardLoading,
    error,
    refetch,
  } = useDashboardData(filters);

  // Update KVA options when dashboard data loads
  useEffect(() => {
    if (dashboard_data?.chart_data?.kva_filter) {
      setKvaOptions(dashboard_data.chart_data.kva_filter);
    }
  }, [dashboard_data]);

  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">
              Dashboard
            </Heading>
          </VStack>
          <DashboardPlaceholder isLoading={isDashboardLoading} />
          <AuthLoading
            authLoading={isLoading}
            isAuthenticated={isAuthenticated}
          />
          <ErrorScreen error={error} refetch={refetch} />
          <NoData data={dashboard_data} isLoading={isDashboardLoading} />
          <FleetControlPage
            dashboard_data={dashboard_data}
            isLoading={isDashboardLoading}
            selectedDate={selectedDate}
            setSelectedDateCallback={setSelectedDate}
            selectedKva={selectedKva}
            setSelectedKvaCallback={setSelectedKvaCallback}
            showPrevious={showPrevious}
            setShowPreviousCallback={setShowPreviousCallback}
            kvaOptions={kvaOptions}
          />
        </Box>
      </Center>
    </ScrollView>
  );
}
