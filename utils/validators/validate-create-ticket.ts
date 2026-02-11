import { z } from "zod";

export const validateTicketCreation = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  contactid: z.string().min(1, { message: "Contact ID is required" }), // Curre
  userid: z.string().min(1, { message: "User ID is required" }),
  project_id: z.string().optional(),
  message: z.string().optional(),
  service: z.string().optional(),
  assigned: z.string().optional(),
  cc: z.string().optional(),
  priority: z.string().optional(),
  tags: z.string().optional(),
});

export type ticketCreationRequest = z.infer<typeof validateTicketCreation>;