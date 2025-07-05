import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGetResources,
  handleUploadResource,
  handleDownloadResource,
  handleDeleteResource,
  handleGetResource,
} from "./routes/resources";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Resources API routes
  app.get("/api/resources", handleGetResources);
  app.post("/api/resources", handleUploadResource);
  app.get("/api/resources/:id", handleGetResource);
  app.get("/api/resources/:id/download", handleDownloadResource);
  app.delete("/api/resources/:id", handleDeleteResource);

  return app;
}
