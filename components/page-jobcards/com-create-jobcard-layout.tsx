import React from "react";
import { View, Text } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Heading } from "@/components/ui/heading";
import type { Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

const STEP_LABELS = ["Customer & Asset", "Details", "Tasks & Inventory"];

interface CreateJobcardLayoutProps {
  title: string;
  step: number;
  setStep: (s: number) => void;
  isPending: boolean;
  isFirst: boolean;
  isLast: boolean;
  control: Control<JobcardCreationRequest>;
  goBack: () => void;
  handleReset: () => void;
  handleFinalSubmit: () => void;
  goNext: () => void;
  step1: React.ReactNode;
  step2: React.ReactNode;
  step3: React.ReactNode;
}

export default function CreateJobcardLayout({
  title,
  step,
  setStep,
  isPending,
  isFirst,
  isLast,
  goBack,
  handleReset,
  handleFinalSubmit,
  goNext,
  step1,
  step2,
  step3,
}: CreateJobcardLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Heading size="lg" className="mb-4">
          {title}
        </Heading>

        <View className="mb-4 w-full flex flex-row justify-between">
          {STEP_LABELS.map((label, i) => (
            <View key={label} className="flex-1 items-center">
              <Button
                variant={i === step ? "solid" : "outline"}
                size="sm"
                onPress={() => setStep(i)}
                className={cn("w-8 h-8 relative", i === step ? "bg-accent-primary" : "border-accent-primary")}
              >
                <ButtonText className="text-xs absolute">{i + 1}</ButtonText>
              </Button>
              <Text
                className={cn(
                  "text-xs mt-1 text-center",
                  i === step ? "text-primary font-medium" : "text-text-muted"
                )}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && step1}
          {step === 1 && step2}
          {step === 2 && step3}
        </ScrollView>

        <View className="flex-row items-center justify-between border-t border-input px-4 py-4 pb-24">
          <Button
            variant="outline"
            onPress={handleReset}
            isDisabled={isPending}
          >
            <ButtonText>Reset</ButtonText>
          </Button>

          <View className="flex-row gap-3">
            <Button
              variant="outline"
              onPress={goBack}
              isDisabled={isFirst || isPending}
            >
              <ButtonText>Back</ButtonText>
            </Button>
            {isLast ? (
              <Button onPress={handleFinalSubmit} isDisabled={isPending}>
                <ButtonText>
                  {isPending ? "Creating..." : "Create Jobcard"}
                </ButtonText>
              </Button>
            ) : (
              <Button onPress={goNext} isDisabled={isPending}>
                <ButtonText>Next</ButtonText>
              </Button>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
