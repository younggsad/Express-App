import { beforeEach, afterAll } from "vitest";
import { testPrisma } from "../lib/test-prisma.js";

beforeEach(async () => {
  await testPrisma.user.deleteMany();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});
