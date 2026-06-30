import React, { useState } from "react";
import { useJobcardCreate } from "@/hooks/use-jobcard-create";
import CreateJobcardLayout from "./com-create-jobcard-layout";
import TabStep1Customer from "./com-jobcard-step-1-customer";
import TabStep2 from "./com-jobcard-step-2";
import TabStep3 from "./com-jobcard-step-3";
import TabStepInventory from "./com-jobcard-step-inventory";
import TabStepSummary from "./com-jobcard-step-summary";
import type { CustomerWithLocations } from "@/types/customer";

export default function ComCreateJobcardCustomer() {
  const {
    control,
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
  const isLast = step === 4;

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
      customerName={selectedCustomer?.company_name}
      step1={
        <TabStep1Customer
          control={control}
          onCustomerChange={setSelectedCustomer}
        />
      }
      step2={<TabStep2 control={control} />}
      step3={<TabStep3 control={control} />}
      stepInventory={<TabStepInventory control={control} />}
      stepSummary={
        <TabStepSummary
          control={control}
          isPending={isPending}
          customerName={selectedCustomer?.company_name}
        />
      }
    />
  );
}
