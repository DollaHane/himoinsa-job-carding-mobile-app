import { z } from "zod";

export const validateCompleteJobcard = z.object({
  vehicle_arrival_mileage: z.number().optional().nullable(),
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
      reason_not_used: z.string().optional().nullable(),
    }),
  ),
  inspection_checklists: z
    .array(
      z.object({
        id: z.number().int().positive(),
        items: z.array(
          z.object({
            step: z.number().int().positive(),
            checked: z.boolean(),
            notes: z.string().optional().nullable(),
          }),
        ),
      }),
    )
    .optional()
    .default([]),
});

export type CompleteJobcardRequest = z.input<typeof validateCompleteJobcard>;
