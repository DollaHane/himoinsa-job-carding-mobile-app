import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { useRouter } from "expo-router";

interface AuthLoadingProps {
  authLoading: boolean;
  isAuthenticated: boolean;
}

export default function AuthLoading({ authLoading, isAuthenticated }: AuthLoadingProps) {
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <Text className="text-typography-600">Loading...</Text>
      </Box>
    );
  }

  return null;
}
