import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const healthRoutes = Router();

healthRoutes.get("/", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      database: "unavailable",
    });
  }
});

export default healthRoutes;
