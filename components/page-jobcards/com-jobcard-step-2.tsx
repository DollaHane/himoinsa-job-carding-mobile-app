import React, { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Control, useWatch } from "react-hook-form";
import { FormSelect } from "@/components/ui/forms/form-select";
import { FormDatePicker } from "@/components/ui/forms/form-date-picker";
import { FormMultiSelect } from "@/components/ui/forms/form-multiselect";
import { FormTextArea } from "@/components/ui/forms/form-textarea";
import { useGetJobcardMetadata, useGetTechniciansList } from "@/http/services";
import { mapToOptions } from "@/lib/helpers/form-options";
import ComJobcardServiceKitPicker from "./com-jobcard-service-kit-picker";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import type { ServiceKit } from "@/types/service-kit";

interface TabStep2Props {
  control: Control<JobcardCreationRequest>;
}

export default function TabStep2({ control }: TabStep2Props) {
  const { data: metadata } = useGetJobcardMetadata();
  const { data: techniciansData } = useGetTechniciansList();
  const [selectedKitId, setSelectedKitId] = useState<number | null>(null);

  const watchedAssets = useWatch({ control, name: "assets" });

  const serviceTypeOptions = useMemo(
    () => mapToOptions(metadata?.service_types ?? [], "name", "id"),
    [metadata]
  );

  const technicianOptions = useMemo(() => {
    if (!techniciansData) return [];
    return techniciansData.map((t) => ({
      value: String(t.id),
      label:
        `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim() ||
        `Technician ${t.id}`,
    }));
  }, [techniciansData]);

  // Get asset type from first selected asset for service kit lookup
  const assetTypeId = useMemo(() => {
    // This would need to be resolved from the asset data
    // For now, we'll pass null and let the picker handle it
    return null;
  }, [watchedAssets]);

  const handleKitSelect = useCallback(
    (kit: ServiceKit) => {
      setSelectedKitId(kit.id);
      // The service kit picker would pre-fill work_description, tasks, etc.
      // This is handled by the parent component via the control
    },
    []
  );

  return (
    <View className="flex flex-col gap-5">
      {/* Service Kit Picker */}
      <ComJobcardServiceKitPicker
        assetTypeId={assetTypeId}
        onKitSelect={handleKitSelect}
        selectedKitId={selectedKitId}
      />

      <FormTextArea
        control={control}
        name="work_description"
        label="Work Description"
        placeholder="Describe the work to be done..."
        isRequired
      />

      <FormSelect
        control={control}
        name="service_type"
        label="Service Type"
        options={serviceTypeOptions}
        isRequired
      />

      <FormMultiSelect
        control={control}
        name="technicians"
        label="Technicians"
        options={technicianOptions}
        placeholder="Select technicians..."
      />

      <FormDatePicker
        control={control}
        name="scheduled_datetime"
        label="Scheduled Date & Time"
        mode="datetime"
      />
    </View>
  );
}
