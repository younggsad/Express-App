import rateLimit from "express-rate-limit";

export const createRateLimiter = (limit: number) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    },
  });

export const apiRateLimiter = createRateLimiter(100);

export const writeRateLimiter = createRateLimiter(30);
