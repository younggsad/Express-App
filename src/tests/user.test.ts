import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";

import app from "../app.js";
import { testPrisma } from "../lib/test-prisma.js";
import { createTestUser } from "./helpers/user.helper.js";

describe("Users API", () => {
  // =========================
  // POST /users
  // =========================

  it("POST /users should create user", async () => {
    const response = await request(app).post("/users").send({
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    });

    expect(response.statusCode).toBe(201);

    expect(response.body).toMatchObject({
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
    });

    const user = await testPrisma.user.findUnique({
      where: {
        email: "alex.johnson@example.com",
      },
    });

    expect(user).not.toBeNull();
  });

  it("POST /users should return 409 if email already exists", async () => {
    await createTestUser({
      name: "Existing User",
      email: "existing@example.com",
    });

    const response = await request(app).post("/users").send({
      name: "New User",
      email: "existing@example.com",
    });

    expect(response.statusCode).toBe(409);

    expect(response.body).toMatchObject({
      success: false,
      message: "Email already exists",
      code: "EMAIL_EXISTS",
    });
  });

  // =========================
  // GET /users
  // =========================

  it("GET /users should return users", async () => {
    await testPrisma.user.createMany({
      data: [
        {
          name: "John Smith",
          email: "john.smith@example.com",
        },
        {
          name: "Kate Brown",
          email: "kate.brown@example.com",
        },
      ],
    });

    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);

    expect(response.body.data).toHaveLength(2);

    expect(response.body.meta).toMatchObject({
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1,
    });
  });

  // =========================
  // GET /users/:id
  // =========================

  it("GET /users/:id should return user", async () => {
    const user = await createTestUser({
      name: "Michael Scott",
      email: "michael.scott@example.com",
    });

    const response = await request(app).get(`/users/${user.id}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toMatchObject({
      id: user.id,
      name: "Michael Scott",
      email: "michael.scott@example.com",
    });
  });

  it("GET /users/:id should return 404 if user not found", async () => {
    const response = await request(app).get("/users/999999");

    expect(response.statusCode).toBe(404);

    expect(response.body).toMatchObject({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  });

  // =========================
  // PATCH /users/:id
  // =========================

  it("PATCH /users/:id should update user", async () => {
    const user = await createTestUser({
      name: "John Smith",
      email: "john.smith@example.com",
    });

    const response = await request(app).patch(`/users/${user.id}`).send({
      name: "John Updated",
    });

    expect(response.statusCode).toBe(200);

    expect(response.body).toMatchObject({
      id: user.id,
      name: "John Updated",
      email: "john.smith@example.com",
    });
  });

  // =========================
  // DELETE /users/:id
  // =========================

  it("DELETE /users/:id should delete user", async () => {
    const user = await createTestUser({
      name: "Delete User",
      email: "delete.user@example.com",
    });

    const response = await request(app).delete(`/users/${user.id}`);

    expect(response.statusCode).toBe(204);

    const deletedUser = await testPrisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(deletedUser).toBeNull();
  });

  it("DELETE /users/:id should return 404 if user not found", async () => {
    const response = await request(app).delete("/users/999999");

    expect(response.statusCode).toBe(404);

    expect(response.body).toMatchObject({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND",
    });
  });

  describe("Users API", () => {
    beforeEach(async () => {
      await testPrisma.user.deleteMany();
    });

    it("POST /users should create user", async () => {});
  });
});
