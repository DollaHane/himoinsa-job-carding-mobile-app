import { z } from "zod";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : Number(v)),
  z.coerce.number().int().positive().optional()
);

export const validateJobcardCreate = z
  .object({
    is_fleet_jc: z.coerce.boolean().default(false),
    contract_id: optionalNumber,
    customer_id: z.preprocess(
      (v) => (v === "" ? 0 : Number(v)),
      z.coerce.number().int().default(0)
    ),
    customer_location_id: optionalNumber,
    work_description: z.string().min(1),
    service_type: z.coerce.number().int().positive().default(1),
    recurring_interval: z.coerce.number().int().positive().default(1),
    is_recurring: z.coerce.boolean().default(false),
    scheduled_datetime: z.coerce.date().nullable().optional(),
    travel_time: z.coerce.number().int().nonnegative().nullable().optional(),
    reminder_time: z.coerce.date().nullable().optional(),
    assets: z
      .array(
        z.object({
          asset_id: z.coerce.number().int().positive(),
          asset_location_id: z.coerce.number().int().positive(),
        })
      )
      .min(1, "At least one asset is required"),
    tasks: z
      .array(
        z.object({
          task_step: z.number().int().positive(),
          description: z.string().min(1, "Task description is required"),
          duration: z.number().int().nonnegative().nullable().optional(),
        })
      )
      .optional(),
    technicians: z.array(z.coerce.number().int().positive()).default([]),
    inventory: z
      .array(
        z.object({
          inventory_id: z.coerce.number().int().positive(),
          quantity_requested: z.coerce.number().min(0.0001),
          requested_by: z.coerce.number().int().positive(),
          date_requested: z.string().min(1),
          estimated_arrival_date: z.string().nullable().optional(),
          notes: z.string().nullable().optional(),
        })
      )
      .optional()
      .default([]),
  })
  .refine(
    (data) => {
      if (!data.is_fleet_jc) {
        return data.customer_id > 0;
      }
      return true;
    },
    {
      message: "Customer is required for non-fleet jobcards",
      path: ["customer_id"],
    }
  );

export type JobcardCreationRequest = z.input<typeof validateJobcardCreate>;
