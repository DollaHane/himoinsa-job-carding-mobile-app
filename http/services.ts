import { useQuery } from "@tanstack/react-query";

import { DashboardData, KvaRevenueDataAction, KvaContractDetailsAction } from "./actions";
import { DashBoardFilter, FleetControlData } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";

export function useDashboardData(params: DashBoardFilter) {
    const { token } = useAuth();
    return useQuery({
        queryKey: ['dashboard-data', params],
        queryFn: () => DashboardData(params, token),
        enabled: !!token
    })
}

export function useKvaRevenueData(params: { start_date: string; end_date: string }) {
    const { token } = useAuth();
    return useQuery({
        queryKey: ['kva-revenue-data', params],
        queryFn: () => KvaRevenueDataAction(params, token),
        enabled: !!token && !!params.start_date && !!params.end_date
    })
}

export function useKvaContractDetails(params: { start_date: string; end_date: string; kva: number }, enabled: boolean = false) {
    const { token } = useAuth();
    return useQuery({
        queryKey: ['kva-contract-details', params],
        queryFn: () => KvaContractDetailsAction(params, token),
        enabled: enabled && !!token && !!params.start_date && !!params.end_date && !!params.kva
    })
}