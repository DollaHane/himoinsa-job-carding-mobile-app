import React from 'react';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { ScrollView } from '@/components/ui/scroll-view';
import { Icon } from '@/components/ui/icon';
import { User, Mail, Phone, Briefcase, Hash } from 'lucide-react-native';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Text className="text-typography-600">Loading...</Text>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16">
          <VStack
            className="mb-6 pt-4"
            space="xs"
          >
            <Heading className="text-3xl font-bold text-primary-900 dark:text-white mb-10">Profile</Heading>

          {isAuthenticated && user ? (
            <Box className="bg-background-0 rounded-2xl shadow-sm border border-secondary-300 overflow-hidden">
              <VStack space="lg" className="p-4">
                {/* Name */}
                <HStack className="items-center gap-4">
                  <Box className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center">
                    <Icon as={User} size="lg" className="text-blue-600 dark:text-blue-400" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="text-xs text-primary-500 dark:text-primary-400">Name</Text>
                    <Text className="text-base font-semibold text-primary-900 dark:text-white">
                      {user.firstname} {user.lastname}
                    </Text>
                  </VStack>
                </HStack>

                {/* Email */}
                <HStack className="items-center gap-4">
                  <Box className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center">
                    <Icon as={Mail} size="lg" className="text-green-600 dark:text-green-400" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="text-xs text-primary-500 dark:text-primary-400">Email</Text>
                    <Text className="text-base font-semibold text-primary-900 dark:text-white">
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
                    <Text className="text-xs text-primary-500 dark:text-primary-400">Phone</Text>
                    <Text className="text-base font-semibold text-primary-900 dark:text-white">
                      {user.phonenumber || 'Not provided'}
                    </Text>
                  </VStack>
                </HStack>

                {/* Title */}
                <HStack className="items-center gap-4">
                  <Box className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 items-center justify-center">
                    <Icon as={Briefcase} size="lg" className="text-orange-600 dark:text-orange-400" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="text-xs text-primary-500 dark:text-primary-400">Title</Text>
                    <Text className="text-base font-semibold text-primary-900 dark:text-white">
                      {user.title || 'Not provided'}
                    </Text>
                  </VStack>
                </HStack>

                {/* User ID */}
                <HStack className="items-center gap-4">
                  <Box className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-900/20 items-center justify-center">
                    <Icon as={Hash} size="lg" className="text-gray-600 dark:text-gray-400" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="text-xs text-primary-500 dark:text-primary-400">User ID</Text>
                    <Text className="text-sm font-mono text-primary-900 dark:text-white">
                      {user.userid}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          ) : (
            <Text className="text-center text-primary-500">Not logged in</Text>
          )}
        </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
