import React, { useState, useRef } from "react";
import { View, Image, Pressable, ScrollView } from "react-native";
import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import {
  X,
  Camera as CameraIcon,
  Trash2,
  Image as ImageIcon,
} from "lucide-react-native";
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

interface PhotoCaptureProps {
  photos: Array<{ uri: string; base64?: string }>;
  onPhotosChange: (photos: Array<{ uri: string; base64?: string }>) => void;
  maxPhotos?: number;
}

export default function PhotoCapture({
  photos,
  onPhotosChange,
  maxPhotos = 10,
}: PhotoCaptureProps) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  async function handlePickFromGallery() {
    setPickerOpen(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.7,
      base64: true,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets?.length) {
      const newPhotos = result.assets.map((asset) => ({
        uri: asset.uri,
        base64: asset.base64 ?? undefined,
      }));
      onPhotosChange([...photos, ...newPhotos].slice(0, maxPhotos));
    }
  }

  async function handleTakePhoto() {
    setPickerOpen(false);
    setCameraOpen(true);
  }

  async function handleCapture() {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      if (result) {
        onPhotosChange([
          ...photos,
          {
            uri: result.uri,
            base64: result.base64 ?? undefined,
          },
        ]);
      }
      setCameraOpen(false);
    } catch {
      setCameraOpen(false);
    }
  }

  function handleDelete(index: number) {
    onPhotosChange(photos.filter((_, i) => i !== index));
  }

  return (
    <View className="flex flex-col gap-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-3"
      >
        {photos.map((photo, index) => (
          <View
            key={index}
            className="relative w-24 h-24 rounded-lg overflow-hidden"
          >
            <Image
              source={{ uri: photo.uri }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => handleDelete(index)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
            >
              <Icon as={Trash2} size="xs" className="text-white" />
            </Pressable>
          </View>
        ))}

        {photos.length < maxPhotos && (
          <Pressable
            onPress={() => setPickerOpen(true)}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-border items-center justify-center gap-1"
          >
            <Icon as={CameraIcon} size="lg" className="text-muted-foreground" />
            <Text className="text-xs text-muted-foreground">Add</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Source picker modal */}
      <Modal isOpen={pickerOpen} onClose={() => setPickerOpen(false)}>
        <ModalBackdrop />
        <ModalContent className="mt-auto rounded-t-3xl pb-8">
          <ModalHeader>
            <Heading size="md" className="text-foreground">
              Add Photo
            </Heading>
          </ModalHeader>
          <ModalBody>
            <View className="flex-col gap-4">
              <Button
                variant="outline"
                size="lg"
                onPress={handleTakePhoto}
                className="flex-row items-center gap-3 justify-start px-6 h-16"
              >
                <Icon as={CameraIcon} size="lg" className="text-foreground" />
                <View>
                  <Text className="text-base font-medium text-foreground">
                    Take Photo
                  </Text>
                  <Text className="text-sm text-muted-foreground">
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
                <Icon as={ImageIcon} size="lg" className="text-foreground" />
                <View>
                  <Text className="text-base font-medium text-foreground">
                    Choose from Gallery
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Select existing photos
                  </Text>
                </View>
              </Button>
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

      {/* Full-screen camera modal */}
      <Modal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        size="full"
      >
        <View className="flex-1 bg-black">
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
            {/* Close button */}
            <View className="absolute top-14 left-6 z-50">
              <Pressable
                onPress={() => setCameraOpen(false)}
                className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
              >
                <Icon as={X} size="xl" className="text-white" />
              </Pressable>
            </View>

            {/* Capture button */}
            <View className="absolute bottom-16 w-full items-center">
              <Pressable
                onPress={handleCapture}
                className="w-20 h-20 rounded-full bg-white border-[6px] border-gray-400"
              />
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
}
