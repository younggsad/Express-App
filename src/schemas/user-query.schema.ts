import { z } from "zod";

export const userQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  search: z.string().trim().optional(),

  sort: z.enum(["name", "email"]).default("name"),

  order: z.enum(["asc", "desc"]).default("asc"),
});
