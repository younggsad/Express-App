import "dotenv/config";

import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down server...");

  server.close(async () => {
    await prisma.$disconnect();

    console.log("Database connection closed");

    process.exit(0);
  });
};

// Остановка контейнера / сервера
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
