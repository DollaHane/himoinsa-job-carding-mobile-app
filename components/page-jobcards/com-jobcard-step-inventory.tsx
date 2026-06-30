import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import {
  Control,
  useFieldArray,
} from "react-hook-form";
import { Plus } from "lucide-react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FieldLabel } from "@/components/ui/field";
import { useGetInventoryList, useSearchInventory } from "@/http/services";
import { useAuth } from "@/contexts/AuthContext";
import ComInventoryRow from "./com-inventory-row";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStepInventoryProps {
  control: Control<JobcardCreationRequest>;
}

export default function TabStepInventory({ control }: TabStepInventoryProps) {
  const { user } = useAuth();
  const [invSearch, setInvSearch] = useState("");
  const [debouncedInvSearch, setDebouncedInvSearch] = useState("");

  const {
    fields: inventoryFields,
    append: appendInventory,
    remove: removeInventory,
  } = useFieldArray({ control, name: "inventory" });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInvSearch(invSearch), 300);
    return () => clearTimeout(timer);
  }, [invSearch]);

  const { data: preloadedInventory } = useGetInventoryList();
  const { data: searchedInventory } = useSearchInventory(debouncedInvSearch);

  const inventoryData = debouncedInvSearch
    ? searchedInventory
    : preloadedInventory;

  const inventoryOptions =
    inventoryData?.map((item) => ({
      value: String(item.id),
      label: item.stock_code ?? `Inventory ${item.id}`,
    })) ?? [];

  const handleAddInventory = useCallback(() => {
    appendInventory({
      inventory_id: 0,
      quantity_requested: 1,
      requested_by: user?.id ?? 0,
      date_requested: new Date().toISOString().slice(0, 10),
      estimated_arrival_date: null,
      notes: null,
    });
  }, [appendInventory, user?.id]);

  return (
    <View className="flex flex-col gap-5">
      <View className="flex-row items-center justify-between">
        <FieldLabel>Inventory Items</FieldLabel>
        <Button variant="outline" size="sm" onPress={handleAddInventory}>
          <ButtonIcon as={Plus} className="mr-1 h-3 w-3" />
          <ButtonText>Add Inventory</ButtonText>
        </Button>
      </View>

      {inventoryFields.length === 0 && (
        <Text className="text-sm text-text-muted">
          No inventory items added. Click &ldquo;Add Inventory&rdquo; to add
          items to this jobcard.
        </Text>
      )}

      {inventoryFields.map((field, i) => (
        <ComInventoryRow
          key={field.id}
          control={control}
          index={i}
          inventoryOptions={inventoryOptions}
          onSearch={setInvSearch}
          onRemove={() => removeInventory(i)}
        />
      ))}
    </View>
  );
}
