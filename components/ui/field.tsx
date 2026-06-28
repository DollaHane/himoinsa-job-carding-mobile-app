import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface FieldProps {
  children: React.ReactNode;
  className?: string;
  invalid?: boolean;
}

export function Field({ children, className, invalid }: FieldProps) {
  return (
    <View
      className={cn(
        "flex flex-col w-full gap-1",
        invalid && "text-destructive",
        className,
      )}
    >
      {children}
    </View>
  );
}

interface FieldGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldGroup({ children, className }: FieldGroupProps) {
  return (
    <View className={cn("flex flex-col w-full gap-5", className)}>
      {children}
    </View>
  );
}

interface FieldLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldLabel({ children, className }: FieldLabelProps) {
  return (
    <View className={cn("flex flex-row items-center", className)}>
      <Text className="text-sm font-medium text-foreground">{children}</Text>
    </View>
  );
}

interface FieldDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldDescription({
  children,
  className,
}: FieldDescriptionProps) {
  if (!children) return null;
  return (
    <Text className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </Text>
  );
}

interface FieldErrorProps {
  errors?: Array<{ message?: string } | undefined>;
  className?: string;
}

export function FieldError({ errors, className }: FieldErrorProps) {
  const content = useMemo(() => {
    if (!errors?.length) return null;

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return uniqueErrors
      .map((error, index) => `${index + 1}. ${error?.message}`)
      .join("\n");
  }, [errors]);

  if (!content) return null;

  return (
    <Text className={cn("text-sm text-destructive", className)}>{content}</Text>
  );
}

interface FieldSetProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldSet({ children, className }: FieldSetProps) {
  return (
    <View className={cn("flex flex-col gap-4", className)}>{children}</View>
  );
}

interface FieldLegendProps {
  children: React.ReactNode;
  className?: string;
}

export function FieldLegend({ children, className }: FieldLegendProps) {
  return (
    <Text className={cn("text-base font-medium mb-1.5", className)}>
      {children}
    </Text>
  );
}

interface FieldSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

export function FieldSeparator({ children, className }: FieldSeparatorProps) {
  return (
    <View className={cn("relative h-5 my-2", className)}>
      <View className="absolute inset-0 top-1/2 h-px bg-border" />
      {children && (
        <View className="absolute left-1/2 -translate-x-1/2 -top-0.5 bg-background px-2">
          <Text className="text-sm text-muted-foreground">{children}</Text>
        </View>
      )}
    </View>
  );
}
