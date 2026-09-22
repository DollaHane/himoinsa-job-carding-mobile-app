import React, { useState } from "react";
import { useJobcardCreate } from "@/hooks/use-jobcard-create";
import CreateJobcardLayout from "./com-create-jobcard-layout";
import TabStep1Customer from "./com-jobcard-step-1-customer";
import TabStep2 from "./com-jobcard-step-2";
import TabStep3 from "./com-jobcard-step-3";
import type { CustomerWithLocations } from "@/types/customer";

export default function ComCreateJobcardCustomer() {
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
  } = useJobcardCreate(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerWithLocations | null>(null);

  const isFirst = step === 0;
  const isLast = step === 2;

  return (
    <CreateJobcardLayout
      title="New Customer Jobcard"
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
        <TabStep1Customer
          control={control}
          setValue={setValue}
          onCustomerChange={setSelectedCustomer}
        />
      }
      step2={<TabStep2 control={control} />}
      step3={<TabStep3 control={control} />}
    />
  );
}
