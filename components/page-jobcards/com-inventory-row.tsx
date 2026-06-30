import React from "react";
import { View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { FormCombobox } from "@/components/ui/forms/form-combobox";
import { FormDatePicker } from "@/components/ui/forms/form-date-picker";
import { AlertCircle } from "lucide-react-native";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import { Icon } from "lucide-react-native";

interface ComInventoryRowProps {
  control: Control<JobcardCreationRequest>;
  index: number;
  inventoryOptions: { value: string; label: string }[];
  onSearch: (value: string) => void;
  onRemove: () => void;
}

export default function ComInventoryRow({
  control,
  index,
  inventoryOptions,
  onSearch,
  onRemove,
}: ComInventoryRowProps) {
  return (
    <Card className="p-4 gap-3">
      <View className="flex-row gap-2 items-start">
        <View className="w-10 items-center justify-center rounded-lg border border-border bg-background-subtle h-10 mt-1">
          <Text className="text-text-muted text-sm font-medium">
            {index + 1}
          </Text>
        </View>

        <View className="flex-1">
          <FormCombobox
            control={control}
            name={`inventory.${index}.inventory_id`}
            placeholder="Search inventory..."
            options={inventoryOptions}
            onSearch={onSearch}
          />
        </View>

        <View className="w-20 mt-1">
          <Controller
            control={control}
            name={`inventory.${index}.quantity_requested`}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <FormControl isInvalid={!!error}>
                <Input size="md">
                  <InputField
                    keyboardType="decimal-pad"
                    placeholder="Qty"
                    value={value ? String(value) : ""}
                    onChangeText={(text) => {
                      const parsed = parseFloat(text || "0");
                      if (!isNaN(parsed)) {
                        onChange(Math.round(parsed * 100) / 100);
                      }
                    }}
                    onBlur={onBlur}
                  />
                </Input>
                {error && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircle} />
                    <FormControlErrorText>
                      {error.message}
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />
        </View>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1">
          <FormDatePicker
            control={control}
            name={`inventory.${index}.date_requested`}
            label="Date Requested"
            mode="date"
          />
        </View>

        <View className="flex-1">
          <FormDatePicker
            control={control}
            name={`inventory.${index}.estimated_arrival_date`}
            label="Est. Arrival"
            mode="date"
          />
        </View>
      </View>

      <Controller
        control={control}
        name={`inventory.${index}.notes`}
        render={({ field: { onChange, onBlur, value } }) => (
          <FormControl>
            <Input size="md">
              <InputField
                placeholder="Notes"
                value={value ?? ""}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </Input>
          </FormControl>
        )}
      />

      <Button
        variant="outline"
        size="sm"
        onPress={onRemove}
        className="self-end border-error"
      >
        <ButtonText className="text-error">Remove Item</ButtonText>
      </Button>
    </Card>
  );
}
