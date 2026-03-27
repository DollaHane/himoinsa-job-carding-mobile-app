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
            <Heading className="mb-4 text-3xl font-bold text-primary dark:text-white">
              Privacy Policy
            </Heading>

            <Box className="rounded-2xl bg-background p-4 pb-28">
              <VStack space="md">
                <Text className="text-sm text-primary dark:text-primary">
                  Last updated March 27, 2026
                </Text>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    Overview
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    This Privacy Policy for HIMOINSA S.L. ("we," "us," or "our") explains
                    how we handle personal information when you use this app.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    This app is used for account access only. We do not provide user
                    registration in the app. Accounts are provisioned outside the app by
                    authorized administrators.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    Summary of Key Points
                  </Heading>
                  <Text className="ml-4 text-sm text-primary dark:text-primary">
                    • We collect login credentials entered in the app (email/username and
                    password) to authenticate access.
                    {'\n\n'}• After successful login, we also process your authentication
                    token and account profile data returned by the service (such as name,
                    email, username, and role/permissions) to keep you signed in and
                    control access.
                    {'\n\n'}• We use this information only to authenticate access,
                    maintain account security, and operate the service.
                    {'\n\n'}• We do not offer registration through the app.
                    {'\n\n'}• We do not use social login through the app.
                    {'\n\n'}• We do not collect marketing profile information through the
                    app.
                    {'\n\n'}• To exercise privacy rights or ask questions, contact us
                    using the details below.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    Table of Contents
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    1. What Information Do We Collect?{'\n'}
                    2. How Do We Use Your Information?{'\n'}
                    3. Do We Share Your Information?{'\n'}
                    4. Data Retention and Security{'\n'}
                    5. Children’s Privacy{'\n'}
                    6. Your Privacy Rights{'\n'}
                    7. Changes to This Policy{'\n'}
                    8. Contact Us
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    1. What Information Do We Collect?
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We collect only the information needed to authenticate your access and
                    maintain your session in the app.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    This includes:{'\n'}• Login identifier (email address or username)
                    {'\n'}• Password entered during sign-in{'\n'}• Authentication token
                    issued after successful login{'\n'}• Basic account profile data
                    provided by the service (for example name, email, username, and role
                    details)
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We do not provide account registration through the app. User accounts,
                    if applicable, are created outside the app by authorized processes.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We do not collect social profile information through the app.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We do not state in this policy that we collect cookies, advertising
                    identifiers, marketing data, or public social media data through the
                    app.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    2. How Do We Use Your Information?
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We use your login identifier, password, authentication token, and
                    account profile data only to:{'\n'}• Authenticate your login
                    {'\n'}• Allow access to authorized features based on your account
                    {'\n'}• Maintain session continuity and app security
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    3. Do We Share Your Information?
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We do not sell your personal information.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We may share limited information only when necessary to operate,
                    secure, or support the login service, or when required by law.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    4. Data Retention and Security
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We retain personal information only for as long as needed to provide
                    access to the app, maintain security, meet legal obligations, and
                    resolve operational issues.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Authentication tokens and user session data are stored on device using
                    secure storage mechanisms provided by the platform.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We take reasonable steps to protect login information from unauthorized
                    access, use, or disclosure.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    5. Children’s Privacy
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    This app is not intended for children, and we do not knowingly collect
                    personal information from children through the app.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    6. Your Privacy Rights
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    Depending on applicable law, you may have the right to request access
                    to, correction of, or deletion of your personal information.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Because account registration is not available in the app, account
                    deletion or deactivation requests can be made by contacting us at the
                    details below.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    7. Changes to This Policy
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We may update this Privacy Policy from time to time. The updated
                    version will be shown in the app with a revised "Last updated" date.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    8. Contact Us
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    If you have questions about this Privacy Policy or want to make a
                    privacy request, please contact:{'\n\n'}
                    HIMOINSA S.L.{'\n'}
                    57 Edison Street{'\n'}
                    Las Mezquitas Industrial Park{'\n'}
                    Madrid 28906{'\n'}
                    Spain{'\n'}
                    Phone: +27 (0)82 461 6054{'\n'}
                    Email: braddon@networkassociates.co.za
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
