import React from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface InfoGroupProps {
  label: string;
  data: React.ReactNode;
  icon?: LucideIcon | null;
  className?: string;
}

export default function InfoGroup({
  label,
  data,
  icon,
  className,
}: InfoGroupProps) {
  return (
    <View className={cn("w-full flex flex-col gap-1", className)}>
      <View className="flex flex-row gap-2 items-center text-text-muted">
        {icon && <Icon as={icon} size="sm" className="text-text" />}
        <Text
          className={cn(
            "text-sm font-medium text-text-muted",
            icon && "text-center",
          )}
        >
          {label}
        </Text>
      </View>
      <Text
        className={cn(
          "font-medium text-text flex items-center",
          icon && "pl-6",
        )}
      >
        {data ?? "-"}
      </Text>
    </View>
  );
}
