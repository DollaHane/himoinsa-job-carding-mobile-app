import { useState } from "react";
import { View, Text } from "react-native";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
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
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface ModCreateLocationProps {
  customerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (location: { id: number; name: string }) => void;
}

export default function ModCreateLocation({
  customerId,
  open,
  onOpenChange,
  onCreated,
}: ModCreateLocationProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Location name is required" });
      return;
    }
    setIsCreating(true);
    try {
      const response = await apiFetch(HimoinsaAPI.api_locations_store, "POST", {
        customer_id: customerId,
        name: name.trim(),
        address: address.trim() || null,
      });
      const json = await response.json();
      if (json.data) {
        Toast.show({ type: "success", text1: "Location created" });
        onCreated(json.data);
        setName("");
        setAddress("");
        onOpenChange(false);
      }
    } catch {
      Toast.show({ type: "error", text1: "Failed to create location" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)}>
      <ModalBackdrop />
      <ModalContent className="w-full max-w-md">
        <ModalHeader>
          <Text className="text-lg font-semibold">Create Location</Text>
        </ModalHeader>
        <ModalBody>
          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium mb-1">Name *</Text>
              <Input size="md">
                <InputField
                  placeholder="Location name"
                  value={name}
                  onChangeText={setName}
                />
              </Input>
            </View>
            <View>
              <Text className="text-sm font-medium mb-1">Address</Text>
              <Input size="md">
                <InputField
                  placeholder="Address (optional)"
                  value={address}
                  onChangeText={setAddress}
                />
              </Input>
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)} disabled={isCreating}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={handleCreate} disabled={isCreating}>
            {isCreating ? <Spinner size="small" /> : <ButtonText>Create</ButtonText>}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
