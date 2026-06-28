import { z } from "zod";

export const validateCompleteJobcard = z.object({
  asset_smr: z.array(
    z.object({
      asset_id: z.number().int().positive(),
      asset_type: z.string().min(1),
      date: z.string().min(1),
      smr_reading: z.string().min(1, "SMR reading is required"),
      equipment_condition: z.string().optional().nullable(),
      recommendations: z.string().optional().nullable(),
    }),
  ),
  tasks: z.array(
    z.object({
      id: z.number().int().positive(),
      completed: z.boolean(),
      incomplete_reason: z.string().optional().nullable(),
    }),
  ),
  inventory: z.array(
    z.object({
      id: z.number().int().positive(),
      quantity_used: z.number().min(0, "Quantity cannot be negative"),
    }),
  ),
  signature: z.string().optional().nullable(),
  photos: z.array(z.string()).optional().default([]),
});

export type CompleteJobcardRequest = z.input<typeof validateCompleteJobcard>;
