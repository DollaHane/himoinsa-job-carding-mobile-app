import React from "react";

import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";
import { AlertCircle } from "lucide-react-native";

interface NoDataProps {
  data: any;
  isLoading: boolean;
}

export default function NoData({ data, isLoading }: NoDataProps) {
  if (isLoading || data) return null;

  return (
    <Box className="h-[50vh] flex flex-col items-center justify-center p-4 gap-10">
      <Icon as={AlertCircle} className="w-12 h-12 text-error" />
      <Text className="text-primary text-xl">No data available</Text>
    </Box>
  );
}
