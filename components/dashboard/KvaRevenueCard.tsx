import { Box } from "../ui/box"
import { Text } from "../ui/text"
import { VStack } from "../ui/vstack"

interface KvaRevenueCardProps {
  title: string
  value: string
  subtitle?: string
  borderColor: string
}

export function KvaRevenueCard({ title, value, subtitle, borderColor }: KvaRevenueCardProps) {
  return (
    <Box
      className="rounded-lg border-2 bg-background px-4 py-5 items-center justify-center"
      style={{ borderColor }}
    >
      <VStack space="xs" className="items-center">
        <Text className="text-sm text-primary text-center">{title}</Text>
        <Text className="text-2xl font-bold text-primary text-center">{value}</Text>
        {subtitle && (
          <Text className="text-xs text-primary text-center">{subtitle}</Text>
        )}
      </VStack>
    </Box>
  )
}
