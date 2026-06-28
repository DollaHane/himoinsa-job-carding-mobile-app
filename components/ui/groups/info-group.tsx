import React from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
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
  icon: Icon,
  className,
}: InfoGroupProps) {
  return (
    <View className={cn("w-full flex flex-col gap-1", className)}>
      <View className="flex flex-row gap-2 items-center text-muted-foreground">
        {Icon && <Icon size={16} className="text-muted-foreground" />}
        <Text
          className={cn(
            "text-sm font-medium text-muted-foreground",
            Icon && "text-center",
          )}
        >
          {label}
        </Text>
      </View>
      <Text
        className={cn(
          "font-medium text-foreground flex items-center",
          Icon && "pl-6",
        )}
      >
        {data ?? "-"}
      </Text>
    </View>
  );
}
