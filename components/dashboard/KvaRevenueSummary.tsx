import React from "react"
import { Box } from "../ui/box"
import { KvaRevenueCard } from "./KvaRevenueCard"
import { KvaRevenueData } from "@/types/revenue"

interface KvaRevenueSummaryProps {
  data: KvaRevenueData
}

export function KvaRevenueSummary({ data }: KvaRevenueSummaryProps) {
  const formatCurrency = (value: number) => {
    return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <Box className="grid grid-cols-3 gap-3">
      <KvaRevenueCard
        title="Highest Revenue kVA"
        value={data.top_revenue_kva ? `${data.top_revenue_kva.kva} kVA` : 'N/A'}
        subtitle={data.top_revenue_kva ? formatCurrency(data.top_revenue_kva.total_revenue) : ''}
        borderColor="#f59e0b"
      />
      <KvaRevenueCard
        title="Most Popular kVA"
        value={data.most_popular_kva ? `${data.most_popular_kva.kva} kVA` : 'N/A'}
        subtitle={data.most_popular_kva ? `${data.most_popular_kva.total_contracts} Contracts` : ''}
        borderColor="#38bdf8"
      />
      <KvaRevenueCard
        title="Most Popular Industry"
        value={data.most_popular_industry ? data.most_popular_industry.name : 'N/A'}
        subtitle={data.most_popular_industry ? `${data.most_popular_industry.total_contracts} Contracts` : ''}
        borderColor="#34d399"
      />
    </Box>
  )
}
