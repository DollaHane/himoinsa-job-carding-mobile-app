import { useAuth } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";

import { DashBoardFilter } from "@/types/dashboard";
import { KvaRevenueData, KvaContractDetailsResponse } from "@/types/revenue";

import { get_fleet_control, get_kva_revenue, get_kva_contract_details } from "./api";

type ApiError = {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

/**
 * Fetch data for the main dashboard view
 * 
 */
export async function DashboardData(params: DashBoardFilter, token: string | null) {
    console.log('url', get_fleet_control);
    try {
        const response = await axios.get(get_fleet_control, {
            params: params,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        return response.data.data
    } catch (error) {
        console.error('DashboardData error:', error);
        console.error('Error details:', parseError(error));
        throw error;
    }
}

/**
 * Fetch KVA Revenue data
 * 
 */
export async function KvaRevenueDataAction(params: { start_date: string; end_date: string }, token: string | null) {
    console.log('url', get_kva_revenue);
    try {
        const response = await axios.get(get_kva_revenue, {
            params: params,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        return response.data.data as KvaRevenueData
    } catch (error) {
        console.error('KvaRevenueData error:', error);
        console.error('Error details:', parseError(error));
        throw error;
    }
}

/**
 * Fetch contract details for a specific kVA size
 * 
 */
export async function KvaContractDetailsAction(params: { start_date: string; end_date: string; kva: number }, token: string | null) {
    console.log('url', get_kva_contract_details);
    console.log('params', params);
    try {
        const response = await axios.get(get_kva_contract_details, {
            params: params,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
        console.log('KvaContractDetails response', response.data);
        return {
            kva: response.data.kva,
            contracts: response.data.contracts
        } as KvaContractDetailsResponse
    } catch (error) {
        console.error('KvaContractDetailsAction error:', error);
        console.error('Error details:', parseError(error));
        throw error;
    }
}

/**
 * Error parser for try/catch statement
 * 
 */
function parseError(error: unknown): ApiError {
  // Axios HTTP error (4xx, 5xx)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string[]> }>

    return {
      message: axiosError.response?.data?.message ?? axiosError.message,
      status: axiosError.response?.status,
      errors: axiosError.response?.data?.errors, // Laravel validation bag
    }
  }

  if (error instanceof Error) {
    return { message: error.message }
  }

  return { message: "An unexpected error occurred" }
}