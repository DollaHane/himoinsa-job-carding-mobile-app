import React, { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Calendar } from "lucide-react-native";
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
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseDatePickerProps {
  label?: string;
  placeholder?: string;
  description?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: "date" | "time" | "datetime";
  className?: string;
}

type FormDatePickerProps<TFieldValues extends FieldValues> =
  BaseDatePickerProps & {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
  };

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "";
  return `${formatDate(date)} ${formatTime(date)}`;
}

function displayValue(
  value: string | Date | undefined,
  mode: "date" | "time" | "datetime",
): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (mode === "date") return formatDate(date);
  if (mode === "time") return formatTime(date);
  return formatDateTime(date);
}

export function FormDatePicker<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select date",
  description,
  isRequired = false,
  isDisabled = false,
  minimumDate,
  maximumDate,
  mode = "date",
  className,
}: FormDatePickerProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <DatePickerInternal
            label={label}
            placeholder={placeholder}
            description={description}
            isRequired={isRequired}
            isDisabled={isDisabled}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            mode={mode}
            className={className}
            error={error}
            value={value}
            onChange={onChange}
          />
        );
      }}
    />
  );
}

interface DatePickerInternalProps extends BaseDatePickerProps {
  value?: string | Date;
  onChange: (value: string) => void;
  error?: { message?: string };
}

function DatePickerInternal({
  label,
  placeholder = "Select date",
  description,
  isRequired,
  isDisabled,
  minimumDate,
  maximumDate,
  mode = "date",
  className,
  value,
  onChange,
  error,
}: DatePickerInternalProps) {
  const [showPicker, setShowPicker] = useState(false);

  const dateValue = value ? new Date(value) : new Date();

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) {
        onChange(selectedDate.toISOString());
      }
      return;
    }

    if (event.type === "set" && selectedDate) {
      onChange(selectedDate.toISOString());
    }
  };

  return (
    <FormControl
      isInvalid={!!error}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <View className={cn("w-full", className)}>
        <Pressable onPress={() => !isDisabled && setShowPicker(true)}>
          <Input
            variant="outline"
            size="md"
            isDisabled={isDisabled}
            isReadOnly={true}
            className="pointer-events-none w-full my-1"
          >
            <InputField
              placeholder={placeholder}
              value={displayValue(value, mode)}
              editable={false}
              className="text-text"
            />
            <InputSlot className="pr-3 pointer-events-none">
              <InputIcon as={Calendar} className="text-text" />
            </InputSlot>
          </Input>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateValue}
            mode={mode}
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )}

        {Platform.OS === "ios" && showPicker && (
          <Button onPress={() => setShowPicker(false)} className="mt-2">
            <ButtonText>Done</ButtonText>
          </Button>
        )}
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
}
