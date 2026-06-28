import React, { useMemo, useState, useEffect } from "react";
import { View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";
import ModalGroup from "@/components/ui/groups/modal-group";
import { FieldGroup } from "@/components/ui/field";
import { FormSelect } from "@/components/ui/forms/form-select";
import { FormTextArea } from "@/components/ui/forms/form-textarea";
import { FormDatePicker } from "@/components/ui/forms/form-date-picker";
import { useAuth } from "@/contexts/AuthContext";
import { useMutationHandler } from "@/hooks/mutation";
import { useGetCustomersList, useGetJobcardMetadata } from "@/http/services";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys } from "@/http/services";
import { isOnline } from "@/http/offline-sync";
import { enqueuePending } from "@/http/offline-queue";
import { mapToOptions } from "@/lib/helpers/form-options";
import Toast from "react-native-toast-message";
import {
  validateQuickJobcard,
  type QuickJobcardRequest,
} from "@/lib/validators/validate-quick-jobcard";

export default function ModCreateQuickJobcard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { data: customers } = useGetCustomersList();
  const { data: metadata } = useGetJobcardMetadata();

  const customerOptions = useMemo(
    () => mapToOptions(customers ?? [], "company_name", "id"),
    [customers],
  );

  const serviceTypeOptions = useMemo(
    () => mapToOptions(metadata?.service_types ?? [], "name", "id"),
    [metadata],
  );

  const defaultValues = useMemo<QuickJobcardRequest>(
    () => ({
      customer_id: "",
      work_description: "",
      scheduled_datetime: new Date().toISOString(),
      service_type: String(metadata?.service_types?.[0]?.id ?? ""),
    }),
    [metadata],
  );

  const { control, handleSubmit, reset } = useForm<QuickJobcardRequest>({
    defaultValues,
    resolver: zodResolver(validateQuickJobcard),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const { handleMutation: onSubmit, isPending } = useMutationHandler({
    route: HimoinsaAPI.api_jobcards_store,
    method: "POST",
    success_message: "Jobcard created.",
    query_keys: QueryKeys.jobcards_list,
    onSuccess: () => {
      reset();
      setOpen(false);
    },
  });

  async function submit(values: QuickJobcardRequest) {
    const payload = {
      is_fleet_jc: false,
      customer_id: Number(values.customer_id),
      work_description: values.work_description,
      scheduled_datetime: values.scheduled_datetime,
      service_type: Number(values.service_type),
      technicians: user?.technician_id ? [user.technician_id] : [],
      assets: [],
      tasks: [],
      inventory: [],
    };

    const online = await isOnline();
    if (online) {
      onSubmit(payload);
    } else {
      await enqueuePending("create", payload);
      Toast.show({
        type: "success",
        text1: "Saved offline",
        text2: "Jobcard will sync when connection returns.",
      });
      reset();
      setOpen(false);
    }
  }

  const footer = (
    <View className="flex-row gap-2">
      <Button
        variant="outline"
        onPress={() => setOpen(false)}
        className="flex-1"
      >
        <ButtonText>Cancel</ButtonText>
      </Button>
      <Button
        onPress={handleSubmit(submit)}
        isDisabled={isPending}
        className="flex-1"
      >
        <ButtonText>{isPending ? "Creating..." : "Create Jobcard"}</ButtonText>
      </Button>
    </View>
  );

  return (
    <ModalGroup
      title="Create Jobcard"
      description="Quickly create a new jobcard for a customer."
      triggerText="Create Jobcard"
      triggerIcon={Plus}
      triggerAction="primary"
      size="lg"
      isOpen={open}
      onOpenChange={setOpen}
      footer={footer}
    >
      <FieldGroup>
        <FormSelect
          control={control}
          name="customer_id"
          label="Customer"
          options={customerOptions}
          placeholder="Select customer"
          isRequired
        />
        <FormTextArea
          control={control}
          name="work_description"
          label="Work Description"
          placeholder="Describe the work..."
          isRequired
        />
        <FormSelect
          control={control}
          name="service_type"
          label="Service Type"
          options={serviceTypeOptions}
          placeholder="Select service type"
          isRequired
        />
        <FormDatePicker
          control={control}
          name="scheduled_datetime"
          label="Scheduled Date"
          mode="datetime"
        />
      </FieldGroup>
    </ModalGroup>
  );
}
