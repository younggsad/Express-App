import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../app.js";

describe("Health API", () => {
  it("GET /health should return 200", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
    });
  });

  it("GET /health/ready should return database status", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
      database: "connected",
    });
  });
});
