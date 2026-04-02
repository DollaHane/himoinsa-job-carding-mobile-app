import React from "react";
import { ScrollView } from "@/components/ui/scroll-view";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { useAuth } from "@/contexts/AuthContext";
import AuthLoading from "@/components/auth/auth-loading";
import ProfilePlaceholder from "@/components/placeholders/profile-placeholder";
import ProfileScreen from "@/components/page_profile/profile-screen";
import NoData from "@/components/placeholders/no-data";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <Center>
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-36">
          <VStack className="mb-6 pt-4" space="xs">
            <Heading className="text-3xl font-bold text-text mb-5">Profile</Heading>
          </VStack>
          <ProfilePlaceholder isLoading={isLoading} />
          <AuthLoading authLoading={isLoading} isAuthenticated={isAuthenticated} />
          <NoData data={user} isLoading={isLoading} />
          {isAuthenticated && user && <ProfileScreen user={user} />}
        </Box>
      </Center>
    </ScrollView>
  );
}
