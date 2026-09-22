import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Wrench, Check } from "lucide-react-native";
import { Spinner } from "@/components/ui/spinner";
import { Badge, BadgeText } from "@/components/ui/badge";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
import type { ServiceKit } from "@/types/service-kit";

interface ComJobcardServiceKitPickerProps {
  assetTypeId: number | null;
  onKitSelect: (kit: ServiceKit) => void;
  selectedKitId: number | null;
}

export default function ComJobcardServiceKitPicker({
  assetTypeId,
  onKitSelect,
  selectedKitId,
}: ComJobcardServiceKitPickerProps) {
  const [kits, setKits] = useState<ServiceKit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!assetTypeId) {
      setKits([]);
      return;
    }
    setIsLoading(true);
    apiFetch(`${HimoinsaAPI.api_settings_customers_meta}?param=asset_type`, "GET")
      .then((res) => res.json())
      .then(() => {
        // Fetch service kits by asset type
        return apiFetch(
          `${HimoinsaAPI.api_settings_customers_meta}?param=service_kit&asset_type_id=${assetTypeId}`,
          "GET"
        );
      })
      .then((res) => res.json())
      .then((json: any) => {
        setKits(json.data?.service_kits ?? []);
      })
      .catch(() => setKits([]))
      .finally(() => setIsLoading(false));
  }, [assetTypeId]);

  if (!assetTypeId) {
    return (
      <View className="py-3">
        <Text className="text-xs text-text-muted">
          Select an asset first to see available service kits.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="py-3 items-center">
        <Spinner size="small" />
        <Text className="text-xs text-text-muted mt-2">Loading service kits...</Text>
      </View>
    );
  }

  if (kits.length === 0) {
    return (
      <View className="py-3">
        <Text className="text-xs text-text-muted">
          No service kits available for this asset type.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-2">
      <Text className="text-sm font-semibold mb-2">Service Kit</Text>
      <ScrollView horizontal={false} className="max-h-40">
        {kits.map((kit) => (
          <Pressable
            key={kit.id}
            onPress={() => onKitSelect(kit)}
            className={`flex-row items-center gap-2 rounded border px-3 py-2 mb-1 ${
              selectedKitId === kit.id
                ? "border-primary bg-primary/10"
                : "border-border"
            }`}
          >
            <Wrench className="h-4 w-4 text-text-muted" />
            <View className="flex-1">
              <Text className="text-sm font-medium">{kit.name}</Text>
              {kit.description && (
                <Text className="text-xs text-text-muted">{kit.description}</Text>
              )}
            </View>
            {selectedKitId === kit.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
            {kit.items && kit.items.length > 0 && (
              <Badge size="sm" variant="outline">
                <BadgeText className="text-xs">{kit.items.length} items</BadgeText>
              </Badge>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
