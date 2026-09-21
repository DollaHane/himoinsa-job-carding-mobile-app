import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Icon } from "@/components/ui/icon";
import { ArrowLeft } from "lucide-react-native";

export default function EditJobcard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center gap-3 px-4 py-4">
        <Pressable onPress={() => router.back()} className="p-1">
          <Icon as={ArrowLeft} size="lg" className="text-text" />
        </Pressable>
        <Text className="text-lg font-bold text-text flex-1">Edit Jobcard</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-text-muted text-sm">
          Editing jobcards from the mobile app is not yet supported. Please use the web app to edit jobcards.
        </Text>
      </View>
    </SafeAreaView>
  );
}
