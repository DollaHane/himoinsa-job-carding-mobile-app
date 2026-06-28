import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonText } from "@/components/ui/button";
import ModalGroup from "@/components/ui/groups/modal-group";
import CardGroup from "@/components/ui/groups/card-group";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormSwitch } from "@/components/ui/forms/form-switch";
import { Text } from "@/components/ui/text";
import { useMutationHandler } from "@/hooks/mutation";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys } from "@/http/services";
import { isOnline } from "@/http/offline-sync";
import { enqueuePending } from "@/http/offline-queue";
import Toast from "react-native-toast-message";
import {
  validateCompleteJobcard,
  type CompleteJobcardRequest,
} from "@/lib/validators/validate-complete-jobcard";
import PhotoCapture from "./com-photo-capture";
import SignatureCapture from "./com-signature-capture";
import type { Jobcard } from "@/types/jobcard";

interface ModCompleteJobcardProps {
  jobcard: Jobcard;
}

export default function ModCompleteJobcard({
  jobcard,
}: ModCompleteJobcardProps) {
  const [open, setOpen] = useState(false);

  const defaultValues = useMemo<CompleteJobcardRequest>(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      asset_smr:
        jobcard.assets?.map((asset) => ({
          asset_id: asset.asset_id,
          asset_type: asset.asset_type ?? "",
          date: today,
          smr_reading: "",
          equipment_condition: jobcard.equipment_condition ?? "",
          recommendations: jobcard.recommendations ?? "",
        })) ?? [],
      tasks:
        jobcard.tasks?.map((task) => ({
          id: task.id,
          completed: task.status?.toLowerCase() === "completed",
          incomplete_reason: task.incomplete_reason ?? "",
        })) ?? [],
      inventory:
        jobcard.inventory?.map((item) => ({
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

  const photos = useWatch({ control, name: "photos" }) ?? [];
  const signature = useWatch({ control, name: "signature" }) ?? "";

  const { handleMutation: onSubmit, isPending } = useMutationHandler({
    route: HimoinsaAPI.api_jobcards_complete,
    method: "POST",
    append_id: true,
    success_message: "Jobcard completed.",
    query_keys: [
      QueryKeys.jobcards_show(String(jobcard.id)),
      QueryKeys.jobcards_list,
      QueryKeys.timers_running,
    ],
    onSuccess: () => {
      reset();
      setOpen(false);
    },
  });

  async function submit(values: CompleteJobcardRequest) {
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
      setOpen(false);
    }
  }

  const footer = (
    <Button
      onPress={handleSubmit(submit)}
      isDisabled={isPending}
      className="w-full"
    >
      <ButtonText>
        {isPending ? "Completing..." : "Complete Jobcard"}
      </ButtonText>
    </Button>
  );

  return (
    <ModalGroup
      title="Complete Jobcard"
      description="Record tasks, SMR readings, parts used and capture sign-off."
      triggerText="Complete Jobcard"
      triggerAction="positive"
      size="full"
      isOpen={open}
      onOpenChange={setOpen}
      footer={footer}
    >
      <View className="flex flex-col gap-4 pb-6">
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
                    {item.inventory?.stock_code ?? `Item #${item.inventory_id}`}
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
    </ModalGroup>
  );
}
