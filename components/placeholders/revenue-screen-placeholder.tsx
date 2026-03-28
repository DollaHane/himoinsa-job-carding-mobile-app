import React from "react";
import { ScrollView } from "../ui/scroll-view";
import { VStack } from "../ui/vstack";
import { Box } from "../ui/box";
import { Heading } from "../ui/heading";
import { Center } from "../ui/center";
import { HStack } from "../ui/hstack";
import { Skeleton } from "../ui/skeleton";

interface RevenueScreenPlaceholderProps {
  isLoading: boolean;
}

export default function RevenueScreenPlaceholder({
  isLoading,
}: RevenueScreenPlaceholderProps) {
  if (!isLoading) return null;

  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">Revenue</Heading>
          </VStack>
          <VStack space="md">
            <Box className="bg-card rounded-lg p-4">
              <VStack space="xl">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </VStack>
            </Box>

            <VStack space="md">
              <Box className="flex-1 rounded-lg bg-background px-4 py-5 items-center justify-center">
                <VStack space="xs" className="items-center">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </VStack>
              </Box>
              <Box className="flex-1 rounded-lg bg-background px-4 py-5 items-center justify-center">
                <VStack space="xs" className="items-center">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </VStack>
              </Box>
              <Box className="flex-1 rounded-lg bg-background px-4 py-5 items-center justify-center">
                <VStack space="xs" className="items-center">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </VStack>
              </Box>
            </VStack>

            <Box className="bg-card rounded-lg p-4">
              <VStack space="sm" className="flex">
                <Skeleton className="h-6 w-40 rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
