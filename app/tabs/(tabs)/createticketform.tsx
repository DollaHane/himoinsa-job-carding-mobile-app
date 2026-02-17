import React, { useState } from "react";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { ScrollView } from "@/components/ui/scroll-view";
import { Icon } from "@/components/ui/icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/form/FormField";
import { FormTextArea } from "@/components/form/FormTextArea";
import { domain, auth_token, post_ticket } from "@/http/api";
import { validateTicketCreation, ticketCreationRequest } from "@/utils/validators/validate-create-ticket";

export default function CreateTicketForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading, user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const form = useForm({
    resolver: zodResolver(validateTicketCreation),
    defaultValues: {
      subject: "",
      department: "",
      contactid: user?.userid || "",
      userid: "",
      project_id: "",
      message: "",
      service: "",
      assigned: "",
      cc: "",
      priority: "",
      tags: "",
    },
  });

  const { mutate: handleMutation } = useMutation({
    mutationFn: async (payload: ticketCreationRequest) => {
      const url = domain + post_ticket;
      const response = await axios.post(url, payload, {
        headers: {
          accept: "application/json",
          authtoken: auth_token,
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
        console.log("Ticket created successfully:", data);

        setIsSubmitting(false);
        form.reset();

        // Navigate to tickets
        router.replace("/tabs/tickets");

        // return toast({
        //   title: "Success!",
        //   description: "Ticket created successfully!"
        // })
      } catch (error) {
        console.error("Error creating ticket:", error);
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

  function onSubmit(value: z.infer<typeof validateTicketCreation>) {
    const payload: ticketCreationRequest = {
      subject: value.subject,
      department: value.department,
      contactid: value.contactid,
      userid: value.userid,
      project_id: value.project_id,
      message: value.message,
      service: value.service,
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
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <Text className="text-typography-600">Loading...</Text>
      </Box>
    );
  }

  // Don't render if not authenticated (will redirect)
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
            <Heading className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Create Ticket</Heading>
            <FormField
              control={form.control}
              name="subject"
              label="Subject"
              placeholder="Ticket subject"
              isRequired={true}
              isDisabled={isSubmitting}
            />

            <FormField
              control={form.control}
              name="userid"
              label="User ID"
              placeholder="Enter user ID"
              isRequired={true}
              isDisabled={isSubmitting}
              hidden={true}
            />

            <FormTextArea
              control={form.control}
              name="message"
              label="Message"
              placeholder="Ticket message"
              size="md"
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
                <ButtonText>Create</ButtonText>
              )}
            </Button>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}
