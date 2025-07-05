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
  app.get("/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/demo", handleDemo);

  // Resources API routes
  app.get("/resources", handleGetResources);
  app.post("/resources", handleUploadResource);
  app.get("/resources/:id", handleGetResource);
  app.get("/resources/:id/download", handleDownloadResource);
  app.delete("/resources/:id", handleDeleteResource);

  return app;
}
