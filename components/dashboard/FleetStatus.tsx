import { Box } from "../ui/box"
import { HStack } from "../ui/hstack"
import { Text } from "../ui/text"

const fleetData = [
  { label: "Contracts:", value: 13 },
  { label: "Long-Hire:", value: 93 },
  { label: "In Repair:", value: 20 },
  { label: "Units In Use:", value: 106 },
  { label: "Available Units:", value: 87 },
]

export function FleetStatus() {
  return (
    <Box className="rounded-lg border border-primary-900 dark:border-white bg-card p-4">
      <Text className="border-b border-primary-900 dark:border-white pb-1 text-sm font-bold text-primary-900 dark:text-white">
        Fleet Status
      </Text>
      <Box className="mt-2 space-y-1.5">
        {fleetData.map((item) => (
          <HStack key={item.label} className="flex items-center justify-between">
            <Text className="text-xs text-primary-900 dark:text-white">{item.label}</Text>
            <Text className="text-xs font-semibold text-primary-900 dark:text-white">
              {item.value}
            </Text>
          </HStack>
        ))}
      </Box>
    </Box>
  )
}