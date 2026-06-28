import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { apiFetch, type METHOD } from "@/http";

interface MutationHandlerProps<
  TFormValues extends Record<string, any> = Record<string, any>,
> {
  form?: any;
  route: string;
  append_id?: boolean | null;
  method?: METHOD;
  submit_message?: string | null;
  success_message?: string | null;
  redirect_url?: string | null;
  refetch?: () => void;
  query_keys?: ReadonlyArray<string | readonly string[]> | null;
  onSuccess?: () => void;
}

export type TFormRecord = Record<string, any>;
export type URL_ID = {
  id: string;
};

export function useMutationHandler<
  TFormValues extends TFormRecord,
  TPayload extends { id?: string | number } | void = TFormValues,
>({
  form,
  route,
  append_id,
  method,
  success_message,
  redirect_url,
  refetch,
  query_keys,
  onSuccess,
}: MutationHandlerProps<TFormValues>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    mutate: handleSubmit,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (payload: TPayload) => {
      const id = (payload as any)?.id;
      const url = append_id && id ? `${route}/${id}` : route;
      const requestBody =
        append_id && payload
          ? Object.fromEntries(
              Object.entries(payload as object).filter(([k]) => k !== "id"),
            )
          : payload;
      const requestMethod = method || "POST";

      const response = await apiFetch(
        url,
        requestMethod,
        requestMethod !== "DELETE" && requestBody
          ? (requestBody as Record<string, string | null>)
          : undefined,
      );

      if (!response.ok) {
        const status = response.status;

        if (status === 422) {
          Toast.show({
            type: "error",
            text1: "Data Validation Error.",
            text2:
              "There was an error processing the data provided. Please try again.",
          });
        }
        if (status === 401) {
          Toast.show({
            type: "error",
            text1: "Authorisation Error.",
            text2: "Operation was not authorised, please login.",
          });
        }
        if (status === 429) {
          Toast.show({
            type: "error",
            text1: "Too Many Requests.",
            text2: "Please wait 30sec before trying again.",
          });
        }
        if (status === 500) {
          Toast.show({
            type: "error",
            text1: "Server Error.",
            text2:
              "Failed to complete operation due to a server error. Please try again.",
          });
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSubmitting(false);
      if (form) {
        form.reset();
      }
      if (redirect_url) {
        router.replace(redirect_url as any);
      }
      if (refetch) {
        refetch();
      }
      if (onSuccess) {
        onSuccess();
      }
      Toast.show({
        type: "success",
        text1: "Success!",
        text2: success_message || "Operation completed successfully!",
      });
    },
    onError: () => {
      setIsSubmitting(false);
    },
    onSettled: () => {
      if (query_keys && query_keys.length > 0) {
        if (Array.isArray(query_keys[0])) {
          for (const key of query_keys) {
            queryClient.invalidateQueries({ queryKey: key as string[] });
          }
        } else {
          queryClient.invalidateQueries({ queryKey: query_keys as string[] });
        }
      }
    },
  });

  function handleMutation(payload: TPayload) {
    setIsSubmitting(true);
    handleSubmit(payload);
  }

  return { handleMutation, isSubmitting, isPending, isSuccess, isError };
}
