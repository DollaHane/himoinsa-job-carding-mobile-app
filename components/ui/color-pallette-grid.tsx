import React from 'react'
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';

export default function ColorPaletteGrid() {
  return (
    <Box className="mt-8">
      <Heading className="text-xl font-bold text-primary mb-4">Color Palette</Heading>
            
            <VStack space="md">
              {/* Primary Colors */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Primary</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-primary items-center justify-center">
                    <Text className="text-xs text-primary-foreground font-medium">primary</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-primary-muted items-center justify-center">
                    <Text className="text-xs text-primary font-medium">primary-muted</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-primary-foreground items-center justify-center border border-border">
                    <Text className="text-xs text-primary font-medium">primary-fg</Text>
                  </Box>
                </HStack>
              </VStack>

              {/* Secondary Colors */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Secondary</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-secondary items-center justify-center">
                    <Text className="text-xs text-secondary-foreground font-medium">secondary</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-secondary-muted items-center justify-center">
                    <Text className="text-xs text-primary font-medium">secondary-muted</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-secondary-foreground items-center justify-center">
                    <Text className="text-xs text-background font-medium">secondary-fg</Text>
                  </Box>
                </HStack>
              </VStack>

              {/* Tertiary Colors */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Tertiary</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-tertiary items-center justify-center">
                    <Text className="text-xs text-tertiary-foreground font-medium">tertiary</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-tertiary-muted items-center justify-center">
                    <Text className="text-xs text-tertiary font-medium">tertiary-muted</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-tertiary-foreground items-center justify-center border border-border">
                    <Text className="text-xs text-primary font-medium">tertiary-fg</Text>
                  </Box>
                </HStack>
              </VStack>

              {/* Status Colors */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Status</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-error items-center justify-center">
                    <Text className="text-xs text-white font-medium">error</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-success items-center justify-center">
                    <Text className="text-xs text-white font-medium">success</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-warning items-center justify-center">
                    <Text className="text-xs text-white font-medium">warning</Text>
                  </Box>
                </HStack>
              </VStack>

              {/* Info & Accent */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Info & Accent</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-info items-center justify-center">
                    <Text className="text-xs text-white font-medium">info</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-accent-primary items-center justify-center">
                    <Text className="text-xs text-white font-medium">accent-primary</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-accent-muted items-center justify-center">
                    <Text className="text-xs text-white font-medium">accent-muted</Text>
                  </Box>
                </HStack>
              </VStack>

              {/* Background & Border */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Background & Border</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-background items-center justify-center border border-border">
                    <Text className="text-xs text-primary font-medium">background</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-background-subtle items-center justify-center">
                    <Text className="text-xs text-primary font-medium">bg-subtle</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg border-4 border-border bg-background items-center justify-center">
                    <Text className="text-xs text-primary font-medium">border</Text>
                  </Box>
                </HStack>
              </VStack>

              {/* Text Colors */}
              <VStack space="xs">
                <Text className="text-sm font-semibold text-primary  mb-2">Text</Text>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-background-subtle items-center justify-center">
                    <Text className="text-base text-text font-medium">text</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-background-subtle items-center justify-center">
                    <Text className="text-base text-text-muted font-medium">text-muted</Text>
                  </Box>
                  <Box className="flex-1 h-20 rounded-lg bg-background-subtle items-center justify-center">
                    <Text className="text-base text-primary font-medium">primary (text)</Text>
                  </Box>
                </HStack>
                <HStack space="sm">
                  <Box className="flex-1 h-20 rounded-lg bg-primary items-center justify-center">
                    <Text className="text-base text-text-inverse font-medium">text-inverse</Text>
                  </Box>
                </HStack>
              </VStack>
            </VStack>
          </Box>
  )
}