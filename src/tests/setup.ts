import "dotenv/config";

import { beforeEach, afterAll } from "vitest";
import { testPrisma } from "../lib/test-prisma.js";

// Во время тестов приложение должно использовать тестовую БД
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

beforeEach(async () => {
  await testPrisma.user.deleteMany();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
