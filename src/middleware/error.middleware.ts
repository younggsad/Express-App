import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";

import { AppError } from "../errors/app.error.js";
import { ErrorCodes } from "../errors/error-codes.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
        code: ErrorCodes.USER_NOT_FOUND,
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        code: ErrorCodes.EMAIL_EXISTS,
      });
    }
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    code: ErrorCodes.INTERNAL_ERROR,
  });
};
