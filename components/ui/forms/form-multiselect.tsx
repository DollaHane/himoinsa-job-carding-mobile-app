import React, { useState, useMemo, useCallback } from "react";
import { TouchableOpacity, View, ScrollView } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { AlertCircle, Check, ChevronDown, ChevronUp, X } from "lucide-react-native";
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
import { Badge, BadgeText } from "@/components/ui/badge";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export type MultiselectOption = { value: string; label: string };

type FormMultiSelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isDisabled?: boolean;
  hidden?: boolean;
  options: MultiselectOption[];
  placeholder?: string;
};

export function FormMultiSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  size = "md",
  isRequired = false,
  isDisabled = false,
  hidden = false,
  options,
  placeholder,
}: FormMultiSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange: fieldOnChange, value },
        fieldState: { error },
      }) => {
        const [open, setOpen] = useState(false);
        const [search, setSearch] = useState("");

        const selectedValues: string[] = useMemo(
          () => (Array.isArray(value) ? value.map(String) : []),
          [value]
        );

        const selectedOptions = useMemo(
          () => options.filter((opt) => selectedValues.includes(opt.value)),
          [options, selectedValues]
        );

        const filteredOptions = useMemo(() => {
          const query = search.toLowerCase().trim();
          if (!query) return options;
          return options.filter((o) => o.label.toLowerCase().includes(query));
        }, [options, search]);

        const toggleValue = useCallback(
          (val: string) => {
            const strVal = String(val);
            if (selectedValues.includes(strVal)) {
              fieldOnChange(selectedValues.filter((v) => v !== strVal));
            } else {
              fieldOnChange([...selectedValues, strVal]);
            }
          },
          [fieldOnChange, selectedValues]
        );

        const removeValue = useCallback(
          (val: string) => {
            fieldOnChange(selectedValues.filter((v) => v !== val));
          },
          [fieldOnChange, selectedValues]
        );

        const toggleOpen = useCallback(() => {
          setSearch("");
          setOpen((prev) => !prev);
        }, []);

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
                "my-1 flex flex-row items-center justify-between rounded-lg border border-border bg-background px-3 py-2",
                size === "sm" ? "min-h-8" : size === "lg" ? "min-h-12" : "min-h-10",
                !!error && "border-error",
                isDisabled && "opacity-50"
              )}
            >
              <View className="flex-1 flex-row flex-wrap gap-1">
                {selectedOptions.length === 0 && (
                  <Text className="text-text-muted">
                    {placeholder || `Select ${label?.toLowerCase() || ""}...`}
                  </Text>
                )}
                {selectedOptions.map((opt) => (
                  <Badge key={opt.value} action="info" variant="solid" size="sm">
                    <View className="flex-row items-center gap-1">
                      <BadgeText>{opt.label}</BadgeText>
                      <Pressable
                        onPress={() => removeValue(opt.value)}
                        className="ml-0.5 rounded-full p-0.5"
                      >
                        <X size={10} className="text-text" />
                      </Pressable>
                    </View>
                  </Badge>
                ))}
              </View>
              {open ? (
                <ChevronUp size={16} className="ml-2 text-text" />
              ) : (
                <ChevronDown size={16} className="ml-2 text-text" />
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
                <View className="px-3 pt-2 pb-2">
                  <Input size={size}>
                    <InputField
                      placeholder={`Search ${label?.toLowerCase() || ""}...`}
                      value={search}
                      onChangeText={setSearch}
                      autoFocus
                    />
                  </Input>
                </View>
                <ScrollView
                  className="max-h-60"
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
                    filteredOptions.map((item) => {
                      const isChecked = selectedValues.includes(item.value);
                      return (
                        <Pressable
                          key={item.value}
                          onPress={() => toggleValue(item.value)}
                          className="flex-row items-center gap-3 px-3 py-3 border-t border-border"
                        >
                          <View
                            className={`h-5 w-5 items-center justify-center rounded border-2 ${
                              isChecked
                                ? "border-primary bg-primary"
                                : "border-border bg-background"
                            }`}
                          >
                            {isChecked && (
                              <Check size={12} color="#ffffff" />
                            )}
                          </View>
                          <Text className="text-text">{item.label}</Text>
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
