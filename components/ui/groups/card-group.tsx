import React from "react";
import { View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface CardGroupProps {
  title?: string | null;
  description?: string | null;
  customHeader?: React.ReactNode;
  icon?: LucideIcon | null;
  children: React.ReactNode;
  className?: string;
}

export default function CardGroup({
  title,
  description,
  customHeader,
  icon: Icon,
  children,
  className,
}: CardGroupProps) {
  const showHeader = customHeader || title;

  return (
    <Card className={cn("p-4", className)}>
      {showHeader && (
        <View className="flex-row justify-between items-start mb-3 pb-3 border-b border-border">
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              {Icon && <Icon size={20} className="text-primary" />}
              {title && (
                <Heading size="sm" className="text-foreground">
                  {title}
                </Heading>
              )}
            </View>
            {description && (
              <Text className="text-sm text-muted-foreground mt-1">
                {description}
              </Text>
            )}
          </View>
          {customHeader}
        </View>
      )}
      {children}
    </Card>
  );
}
