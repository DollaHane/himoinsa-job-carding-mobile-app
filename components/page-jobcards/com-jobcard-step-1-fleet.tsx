import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import {
  Control,
  useWatch,
} from "react-hook-form";
import { Check, Truck } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { FormCombobox } from "@/components/ui/forms/form-combobox";
import {
  useGetContractsList,
  useGetContractShow,
  useSearchFleetAssets,
} from "@/http/services";
import AssetLocationSelect from "./com-asset-location-select";
import type { Asset } from "@/types/asset";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

interface TabStep1FleetProps {
  control: Control<JobcardCreationRequest>;
  setValue: (name: any, value: any) => void;
  onContractChange?: (contractLabel: string | null) => void;
}

export default function TabStep1Fleet({
  control,
  setValue,
  onContractChange,
}: TabStep1FleetProps) {
  const [contractSearch, setContractSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [debouncedContractSearch, setDebouncedContractSearch] = useState("");
  const [debouncedAssetSearch, setDebouncedAssetSearch] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");

  const watchedAssets = useWatch({ control, name: "assets" });

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedContractSearch(contractSearch),
      300
    );
    return () => clearTimeout(timer);
  }, [contractSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedAssetSearch(assetSearch), 300);
    return () => clearTimeout(timer);
  }, [assetSearch]);

  const { data: contractsData } = useGetContractsList(
    debouncedContractSearch ? { search: debouncedContractSearch } : undefined
  );
  const { data: contractDetail, isLoading: contractLoading } =
    useGetContractShow(selectedContractId);
  const { data: fleetAssetsData } = useSearchFleetAssets(debouncedAssetSearch);

  const contractOptions =
    contractsData?.map((c) => ({
      value: String(c.id),
      label: c.contract_number ?? `Contract ${c.id}`,
    })) ?? [];

  const contractAssets: Asset[] =
    contractDetail?.assets
      ?.map((ca) => ca.asset_details)
      .filter((a): a is Asset => a != null) ?? [];

  const mergedFleetAssets = selectedContractId
    ? contractAssets
    : fleetAssetsData;

  const filteredAssets = useMemo(() => {
    if (!mergedFleetAssets) return [];
    if (!debouncedAssetSearch) return mergedFleetAssets;
    const search = debouncedAssetSearch.toLowerCase();
    return mergedFleetAssets.filter(
      (a) =>
        a.fleet_number?.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search) ||
        a.serial_number?.toLowerCase().includes(search)
    );
  }, [mergedFleetAssets, debouncedAssetSearch]);

  // Check if an asset is selected
  const isAssetChecked = (assetId: number) => {
    return (watchedAssets ?? []).some((a: any) => a.asset_id === assetId);
  };

  // Get the index of the selected asset in the assets array
  const getAssetIndex = (assetId: number) => {
    return (watchedAssets ?? []).findIndex((a: any) => a.asset_id === assetId);
  };

  // Toggle asset selection (single-select only)
  const toggleAsset = (assetId: number, checked: boolean) => {
    if (checked) {
      setValue("assets", [{ asset_id: assetId, asset_location_id: undefined }]);
    } else {
      setValue("assets", []);
    }
  };

  return (
    <View className="flex flex-col gap-5">
      {/* Contract Selection */}
      <FormCombobox
        control={control}
        name="contract_id"
        label="Contract"
        placeholder="Search and select a contract..."
        options={contractOptions}
        onSearch={(value) => {
          setContractSearch(value);
          if (!value) {
            setSelectedContractId("");
            onContractChange?.(null);
          }
        }}
        onChange={(value) => {
          setSelectedContractId(value || "");
          if (value) {
            const selected = contractOptions.find((o) => o.value === value);
            onContractChange?.(selected?.label ?? null);
          } else {
            onContractChange?.(null);
          }
        }}
      />

      {/* Fleet Assets with Selection */}
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Fleet Assets</FieldLabel>
          {!selectedContractId && (
            <Text className="text-xs text-text-muted">
              Select a contract to view its assets.
            </Text>
          )}
          {selectedContractId && (watchedAssets ?? []).length === 0 && (
            <Text className="text-xs text-text-muted">
              Select one asset below.
            </Text>
          )}
        </View>

        {/* Asset Search */}
        {selectedContractId && (
          <View className="relative">
            <Input size="md" className="pl-9">
              <InputField
                placeholder="Search assets..."
                value={assetSearch}
                onChangeText={setAssetSearch}
              />
            </Input>
            <Icon as={Truck} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          </View>
        )}

        {/* Asset List with Check Marks */}
        {selectedContractId ? (
          <ScrollView horizontal={false} className="max-h-60 border border-border rounded-xl p-2">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const isSelected = isAssetChecked(asset.id);
                const idx = getAssetIndex(asset.id);
                const isDisabled = (watchedAssets ?? []).length > 0 && !isSelected;

                return (
                  <Pressable
                    key={asset.id}
                    onPress={() => {
                      if (!isDisabled) {
                        toggleAsset(asset.id, !isSelected);
                      }
                    }}
                    disabled={isDisabled}
                    className={`flex-row items-center gap-2 rounded-full border border-border px-2 py-1.5 mb-2 ${
                      isDisabled ? "opacity-50" : ""
                    }`}
                  >
                    <View
                      className={cn(
                        "w-8 h-8 rounded-full border items-center justify-center",
                        isSelected
                          ? "bg-accent-primary border-accent-primary"
                          : "border-border bg-background"
                      )}
                    >
                      {isSelected && <Icon as={Check} className="w-3 h-3 text-white" />}
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-text font-medium">
                        {asset.fleet_number || "N/A"} — {asset.description || "No description"}
                      </Text>
                    </View>
                    {isSelected && idx >= 0 && (
                      <View className="w-32">
                        <AssetLocationSelect
                          control={control}
                          name={`assets.${idx}.asset_location_id`}
                          assetId={asset.id}
                          isFleetJc={true}
                        />
                      </View>
                    )}
                  </Pressable>
                );
              })
            ) : (
              <View className="py-8 items-center">
                {contractLoading ? (
                  <Text className="text-sm text-text-muted">Loading contract assets...</Text>
                ) : (
                  <Text className="text-sm text-text-muted">
                    No assets found for this contract.
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        ) : (
          <View className="py-8 items-center">
            <Text className="text-sm text-text-muted">
              Select a contract to view its assets.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
