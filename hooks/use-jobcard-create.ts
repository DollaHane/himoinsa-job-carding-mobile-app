import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useMutationHandler } from "@/hooks/mutation";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys } from "@/http/services";
import { isOnline } from "@/http/offline-sync";
import { enqueuePending } from "@/http/offline-queue";
import {
  validateJobcardCreate,
  type JobcardCreationRequest,
} from "@/lib/validators/validate-jobcard-create";
import Toast from "react-native-toast-message";

export function useJobcardCreate(isFleetJc: boolean) {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 1);

  const defaultValues = useMemo<JobcardCreationRequest>(
    () => ({
      is_fleet_jc: isFleetJc,
      contract_id: undefined,
      customer_id: 0,
      customer_location_id: undefined,
      work_description: "",
      service_type: undefined,
      is_recurring: false,
      recurring_interval: undefined,
      scheduled_datetime: scheduledDate,
      travel_time: 0,
      reminder_time: undefined,
      assets: [],
      tasks: [],
      technicians: [],
      inventory: [],
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<JobcardCreationRequest>({
    defaultValues,
    resolver: zodResolver(validateJobcardCreate),
    shouldUnregister: false,
  });

  const { handleMutation: submitMutation, isPending } = useMutationHandler({
    route: HimoinsaAPI.api_jobcards_store,
    method: "POST",
    success_message: "Jobcard created successfully.",
    query_keys: QueryKeys.jobcards_list,
    redirect_url: "/tabs/job-cards",
    onSuccess: () => {
      reset();
    },
  });

  const formatDate = (date: Date | null | undefined): string | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  const onSubmit = useCallback(
    async (values: JobcardCreationRequest) => {
      console.log("[DEBUG] onSubmit called with values:", JSON.stringify(values, null, 2));
      const scheduledDateVal = values.scheduled_datetime
        ? new Date(values.scheduled_datetime as Date)
        : null;
      const reminderDate = scheduledDateVal
        ? new Date(scheduledDateVal.getTime() - 2 * 60 * 60 * 1000)
        : undefined;

      const payload = {
        is_fleet_jc: values.is_fleet_jc,
        contract_id: values.contract_id
          ? Number(values.contract_id)
          : undefined,
        customer_id:
          !values.is_fleet_jc && values.customer_id
            ? Number(values.customer_id)
            : undefined,
        customer_location_id: values.customer_location_id
          ? Number(values.customer_location_id)
          : undefined,
        service_type: values.service_type
          ? Number(values.service_type)
          : undefined,
        scheduled_datetime: formatDate(scheduledDateVal),
        travel_time: 0,
        reminder_time: formatDate(reminderDate),
        work_description: values.work_description,
        assets: values.assets.map((a) => ({
          asset_id: Number(a.asset_id),
          asset_location_id: a.asset_location_id
            ? Number(a.asset_location_id)
            : undefined,
        })),
        tasks: values.tasks?.map((t) => ({
          task_step: Number(t.task_step),
          description: t.description,
          duration: t.duration ?? undefined,
        })),
        technicians: values.technicians?.map((t) => Number(t)) || [],
        inventory:
          values.inventory?.map((item) => ({
            inventory_id: Number(item.inventory_id),
            quantity_requested: Number(item.quantity_requested),
            requested_by: Number(item.requested_by),
            date_requested: item.date_requested,
            estimated_arrival_date: item.estimated_arrival_date ?? undefined,
            notes: item.notes ?? undefined,
          })) || [],
      };

      const online = await isOnline();
      console.log("[DEBUG] online:", online, "payload:", JSON.stringify(payload, null, 2));
      if (online) {
        submitMutation(payload as Record<string, unknown>);
      } else {
        await enqueuePending("create", payload as Record<string, unknown>);
        Toast.show({
          type: "success",
          text1: "Saved offline",
          text2: "Jobcard will sync when connection returns.",
        });
        reset();
        router.replace("/tabs/job-cards" as any);
      }
    },
    [submitMutation, reset, router]
  );

  const goNext = useCallback(() => {
    if (step < 4) setStep(step + 1);
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) setStep(step - 1);
  }, [step]);

  const handleReset = useCallback(() => {
    reset();
    setStep(0);
  }, [reset]);

  const submitRef = useRef(handleSubmit(onSubmit));
  submitRef.current = handleSubmit(onSubmit);

  const handleFinalSubmit = useCallback(async () => {
    console.log("[DEBUG] handleFinalSubmit called");
    const valid = await trigger();
    console.log("[DEBUG] trigger result:", valid, "errors:", JSON.stringify(errors, null, 2));
    if (!valid) {
      Toast.show({
        type: "error",
        text1: "Please fix the errors",
        text2: "Some required fields are missing or invalid.",
      });
      return;
    }
    console.log("[DEBUG] validation passed, calling submitRef");
    submitRef.current();
  }, [trigger, errors]);

  return {
    control,
    setValue,
    reset,
    step,
    setStep,
    isPending,
    goNext,
    goBack,
    handleReset,
    handleFinalSubmit,
  };
}
