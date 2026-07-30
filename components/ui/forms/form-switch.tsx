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
import { Switch } from "@/components/ui/switch";

type FormSwitchProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  isDisabled?: boolean;
  hidden?: boolean;
};

export function FormSwitch<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  isDisabled = false,
  hidden = false,
}: FormSwitchProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl
          isInvalid={!!error}
          isDisabled={isDisabled}
          style={hidden ? { display: "none" } : {}}
        >
          <FormControlLabel className="flex-row justify-between items-center">
            <FormControlLabelText>{label}</FormControlLabelText>
            <Switch
              value={!!value}
              onValueChange={onChange}
              disabled={isDisabled}
            />
          </FormControlLabel>
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
      )}
    />
  );
}
