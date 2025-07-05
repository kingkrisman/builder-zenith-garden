import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Add middleware that handles API routes
      server.middlewares.use("/api", async (req, res, next) => {
        try {
          const { createServer } = await import("./server/index.js");
          const app = createServer();
          app(req, res, next);
        } catch (error) {
          console.error("Express middleware error:", error);
          next();
        }
      });
    },
  };
}
