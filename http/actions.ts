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
    try {
        // Prepare params for axios - handle array properly
        const requestParams: any = {
            date: params.date,
            show_previous: params.show_previous,
        };
        
        // Add kva as array if present
        if (params.kva) {
            if (Array.isArray(params.kva)) {
                requestParams.kva = params.kva;
            } else {
                requestParams.kva = [params.kva];
            }
        }

        const response = await axios.get(get_fleet_control, {
            params: requestParams,
            paramsSerializer: {
                indexes: null, // Send as kva[]=200&kva[]=60 format
                serialize: (params) => {
                    const parts: string[] = [];
                    Object.keys(params).forEach((key) => {
                        const value = params[key];
                        if (Array.isArray(value)) {
                            value.forEach((val) => {
                                parts.push(`${key}[]=${encodeURIComponent(val)}`);
                            });
                        } else if (value !== null && value !== undefined) {
                            parts.push(`${key}=${encodeURIComponent(value)}`);
                        }
                    });
                    return parts.join('&');
                }
            },
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
    try {
        const response = await axios.get(get_kva_contract_details, {
            params: params,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        })
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