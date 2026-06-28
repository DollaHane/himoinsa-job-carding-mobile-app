import { z } from "zod";

export const validateQuickJobcard = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  work_description: z.string().min(1, "Work description is required"),
  scheduled_datetime: z.string().optional(),
  service_type: z.string().min(1, "Service type is required"),
});

export type QuickJobcardRequest = z.input<typeof validateQuickJobcard>;
