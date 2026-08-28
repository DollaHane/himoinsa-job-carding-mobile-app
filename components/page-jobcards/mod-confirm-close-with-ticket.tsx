import { useRef, useState } from "react";
import { View } from "react-native";
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
import { Switch } from "@/components/ui/switch";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Button, ButtonText } from "@/components/ui/button";
import { createTicket } from "@/http/actions";
import { enqueuePending } from "@/http/offline-queue";
import { isOnline } from "@/http/offline-sync";
import type { TicketCreatePayload } from "@/types/jobcard-complete";
import type { Jobcard } from "@/types/jobcard";
import Toast from "react-native-toast-message";

interface ModConfirmCloseWithTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobcard: Jobcard;
  onConfirm: () => Promise<boolean>;
}

export default function ModConfirmCloseWithTicket({
  open,
  onOpenChange,
  jobcard,
  onConfirm,
}: ModConfirmCloseWithTicketProps) {
  const [followUpChecked, setFollowUpChecked] = useState(false);
  const [followUpNote, setFollowUpNote] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const isClosingRef = useRef(false);

  const buildTicketPayload = (): TicketCreatePayload => {
    const asset = jobcard.assets?.[0];
    const assetLabel =
      asset?.asset?.description || asset?.asset?.fleet_number || "Generator";

    return {
      subject: `${assetLabel} — after-sales follow-up`,
      description: followUpNote.trim(),
      customer_id: jobcard.customer_id ?? undefined,
      asset_id: asset?.asset_id,
      asset_type: asset?.asset_type ?? undefined,
      jobcard_id: jobcard.id,
      priority: "normal",
    };
  };

  const handleConfirmedClose = async () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);

    const closed = await onConfirm();

    setIsClosing(false);
    isClosingRef.current = false;

    if (!closed) {
      // The underlying close failed — its own error toast already fired;
      // leave this dialog open so the technician can retry.
      return;
    }

    onOpenChange(false);

    if (followUpChecked && followUpNote.trim()) {
      const payload = buildTicketPayload();
      const online = await isOnline();

      if (online) {
        try {
          await createTicket(payload);
          Toast.show({
            type: "success",
            text1: "After-sales ticket created.",
          });
        } catch {
          Toast.show({
            type: "error",
            text1: "Failed to create ticket",
            text2: "The jobcard was closed but the ticket was not created.",
          });
        }
      } else {
        await enqueuePending("ticket", payload);
        Toast.show({
          type: "success",
          text1: "Ticket queued offline",
          text2: "It will sync when connection returns.",
        });
      }
    }
  };

  return (
    <AlertDialog isOpen={open} onClose={() => onOpenChange(false)}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <Heading size="md" className="text-text">
            Close And Complete Jobcard
          </Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <View className="flex flex-col gap-3">
            <Text className="text-sm text-text-muted">
              Before closing, is there any after-sales service that can be
              followed up on for this generator?
            </Text>
            <View className="flex-row items-center gap-2">
              <Switch
                value={followUpChecked}
                onValueChange={(v) => setFollowUpChecked(v)}
              />
              <Text className="flex-1 text-sm text-text">
                There&apos;s an after-sales opportunity to follow up on
              </Text>
            </View>
            {followUpChecked && (
              <View className="flex flex-col gap-1.5">
                <Text className="text-xs text-text-muted">
                  What should be followed up on?
                </Text>
                <Textarea size="md">
                  <TextareaInput
                    value={followUpNote}
                    onChangeText={setFollowUpNote}
                    placeholder="e.g. Generator may need additional servicing — coolant level was low."
                  />
                </Textarea>
              </View>
            )}
          </View>
        </AlertDialogBody>
        <AlertDialogFooter className="flex-row justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onPress={() => onOpenChange(false)}
            isDisabled={isClosing}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            size="sm"
            onPress={handleConfirmedClose}
            isDisabled={isClosing}
          >
            <ButtonText>
              {isClosing ? "Completing..." : "Close And Complete Jobcard"}
            </ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
