import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { User } from "lucide-react-native";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
import { QueryKeys, useGetTechniciansList } from "@/http/services";
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
import { Checkbox, CheckboxIndicator, CheckboxIcon } from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import type { Jobcard } from "@/types/jobcard";

interface ModTechnicianAssignProps {
  jobcard: Jobcard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function technicianName(
  t: { first_name?: string | null; last_name?: string | null } | null | undefined,
  fallback: string
) {
  const name = `${t?.first_name ?? ""} ${t?.last_name ?? ""}`.trim();
  return name || fallback;
}

export default function ModTechnicianAssign({
  jobcard,
  open,
  onOpenChange,
}: ModTechnicianAssignProps) {
  const queryClient = useQueryClient();
  const { data: technicians } = useGetTechniciansList();
  const [pendingIds, setPendingIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPendingIds(jobcard.technicians?.map((t) => t.technician_id) ?? []);
    }
  }, [open, jobcard.technicians]);

  const toggle = (id: number) => {
    setPendingIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (pendingIds.length === 0) {
      Toast.show({ type: "error", text1: "Select at least one technician" });
      return;
    }
    setIsSaving(true);
    try {
      await apiFetch(
        `${HimoinsaAPI.api_jobcards_update}/${jobcard.id}`,
        "PUT",
        { technicians: pendingIds }
      );
      Toast.show({ type: "success", text1: "Technicians updated" });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.jobcards_show(String(jobcard.id)),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.jobcards_list });
      onOpenChange(false);
    } catch {
      Toast.show({ type: "error", text1: "Failed to update technicians" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)}>
      <ModalBackdrop />
      <ModalContent className="w-full max-w-md">
        <ModalHeader>
          <Text className="text-lg font-semibold">Change Technicians</Text>
        </ModalHeader>
        <ModalBody>
          <View className="max-h-64 space-y-1">
            {(technicians ?? []).map((t) => (
              <Pressable
                key={t.id}
                onPress={() => toggle(t.id)}
                className="flex-row items-center gap-2 rounded px-2 py-1.5 hover:bg-background-subtle"
              >
                <Checkbox
                  value={pendingIds.includes(t.id) ? "checked" : "unchecked"}
                  onChange={() => toggle(t.id)}
                >
                  <CheckboxIndicator>
                    <CheckboxIcon as={CheckIcon} />
                  </CheckboxIndicator>
                </Checkbox>
                <User className="h-4 w-4 text-text-muted" />
                <Text className="text-sm">{technicianName(t, `Tech #${t.id}`)}</Text>
              </Pressable>
            ))}
            {(technicians ?? []).length === 0 && (
              <Text className="py-4 text-center text-xs text-text-muted">
                No technicians found.
              </Text>
            )}
          </View>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onPress={() => onOpenChange(false)}
            disabled={isSaving}
          >
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
