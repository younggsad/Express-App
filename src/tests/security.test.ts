import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../app.js";

describe("Security middleware", () => {
  it("should set security headers", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBeDefined();
    expect(response.headers["content-security-policy"]).toBeDefined();
  });

  it("should include rate limit headers", async () => {
    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);

    expect(response.headers["ratelimit"]).toBeDefined();
  });

  it("should reject requests from disallowed origins", async () => {
    const response = await request(app)
      .get("/users")
      .set("Origin", "https://malicious.example.com");

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("should allow requests from configured origin", async () => {
    const allowedOrigin = process.env.CORS_ORIGIN;

    if (!allowedOrigin) {
      throw new Error("CORS_ORIGIN is not configured for tests");
    }

    const response = await request(app)
      .get("/users")
      .set("Origin", allowedOrigin);

    expect(response.headers["access-control-allow-origin"]).toBe(allowedOrigin);
  });
});
