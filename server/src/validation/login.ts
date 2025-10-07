import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        error: "Email is required",
      })
      .email({ message: "Please enter a valid email" }),
    password: z
      .string({
        error: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters" }),
  }),
});

export type LoginRequest = z.infer<typeof loginSchema>;