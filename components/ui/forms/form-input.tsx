import React from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { TextInputProps } from "react-native";
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

type FormInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  type?: "text" | "password";
  label: string;
  placeholder?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  isRequired?: boolean;
  isDisabled?: boolean;
  inputProps?: Omit<
    TextInputProps,
    "value" | "onChangeText" | "onBlur" | "editable"
  >;
  hidden?: boolean;
};

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  type = "text",
  label,
  placeholder,
  description,
  size = "md",
  isRequired = false,
  isDisabled = false,
  inputProps = {},
  hidden = false,
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
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
          <Input className="my-1" size={size}>
            <InputField
              type={type}
              placeholder={placeholder}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!isDisabled}
              {...inputProps}
            />
          </Input>
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
