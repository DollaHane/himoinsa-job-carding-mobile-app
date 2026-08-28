import React, { useMemo, useCallback, useState } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
} from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import CardGroup from "@/components/ui/groups/card-group";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetJobcardShow,
  useCompleteJobcard,
  useGetRunningTimers,
} from "@/http/services";
import { isOnline } from "@/http/offline-sync";
import { enqueuePending } from "@/http/offline-queue";
import Toast from "react-native-toast-message";
import SignatureCapture from "@/components/page-jobcards/com-signature-capture";
import GeneratorSection from "@/components/page-jobcards/com-generator-section";
import ModConfirmCloseWithTicket from "@/components/page-jobcards/mod-confirm-close-with-ticket";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  ClipboardList,
  Box,
  Truck,
  Pencil,
  Camera,
  CircleCheck,
  CircleX,
  ArrowRightToLine,
  Check,
  ChevronDown,
} from "lucide-react-native";
import ErrorScreen from "@/components/placeholders/error-screen";
import { useCompleteFormState } from "@/components/page-jobcards/use-complete-form-state";
import { getMissingCloseFields } from "@/lib/helpers/close-form-validator";
import { buildCompleteFormData } from "@/lib/helpers/build-complete-form-data";
import { formatSeconds } from "@/lib/helpers/date-functions";
import type { Jobcard } from "@/types/jobcard";

const INVENTORY_REASONS = [
  { label: "Incorrect part supplied", value: "Incorrect part supplied" },
  { label: "No longer required", value: "No longer required" },
  { label: "Other", value: "Other" },
];

function assetLabel(a: any): string {
  return (
    a.asset?.fleet_number ??
    a.asset?.description ??
    `Asset #${a.asset_id}`
  );
}

function inventoryItemName(inv: any): string {
  return (
    [inv.inventory?.stock_code, inv.inventory?.description]
      .filter(Boolean)
      .join(" - ") ||
    inv.inventory?.barcode ||
    inv.inventory?.serial_number ||
    `Item #${inv.inventory_id}`
  );
}

function buildCompletePayload(
  state: ReturnType<typeof useCompleteFormState>["state"],
  jobcard: Jobcard,
) {
  const assets = jobcard.assets ?? [];
  const tasks = jobcard.tasks ?? [];
  const inventory = jobcard.inventory ?? [];
  const checklists = jobcard.inspection_checklists ?? [];
  const today = new Date().toISOString().split("T")[0];

  return {
    asset_smr: assets.map((a) => {
      const entry = state.smr_entries[a.id] ?? {
        smr_reading: "",
        equipment_condition: "",
        recommendations: "",
      };
      return {
        asset_id: a.asset_id,
        asset_type:
          a.asset_type ?? (jobcard.is_fleet_jc ? "fleet_asset" : "customer_asset"),
        date: today,
        smr_reading: entry.smr_reading,
        equipment_condition: entry.equipment_condition || null,
        recommendations: entry.recommendations || null,
      };
    }),
    tasks: tasks.map((t) => ({
      id: t.id,
      completed: state.task_status[t.id] ?? false,
      incomplete_reason:
        !state.task_status[t.id] && state.task_reasons[t.id]
          ? state.task_reasons[t.id]
          : null,
    })),
    inventory: inventory.map((inv) => ({
      id: inv.id,
      quantity_used: state.inventory_used[inv.id] ?? 0,
      reason_not_used: state.inventory_reasons?.[inv.id] ?? null,
    })),
    inspection_checklists: checklists.map((cl) => ({
      id: cl.id,
      items: cl.items.map((item) => ({
        step: item.step,
        checked:
          state.checklist_item_checked?.[`${cl.id}_${item.step}`] ??
          item.checked ??
          false,
        notes:
          state.checklist_item_notes?.[`${cl.id}_${item.step}`] ?? "",
      })),
    })),
    technician_signature_name: state.technician_signature_name || null,
    customer_signature_name: state.customer_signature_name || null,
  };
}

