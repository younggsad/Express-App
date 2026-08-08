import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters"),

  email: z.email("Invalid email"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),

  email: z.email().optional(),
});
