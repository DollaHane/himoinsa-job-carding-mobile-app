import React, { useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { KvaRevenueItem } from "@/types/revenue"
import { HStack } from "../ui/hstack"
import { VStack } from "../ui/vstack"
import { KvaContractDetailsModal } from "./KvaContractDetailsModal"

interface KvaRevenueTableProps {
  data: KvaRevenueItem[]
  grandTotalRevenue: number
  grandTotalContracts: number
  startDate: string
  endDate: string
}

export function KvaRevenueTable({ data, grandTotalRevenue, grandTotalContracts, startDate, endDate }: KvaRevenueTableProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedKva, setSelectedKva] = useState<number>(0)

  const formatCurrency = (value: number) => {
    return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleContractClick = (kva: number) => {
    setSelectedKva(kva)
    setModalOpen(true)
  }

  return (
    <>
      <Box className="bg-card rounded-lg p-4 mt-4">
      <Text className="text-lg font-bold text-primary dark:text-white mb-4">kVA Revenue</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={true} className="pb-5">
        <VStack space="sm" style={{ minWidth: 630 }}>
          {/* Table Header */}
          <HStack className="pb-3 border-b border-gray-200 dark:border-gray-700">
            <Box style={{ width: 50 }}>
              <Text className="text-xs font-semibold text-primary dark:text-white">kVA Size</Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-xs font-semibold text-primary dark:text-white text-right">Total Revenue</Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-xs font-semibold text-primary dark:text-white text-center">Total Contracts</Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-xs font-semibold text-primary dark:text-white text-center">Top Industry</Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-xs font-semibold text-primary dark:text-white text-right">Avg Revenue/Contract</Text>
            </Box>
            <Box style={{ width: 100 }}>
              <Text className="text-xs font-semibold text-primary dark:text-white text-right">% of Total</Text>
            </Box>
          </HStack>

          {/* Table Rows */}
          {data.map((item, index) => (
            <HStack key={index} className="py-3 border-b border-gray-100 dark:border-gray-800">
              <Box style={{ width: 50 }}>
                <Text className="text-sm text-primary dark:text-white font-medium">{item.kva} kVA</Text>
              </Box>
              <Box style={{ width: 120 }}>
                <Text className="text-sm text-primary dark:text-white text-right">
                  {formatCurrency(item.total_revenue)}
                </Text>
              </Box>
              <Box style={{ width: 120 }}>
                <TouchableOpacity onPress={() => handleContractClick(item.kva)}>
                  <Text className="text-sm text-blue-600 dark:text-blue-400 text-center font-medium underline">
                    {item.total_contracts}
                  </Text>
                </TouchableOpacity>
              </Box>
              <Box style={{ width: 120 }}>
                <Text className="text-sm text-primary dark:text-white text-center">{item.top_industry}</Text>
              </Box>
              <Box style={{ width: 120 }}>
                <Text className="text-sm text-primary dark:text-white text-right">
                  {formatCurrency(item.avg_revenue)}
                </Text>
              </Box>
              <Box style={{ width: 100 }}>
                <Text className="text-sm text-primary dark:text-white text-right">{item.percentage}%</Text>
              </Box>
            </HStack>
          ))}

          {/* Total Row */}
          <HStack className="pt-3 mt-2 border-t-2 border-gray-300 dark:border-gray-600">
            <Box style={{ width: 50 }}>
              <Text className="text-sm font-bold text-primary dark:text-white">Total</Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-sm font-bold text-primary dark:text-white text-right">
                {formatCurrency(grandTotalRevenue)}
              </Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-sm font-bold text-primary dark:text-white text-center">
                {grandTotalContracts}
              </Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-sm text-primary dark:text-white text-center"></Text>
            </Box>
            <Box style={{ width: 120 }}>
              <Text className="text-sm text-primary dark:text-white text-right">-</Text>
            </Box>
            <Box style={{ width: 100 }}>
              <Text className="text-sm font-bold text-primary dark:text-white text-right">100%</Text>
            </Box>
          </HStack>
        </VStack>
      </ScrollView>
    </Box>

    <KvaContractDetailsModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      kva={selectedKva}
      startDate={startDate}
      endDate={endDate}
    />
    </>
  )
}
