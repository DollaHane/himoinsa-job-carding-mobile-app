import React, { useCallback, useMemo, useState } from "react";
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
import { FormMultiSelect } from "@/components/ui/forms/form-multiselect";
import ComTaskRow from "./com-task-row";
import ComInventoryRow from "./com-inventory-row";
import { useGetInspectionChecklistsList, useGetInventoryList } from "@/http/services";
import { useAuth } from "@/contexts/AuthContext";
import { mapToOptions } from "@/lib/helpers/form-options";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStep3Props {
  control: Control<JobcardCreationRequest>;
}

export default function TabStep3({ control }: TabStep3Props) {
  const { user } = useAuth();
  const { data: checklists } = useGetInspectionChecklistsList();
  const [inventorySearch, setInventorySearch] = useState("");
  const [debouncedInventorySearch, setDebouncedInventorySearch] = useState("");

  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({ control, name: "tasks" });

  const {
    fields: inventoryFields,
    append: appendInventory,
    remove: removeInventory,
  } = useFieldArray({ control, name: "inventory" });

  const { data: inventoryData } = useGetInventoryList(debouncedInventorySearch || undefined);

  const inventoryOptions = useMemo(
    () => mapToOptions(inventoryData ?? [], "description", "id"),
    [inventoryData]
  );

  const checklistOptions = useMemo(() => {
    if (!checklists) return [];
    return checklists.map((c) => ({
      value: String(c.id),
      label: c.name,
    }));
  }, [checklists]);

  const handleAddTask = useCallback(() => {
    appendTask({
      task_step: taskFields.length + 1,
      description: "",
      duration: 900,
    });
  }, [appendTask, taskFields.length]);

  const handleAddInventory = useCallback(() => {
    appendInventory({
      inventory_id: 0,
      quantity_requested: 1,
      requested_by: user?.technician_id ?? 0,
      date_requested: new Date().toISOString().split("T")[0],
      notes: "",
    });
  }, [appendInventory, user?.technician_id]);

  return (
    <View className="flex flex-col gap-5">
      {/* Tasks Section */}
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Tasks</FieldLabel>
          <Button variant="outline" size="sm" onPress={handleAddTask}>
            <ButtonIcon as={Plus} className="mr-1 h-3 w-3" />
            <ButtonText>Add Task</ButtonText>
          </Button>
        </View>

        {taskFields.length === 0 && (
          <Text className="text-sm text-text-muted">
            No tasks added. Click &ldquo;Add Task&rdquo; to add tasks to this
            jobcard.
          </Text>
        )}

        {taskFields.map((field, i) => (
          <ComTaskRow
            key={field.id}
            control={control}
            index={i}
            onRemove={() => removeTask(i)}
          />
        ))}
      </View>

      {/* Inspection Checklists */}
      <FormMultiSelect
        control={control}
        name="inspection_checklist_ids"
        label="Inspection Checklists"
        options={checklistOptions}
        placeholder="Select checklists..."
      />

      {/* Inventory Section */}
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Inventory</FieldLabel>
          <Button variant="outline" size="sm" onPress={handleAddInventory}>
            <ButtonIcon as={Plus} className="mr-1 h-3 w-3" />
            <ButtonText>Add Item</ButtonText>
          </Button>
        </View>

        {inventoryFields.length === 0 && (
          <Text className="text-sm text-text-muted">
            No inventory items added.
          </Text>
        )}

        {inventoryFields.map((field, i) => (
          <ComInventoryRow
            key={field.id}
            control={control}
            index={i}
            inventoryOptions={inventoryOptions}
            onSearch={setInventorySearch}
            onRemove={() => removeInventory(i)}
          />
        ))}
      </View>
    </View>
  );
}
