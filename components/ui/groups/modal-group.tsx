import React from "react";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface ModalGroupProps {
  title?: string | null;
  description?: string | null;
  triggerIcon?: LucideIcon;
  triggerAction?: "primary" | "secondary" | "positive" | "negative" | "default";
  triggerVariant?: "solid" | "outline" | "link";
  triggerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  triggerIconClass?: string;
  triggerText?: string;
  children: React.ReactNode;
  contentClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "full";
  footer?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeable?: boolean;
}

export default function ModalGroup({
  title,
  description,
  triggerIcon: TriggerIcon,
  triggerAction = "primary",
  triggerVariant = "solid",
  triggerSize = "md",
  triggerIconClass,
  triggerText,
  children,
  contentClassName,
  size = "md",
  footer,
  isOpen,
  onOpenChange,
  closeable = true,
}: ModalGroupProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const insets = useSafeAreaInsets();

  const isFull = size === "full";

  return (
    <View>
      <Button
        action={triggerAction}
        variant={triggerVariant}
        size={triggerSize}
        className={cn(triggerText ? "flex-row items-center" : "px-3")}
        onPress={() => setOpen(true)}
      >
        {TriggerIcon && (
          <View className={cn("mr-2", triggerIconClass)}>
            <TriggerIcon size={16} color="currentColor" />
          </View>
        )}
        {triggerText && <ButtonText>{triggerText}</ButtonText>}
      </Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} size={size}>
        <ModalBackdrop />
        <ModalContent
          className={cn(isFull && "mt-auto rounded-b-none", contentClassName)}
          style={
            isFull ? { paddingBottom: Math.max(insets.bottom, 16) } : undefined
          }
        >
          <ModalHeader>
            <View className="flex-1">
              {title && (
                <Heading size="md" className="text-foreground">
                  {title}
                </Heading>
              )}
              {description && (
                <Text className="text-sm text-muted-foreground mt-1">
                  {description}
                </Text>
              )}
            </View>
            {closeable && (
              <Pressable
                onPress={() => setOpen(false)}
                className="p-1 ml-2 rounded-full"
              >
                <Icon as={X} size="md" className="text-muted-foreground" />
              </Pressable>
            )}
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      </Modal>
    </View>
  );
}
