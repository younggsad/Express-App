import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

export const validate = (
  schema: ZodTypeAny,
  target: "body" | "query" | "params" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    res.locals.validated = result.data;

    next();
  };
};
