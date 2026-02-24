import React, { useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Calendar } from 'lucide-react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface DatePickerProps<T extends FieldValues> {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  value?: string | Date;
  onChange?: (date: string) => void;
  className?: string;
}

export function DatePicker<T extends FieldValues>({
  control,
  name,
  placeholder = 'Select date',
  isDisabled = false,
  minimumDate,
  maximumDate,
  value: externalValue,
  onChange: externalOnChange,
  className,
}: DatePickerProps<T>) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | null | undefined): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // If using with react-hook-form
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => {
          const dateValue = value ? new Date(value) : new Date();

          const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
            const currentDate = selectedDate || dateValue;
            
            if (Platform.OS === 'android') {
              setShowPicker(false);
              if (event.type === 'set') {
                onChange(currentDate.toISOString());
              }
            } else {
              if (event.type === 'set' && selectedDate) {
                onChange(selectedDate.toISOString());
              }
            }
          };

          return (
            <View className={className || "w-full"}>
              <Pressable onPress={() => !isDisabled && setShowPicker(true)}>
                <Input
                  variant="outline"
                  size="lg"
                  isDisabled={isDisabled}
                  isReadOnly={true}
                  className="pointer-events-none w-full"
                >  <InputField
                    placeholder={placeholder}
                    value={value ? formatDate(new Date(value)) : ''}
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
                  mode="date"
                  is24Hour={true}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                />
              )}

              {Platform.OS === 'ios' && showPicker && (
                <Button 
                  onPress={() => setShowPicker(false)}
                  className="mt-2"
                >
                  <ButtonText>Done</ButtonText>
                </Button>
              )}
            </View>
          );
        }}
      />
    );
  }

  // If using with useState
  const dateValue = externalValue ? new Date(externalValue) : new Date();

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateValue;
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && externalOnChange) {
        externalOnChange(currentDate.toISOString());
      }
    } else {
      if (event.type === 'set' && selectedDate && externalOnChange) {
        externalOnChange(selectedDate.toISOString());
      }
    }
  };

  return (
    <View className={className || "w-full"}>
      <Pressable onPress={() => !isDisabled && setShowPicker(true)}>
        <Input
          variant="outline"
          size="md"
          isDisabled={isDisabled}
          isReadOnly={true}
          className="pointer-events-none w-full"
        >
          <InputField
            placeholder={placeholder}
            value={externalValue ? formatDate(new Date(externalValue)) : ''}
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
          mode="date"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {Platform.OS === 'ios' && showPicker && (
        <Button 
          onPress={() => setShowPicker(false)}
          className="mt-2"
        >
          <ButtonText>Done</ButtonText>
        </Button>
      )}
    </View>
  );
}
