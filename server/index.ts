import express from "express";
import cors from "cors";
import multer from "multer";
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

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory for demo
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed"));
      }
    },
  });

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
  app.post("/resources", upload.single("file"), handleUploadResource);
  app.get("/resources/:id", handleGetResource);
  app.get("/resources/:id/download", handleDownloadResource);
  app.delete("/resources/:id", handleDeleteResource);

  return app;
}
