import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import {
  Control,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Plus } from "lucide-react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FieldLabel } from "@/components/ui/field";
import { FormCombobox } from "@/components/ui/forms/form-combobox";
import {
  useGetContractsList,
  useGetContractShow,
  useSearchFleetAssets,
} from "@/http/services";
import ComAssetRow from "./com-asset-row";
import type { Asset } from "@/types/asset";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStep1FleetProps {
  control: Control<JobcardCreationRequest>;
  onContractChange?: (contractLabel: string | null) => void;
}

export default function TabStep1Fleet({
  control,
  onContractChange,
}: TabStep1FleetProps) {
  const [contractSearch, setContractSearch] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [debouncedContractSearch, setDebouncedContractSearch] = useState("");
  const [debouncedAssetSearch, setDebouncedAssetSearch] = useState("");
  const [selectedContractId, setSelectedContractId] = useState("");

  const watchedAssets = useWatch({ control, name: "assets" });

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({ control, name: "assets" });

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

  const assetOptions =
    filteredAssets.map((asset) => ({
      value: String(asset.id),
      label: [
        asset.fleet_number ?? "N/A",
        asset.description ?? "No description",
        asset.serial_number ? `(${asset.serial_number})` : "",
      ]
        .filter(Boolean)
        .join(" — "),
    })) ?? [];

  const handleAddAsset = useCallback(() => {
    appendAsset({ asset_id: 0, asset_location_id: 0 });
  }, [appendAsset]);

  return (
    <View className="flex flex-col gap-5">
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

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Fleet Assets</FieldLabel>
          <Button variant="outline" size="sm" onPress={handleAddAsset}>
            <ButtonIcon as={Plus} className="mr-1 h-3 w-3" />
            <ButtonText>Add Asset</ButtonText>
          </Button>
        </View>

        {assetFields.length === 0 && (
          <Text className="text-sm text-text-muted">
            {!selectedContractId
              ? "Select a contract to view its assets"
              : contractLoading
                ? "Loading contract assets..."
                : contractAssets.length === 0
                  ? "No assets for this contract"
                  : 'No assets added. Click "Add Asset" to select at least one asset.'}
          </Text>
        )}

        {assetFields.map((field, i) => (
          <ComAssetRow
            key={field.id}
            control={control}
            index={i}
            assetOptions={assetOptions}
            assetId={Number(watchedAssets?.[i]?.asset_id) || null}
            isFleetJc={true}
            onSearch={setAssetSearch}
            onRemove={() => removeAsset(i)}
          />
        ))}
      </View>
    </View>
  );
}
