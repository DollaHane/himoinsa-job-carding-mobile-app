import React, { useState, useMemo, useCallback } from "react";
import { View, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react-native";
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
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type ComboboxOption = { value: string; label: string };

type FormComboboxProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  placeholder?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isDisabled?: boolean;
  hidden?: boolean;
  options: ComboboxOption[];
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  initialLabel?: string;
};

export function FormCombobox<TFieldValues extends FieldValues>({
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
  onSearch,
  onChange,
  initialLabel,
}: FormComboboxProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange: fieldOnChange, onBlur, value },
        fieldState: { error },
      }) => {
        const [open, setOpen] = useState(false);
        const [searchText, setSearchText] = useState("");

        const selectedOption = useMemo(() => {
          if (!value) return null;
          return (
            options.find((o) => String(o.value) === String(value)) ?? null
          );
        }, [options, value]);

        const displayLabel = selectedOption?.label ?? initialLabel ?? "";

        const filteredOptions = useMemo(() => {
          const query = searchText.toLowerCase().trim();
          if (!query) return options;
          return options.filter((o) =>
            o.label.toLowerCase().includes(query)
          );
        }, [options, searchText]);

        const toggleOpen = useCallback(() => {
          setSearchText("");
          setOpen((prev) => !prev);
        }, []);

        const handleClose = useCallback(() => {
          setOpen(false);
          onBlur();
        }, [onBlur]);

        const handleSelect = useCallback(
          (option: ComboboxOption) => {
            fieldOnChange(option.value);
            onChange?.(option.value);
            setSearchText("");
            setOpen(false);
          },
          [fieldOnChange, onChange]
        );

        const handleClear = useCallback(() => {
          fieldOnChange("");
          onChange?.("");
          setSearchText("");
        }, [fieldOnChange, onChange]);

        const handleSearchChange = useCallback(
          (text: string) => {
            setSearchText(text);
            onSearch?.(text);
          },
          [onSearch]
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
              <View className="flex-row items-center gap-1">
                {displayLabel ? (
                  <Pressable onPress={handleClear} className="p-1">
                    <X size={14} className="text-text" />
                  </Pressable>
                ) : null}
                <View className="p-1">
                  {open ? (
                    <ChevronUp size={16} className="text-text" />
                  ) : (
                    <ChevronDown size={16} className="text-text" />
                  )}
                </View>
              </View>
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
                <View className="px-3 pt-2 pb-2">
                  <Input size={size}>
                    <InputField
                      placeholder={`Search ${label?.toLowerCase() || ""}...`}
                      value={searchText}
                      onChangeText={handleSearchChange}
                      autoFocus
                    />
                  </Input>
                </View>
                <ScrollView
                  className="max-h-48"
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {filteredOptions.length === 0 ? (
                    <View className="items-center justify-center py-6">
                      <Text className="text-text-muted">
                        No results found.
                      </Text>
                    </View>
                  ) : (
                    filteredOptions.map((option) => {
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
