import React, { useMemo, useEffect } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonText } from "@/components/ui/button";
import CardGroup from "@/components/ui/groups/card-group";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormSwitch } from "@/components/ui/forms/form-switch";
import { useMutationHandler } from "@/hooks/mutation";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys, useGetJobcardShow } from "@/http/services";
import { isOnline } from "@/http/offline-sync";
import { enqueuePending } from "@/http/offline-queue";
import Toast from "react-native-toast-message";
import {
  validateCompleteJobcard,
  type CompleteJobcardRequest,
} from "@/lib/validators/validate-complete-jobcard";
import PhotoCapture from "@/components/page-jobcards/com-photo-capture";
import SignatureCapture from "@/components/page-jobcards/com-signature-capture";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, X } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import ErrorScreen from "@/components/placeholders/error-screen";

export default function CompleteJobCardPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    data: jobcard,
    isLoading,
    error,
    refetch,
  } = useGetJobcardShow(id ?? null);

  const defaultValues = useMemo<CompleteJobcardRequest>(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      asset_smr:
        jobcard?.assets?.map((asset) => ({
          asset_id: asset.asset_id,
          asset_type: asset.asset_type ?? "",
          date: today,
          smr_reading: "",
          equipment_condition: jobcard.equipment_condition ?? "",
          recommendations: jobcard.recommendations ?? "",
        })) ?? [],
      tasks:
        jobcard?.tasks?.map((task) => ({
          id: task.id,
          completed: String(task.status ?? "").toLowerCase() === "completed",
          incomplete_reason: task.incomplete_reason ?? "",
        })) ?? [],
      inventory:
        jobcard?.inventory?.map((item) => ({
          id: item.id,
          quantity_used: item.quantity_used ?? 0,
        })) ?? [],
      signature: "",
      photos: [],
    };
  }, [jobcard]);

  const { control, handleSubmit, reset, setValue } =
    useForm<CompleteJobcardRequest>({
      defaultValues,
      resolver: zodResolver(validateCompleteJobcard),
    });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const photos = useWatch({ control, name: "photos" }) ?? [];
  const signature = useWatch({ control, name: "signature" }) ?? "";

  const { handleMutation: onSubmit, isPending } = useMutationHandler({
    route: HimoinsaAPI.api_jobcards_complete,
    method: "POST",
    append_id: true,
    success_message: "Jobcard completed.",
    query_keys: [
      QueryKeys.jobcards_show(String(id)),
      QueryKeys.jobcards_list,
      QueryKeys.timers_running,
    ],
    redirect_url: `/tabs/job-cards/${id}` as any,
    onSuccess: () => reset(),
  });

  async function submit(values: CompleteJobcardRequest) {
    if (!jobcard) return;
    const payload = { id: jobcard.id, ...values };
    const online = await isOnline();
    if (online) {
      onSubmit(payload);
    } else {
      await enqueuePending("complete", payload);
      Toast.show({
        type: "success",
        text1: "Saved offline",
        text2: "Completion will sync when connection returns.",
      });
      reset();
      router.back();
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Complete Jobcard",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="mr-4 p-1">
              <Icon as={ArrowLeft} size="lg" className="text-text" />
            </Pressable>
          ),
        }}
      />

      <ErrorScreen error={error} refetch={refetch} />

      {jobcard && (
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="flex flex-col gap-4">
              {jobcard.assets && jobcard.assets.length > 0 && (
                <CardGroup title="SMR Readings" icon={undefined}>
                  <FieldSet>
                    {jobcard.assets.map((asset, index) => (
                      <View key={asset.id}>
                        <FieldLegend>
                          {asset.asset?.fleet_number ??
                            asset.asset?.description ??
                            `Asset ${index + 1}`}
                        </FieldLegend>
                        <FormInput
                          control={control}
                          name={`asset_smr.${index}.smr_reading`}
                          label="SMR Reading"
                          isRequired
                        />
                        <FormInput
                          control={control}
                          name={`asset_smr.${index}.equipment_condition`}
                          label="Equipment Condition"
                        />
                        <FormInput
                          control={control}
                          name={`asset_smr.${index}.recommendations`}
                          label="Recommendations"
                        />
                      </View>
                    ))}
                  </FieldSet>
                </CardGroup>
              )}

              {jobcard.tasks && jobcard.tasks.length > 0 && (
                <CardGroup title="Tasks" icon={undefined}>
                  <FieldSet>
                    {jobcard.tasks.map((task, index) => (
                      <View key={task.id} className="flex flex-col gap-2">
                        <FormSwitch
                          control={control}
                          name={`tasks.${index}.completed`}
                          label={`${task.task_step}. ${task.description}`}
                        />
                        <FormInput
                          control={control}
                          name={`tasks.${index}.incomplete_reason`}
                          label="Incomplete reason"
                        />
                      </View>
                    ))}
                  </FieldSet>
                </CardGroup>
              )}

              {jobcard.inventory && jobcard.inventory.length > 0 && (
                <CardGroup title="Parts Used" icon={undefined}>
                  <FieldSet>
                    {jobcard.inventory.map((item, index) => (
                      <View key={item.id}>
                        <FieldLegend>
                          {item.inventory?.stock_code ??
                            `Item #${item.inventory_id}`}
                        </FieldLegend>
                        <FormInput
                          control={control}
                          name={`inventory.${index}.quantity_used`}
                          label="Quantity Used"
                          inputProps={{ keyboardType: "numeric" }}
                        />
                      </View>
                    ))}
                  </FieldSet>
                </CardGroup>
              )}

              <CardGroup title="Sign-off" icon={undefined}>
                <FieldGroup>
                  <SignatureCapture
                    value={signature}
                    onChange={(val) => setValue("signature", val)}
                  />
                  <PhotoCapture
                    photos={photos.map((uri) => ({ uri }))}
                    onPhotosChange={(newPhotos) =>
                      setValue(
                        "photos",
                        newPhotos.map((p) => p.uri),
                      )
                    }
                  />
                </FieldGroup>
              </CardGroup>
            </View>
          </ScrollView>

          <View
            className="flex-row gap-3 px-4 pt-3 pb-6 border-t border-border bg-background"
            style={{ paddingBottom: 20 }}
          >
            <Button
              variant="outline"
              onPress={() => router.back()}
              className="flex-1"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleSubmit(submit)}
              isDisabled={isPending}
              className="flex-1"
            >
              <ButtonText>
                {isPending ? "Completing..." : "Complete Jobcard"}
              </ButtonText>
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
