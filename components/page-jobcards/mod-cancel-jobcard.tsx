import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ban } from "lucide-react-native";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys, useGetJobcardMetadata } from "@/http/services";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ModCancelJobcardProps {
  jobcardId: number;
  trigger: React.ReactNode;
}

export default function ModCancelJobcard({ jobcardId, trigger }: ModCancelJobcardProps) {
  const queryClient = useQueryClient();
  const { data: metadata } = useGetJobcardMetadata();
  const [open, setOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelledStatusId = metadata?.statuses?.find(
    (s) => s.name === "cancelled"
  )?.id;

  const handleCancel = async () => {
    if (!cancelledStatusId) {
      Toast.show({ type: "error", text1: "Cancelled status not found" });
      return;
    }
    setIsCancelling(true);
    try {
      await apiFetch(
        `${HimoinsaAPI.api_jobcards_update}/${jobcardId}`,
        "PUT",
        { status_id: cancelledStatusId }
      );
      Toast.show({ type: "success", text1: "Jobcard cancelled" });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.jobcards_show(String(jobcardId)),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
      setOpen(false);
    } catch {
      Toast.show({ type: "error", text1: "Failed to cancel jobcard" });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>{trigger}</Pressable>
      <AlertDialog isOpen={open} onClose={() => setOpen(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-semibold">Cancel Jobcard</Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <View className="items-center gap-3">
              <Ban className="h-10 w-10 text-error" />
              <Text className="text-center text-sm text-text-muted">
                Are you sure you want to cancel this jobcard? This action cannot be undone.
              </Text>
            </View>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setOpen(false)} disabled={isCancelling}>
              <ButtonText>Keep</ButtonText>
            </Button>
            <Button variant="solid" action="negative" onPress={handleCancel} disabled={isCancelling}>
              {isCancelling ? (
                <Spinner size="small" />
              ) : (
                <ButtonText>Cancel Jobcard</ButtonText>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
