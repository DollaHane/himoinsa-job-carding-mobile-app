import React from "react";
import { View } from "react-native";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormSelectDropdown } from "@/components/ui/forms/form-select-dropdown";
import { Text } from "@/components/ui/text";
import { useGetLocationsByEntity } from "@/http/services";

interface AssetLocationSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  assetId: number | null;
  isFleetJc: boolean;
}

export default function AssetLocationSelect<TFieldValues extends FieldValues>({
  control,
  name,
  assetId,
  isFleetJc,
}: AssetLocationSelectProps<TFieldValues>) {
  const entityType = isFleetJc ? "asset" : "customer_asset";
  const { data: locations } = useGetLocationsByEntity(assetId ?? 0, entityType);

  const locationOptions =
    locations?.map((loc) => ({
      value: String(loc.id),
      label: loc.address ?? loc.name ?? `Location ${loc.id}`,
    })) ?? [];

  const hasLocations = locationOptions.length > 0;

  return (
    <View className="flex-1">
      {assetId ? (
        hasLocations ? (
          <FormSelectDropdown
            control={control}
            name={name}
            label="Location"
            placeholder="Select location..."
            options={locationOptions}
          />
        ) : (
          <View className="rounded-md border border-border px-3 py-2">
            <Text className="text-sm text-text-muted">
              No locations for this asset
            </Text>
          </View>
        )
      ) : (
        <View className="rounded-md border border-border px-3 py-2">
          <Text className="text-sm text-text-muted">
            Select an asset first
          </Text>
        </View>
      )}
    </View>
  );
}
