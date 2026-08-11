import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createRateLimiter } from "../middleware/rate-limit.middleware.js";

describe("Rate limiter", () => {
  it("should return 429 when request limit is exceeded", async () => {
    const app = express();

    app.use(createRateLimiter(2));

    app.get("/test", (_req, res) => {
      res.status(200).json({
        success: true,
      });
    });

    const firstResponse = await request(app).get("/test");
    const secondResponse = await request(app).get("/test");
    const thirdResponse = await request(app).get("/test");

    expect(firstResponse.statusCode).toBe(200);
    expect(secondResponse.statusCode).toBe(200);

    expect(thirdResponse.statusCode).toBe(429);

    expect(thirdResponse.body).toEqual({
      success: false,
      message: "Too many requests, please try again later",
      code: "RATE_LIMIT_EXCEEDED",
    });
  });
});
