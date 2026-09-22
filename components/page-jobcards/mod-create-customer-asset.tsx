import { useState } from "react";
import { View, Text } from "react-native";
import { apiFetch } from "@/http/core";
import { HimoinsaAPI } from "@/http/actions";
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
import { FormSelect } from "@/components/ui/forms/form-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(1, "Description is required"),
  serial_number: z.string().optional(),
  asset_type: z.string().min(1, "Asset type is required"),
});

interface ModCreateCustomerAssetProps {
  customerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (asset: { id: number; description: string }) => void;
}

export default function ModCreateCustomerAsset({
  customerId,
  open,
  onOpenChange,
  onCreated,
}: ModCreateCustomerAssetProps) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      description: "",
      serial_number: "",
      asset_type: "",
    },
    resolver: zodResolver(schema),
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (values: any) => {
    setIsCreating(true);
    try {
      const response = await apiFetch(
        HimoinsaAPI.api_customer_assets_store,
        "POST",
        {
          customer_id: customerId,
          description: values.description,
          serial_number: values.serial_number || null,
          asset_type: Number(values.asset_type),
        }
      );
      const json = await response.json();
      if (json.data) {
        Toast.show({ type: "success", text1: "Asset created" });
        onCreated(json.data);
        reset();
        onOpenChange(false);
      }
    } catch {
      Toast.show({ type: "error", text1: "Failed to create asset" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={() => onOpenChange(false)}>
      <ModalBackdrop />
      <ModalContent className="w-full max-w-md">
        <ModalHeader>
          <Text className="text-lg font-semibold">Create Customer Asset</Text>
        </ModalHeader>
        <ModalBody>
          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium mb-1">Description *</Text>
                <Input size="md">
                <InputField
                  placeholder="Asset description"
                  value={control._formValues.description}
                  onChangeText={(text) => {
                    control._formValues.description = text;
                  }}
                />
              </Input>
            </View>
            <View>
              <Text className="text-sm font-medium mb-1">Serial Number</Text>
              <Input size="md">
                <InputField
                  placeholder="Serial number (optional)"
                  value={control._formValues.serial_number}
                  onChangeText={(text) => {
                    control._formValues.serial_number = text;
                  }}
                />
              </Input>
            </View>
            <View>
              <Text className="text-sm font-medium mb-1">Asset Type *</Text>
              <Input size="md">
                <InputField
                  placeholder="Asset type ID"
                  keyboardType="numeric"
                  value={control._formValues.asset_type}
                  onChangeText={(text) => {
                    control._formValues.asset_type = text;
                  }}
                />
              </Input>
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={() => onOpenChange(false)} disabled={isCreating}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={handleSubmit(handleCreate)} disabled={isCreating}>
            {isCreating ? <Spinner size="small" /> : <ButtonText>Create</ButtonText>}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
