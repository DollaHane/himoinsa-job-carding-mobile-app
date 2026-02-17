import { useAuth } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";

import { DashBoardFilter } from "@/types/dashboard";

import { get_fleet_control } from "./api";

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
    const response = await axios.get(get_fleet_control, {
        params: params,
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    })
    return response.data
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