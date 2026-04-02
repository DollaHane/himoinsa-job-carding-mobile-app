import React from "react"
import { ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native"
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

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop — fills true full screen */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        activeOpacity={1}
      >
        <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="dark" />
      </TouchableOpacity>

      {/* Modal Content — centred over full screen */}
      <Box style={StyleSheet.absoluteFill} className="items-center justify-center" pointerEvents="box-none">
        <Box
          className="w-[90%] max-h-[80%] bg-background border border-border rounded-lg shadow-lg overflow-hidden"
          pointerEvents="auto"
        >
          <VStack space="md" className="h-full">
            {/* Header */}
            <HStack className="items-center justify-between p-4 border-b border-border bg-background">
              <Heading size="lg" className="text-primary">
                {kva} kVA Contracts
              </Heading>
              <TouchableOpacity onPress={onClose}>
                <Icon as={X} className="text-primary" size="xl" />
              </TouchableOpacity>
            </HStack>

            {/* Body */}
            <Box className="flex-1 px-4 pb-4">
              {isLoading ? (
                <Box className="items-center justify-center py-10">
                  <Spinner size="large" />
                  <Text className="mt-4 text-primary">Loading contracts...</Text>
                </Box>
              ) : error ? (
                <Box className="items-center justify-center py-10">
                  <Text className="text-red-500">Error loading contracts: {(error as Error).message}</Text>
                </Box>
              ) : data && data.contracts.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={true} className="pb-5">
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <VStack space="sm" style={{ minWidth: 870 }}>
                      {/* Table Header */}
                      <HStack className="pb-3 border-b-2 border-border">
                        <Box style={{ width: 150 }}>
                          <Text className="text-xs font-semibold text-primary">Contract #</Text>
                        </Box>
                        <Box style={{ width: 180 }}>
                          <Text className="text-xs font-semibold text-primary">Customer</Text>
                        </Box>
                        <Box style={{ width: 180 }}>
                          <Text className="text-xs font-semibold text-primary">Industry</Text>
                        </Box>
                        <Box style={{ width: 120 }}>
                          <Text className="text-xs font-semibold text-primary text-right">Contract Value</Text>
                        </Box>
                        <Box style={{ width: 120 }}>
                          <Text className="text-xs font-semibold text-primary text-center">Start Date</Text>
                        </Box>
                        <Box style={{ width: 120 }}>
                          <Text className="text-xs font-semibold text-primary text-center">End Date</Text>
                        </Box>
                      </HStack>

                      {/* Table Rows */}
                      {data.contracts.map((contract: KvaContractDetail) => (
                        <HStack key={contract.contract_id} className="py-3 border-b border-border">
                          <Box style={{ width: 150 }}>
                            <Text className="text-sm text-primary font-medium" numberOfLines={1}>
                              {contract.contract_number}
                            </Text>
                          </Box>
                          <Box style={{ width: 180 }}>
                            <Text className="text-sm text-primary" numberOfLines={1}>{contract.customer}</Text>
                          </Box>
                          <Box style={{ width: 180 }}>
                            <Text className="text-sm text-primary" numberOfLines={1}>{contract.industry}</Text>
                          </Box>
                          <Box style={{ width: 120 }}>
                            <Text className="text-sm text-primary text-right" numberOfLines={1}>
                              {formatCurrency(contract.contract_value)}
                            </Text>
                          </Box>
                          <Box style={{ width: 120 }}>
                            <Text className="text-sm text-primary text-center" numberOfLines={1}>
                              {formatDate(contract.start_date)}
                            </Text>
                          </Box>
                          <Box style={{ width: 120 }}>
                            <Text className="text-sm text-primary text-center" numberOfLines={1}>
                              {formatDate(contract.end_date)}
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </ScrollView>
                </ScrollView>
              ) : (
                <Box className="items-center justify-center py-10">
                  <Text className="text-primary">No contracts found</Text>
                </Box>
              )}
            </Box>
          </VStack>
        </Box>
      </Box>
    </Modal>
  )
}
