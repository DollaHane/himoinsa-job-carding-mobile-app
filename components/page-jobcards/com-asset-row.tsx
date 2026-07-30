import React from "react";
import { Control } from "react-hook-form";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormCombobox } from "@/components/ui/forms/form-combobox";
import AssetLocationSelect from "./com-asset-location-select";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import { Icon } from "../ui/icon";
import { Trash2 } from "lucide-react-native";

interface ComAssetRowProps {
  control: Control<JobcardCreationRequest>;
  index: number;
  assetOptions: { value: string; label: string }[];
  assetId: number | null;
  isFleetJc: boolean;
  onSearch: (value: string) => void;
  onRemove: () => void;
}

export default function ComAssetRow({
  control,
  index,
  assetOptions,
  assetId,
  isFleetJc,
  onSearch,
  onRemove,
}: ComAssetRowProps) {
  return (
    <Card className="p-4 gap-3">
      <FormCombobox
        control={control}
        name={`assets.${index}.asset_id`}
        placeholder="Search asset..."
        options={assetOptions}
        onSearch={onSearch}
      />

      <AssetLocationSelect
        control={control}
        name={`assets.${index}.asset_location_id`}
        assetId={assetId}
        isFleetJc={isFleetJc}
      />

      <Button
        variant="outline"
        size="sm"
        onPress={onRemove}
        className="self-end border-error"
      >
        <Icon as={Trash2} className="text-error"/>
        <ButtonText className="text-error">Remove Asset</ButtonText>
      </Button>
    </Card>
  );
}
