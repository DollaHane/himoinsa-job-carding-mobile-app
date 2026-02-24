import React, { useState } from "react"
import { ScrollView } from "react-native"
import { Box } from "@/components/ui/box"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { Button, ButtonText } from "@/components/ui/button"
import { Input, InputField } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { KvaRevenueSummary } from "@/components/dashboard/KvaRevenueSummary"
import { KvaRevenueTable } from "@/components/dashboard/KvaRevenueTable"
import { useKvaRevenueData } from "@/http/services"

export default function KvaRevenueDashboard() {
  const [startDate, setStartDate] = useState("2026-02-01")
  const [endDate, setEndDate] = useState("2026-02-28")
  
  const { data, isLoading, error, refetch } = useKvaRevenueData({
    start_date: startDate,
    end_date: endDate,
  })

  const handleApply = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Spinner size="large" />
        <Text className="mt-4 text-primary dark:text-white">Loading revenue data...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500">Error loading data: {(error as Error).message}</Text>
        <Button onPress={handleApply} className="mt-4">
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    )
  }

  if (!data) {
    return (
      <Box className="flex-1 items-center justify-center p-4">
        <Text className="text-primary dark:text-white">No data available</Text>
      </Box>
    )
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Box className="p-4">
        <VStack space="md">
          {/* Date Filter Section */}
          <Box className="bg-card rounded-lg p-4">
            <HStack space="md" className="items-end">
              <VStack className="flex-1">
                <Text className="text-xs text-primary dark:text-white mb-1">Start Date</Text>
                <Input variant="outline" size="sm">
                  <InputField
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="YYYY-MM-DD"
                  />
                </Input>
              </VStack>
              
              <VStack className="flex-1">
                <Text className="text-xs text-primary dark:text-white mb-1">End Date</Text>
                <Input variant="outline" size="sm">
                  <InputField
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="YYYY-MM-DD"
                  />
                </Input>
              </VStack>
              
              <Button onPress={handleApply} size="sm" className="bg-blue-500">
                <ButtonText>Apply</ButtonText>
              </Button>
            </HStack>
          </Box>

          {/* Summary Cards */}
          <KvaRevenueSummary data={data} />

          {/* Revenue Table */}
          <KvaRevenueTable
            data={data.kva_data}
            grandTotalRevenue={data.grand_total_revenue}
            grandTotalContracts={data.grand_total_contracts}
          />
        </VStack>
      </Box>
    </ScrollView>
  )
}
