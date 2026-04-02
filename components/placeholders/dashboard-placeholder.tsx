import React from "react";
import { ScrollView } from "../ui/scroll-view";
import { VStack } from "../ui/vstack";
import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { Center } from "../ui/center";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";

interface DashboardPlaceholderProps {
  isLoading: boolean;
}

export default function DashboardPlaceholder({
  isLoading,
}: DashboardPlaceholderProps) {
  if (!isLoading) return null;

  return (
    <VStack space="md">
      {/* Filter Button */}
      <Box className="flex-col bg-background p-4 rounded-lg items-start justify-start gap-4">
        <Skeleton className="h-10 w-full bg-background rounded-full" />
        <Skeleton className="h-10 w-full bg-background rounded-full" />
        <Skeleton className="h-10 w-full bg-background rounded-full" />
      </Box>

      {/* Stat Cards */}
      <HStack space="md">
        <Box className="flex-1 rounded-lg bg-background px-4 py-5 items-center justify-center">
          <VStack space="xs" className="items-center w-full">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </VStack>
        </Box>
        <Box className="flex-1 rounded-lg bg-background px-4 py-5 items-center justify-center">
          <VStack space="xs" className="items-center w-full">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-8 w-20 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </VStack>
        </Box>
      </HStack>

      {/* Charts */}
      <Box className="bg-background rounded-lg p-4">
        <VStack space="md">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-64 w-full rounded" />
        </VStack>
      </Box>

      <Box className="bg-background rounded-lg p-4">
        <VStack space="md">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-64 w-full rounded" />
        </VStack>
      </Box>
    </VStack>
  );
}
