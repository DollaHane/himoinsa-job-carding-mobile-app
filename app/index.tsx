import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/form/FormField";
import { Image } from "@/components/ui/image";
import { domain, auth_token, post_login, post_auth } from "@/http/api";
import { useAuth } from "@/contexts/AuthContext";
import { encodeURL } from "@/utils/helpers";
import { validateAuth, authCreationRequest } from "@/utils/validators/validate-auth";

export default function Home() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/tabs/tickets");
    }
  }, [isAuthenticated, isLoading, router]);

  const form = useForm({
    resolver: zodResolver(validateAuth),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: handleMutation } = useMutation({
    mutationFn: async (payload: authCreationRequest) => {

      const response = await axios.post(post_auth, payload, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      return response.data;
    },
    onError: (error: AxiosError) => {
      setIsSubmitting(false);
      console.log("error", error.message);
      if (error.response?.status === 400) {
        // return toast({
        //   title: 'Data Validation Error.',
        //   description:
        //     'There was an error processing the data provided. Please try again.',
        //   variant: 'destructive',
        // })
      }
      if (error.response?.status === 401) {
        // return toast({
        //   title: 'Authorisation Error.',
        //   description: 'Operation was not authorised, please login.',
        //   variant: 'destructive',
        // })
      }
      if (error.response?.status === 429) {
        // return toast({
        //   title: 'Too Many Requests.',
        //   description: 'Please wait 30sec before trying again.',
        //   variant: 'destructive',
        // })
      }
      if (error.response?.status === 500) {
        // return toast({
        //   title: 'Server Error.',
        //   description:
        //     'Failed to complete operation due to a server error. Please try again.',
        //   variant: 'destructive',
        // })
      }
    },
    onSuccess: async (data) => {
      try {
        console.log("Login successful:", data);

        // Save token and user data securely
        await login(data.token, data.user);

        setIsSubmitting(false);
        form.reset();

        // Navigate to tabs
        router.replace("/tabs/tickets");

        // return toast({
        //   title: "Success!",
        //   description: "Login successful!"
        // })
      } catch (error) {
        console.error("Error saving auth data:", error);
        setIsSubmitting(false);
      }
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log("onSettled error:", error);
      } else {
        // router.push('/path')
        // await queryClient.invalidateQueries({ queryKey: ["key"] });
      }
    },
  });

  function onSubmit(value: z.infer<typeof validateAuth>) {
    const payload: authCreationRequest = {
      username: value.username,
      password: value.password,
    };
    handleMutation(payload);
    setIsSubmitting(true);
    // return toast({
    //   title: "Form Submitted",
    //   description: "Processing request."
    // })
  }

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <Box className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-subtle p-5 pt-16">
      <VStack
        className="w-full"
        space="lg"
      >
        <Box className="flex items-center justify-center rounded-xl h-20 w-80 my-12 mx-auto shadow-md dark:shadow-none overflow-hidden">
          <Image
            source={require("@/assets/images/Himoinsa-Logo.png")}
            className="w-full h-full"
            resizeMode="cover"
            alt="Company Logo"
          />
        </Box>

        <Text className="w-full text-center text-4xl font-bold">Login</Text>

        <FormField
          control={form.control}
          name="username"
          label="Email / Username"
          type="email"
          placeholder="Enter email / username"
          isRequired={true}
          isDisabled={isSubmitting}
        />

        <FormField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="Enter password"
          isRequired={true}
          isDisabled={isSubmitting}
        />

        <Button
          className="w-full mt-4"
          size="xl"
          onPress={form.handleSubmit(onSubmit)}
          isDisabled={isSubmitting}
        >
          {isSubmitting ? (
            <Icon
              as={Loader2}
              className="animate-spin"
            />
          ) : (
            <ButtonText>Login</ButtonText>
          )}
        </Button>

        <Box className="w-full">
          <Text className="text-center text-muted">Trouble logging in?</Text>
          <Link ><Text className="text-center underline text-blue-500">Contact system administrator</Text></Link>
        </Box>
      </VStack>
      <Box className="absolute bottom-4 w-full">
        <Text className="text-center text-muted">{`© ${currentYear} Network Associates`}</Text>
      </Box>
    </Box>
  );
}
