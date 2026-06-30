import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { AlertCircle } from "lucide-react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function hoursMinutesToSeconds(hours: number, minutes: number): number {
  return hours * 3600 + minutes * 60;
}

function secondsToHoursMinutes(totalSeconds: number): {
  hours: number;
  minutes: number;
} {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { hours, minutes };
}

type FormDurationPickerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  hidden?: boolean;
};

export function FormDurationPicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  isRequired = false,
  isDisabled = false,
  hidden = false,
}: FormDurationPickerProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const { hours, minutes } = secondsToHoursMinutes(Number(value) || 0);

        const update = (newHours: number, newMinutes: number) => {
          onChange(hoursMinutesToSeconds(newHours, newMinutes));
        };

        return (
          <FormControl
            isInvalid={!!error}
            isDisabled={isDisabled}
            isRequired={isRequired}
            style={hidden ? { display: "none" } : {}}
          >
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
            <View className="flex flex-row gap-3 my-1">
              <Input className={cn("flex-1")} size="md">
                <InputField
                  placeholder="HH"
                  keyboardType="number-pad"
                  value={hours > 0 ? String(hours) : ""}
                  onChangeText={(text) => {
                    const parsed = parseInt(text || "0", 10);
                    update(isNaN(parsed) ? 0 : parsed, minutes);
                  }}
                  editable={!isDisabled}
                />
              </Input>
              <View className="justify-center">
                <Text className="text-lg text-text">:</Text>
              </View>
              <Input className={cn("flex-1")} size="md">
                <InputField
                  placeholder="MM"
                  keyboardType="number-pad"
                  value={String(minutes).padStart(2, "0")}
                  onChangeText={(text) => {
                    let parsed = parseInt(text || "0", 10);
                    if (isNaN(parsed)) parsed = 0;
                    if (parsed > 59) parsed = 59;
                    update(hours, parsed);
                  }}
                  editable={!isDisabled}
                />
              </Input>
            </View>
            {description && !error && (
              <FormControlHelper>
                <FormControlHelperText>{description}</FormControlHelperText>
              </FormControlHelper>
            )}
            {error && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircle} />
                <FormControlErrorText>{error.message}</FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
        );
      }}
    />
  );
}
