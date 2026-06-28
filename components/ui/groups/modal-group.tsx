import React from "react";
import { Pressable, View } from "react-native";
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
}: ModalGroupProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <View>
      <Pressable onPress={() => setOpen(true)}>
        <Button
          action={triggerAction}
          variant={triggerVariant}
          size={triggerSize}
          className={cn(triggerText ? "flex-row items-center" : "px-3")}
        >
          {TriggerIcon && (
            <View className={cn("mr-2", triggerIconClass)}>
              <TriggerIcon size={16} color="currentColor" />
            </View>
          )}
          {triggerText && <ButtonText>{triggerText}</ButtonText>}
        </Button>
      </Pressable>

      <Modal isOpen={open} onClose={() => setOpen(false)} size={size}>
        <ModalBackdrop />
        <ModalContent className={contentClassName}>
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
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </ModalContent>
      </Modal>
    </View>
  );
}
