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
      className="rounded-lg border-2 bg-background px-3 py-4 text-center"
      style={{ borderColor }}
    >
      <Text className="text-center text-primary">{label}</Text>
      <Text className="mt-1 text-center text-2xl font-bold text-primary">{value}</Text>
    </Box>
  )
}