import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { User, Truck } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

export default function CreateJobcardSelect() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4 justify-center gap-8">
        <Heading size="lg" className="text-center">
          New Jobcard
        </Heading>
        <Text className="text-center text-text-muted">
          Select the type of jobcard to create
        </Text>

        <View className="flex flex-col gap-4 px-6">
          <Button
            variant="outline"
            size="xl"
            onPress={() => router.push("/tabs/job-cards/create/customer" as any)}
            className="h-20"
          >
            <Icon as={User} size="lg" className="mr-3 text-text" />
            <ButtonText>Customer Jobcard</ButtonText>
          </Button>

          <Button
            variant="outline"
            size="xl"
            onPress={() => router.push("/tabs/job-cards/create/fleet" as any)}
            className="h-20"
          >
            <Icon as={Truck} size="lg" className="mr-3 text-text" />
            <ButtonText>Fleet Jobcard</ButtonText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
