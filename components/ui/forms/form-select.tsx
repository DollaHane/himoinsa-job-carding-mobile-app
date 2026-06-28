import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
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
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react-native";

export type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isDisabled?: boolean;
  hidden?: boolean;
};

export function FormSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  description,
  size = "md",
  isRequired = false,
  isDisabled = false,
  hidden = false,
}: FormSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = options.find((o) => o.value === value);

        return (
          <FormControl
            isInvalid={!!error}
            size={size}
            isDisabled={isDisabled}
            isRequired={isRequired}
            style={hidden ? { display: "none" } : {}}
          >
            <FormControlLabel>
              <FormControlLabelText>{label}</FormControlLabelText>
            </FormControlLabel>
            <Select
              selectedValue={value}
              onValueChange={onChange}
              isDisabled={isDisabled}
            >
              <SelectTrigger
                variant="outline"
                size={size}
                className="my-1 justify-between"
              >
                <SelectInput
                  placeholder={placeholder}
                  value={selected?.label}
                  className="flex-1"
                />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
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
