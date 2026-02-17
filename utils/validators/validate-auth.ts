import { z } from "zod";

export const validateAuth = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be longer than 2 characters" })
    .max(100, { message: "Username cannot be longer than 100 characters" }),
  password: z
    .string()
    .min(5, { message: "Password must be longer than 5 characters" })
    .max(100, { message: "Password cannot be longer than 100 characters" }),
});

export type authCreationRequest = z.infer<typeof validateAuth>;