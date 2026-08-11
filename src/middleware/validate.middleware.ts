import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (
  schema: z.ZodType,
  target: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(result.error);
    }

    res.locals.validated ??= {};
    res.locals.validated[target] = result.data;

    next();
  };
};
