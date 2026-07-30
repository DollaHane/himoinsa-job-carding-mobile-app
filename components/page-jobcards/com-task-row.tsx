import React from "react";
import { View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { FormDurationPicker } from "@/components/ui/forms/form-duration-picker";
import { AlertCircle } from "lucide-react-native";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import { Trash2 } from "lucide-react-native";
import { Icon } from "../ui/icon";

interface ComTaskRowProps {
  control: Control<JobcardCreationRequest>;
  index: number;
  onRemove: () => void;
}

export default function ComTaskRow({
  control,
  index,
  onRemove,
}: ComTaskRowProps) {
  return (
    <Card className="p-4 gap-3">
      <View className="flex-row gap-2">
        <View className="w-10">
          <Controller
            control={control}
            name={`tasks.${index}.task_step`}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormControl>
                <Input size="md">
                  <InputField
                    keyboardType="number-pad"
                    placeholder="#"
                    value={value ? String(value) : ""}
                    onChangeText={(text) => {
                      const parsed = parseInt(text || "0", 10);
                      onChange(isNaN(parsed) ? 0 : parsed);
                    }}
                    onBlur={onBlur}
                    className="text-center"
                  />
                </Input>
              </FormControl>
            )}
          />
        </View>

        <View className="flex-1">
          <Controller
            control={control}
            name={`tasks.${index}.description`}
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <FormControl isInvalid={!!error}>
                <Input size="md">
                  <InputField
                    placeholder="Task description"
                    value={value ?? ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </Input>
                {error && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircle} />
                    <FormControlErrorText>{error.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            )}
          />
        </View>
      </View>

      <FormDurationPicker
        control={control}
        name={`tasks.${index}.duration`}
        label="Duration"
      />

      <Button
        variant="outline"
        size="sm"
        onPress={onRemove}
        className="self-end border-error"
      >
        <Icon as={Trash2} className="text-error"/>
        <ButtonText className="text-error">Remove Task</ButtonText>
      </Button>
    </Card>
  );
}
