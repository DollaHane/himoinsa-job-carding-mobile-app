import React from "react";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Box } from "../ui/box";
import { Skeleton } from "../ui/skeleton";

interface ProfilePlaceholderProps {
  isLoading: boolean;
}

export default function ProfilePlaceholder({ isLoading }: ProfilePlaceholderProps) {
  if (!isLoading) return null;

  return (
    <Box className="bg-background rounded-2xl border border-border overflow-hidden">
      <VStack space="lg" className="p-4">
        {/* Five rows matching Name / Email / Phone / Title / User ID */}
        {[...Array(5)].map((_, i) => (
          <HStack key={i} className="items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <VStack space="xs" className="flex-1">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-5 w-48 rounded" />
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
