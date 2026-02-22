import cors from "cors";
import express, { Application, Request, Response } from "express";
import { routes } from "./infra/http/routes";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", routes);

export default app;
