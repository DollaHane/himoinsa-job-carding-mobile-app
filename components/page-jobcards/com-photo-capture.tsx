import React, { useState, useRef } from "react";
import { View, Image, Pressable, ScrollView } from "react-native";
import { CameraView, CameraCapturedPicture } from "expo-camera";
import { X, Camera as CameraIcon, Trash2 } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import ModalGroup from "@/components/ui/groups/modal-group";
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
  const cameraRef = useRef<CameraView>(null);

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
      // camera capture cancelled or failed
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
            onPress={() => setCameraOpen(true)}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-border items-center justify-center gap-1"
          >
            <Icon as={CameraIcon} size="lg" className="text-muted-foreground" />
            <Text className="text-xs text-muted-foreground">Add</Text>
          </Pressable>
        )}
      </ScrollView>

      {cameraOpen && (
        <View className="absolute inset-0 z-50 bg-black">
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
            <View className="absolute top-12 right-6 z-50">
              <Pressable
                onPress={() => setCameraOpen(false)}
                className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
              >
                <Icon as={X} size="lg" className="text-white" />
              </Pressable>
            </View>
            <View className="absolute bottom-12 w-full items-center">
              <Pressable
                onPress={handleCapture}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300"
              />
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}
