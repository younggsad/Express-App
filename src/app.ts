import express from "express";
import helmet from "helmet";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(helmet());

//CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigin = process.env.CORS_ORIGIN;

      if (!origin || origin === allowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
  }),
);

if (process.env.NODE_ENV !== "test") {
  app.use(apiRateLimiter);
}

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

app.use(apiRateLimiter);

// Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/users", userRoutes);

// Global error handler
app.use(errorMiddleware);

export default app;
