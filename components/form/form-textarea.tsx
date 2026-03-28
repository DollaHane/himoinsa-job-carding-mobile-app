import React from 'react';
import { Controller, FieldPath, FieldValues, Control } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Textarea, TextareaInput } from '@/components/ui/textarea';

type FormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isRequired?: boolean;
  isDisabled?: boolean;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'editable'>;
  hidden?: boolean;
};

export function FormTextArea<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  helperText,
  size = 'md',
  isRequired = false,
  isDisabled = false,
  inputProps = {},
  hidden = false,
}: FormFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <FormControl
          isInvalid={!!error}
          size={size}
          isDisabled={isDisabled}
          isRequired={isRequired}
          style={hidden ? { display: 'none' } : {}}
        >
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
          </FormControlLabel>
          <Textarea className="my-1" size='xl'>
          <TextareaInput
              placeholder={placeholder}
              value={value}
              size='xl'
              onChangeText={onChange}
              onBlur={onBlur}
              editable={!isDisabled}
              {...inputProps}
            />
          </Textarea>
          {helperText && !error && (
            <FormControlHelper>
              <FormControlHelperText>{helperText}</FormControlHelperText>
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
