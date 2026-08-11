import express from "express";
import helmet from "helmet";

import userRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(helmet());

// Парсинг JSON тела запроса
app.use(express.json({ limit: "10kb" }));

//Base page
app.get("/", (_req, res) => {
  res.status(200).json({
    name: "Express App API",
    message: "API is running",
    version: "1.0.0",
    docs: "/docs",
    health: "/health",
  });
});

// Health check
app.use("/health", healthRoutes);

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/users", userRoutes);

// Global error handler
app.use(errorMiddleware);

export default app;
