import React, { useState, useRef } from "react";
import { View, Image, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { X, Camera as CameraIcon, Image as ImageIcon } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/contexts/ThemeContext";

const SLOT_LABELS: Record<string, string> = {
  front: "Front",
  rear: "Rear",
  left: "Left",
  right: "Right",
  fuel: "Fuel",
};

interface SlotImagePickerProps {
  slot: string;
  label?: string;
  value: string | null;
  existingUrl?: string | null;
  onChange: (slot: string, uri: string | null) => void;
  disabled?: boolean;
}

export default function SlotImagePicker({
  slot,
  label,
  value,
  existingUrl,
  onChange,
  disabled = false,
}: SlotImagePickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const { colorMode } = useTheme();

  const displayUri = value ?? existingUrl;

  async function handlePickFromGallery() {
    setPickerOpen(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.6,
    });

    if (!result.canceled && result.assets?.length) {
      onChange(slot, result.assets[0].uri);
    }
  }

  async function handleOpenCamera() {
    setPickerOpen(false);
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setCameraOpen(true);
  }

  async function handleCapture() {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.6,
      });
      if (result) {
        onChange(slot, result.uri);
      }
      setCameraOpen(false);
    } catch {
      setCameraOpen(false);
    }
  }

  function handleRemove() {
    setPickerOpen(false);
    onChange(slot, null);
  }

  const slotLabel = label ?? SLOT_LABELS[slot] ?? slot;

  return (
    <View className="flex flex-col items-center gap-1">
      <Text className="text-xs text-text-muted">{slotLabel}</Text>

      {displayUri ? (
        <View className="relative aspect-square w-20 overflow-hidden rounded-lg border border-border">
          <Image
            source={{ uri: displayUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <Pressable
            onPress={() => !disabled && setPickerOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0"
            style={({ pressed }) => ({ opacity: pressed ? 1 : 0 })}
          >
            <Icon as={X} size="sm" className="text-white" />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => !disabled && setPickerOpen(true)}
          className="flex aspect-square w-20 items-center justify-center rounded-lg border-2 border-dashed border-border"
          disabled={disabled}
        >
          <Icon as={ImageIcon} size="sm" className="text-text-muted" />
        </Pressable>
      )}

      <Modal isOpen={pickerOpen} onClose={() => setPickerOpen(false)}>
        <ModalBackdrop className="bg-transparent">
          <BlurView
            intensity={40}
            tint={colorMode === "dark" ? "dark" : "light"}
            style={{ flex: 1 }}
          />
        </ModalBackdrop>
        <ModalContent className="border-border">
          <ModalHeader>
            <Heading size="md" className="text-text">
              {slotLabel} — Select Source
            </Heading>
          </ModalHeader>
          <ModalBody>
            <View className="flex-col gap-4">
              <Button
                variant="outline"
                size="lg"
                onPress={handleOpenCamera}
                className="flex-row items-center gap-3 justify-start px-6 h-16"
              >
                <Icon as={CameraIcon} size="lg" className="text-text" />
                <View>
                  <Text className="text-base font-medium text-text">
                    Take Photo
                  </Text>
                  <Text className="text-sm text-text-muted">
                    Use your device camera
                  </Text>
                </View>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onPress={handlePickFromGallery}
                className="flex-row items-center gap-3 justify-start px-6 h-16"
              >
                <Icon as={ImageIcon} size="lg" className="text-text" />
                <View>
                  <Text className="text-base font-medium text-text">
                    Choose from Gallery
                  </Text>
                  <Text className="text-sm text-text-muted">
                    Select existing photos
                  </Text>
                </View>
              </Button>
              {displayUri && (
                <Button
                  variant="outline"
                  size="lg"
                  onPress={handleRemove}
                  className="flex-row items-center gap-3 justify-start px-6 h-16 border-error"
                >
                  <Icon as={X} size="lg" className="text-error" />
                  <View>
                    <Text className="text-base font-medium text-error">
                      Remove
                    </Text>
                    <Text className="text-sm text-text-muted">
                      Remove this photo
                    </Text>
                  </View>
                </Button>
              )}
            </View>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onPress={() => setPickerOpen(false)}
              className="w-full"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        size="full"
      >
        <View className="absolute inset-0 bg-black">
          {permission?.granted && (
            <CameraView
              ref={cameraRef}
              style={{ position: "absolute", inset: 0 }}
              facing="back"
            />
          )}

          <View className="absolute top-14 left-6 z-50">
            <Pressable
              onPress={() => setCameraOpen(false)}
              className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
            >
              <Icon as={X} size="xl" className="text-white" />
            </Pressable>
          </View>

          <View className="absolute bottom-16 w-full items-center">
            <Pressable
              onPress={handleCapture}
              className="w-20 h-20 rounded-full bg-white border-[6px] border-gray-400"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
