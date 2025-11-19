import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Detect if running inside Docker
const isDocker = process.env.DOCKER === "true";

// Set API base URL depending on environment
const API_BASE_URL =
  process.env.VITE_API_BASE_URL || (isDocker ? "http://backend:8000" : "http://localhost:8000");

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    // proxy: {
    //   "/api": {
    //     target: API_BASE_URL,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
    proxy: {
    "/api": {
      target: "http://backend:8000",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
  },
},

  },
  build: {
    outDir: "dist",
  },
});
