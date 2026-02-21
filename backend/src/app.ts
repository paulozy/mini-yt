import express, { Application, Request, Response } from "express";

const app: Application = express();

// Middleware for parsing JSON request bodies
app.use(express.json());

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

export default app;
