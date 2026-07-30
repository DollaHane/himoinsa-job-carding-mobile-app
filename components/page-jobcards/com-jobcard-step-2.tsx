import React, { useMemo } from "react";
import { View } from "react-native";
import { Control } from "react-hook-form";
import { FormSelect } from "@/components/ui/forms/form-select";
import { FormDatePicker } from "@/components/ui/forms/form-date-picker";
import { FormMultiSelect } from "@/components/ui/forms/form-multiselect";
import { useGetJobcardMetadata, useGetTechniciansList } from "@/http/services";
import { mapToOptions } from "@/lib/helpers/form-options";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStep2Props {
  control: Control<JobcardCreationRequest>;
}

export default function TabStep2({ control }: TabStep2Props) {
  const { data: metadata } = useGetJobcardMetadata();
  const { data: techniciansData } = useGetTechniciansList();

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

  return (
    <View className="flex flex-col gap-5">
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
