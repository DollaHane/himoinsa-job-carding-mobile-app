import React from 'react';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';

export default function PolicyPage() {
  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-8">
          <VStack space="lg">
            <Heading className="text-3xl font-bold text-primary-900 dark:text-white mb-4">
              Privacy Policy
            </Heading>

            <Box className="bg-background-0 rounded-2xl shadow-sm border border-secondary-100 p-4">
              <VStack space="md">
                <Text className="text-sm text-primary-800 dark:text-primary-200">
                  Last Updated: {new Date().toLocaleDateString()}
                </Text>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary-900 dark:text-white">
                    1. Information We Collect
                  </Heading>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    We collect information you provide directly to us, including:
                  </Text>
                  <Text className="text-sm text-primary-700 dark:text-primary-300 ml-4">
                    • Name and contact information{'\n'}
                    • User ID and authentication credentials{'\n'}
                    • Support ticket information{'\n'}
                    • Device information
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary-900 dark:text-white">
                    2. How We Use Your Information
                  </Heading>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    We use the information we collect to:
                  </Text>
                  <Text className="text-sm text-primary-700 dark:text-primary-300 ml-4">
                    • Provide, maintain, and improve our services{'\n'}
                    • Process and complete transactions{'\n'}
                    • Send you technical notices and support messages{'\n'}
                    • Respond to your comments and questions
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary-900 dark:text-white">
                    3. Data Security
                  </Heading>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    We use secure storage mechanisms to protect your data. Your authentication
                    credentials are stored securely using industry-standard encryption.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary-900 dark:text-white">
                    4. Your Rights
                  </Heading>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    You have the right to:
                  </Text>
                  <Text className="text-sm text-primary-700 dark:text-primary-300 ml-4">
                    • Access your personal data{'\n'}
                    • Request deletion of your data{'\n'}
                    • Opt-out of communications{'\n'}
                    • Update your information
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary-900 dark:text-white">
                    5. Contact Us
                  </Heading>
                  <Text className="text-sm text-primary-700 dark:text-primary-300">
                    If you have questions about this Privacy Policy, please contact us at:{'\n\n'}
                    Network Associates{'\n'}
                    Email: privacy@networkassociates.com
                  </Text>
                </VStack>

                <Text className="text-xs text-primary-500 dark:text-primary-400 mt-4">
                  Note: This is a template privacy policy. Please customize it with your actual
                  data practices and have it reviewed by legal counsel before publishing.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
