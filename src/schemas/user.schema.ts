import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name must contain at most 100 characters"),

  email: z.email("Invalid email").trim().toLowerCase(),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name must contain at most 100 characters")
    .optional(),

  email: z.email("Invalid email").trim().toLowerCase().optional(),
});
