import React, { useMemo, useCallback, useState } from "react";
import { ScrollView, View, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import CardGroup from "@/components/ui/groups/card-group";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
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
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import ErrorScreen from "@/components/placeholders/error-screen";
import { useCompleteFormState } from "@/components/page-jobcards/use-complete-form-state";
import { getMissingCloseFields } from "@/lib/helpers/close-form-validator";
import { buildCompleteFormData } from "@/lib/helpers/build-complete-form-data";
import type { Jobcard } from "@/types/jobcard";

const INVENTORY_REASONS = [
  { label: "Incorrect part supplied", value: "Incorrect part supplied" },
  { label: "No longer required", value: "No longer required" },
  { label: "Other", value: "Other" },
];

function ReasonSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = INVENTORY_REASONS.find((r) => r.value === value)?.label;

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-sm text-text">
        Reason not fully used <Text className="text-error">*</Text>
      </Text>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        className="rounded-lg border border-border px-3 py-2 flex-row items-center justify-between"
      >
        <Text className={selectedLabel ? "text-text" : "text-text-muted"}>
          {selectedLabel || "Select a reason..."}
        </Text>
        <Text className="text-text-muted text-xs">{open ? "\u25B2" : "\u25BC"}</Text>
      </TouchableOpacity>
      {open && (
        <View className="rounded-lg border border-border bg-background overflow-hidden">
          {INVENTORY_REASONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="px-3 py-3 border-t border-border"
            >
              <Text
                className={
                  value === option.value ? "text-text font-medium" : "text-text"
                }
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function assetLabel(a: any): string {
  return (
    a.asset?.fleet_number ??
    a.asset?.description ??
    `Asset #${a.asset_id}`
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
  const assetType = jobcard.is_fleet_jc
    ? "App\\Models\\Asset"
    : "App\\Models\\CustomerAsset";

  return {
    asset_smr: assets.map((a) => {
      const entry = state.smr_entries[a.id] ?? {
        smr_reading: "",
        equipment_condition: "",
        recommendations: "",
      };
      return {
        asset_id: a.asset_id,
        asset_type: assetType,
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
    vehicle_arrival_mileage: state.travel_mileage
      ? Number(state.travel_mileage)
      : null,
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

  const handleSubmit = useCallback(async () => {
    if (!jobcard) return;

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
      return;
    }

    const payload = buildCompletePayload(state, jobcard);

    try {
      const formData = await buildCompleteFormData(
        payload,
        state.signature,
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
          signature: state.signature,
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
    } catch {
      // error handled by mutation onError
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
          >
            <View className="flex flex-col gap-4">
              <CardGroup title="Travel" icon={undefined}>
                <FieldGroup>
                  <View className="flex flex-col gap-1">
                    <Text className="text-sm text-text">
                      Vehicle Arrival Mileage{" "}
                      <Text className="text-error">*</Text>
                    </Text>
                    <Input size="md">
                      <InputField
                        placeholder="e.g. 12.5"
                        keyboardType="numeric"
                        value={state.travel_mileage}
                        onChangeText={(text) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "travel_mileage",
                            value: text,
                          })
                        }
                      />
                    </Input>
                  </View>
                </FieldGroup>
              </CardGroup>

              {jobcard.inspection_checklists &&
                jobcard.inspection_checklists.length > 0 && (
                  <CardGroup title="Inspection Checklists" icon={undefined}>
                    <FieldSet>
                      {jobcard.inspection_checklists.map((checklist) => (
                        <View key={checklist.id}>
                          <FieldLegend>{checklist.template_name}</FieldLegend>
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
                                className="flex flex-col gap-2 mb-2"
                              >
                                <View className="flex-row items-center justify-between">
                                  <Text className="flex-1 text-text text-sm">
                                    {item.step}. {item.description}
                                  </Text>
                                  <Switch
                                    value={checked}
                                    onValueChange={(val) =>
                                      dispatch({
                                        type: "SET_CHECKLIST_ITEM",
                                        checklistId: checklist.id,
                                        step: item.step,
                                        checked: val,
                                      })
                                    }
                                  />
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
                      ))}
                    </FieldSet>
                  </CardGroup>
                )}

              {jobcard.assets && jobcard.assets.length > 0 && (
                <CardGroup title="SMR Readings" icon={undefined}>
                  <FieldSet>
                    {jobcard.assets.map((asset) => {
                      const entry = state.smr_entries[asset.id] ?? {
                        smr_reading: "",
                        equipment_condition: "",
                        recommendations: "",
                      };
                      return (
                        <View key={asset.id} className="mb-3">
                          <FieldLegend>{assetLabel(asset)}</FieldLegend>
                          <View className="flex flex-col gap-2 mb-2">
                            <Text className="text-sm text-text">
                              SMR Reading{" "}
                              <Text className="text-error">*</Text>
                            </Text>
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
                          <View className="flex flex-col gap-2 mb-2">
                            <Text className="text-sm text-text">
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
                          <View className="flex flex-col gap-2">
                            <Text className="text-sm text-text">
                              Recommendations
                            </Text>
                            <Textarea size="md">
                              <TextareaInput
                                placeholder="Any recommendations"
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
                      );
                    })}
                  </FieldSet>
                </CardGroup>
              )}

              {jobcard.tasks && jobcard.tasks.length > 0 && (
                <CardGroup title="Tasks" icon={undefined}>
                  <FieldSet>
                    {jobcard.tasks.map((task) => {
                      const completed =
                        state.task_status[task.id] ?? false;
                      return (
                        <View
                          key={task.id}
                          className="flex flex-col gap-2 mb-2"
                        >
                          <View className="flex-row items-center justify-between">
                            <Text className="flex-1 text-text text-sm">
                              {task.task_step}. {task.description}
                            </Text>
                            <Switch
                              value={completed}
                              onValueChange={(val) =>
                                dispatch({
                                  type: "SET_TASK_STATUS",
                                  taskId: task.id,
                                  completed: val,
                                })
                              }
                            />
                          </View>
                          {!completed && (
                            <Input size="sm">
                              <InputField
                                placeholder="Reason for incomplete (optional)"
                                value={
                                  state.task_reasons[task.id] ?? ""
                                }
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
                  </FieldSet>
                </CardGroup>
              )}

              {jobcard.inventory && jobcard.inventory.length > 0 && (
                <CardGroup title="Parts Used" icon={undefined}>
                  <FieldSet>
                    {jobcard.inventory.map((item) => {
                      const itemName =
                        item.inventory?.stock_code ??
                        `Item #${item.inventory_id}`;
                      const qtyRequested =
                        item.quantity_requested ?? 0;
                      const used =
                        state.inventory_used[item.id] ?? 0;
                      const reason =
                        state.inventory_reasons?.[item.id] ?? "";

                      return (
                        <View key={item.id} className="mb-3">
                          <FieldLegend>{itemName}</FieldLegend>
                          <Text className="text-sm text-text-muted mb-1">
                            Quantity Requested: ( x{qtyRequested} )
                          </Text>
                          <View className="flex flex-col gap-2 mb-2">
                            <Text className="text-sm text-text">
                              Qty Used:
                            </Text>
                            <Input size="md">
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
                            <ReasonSelect
                              value={reason}
                              onChange={(val) =>
                                dispatch({
                                  type: "SET_INVENTORY_REASON",
                                  invId: item.id,
                                  reason: val,
                                })
                              }
                            />
                          )}
                        </View>
                      );
                    })}
                  </FieldSet>
                </CardGroup>
              )}

              <CardGroup title="Sign-off" icon={undefined}>
                <FieldGroup>
                  <SignatureCapture
                    value={state.signature}
                    onChange={(val) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "signature",
                        value: val,
                      })
                    }
                  />
                  {jobcard.assets && jobcard.assets.length > 0 && (
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
                  )}
                </FieldGroup>
              </CardGroup>

              {missingFields.length > 0 && (
                <View className="flex flex-col gap-1">
                  <Text className="text-error text-xs font-medium">
                    Please complete before closing:
                  </Text>
                  {missingFields.map((field, i) => (
                    <Text key={i} className="text-error text-xs ml-2">
                      {"\u2022"} {field}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View
            className="flex-col gap-3 px-4 pt-3 pb-24 border-t border-border bg-background"
          >
            <View className="flex-row gap-3">
              <Button
                variant="outline"
                onPress={() => router.back()}
                className="flex-1"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                onPress={handleSubmit}
                isDisabled={
                  completeMutation.isPending || missingFields.length > 0
                }
                className="flex-1"
              >
                <ButtonText>
                  {completeMutation.isPending
                    ? "Completing..."
                    : "Close And Complete Jobcard"}
                </ButtonText>
              </Button>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
