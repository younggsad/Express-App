import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

// Строка подключения к PostgreSQL
const databaseUrl = process.env.TEST_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

// Единственный экземпляр Prisma Client для всего приложения
export const testPrisma = new PrismaClient({
  adapter,
});
