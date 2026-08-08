import { testPrisma } from "../../lib/test-prisma.js";

export const createTestUser = async (
  data = {
    name: "Test User",
    email: "test@example.com",
  },
) => {
  return testPrisma.user.create({
    data,
  });
};
