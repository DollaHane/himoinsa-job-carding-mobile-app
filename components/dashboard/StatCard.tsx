import { Box } from "../ui/box"
import { Text } from "../ui/text"

interface StatCardProps {
  label: string
  value: string
  borderColor: string
}

export function StatCard({ label, value, borderColor }: StatCardProps) {
  return (
    <Box
      className="rounded-lg border-2 bg-card px-3 py-4 text-center"
      style={{ borderColor }}
    >
      <Text className="text-xs text-primary-900 dark:text-white">{label}</Text>
      <Text className="mt-1 text-lg font-bold text-primary-900 dark:text-white">{value}</Text>
    </Box>
  )
}