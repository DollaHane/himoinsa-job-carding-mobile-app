import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/http/services";
import { DashBoardFilter } from "@/types/dashboard";
import AuthLoading from "@/components/auth/auth-loading";
import ErrorScreen from "@/components/placeholders/error-screen";
import NoData from "@/components/placeholders/no-data";
import DashboardPlaceholder from "@/components/placeholders/dashboard-placeholder";
import { getTodayLocalDate } from "@/utils/helpers";
import FleetControlPage from "@/components/page_fleet_control/fleet-control-page";

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

  const toggleKva = (kva: string) => {
    setSelectedKva((prev) =>
      prev.includes(kva) ? prev.filter((k) => k !== kva) : [...prev, kva],
    );
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
    <>
      <DashboardPlaceholder isLoading={isDashboardLoading} />
      <AuthLoading authLoading={isLoading} isAuthenticated={isAuthenticated} />
      <ErrorScreen error={error} refetch={refetch} />
      <NoData data={dashboard_data} />
      <FleetControlPage
        dashboard_data={dashboard_data}
        selectedDate={selectedDate}
        setSelectedDateCallback={setSelectedDate}
        selectedKva={selectedKva}
        toggleKva={toggleKva}
        kvaOptions={kvaOptions}
      />
    </>
  );
}
