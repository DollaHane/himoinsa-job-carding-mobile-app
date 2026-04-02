import React from "react";

import { Box } from "../ui/box";
import { Text } from "../ui/text";

interface NoDataProps {
  data: any;
  isLoading?: boolean;
}

export default function NoData({ data, isLoading }: NoDataProps) {
  if (data || !isLoading) return null;

  return (
    <Box className="flex-1 items-center justify-center p-4">
      <Text className="text-primary">No data available</Text>
    </Box>
  );
}
