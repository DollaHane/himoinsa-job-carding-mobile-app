import React, { useState } from "react";
import { useJobcardCreate } from "@/hooks/use-jobcard-create";
import CreateJobcardLayout from "./com-create-jobcard-layout";
import TabStep1Fleet from "./com-jobcard-step-1-fleet";
import TabStep2 from "./com-jobcard-step-2";
import TabStep3 from "./com-jobcard-step-3";

export default function ComCreateJobcardFleet() {
  const {
    control,
    setValue,
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
  const isLast = step === 2;

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
      step1={
        <TabStep1Fleet
          control={control}
          setValue={setValue}
          onContractChange={setSelectedContractLabel}
        />
      }
      step2={<TabStep2 control={control} />}
      step3={<TabStep3 control={control} />}
    />
  );
}
