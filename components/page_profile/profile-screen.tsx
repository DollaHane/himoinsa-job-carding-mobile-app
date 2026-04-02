import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { User, Mail, Phone, Briefcase, Hash } from "lucide-react-native";
import { ROLES } from "@/types/user";
import type { User as UserType } from "@/types/user";

interface ProfileScreenProps {
  user: UserType;
}

export default function ProfileScreen({ user }: ProfileScreenProps) {
  return (
    <Box className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
      <VStack space="lg" className="p-4">
        {/* Name */}
        <HStack className="items-center gap-4">
          <Box className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center">
            <Icon as={User} size="lg" className="text-blue-600 dark:text-blue-400" />
          </Box>
          <VStack className="flex-1">
            <Text className="text-xs text-primary">Name</Text>
            <Text className="text-base font-semibold text-primary">
              {user.first_name} {user.last_name}
            </Text>
          </VStack>
        </HStack>

        {/* Email */}
        <HStack className="items-center gap-4">
          <Box className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center">
            <Icon as={Mail} size="lg" className="text-green-600 dark:text-green-400" />
          </Box>
          <VStack className="flex-1">
            <Text className="text-xs text-primary">Email</Text>
            <Text className="text-base font-semibold text-primary">
              {user.email}
            </Text>
          </VStack>
        </HStack>

        {/* Phone */}
        <HStack className="items-center gap-4">
          <Box className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 items-center justify-center">
            <Icon as={Phone} size="lg" className="text-purple-600 dark:text-purple-400" />
          </Box>
          <VStack className="flex-1">
            <Text className="text-xs text-primary">Phone</Text>
            <Text className="text-base font-semibold text-primary">
              {user.mobile_number || "Not provided"}
            </Text>
          </VStack>
        </HStack>

        {/* Title */}
        <HStack className="items-center gap-4">
          <Box className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 items-center justify-center">
            <Icon as={Briefcase} size="lg" className="text-orange-600 dark:text-orange-400" />
          </Box>
          <VStack className="flex-1">
            <Text className="text-xs text-primary">Title</Text>
            <Text className="text-base font-semibold text-primary">
              {user.position ? ROLES[user.position] : "Not provided"}
            </Text>
          </VStack>
        </HStack>

        {/* User ID */}
        <HStack className="items-center gap-4">
          <Box className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900/20 items-center justify-center">
            <Icon as={Hash} size="lg" className="text-gray-600 dark:text-gray-400" />
          </Box>
          <VStack className="flex-1">
            <Text className="text-xs text-primary">User ID</Text>
            <Text className="text-sm font-mono text-primary">
              {user.id}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
}
