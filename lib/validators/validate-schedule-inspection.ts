import { z } from "zod";

export const validateScheduleInspection = z.object({
  scheduled_datetime: z.string().min(1, "Scheduled date is required"),
  technicians: z
    .array(z.coerce.number().int().positive())
    .min(1, "At least one technician is required"),
});

export type ScheduleInspectionRequest = z.input<
  typeof validateScheduleInspection
>;