export default function CompleteJobCardPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: jobcard,
    isLoading,
    error,
    refetch,
  } = useGetJobcardShow(id ?? null);

  const { data: runningTimers } = useGetRunningTimers();
  const completeMutation = useCompleteJobcard();

  const { state, dispatch, clearState } = useCompleteFormState(
    id ? Number(id) : 0,
  );

  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const technicianId = user?.technician_id ?? null;

  const isAssigned = useMemo(() => {
    if (!jobcard || !technicianId) return false;
    if (jobcard.technician_id === technicianId) return true;
    return (
      jobcard.technicians?.some((t) => t.technician_id === technicianId) ?? false
    );
  }, [jobcard, technicianId]);

  const missingFields = useMemo(
    () => (jobcard ? getMissingCloseFields(state, jobcard) : []),
    [state, jobcard],
  );

  const handleComplete = useCallback(async (): Promise<boolean> => {
    if (!jobcard) return false;

    const hasRunning = (runningTimers ?? []).some(
      (t) =>
        t.jobcard_id === jobcard.id &&
        t.technician_id === technicianId &&
        !t.end_time,
    );
    if (hasRunning) {
      Toast.show({
        type: "error",
        text1: "Running Timer",
        text2:
          "You have a running timer. Please stop it before closing this jobcard.",
      });
      return false;
    }

    const payload = buildCompletePayload(state, jobcard);

    try {
      const formData = await buildCompleteFormData(
        payload,
        state.technician_signature,
        state.customer_signature,
        state.slot_images,
      );

      const online = await isOnline();
      if (online) {
        await completeMutation.mutateAsync({
          jobcardId: jobcard.id,
          formData,
        });
        clearState();
        router.back();
      } else {
        await enqueuePending("complete", {
          id: jobcard.id,
          json_payload: payload,
          technician_signature: state.technician_signature,
          customer_signature: state.customer_signature,
          slot_images: state.slot_images,
        });
        Toast.show({
          type: "success",
          text1: "Saved offline",
          text2: "Completion will sync when connection returns.",
        });
        clearState();
        router.back();
      }

      return true;
    } catch {
      return false;
    }
  }, [
    jobcard,
    runningTimers,
    technicianId,
    state,
    completeMutation,
    clearState,
    router,
  ]);

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

      {jobcard && !isAssigned && (
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-center text-text-muted">
            You must be an assigned technician to complete this jobcard.
          </Text>
        </View>
      )}

      {jobcard && isAssigned && (
        <View className="flex-1">
          <ScrollView
            className="flex-1 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 120 }}
            scrollEnabled={!isSigning}
          >
            <View className="flex flex-col gap-4">
              <CardGroup title="Work Description" icon={Briefcase}>
                <View className="rounded-lg bg-background-subtle p-2">
                  <Text className="text-sm">
                    {jobcard.work_description || "No description"}
                  </Text>
                </View>
              </CardGroup>

              {(jobcard.tasks ?? []).length > 0 && (
                <CardGroup title="Tasks" icon={ClipboardList}>
                  {(jobcard.tasks ?? []).map((task) => {
                    const completed = state.task_status[task.id] ?? false;
                    return (
                      <View
                        key={task.id}
                        className={
                          completed
                            ? "mb-3 flex flex-col gap-3 rounded-lg border border-success bg-success/10 p-2"
                            : "mb-3 flex flex-col gap-3 rounded-lg border border-border bg-background-subtle p-2"
                        }
                      >
                        <View className="flex-row items-center gap-3">
                          <Checkbox
                            size="sm"
                            value={`task-${task.id}`}
                            isChecked={completed}
                            onChange={(val: boolean) =>
                              dispatch({
                                type: "SET_TASK_STATUS",
                                taskId: task.id,
                                completed: val,
                              })
                            }
                          >
                            <CheckboxIndicator>
                              <CheckboxIcon as={Check} />
                            </CheckboxIndicator>
                          </Checkbox>
                          <Text className="flex-1 text-sm">
                            <Text className="font-medium">
                              Step {task.task_step}: {task.description}
                            </Text>
                            <Text className="text-text-muted">
                              {" "}
                              ({formatSeconds(task.duration ?? 0)})
                            </Text>
                          </Text>
                          {completed ? (
                            <Icon as={CircleCheck} size="sm" className="text-success" />
                          ) : (
                            <Icon as={CircleX} size="sm" className="text-text-muted" />
                          )}
                        </View>
                        {!completed && (
                          <Input size="md">
                            <InputField
                              placeholder="Reason for incomplete (optional)"
                              value={state.task_reasons[task.id] ?? ""}
                              onChangeText={(text) =>
                                dispatch({
                                  type: "SET_TASK_REASON",
                                  taskId: task.id,
                                  reason: text,
                                })
                              }
                            />
                          </Input>
                        )}
                      </View>
                    );
                  })}
                </CardGroup>
              )}

              {(jobcard.inspection_checklists ?? []).length > 0 && (
                <CardGroup title="Inspection Checklists" icon={ClipboardList}>
                  {(jobcard.inspection_checklists ?? []).map((checklist) => (
                    <View key={checklist.id} className="mb-4">
                      <Text className="mb-2 text-sm font-semibold">
                        {checklist.template_name}
                      </Text>
                      <View className="flex flex-col gap-2">
                        {checklist.items.map((item) => {
                          const key = `${checklist.id}_${item.step}`;
                          const checked =
                            state.checklist_item_checked?.[key] ??
                            item.checked ??
                            false;
                          const notes =
                            state.checklist_item_notes?.[key] ?? "";

                          return (
                            <View
                              key={key}
                              className={
                                checked
                                  ? "flex flex-col gap-2 rounded-lg border border-success bg-success/10 p-2"
                                  : "flex flex-col gap-2 rounded-lg border border-border bg-background-subtle p-2"
                              }
                            >
                              <View className="flex-row items-center gap-3">
                                <Checkbox
                                  size="sm"
                                  value={`checklist-${checklist.id}-${item.step}`}
                                  isChecked={checked}
                                  onChange={(val: boolean) =>
                                    dispatch({
                                      type: "SET_CHECKLIST_ITEM",
                                      checklistId: checklist.id,
                                      step: item.step,
                                      checked: val,
                                    })
                                  }
                                >
                                  <CheckboxIndicator>
                                    <CheckboxIcon as={Check} />
                                  </CheckboxIndicator>
                                </Checkbox>
                                <Text className="flex-1 text-sm">
                                  <Text className="font-medium">
                                    Step {item.step}:
                                  </Text>{" "}
                                  {item.description}
                                </Text>
                                {checked ? (
                                  <Icon as={CircleCheck} size="sm" className="text-success" />
                                ) : (
                                  <Icon as={CircleX} size="sm" className="text-text-muted" />
                                )}
                              </View>
                              {!checked && (
                                <Input size="sm">
                                  <InputField
                                    placeholder="Notes (optional)"
                                    value={notes}
                                    onChangeText={(text) =>
                                      dispatch({
                                        type: "SET_CHECKLIST_NOTE",
                                        checklistId: checklist.id,
                                        step: item.step,
                                        note: text,
                                      })
                                    }
                                  />
                                </Input>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </CardGroup>
              )}

              {(jobcard.inventory ?? []).length > 0 && (
                <CardGroup title="Inventory" icon={Box}>
                  {(jobcard.inventory ?? []).map((item) => {
                    const qtyRequested = item.quantity_requested ?? 0;
                    const used = state.inventory_used[item.id] ?? 0;
                    const fullyUsed = used >= qtyRequested;
                    const reason = state.inventory_reasons?.[item.id] ?? "";

                    return (
                      <View
                        key={item.id}
                        className={
                          fullyUsed
                            ? "mb-3 flex flex-col gap-3 rounded-lg border border-success bg-success/10 p-2"
                            : "mb-3 flex flex-col gap-3 rounded-lg border border-border bg-background-subtle p-2"
                        }
                      >
                        <View className="flex-row items-center justify-between gap-2">
                          <Text className="flex-1 font-medium">
                            {inventoryItemName(item)}
                          </Text>
                          {fullyUsed ? (
                            <Icon as={CircleCheck} size="sm" className="text-success" />
                          ) : (
                            <Icon as={CircleX} size="sm" className="text-text-muted" />
                          )}
                        </View>

                        <Text className="text-sm text-text-muted">
                          Quantity Requested: ( x{qtyRequested} )
                        </Text>

                        <View className="flex flex-col gap-3">
                          <View className="flex flex-col gap-1.5">
                            <Text className="text-xs text-text-muted">
                              Qty Used
                            </Text>
                            <Input size="sm">
                              <InputField
                                keyboardType="numeric"
                                placeholder="0"
                                value={used > 0 ? String(used) : ""}
                                onChangeText={(text) => {
                                  const parsed = parseFloat(text || "0");
                                  dispatch({
                                    type: "SET_INVENTORY_USED",
                                    invId: item.id,
                                    qty: isNaN(parsed) ? 0 : parsed,
                                  });
                                }}
                              />
                            </Input>
                          </View>

                          {used < qtyRequested && (
                            <View className="flex flex-col gap-1.5">
                              <Text className="text-xs text-text-muted">
                                Reason not fully used{" "}
                                <Text className="text-error">*</Text>
                              </Text>
                              <Select
                                selectedValue={reason}
                                onValueChange={(val) =>
                                  dispatch({
                                    type: "SET_INVENTORY_REASON",
                                    invId: item.id,
                                    reason: val,
                                  })
                                }
                              >
                                <SelectTrigger
                                  variant="outline"
                                  size="sm"
                                  className="justify-between"
                                >
                                  <SelectInput placeholder="Select a reason..." />
                                  <SelectIcon className="mr-3" as={ChevronDown} />
                                </SelectTrigger>
                                <SelectPortal>
                                  <SelectBackdrop />
                                  <SelectContent>
                                    {INVENTORY_REASONS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                      />
                                    ))}
                                  </SelectContent>
                                </SelectPortal>
                              </Select>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </CardGroup>
              )}

              {(jobcard.assets ?? []).length > 0 && (
                <CardGroup title="SMR Reading" icon={Truck}>
                  {(jobcard.assets ?? []).map((asset) => {
                    const entry = state.smr_entries[asset.id] ?? {
                      smr_reading: "",
                      equipment_condition: "",
                      recommendations: "",
                    };

                    return (
                      <View
                        key={asset.id}
                        className="mb-3 flex flex-col gap-5 rounded-lg border border-border bg-background-subtle p-3"
                      >
                        <View className="flex-row items-center justify-start gap-3">
                          <Icon as={ArrowRightToLine} size="sm" className="text-accent-primary" />
                          <Text className="text-lg font-medium">
                            {assetLabel(asset)}
                          </Text>
                        </View>
                        <View className="flex flex-col gap-5">
                          <View className="flex flex-col gap-1.5">
                            <Text className="text-text-muted">SMR Reading</Text>
                            <Input size="md">
                              <InputField
                                placeholder="Enter SMR reading"
                                value={entry.smr_reading}
                                onChangeText={(text) =>
                                  dispatch({
                                    type: "SET_SMR",
                                    assetId: asset.id,
                                    field: "smr_reading",
                                    value: text,
                                  })
                                }
                              />
                            </Input>
                          </View>
                          <View className="flex flex-col gap-1.5">
                            <Text className="text-text-muted">
                              Equipment Condition
                            </Text>
                            <Textarea size="md">
                              <TextareaInput
                                placeholder="Describe equipment condition"
                                value={entry.equipment_condition}
                                onChangeText={(text) =>
                                  dispatch({
                                    type: "SET_SMR",
                                    assetId: asset.id,
                                    field: "equipment_condition",
                                    value: text,
                                  })
                                }
                              />
                            </Textarea>
                          </View>
                          <View className="flex flex-col gap-1.5">
                            <Text className="text-text-muted">
                              Work Performed{" "}
                              <Text className="text-error">*</Text>
                            </Text>
                            <Textarea size="md">
                              <TextareaInput
                                placeholder="Describe the work performed on this asset"
                                value={entry.recommendations}
                                onChangeText={(text) =>
                                  dispatch({
                                    type: "SET_SMR",
                                    assetId: asset.id,
                                    field: "recommendations",
                                    value: text,
                                  })
                                }
                              />
                            </Textarea>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </CardGroup>
              )}

              <CardGroup title="Technician Signature" icon={Pencil}>
                <View className="flex flex-col gap-3">
                  <View className="flex flex-col gap-1.5">
                    <Text className="text-text-muted">
                      Technician Name <Text className="text-error">*</Text>
                    </Text>
                    <Input size="md">
                      <InputField
                        placeholder="Technician full name"
                        value={state.technician_signature_name}
                        onChangeText={(text) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "technician_signature_name",
                            value: text,
                          })
                        }
                      />
                    </Input>
                  </View>
                  <SignatureCapture
                    value={state.technician_signature}
                    onChange={(val) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "technician_signature",
                        value: val,
                      })
                    }
                    onActiveChange={setIsSigning}
                  />
                </View>
              </CardGroup>

              <CardGroup title="Customer Signature" icon={Pencil}>
                <View className="flex flex-col gap-3">
                  <View className="flex flex-col gap-1.5">
                    <Text className="text-text-muted">
                      Customer Name <Text className="text-error">*</Text>
                    </Text>
                    <Input size="md">
                      <InputField
                        placeholder="Customer full name"
                        value={state.customer_signature_name}
                        onChangeText={(text) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "customer_signature_name",
                            value: text,
                          })
                        }
                      />
                    </Input>
                  </View>
                  <SignatureCapture
                    value={state.customer_signature}
                    onChange={(val) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "customer_signature",
                        value: val,
                      })
                    }
                    onActiveChange={setIsSigning}
                  />
                </View>
              </CardGroup>

              {(jobcard.assets ?? []).length > 0 && (
                <CardGroup title="Generator Photos" icon={Camera}>
                  <GeneratorSection
                    jobcardId={jobcard.id}
                    assets={jobcard.assets ?? []}
                    slotImages={state.slot_images}
                    onSlotChange={(key, uri) =>
                      dispatch({
                        type: "SET_SLOT_IMAGE",
                        key,
                        dataUrl: uri ?? "",
                      })
                    }
                    disabled={false}
                  />
                </CardGroup>
              )}

              {missingFields.length > 0 && (
                <View className="rounded-md border border-error/50 bg-error/5 p-3">
                  <Text className="font-medium text-error">
                    Please complete the following before closing:
                  </Text>
                  {missingFields.map((field, i) => (
                    <Text key={i} className="text-error ml-2 mt-1">
                      {"\u2022"} {field}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View className="flex-col gap-3 px-4 pt-3 pb-24 border-t border-border bg-background">
            <Button
              onPress={() => setConfirmCloseOpen(true)}
              isDisabled={completeMutation.isPending || missingFields.length > 0}
              className="w-full"
            >
              <ButtonText>
                {completeMutation.isPending
                  ? "Completing..."
                  : "Close And Complete Jobcard"}
              </ButtonText>
            </Button>
          </View>

          <ModConfirmCloseWithTicket
            open={confirmCloseOpen}
            onOpenChange={setConfirmCloseOpen}
            jobcard={jobcard}
            onConfirm={handleComplete}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
