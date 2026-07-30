import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useGetJobcardSlotImages } from "@/http/services";
import SlotImagePicker from "@/components/page-jobcards/com-slot-image-picker";

const SLOTS = ["front", "rear", "left", "right", "fuel"] as const;

interface AssetShape {
  id: number;
  asset_id: number;
  asset?: {
    fleet_number?: string | null;
    description?: string | null;
  } | null;
}

interface GeneratorSectionProps {
  jobcardId: number;
  assets: AssetShape[];
  slotImages: Record<string, string>;
  onSlotChange: (key: string, uri: string | null) => void;
  disabled?: boolean;
}

function AssetSlots({
  jobcardId,
  asset,
  slotImages,
  onSlotChange,
  disabled,
}: {
  jobcardId: number;
  asset: AssetShape;
  slotImages: Record<string, string>;
  onSlotChange: (key: string, uri: string | null) => void;
  disabled: boolean;
}) {
  const { data: existingImages } = useGetJobcardSlotImages(
    jobcardId,
    asset.asset_id,
  );

  const existingUrls = new Map<string, string>();
  if (existingImages) {
    for (const img of existingImages) {
      existingUrls.set(img.slot, img.url);
    }
  }

  const assetLabel =
    asset.asset?.fleet_number ??
    asset.asset?.description ??
    `Asset #${asset.asset_id}`;

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2">{assetLabel}</Text>
      <View className="flex flex-row flex-wrap gap-3">
        {SLOTS.map((slot) => {
          const key = `${asset.asset_id}_${slot}`;
          return (
            <SlotImagePicker
              key={key}
              slot={slot}
              value={slotImages[key] ?? null}
              existingUrl={existingUrls.get(slot) ?? null}
              onChange={(s, uri) => {
                const slotKey = `${asset.asset_id}_${s}`;
                onSlotChange(slotKey, uri);
              }}
              disabled={disabled}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function GeneratorSection({
  jobcardId,
  assets,
  slotImages,
  onSlotChange,
  disabled = false,
}: GeneratorSectionProps) {
  if (assets.length === 0) return null;

  return (
    <View>
      {assets.map((asset) => (
        <AssetSlots
          key={asset.id}
          jobcardId={jobcardId}
          asset={asset}
          slotImages={slotImages}
          onSlotChange={onSlotChange}
          disabled={disabled}
        />
      ))}
    </View>
  );
}
