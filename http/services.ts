import { useQuery } from "@tanstack/react-query";

import { DashboardData } from "./actions";
import { DashBoardFilter } from "@/types/dashboard";
import { useAuth } from "@/contexts/AuthContext";

export function useDashboardData(params: DashBoardFilter) {
    const { token } = useAuth();
    
    console.log('Token in useDashboardData:', token);
    
    return useQuery({
        queryKey: ['dashboard-data', params],
        queryFn: () => DashboardData(params, token),
        enabled: !!token
    })
}