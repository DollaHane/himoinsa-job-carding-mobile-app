import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter, type Href } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Image } from "@/components/ui/image";
import { apiFetch, HimoinsaAPI } from "@/http";
import { useAuth } from "@/contexts/AuthContext";
import { FormInput } from "@/components/ui/forms/form-input";
import Toast from "react-native-toast-message";
import type { AuthUser } from "@/types/auth";

const validateAuth = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AuthCreationRequest = z.input<typeof validateAuth>;

interface LoginResponse {
  user: AuthUser;
  session: string;
}

const DASHBOARD_ROUTE = "/tabs/(tabs)/dashboard" as Href;

export default function Home() {
  const router = useRouter();
  const { setSession, isAuthenticated } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace(DASHBOARD_ROUTE);
    }
  }, [isAuthenticated, router]);

  const { control, handleSubmit } = useForm<AuthCreationRequest>({
    resolver: zodResolver(validateAuth),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: handleMutation, isPending } = useMutation({
    mutationFn: async (payload: AuthCreationRequest) => {
      const response = await apiFetch(
        HimoinsaAPI.api_login,
        "POST",
        payload
      );
      const json = (await response.json()) as { data?: LoginResponse };
      if (!response.ok) {
        throw new Error(json?.data ? "Login failed" : "Invalid credentials");
      }
      return json.data;
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Login failed. Please try again.");
    },
    onSuccess: async (data) => {
      if (!data) return;
      await setSession(data.user, data.session);
      setErrorMessage(null);
      Toast.show({
        type: "success",
        text1: "Login successful",
      });
      router.replace(DASHBOARD_ROUTE);
    },
  });

  function onSubmit(value: AuthCreationRequest) {
    setErrorMessage(null);
    handleMutation(value);
  }

  return (
    <Box className="flex-1 bg-background-subtle p-5 pt-16">
      <VStack className="w-full" space="lg">
        <Box className="flex items-center justify-center rounded-xl h-20 w-80 my-12 mx-auto shadow-md dark:shadow-none overflow-hidden">
          <Image
            source={require("@/assets/images/Himoinsa-Logo.png")}
            className="w-full h-full"
            resizeMode="cover"
            alt="Company Logo"
          />
        </Box>

        <Text className="w-full text-center text-4xl font-bold">Login</Text>

        <FormInput
          control={control}
          name="username"
          label="Email / Username"
          type="text"
          placeholder="Enter email / username"
          isRequired
          isDisabled={isPending}
        />

        <FormInput
          control={control}
          name="password"
          label="Password"
          type="password"
          placeholder="Enter password"
          isRequired
          isDisabled={isPending}
        />

        {errorMessage && (
          <Text className="text-center text-destructive text-sm">{errorMessage}</Text>
        )}

        <Button
          className="w-full mt-4"
          size="xl"
          onPress={handleSubmit(onSubmit)}
          isDisabled={isPending}
        >
          {isPending ? (
            <Icon as={Loader2} className="animate-spin text-white" />
          ) : (
            <ButtonText>Login</ButtonText>
          )}
        </Button>
      </VStack>
      <Box className="absolute bottom-4 w-full">
        <Text className="text-center text-muted">{`© ${currentYear} Network Associates`}</Text>
      </Box>
    </Box>
  );
}
