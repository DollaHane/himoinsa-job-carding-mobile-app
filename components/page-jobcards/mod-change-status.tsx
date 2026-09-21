import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Tag } from "lucide-react-native";
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
import type { Jobcard } from "@/types/jobcard";

interface ModChangeStatusProps {
  jobcard: Jobcard;
}

export default function ModChangeStatus({ jobcard }: ModChangeStatusProps) {
  const queryClient = useQueryClient();
  const { data: metadata } = useGetJobcardMetadata();
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = metadata?.statuses ?? [];
  const currentStatusId = jobcard.status?.id;
  const availableStatuses = statuses.filter((s) => s.id !== currentStatusId);
  const cancelledStatus = statuses.find((s) => s.name === "cancelled");

  const handleStatusChange = async (statusId: number) => {
    if (statusId === cancelledStatus?.id) {
      setPendingStatusId(statusId);
      setConfirmCancel(true);
      setShowDropdown(false);
      return;
    }
    setIsUpdating(true);
    try {
      await apiFetch(
        `${HimoinsaAPI.api_jobcards_update}/${jobcard.id}`,
        "PUT",
        { status_id: statusId }
      );
      Toast.show({ type: "success", text1: "Status updated" });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.jobcards_show(String(jobcard.id)),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
      setShowDropdown(false);
    } catch {
      Toast.show({ type: "error", text1: "Failed to update status" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!pendingStatusId) return;
    setIsUpdating(true);
    try {
      await apiFetch(
        `${HimoinsaAPI.api_jobcards_update}/${jobcard.id}`,
        "PUT",
        { status_id: pendingStatusId }
      );
      Toast.show({ type: "success", text1: "Jobcard cancelled" });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.jobcards_show(String(jobcard.id)),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
      setConfirmCancel(false);
      setPendingStatusId(null);
    } catch {
      Toast.show({ type: "error", text1: "Failed to cancel jobcard" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setShowDropdown(!showDropdown)}
        className="flex-row items-center gap-1 rounded bg-background-subtle px-2 py-1"
      >
        <Tag className="h-3.5 w-3.5 text-text-muted" />
        <Text className="text-xs">
          {jobcard.status?.name ?? "Status"}
        </Text>
      </Pressable>

      {showDropdown && (
        <View className="absolute right-0 top-8 z-50 w-48 rounded-lg border border-border bg-background shadow-lg">
          {availableStatuses.map((status) => (
            <Pressable
              key={status.id}
              onPress={() => handleStatusChange(status.id)}
              className="border-b border-border px-3 py-2 last:border-b-0"
              disabled={isUpdating}
            >
              <Text className="text-sm">{status.name}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <AlertDialog isOpen={confirmCancel} onClose={() => setConfirmCancel(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text className="text-lg font-semibold">Cancel Jobcard</Text>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-sm text-text-muted">
              Are you sure you want to cancel this jobcard? This action cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setConfirmCancel(false)} disabled={isUpdating}>
              <ButtonText>Keep</ButtonText>
            </Button>
            <Button variant="solid" className="bg-error" onPress={handleConfirmCancel} disabled={isUpdating}>
              {isUpdating ? <Spinner size="small" /> : <ButtonText>Cancel</ButtonText>}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
