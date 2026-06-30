import React, { useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react-native";
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
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

type FormSelectDropdownProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isDisabled?: boolean;
  hidden?: boolean;
  options: SelectOption[];
};

export function FormSelectDropdown<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  size = "md",
  isRequired = false,
  isDisabled = false,
  hidden = false,
  options,
}: FormSelectDropdownProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const [open, setOpen] = useState(false);

        const selectedOption = useMemo(() => {
          if (!value) return null;
          return options.find((o) => String(o.value) === String(value)) ?? null;
        }, [options, value]);

        const displayLabel = selectedOption?.label ?? "";

        const toggleOpen = useCallback(() => {
          setOpen((prev) => !prev);
        }, []);

        const handleSelect = useCallback(
          (option: SelectOption) => {
            onChange(option.value);
            setOpen(false);
            onBlur();
          },
          [onChange, onBlur]
        );

        const placeholderText =
          placeholder || `Select ${label?.toLowerCase() || "an option"}...`;

        return (
          <FormControl
            isInvalid={!!error}
            size={size}
            isDisabled={isDisabled}
            isRequired={isRequired}
            style={hidden ? { display: "none" } : {}}
          >
            {label && (
              <FormControlLabel>
                <FormControlLabelText>{label}</FormControlLabelText>
              </FormControlLabel>
            )}

            <TouchableOpacity
              onPress={toggleOpen}
              disabled={isDisabled}
              className={cn(
                "my-1 flex flex-row items-center justify-between rounded-lg border border-border bg-background px-3",
                size === "sm" ? "h-8" : size === "lg" ? "h-12" : "h-10",
                !!error && "border-error",
                isDisabled && "opacity-50"
              )}
            >
              <Text
                className={cn(
                  "flex-1 text-text",
                  !displayLabel && "text-text-muted"
                )}
                numberOfLines={1}
              >
                {displayLabel || placeholderText}
              </Text>
              {open ? (
                <ChevronUp size={16} className="text-text" />
              ) : (
                <ChevronDown size={16} className="text-text" />
              )}
            </TouchableOpacity>

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

            {open && (
              <View className="rounded-lg border border-border bg-background overflow-hidden">
                <ScrollView
                  className="max-h-48"
                  nestedScrollEnabled
                >
                  {options.length === 0 ? (
                    <View className="items-center justify-center py-6">
                      <Text className="text-text-muted">No options</Text>
                    </View>
                  ) : (
                    options.map((option) => {
                      const isSelected =
                        String(selectedOption?.value) === String(option.value);
                      return (
                        <Pressable
                          key={option.value}
                          onPress={() => handleSelect(option)}
                          className={cn(
                            "px-3 py-3 border-t border-border",
                            isSelected && "bg-primary-muted"
                          )}
                        >
                          <Text
                            className={cn(
                              "text-text",
                              isSelected && "font-medium"
                            )}
                          >
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            )}
          </FormControl>
        );
      }}
    />
  );
}
