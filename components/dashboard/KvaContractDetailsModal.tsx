import React from "react"
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Heading } from "@/components/ui/heading"
import { Icon } from "@/components/ui/icon"
import { Spinner } from "@/components/ui/spinner"
import { X } from "lucide-react-native"
import { useKvaContractDetails } from "@/http/services"
import { KvaContractDetail } from "@/types/revenue"

interface KvaContractDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  kva: number
  startDate: string
  endDate: string
}

export function KvaContractDetailsModal({ isOpen, onClose, kva, startDate, endDate }: KvaContractDetailsModalProps) {
  const { data, isLoading, error } = useKvaContractDetails(
    { start_date: startDate, end_date: endDate, kva },
    isOpen
  )

  const formatCurrency = (value: number) => {
    return `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (!isOpen) return null

  return (
    <Box style={StyleSheet.absoluteFill} className="items-center justify-center" pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableOpacity
        // style={StyleSheet.absoluteFill}
        className="absolute w-[100vw] h-[100vh]"
        onPress={onClose}
        activeOpacity={1}
      >
        <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />
      </TouchableOpacity>

      {/* Modal Content */}
      <Box 
        className="w-[90%] max-h-[80%] bg-background border border-border rounded-lg shadow-lg overflow-hidden" 
        style={{ position: 'absolute' }}
        pointerEvents="auto"
      >
        <VStack space="md" className="h-full">
          {/* Header */}
          <HStack className="items-center justify-between p-4 border-b border-border bg-card">
            <Heading size="lg" className="text-primary dark:text-white">
              {kva} kVA Contracts
            </Heading>
            <TouchableOpacity onPress={onClose}>
              <Icon as={X} className="text-primary dark:text-white" size="xl" />
            </TouchableOpacity>
          </HStack>

          {/* Body */}
          <Box className="flex-1 px-4 pb-4">
            {isLoading ? (
              <Box className="items-center justify-center py-10">
                <Spinner size="large" />
                <Text className="mt-4 text-primary dark:text-white">Loading contracts...</Text>
              </Box>
            ) : error ? (
              <Box className="items-center justify-center py-10">
                <Text className="text-red-500">Error loading contracts: {(error as Error).message}</Text>
              </Box>
            ) : data && data.contracts.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={true} className="pb-5">
                <VStack space="sm" style={{ minWidth: 810 }}>
                  {/* Table Header */}
                  <HStack className="pb-3 border-b-2 border-border">
                    <Box style={{ width: 150 }}>
                      <Text className="text-xs font-semibold text-primary dark:text-white">Contract #</Text>
                    </Box>
                    <Box style={{ width: 180 }}>
                      <Text className="text-xs font-semibold text-primary dark:text-white">Customer</Text>
                    </Box>
                    <Box style={{ width: 120 }}>
                      <Text className="text-xs font-semibold text-primary dark:text-white">Industry</Text>
                    </Box>
                    <Box style={{ width: 120 }}>
                      <Text className="text-xs font-semibold text-primary dark:text-white text-right">Contract Value</Text>
                    </Box>
                    <Box style={{ width: 120 }}>
                      <Text className="text-xs font-semibold text-primary dark:text-white text-center">Start Date</Text>
                    </Box>
                    <Box style={{ width: 120 }}>
                      <Text className="text-xs font-semibold text-primary dark:text-white text-center">End Date</Text>
                    </Box>
                  </HStack>

                  {/* Table Rows */}
                  {data.contracts.map((contract: KvaContractDetail) => (
                    <HStack key={contract.contract_id} className="py-3 border-b border-border">
                      <Box style={{ width: 150 }}>
                        <Text className="text-sm text-primary dark:text-white font-medium">
                          {contract.contract_number}
                        </Text>
                      </Box>
                      <Box style={{ width: 180 }}>
                        <Text className="text-sm text-primary dark:text-white">{contract.customer}</Text>
                      </Box>
                      <Box style={{ width: 120 }}>
                        <Text className="text-sm text-primary dark:text-white">{contract.industry}</Text>
                      </Box>
                      <Box style={{ width: 120 }}>
                        <Text className="text-sm text-primary dark:text-white text-right">
                          {formatCurrency(contract.contract_value)}
                        </Text>
                      </Box>
                      <Box style={{ width: 120 }}>
                        <Text className="text-sm text-primary dark:text-white text-center">
                          {formatDate(contract.start_date)}
                        </Text>
                      </Box>
                      <Box style={{ width: 120 }}>
                        <Text className="text-sm text-primary dark:text-white text-center">
                          {formatDate(contract.end_date)}
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              </ScrollView>
            ) : (
              <Box className="items-center justify-center py-10">
                <Text className="text-primary dark:text-white">No contracts found</Text>
              </Box>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}
