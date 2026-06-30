import React from "react";
import { View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Heading } from "@/components/ui/heading";
import type { CustomerWithLocations } from "@/types/customer";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";
import type { Control } from "react-hook-form";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["1", "2", "3", "4", "5"];

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
  customerName?: string;
  contractLabel?: string | null;
  step1: React.ReactNode;
  step2: React.ReactNode;
  step3: React.ReactNode;
  stepInventory: React.ReactNode;
  stepSummary: React.ReactNode;
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
  stepInventory,
  stepSummary,
}: CreateJobcardLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Heading size="lg" className="mb-4">
          {title}
        </Heading>

        <View className="mb-4 w-full flex flex-row justify-between px-10">
          {STEP_LABELS.map((label, i) => (
            <Button
              key={label}
              variant={i === step ? "solid" : "outline"}
              size="sm"
              onPress={() => setStep(i)}
              className={cn("flex", i === step ? "bg-tertiary" : "border-tertiary")}
            >
              <ButtonText className="text-xs">{label}</ButtonText>
            </Button>
          ))}
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && step1}
          {step === 1 && step2}
          {step === 2 && step3}
          {step === 3 && stepInventory}
          {step === 4 && stepSummary}
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
