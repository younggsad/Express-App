import "dotenv/config";

import { beforeEach, afterAll } from "vitest";
import { testPrisma } from "../lib/test-prisma.js";

process.env.NODE_ENV = "test";
// Во время тестов приложение должно использовать тестовую БД
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

process.env.CORS_ORIGIN ??= "http://localhost:5173";

beforeEach(async () => {
  await testPrisma.user.deleteMany();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
