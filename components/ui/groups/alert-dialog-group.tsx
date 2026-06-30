import React, { useState } from "react";
import { Pressable } from "react-native";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertDialogGroupProps {
  title: string;
  description: string;
  triggerVariant?: "solid" | "outline" | "link";
  triggerSize?: "xs" | "sm" | "md" | "lg" | "xl";
  triggerClassName?: string;
  triggerText?: string | React.ReactNode;
  actionClassName?: string;
  actionText: string;
  actionVariant?: "solid" | "outline" | "link";
  cancelText?: string;
  onConfirm: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AlertDialogGroup({
  title,
  description,
  triggerVariant = "outline",
  triggerSize = "md",
  triggerClassName,
  triggerText,
  actionClassName,
  actionText,
  actionVariant = "solid",
  cancelText = "Cancel",
  onConfirm,
  isOpen,
  onOpenChange,
}: AlertDialogGroupProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Pressable onPress={() => setOpen(true)}>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
        >
          {typeof triggerText === "string" ? (
            <ButtonText>{triggerText}</ButtonText>
          ) : (
            triggerText
          )}
        </Button>
      </Pressable>

      <AlertDialog isOpen={open} onClose={() => setOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent className={cn("p-4", actionClassName)}>
          <AlertDialogHeader>
            <Heading size="md" className="text-text">
              {title}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-sm text-text-muted">{description}</Text>
          </AlertDialogBody>
          <AlertDialogFooter className="flex-row justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onPress={() => setOpen(false)}>
              <ButtonText>{cancelText}</ButtonText>
            </Button>
            <Button variant={actionVariant} size="sm" onPress={handleConfirm}>
              <ButtonText>{actionText}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  );
}
