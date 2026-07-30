import React, { useState } from "react";
import { useJobcardCreate } from "@/hooks/use-jobcard-create";
import CreateJobcardLayout from "./com-create-jobcard-layout";
import TabStep1Fleet from "./com-jobcard-step-1-fleet";
import TabStep2 from "./com-jobcard-step-2";
import TabStep3 from "./com-jobcard-step-3";
import TabStepInventory from "./com-jobcard-step-inventory";
import TabStepSummary from "./com-jobcard-step-summary";

export default function ComCreateJobcardFleet() {
  const {
    control,
    step,
    setStep,
    isPending,
    goNext,
    goBack,
    handleReset,
    handleFinalSubmit,
  } = useJobcardCreate(true);

  const [selectedContractLabel, setSelectedContractLabel] = useState<
    string | null
  >(null);

  const isFirst = step === 0;
  const isLast = step === 4;

  return (
    <CreateJobcardLayout
      title="New Fleet Jobcard"
      step={step}
      setStep={setStep}
      isPending={isPending}
      isFirst={isFirst}
      isLast={isLast}
      control={control}
      goBack={goBack}
      handleReset={handleReset}
      handleFinalSubmit={handleFinalSubmit}
      goNext={goNext}
      contractLabel={selectedContractLabel}
      step1={
        <TabStep1Fleet
          control={control}
          onContractChange={setSelectedContractLabel}
        />
      }
      step2={<TabStep2 control={control} />}
      step3={<TabStep3 control={control} />}
      stepInventory={<TabStepInventory control={control} />}
      stepSummary={
        <TabStepSummary
          control={control}
          isPending={isPending}
          contractLabel={selectedContractLabel}
        />
      }
    />
  );
}
