import { useState } from "react";
import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys } from "@/http/services";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { Jobcard } from "@/types/jobcard";

interface ModEditScheduledDateProps {
  jobcard: Jobcard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatLocalDatetime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:00`;
}

export default function ModEditScheduledDate({
  jobcard,
  open,
  onOpenChange,
}: ModEditScheduledDateProps) {
  const queryClient = useQueryClient();
  const [pendingDate, setPendingDate] = useState<Date>(
    jobcard.scheduled_datetime ? new Date(jobcard.scheduled_datetime) : new Date()
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch(
        `${HimoinsaAPI.api_jobcards_update}/${jobcard.id}`,
        "PUT",
        { scheduled_datetime: formatLocalDatetime(pendingDate) }
      );
      Toast.show({ type: "success", text1: "Schedule updated" });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.jobcards_show(String(jobcard.id)),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
      onOpenChange(false);
    } catch {
      Toast.show({ type: "error", text1: "Failed to update schedule" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)}>
      <ModalBackdrop />
      <ModalContent className="w-full max-w-md">
        <ModalHeader>
          <Text className="text-lg font-semibold">Edit Scheduled Date</Text>
        </ModalHeader>
        <ModalBody>
          <View className="items-center">
            <DateTimePicker
              value={pendingDate}
              mode="datetime"
              display="spinner"
              onChange={(_, date) => {
                if (date) setPendingDate(date);
              }}
              minimumDate={new Date()}
            />
          </View>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)} disabled={isSaving}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner size="small" /> : <ButtonText>Save</ButtonText>}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
