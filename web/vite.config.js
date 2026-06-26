import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });


const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "3000", 10);
const hmrConfig = process.env.SHOPIFY_APP_URL
  ? {
      protocol: "wss",
      host: new URL(process.env.SHOPIFY_APP_URL).hostname,
      port: 443,
      clientPort: 443,
    }
  : {
      protocol: "ws",
      host: "localhost",
      port: 64999,
      clientPort: 64999,
    };

export default defineConfig({
  root: "./frontend",
  plugins: [
    react(),
    /* Replace %SHOPIFY_API_KEY% in index.html with the actual env var */
    {
      name: "shopify-api-key-replace",
      transformIndexHtml(html) {
        return html.replace(
          /%SHOPIFY_API_KEY%/g,
          process.env.SHOPIFY_API_KEY || ""
        );
      },
    },
  ],
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  resolve: {
    preserveSymlinks: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: "localhost",
    port: 64999,
    hmr: hmrConfig,
    proxy: {
      "^/(\\?.*)?$": {
        target: `http://127.0.0.1:${BACKEND_PORT}`,
        changeOrigin: false,
        secure: true,
        ws: false,
      },
      "^/api(/|(\\?.*)?$)": {
        target: `http://127.0.0.1:${BACKEND_PORT}`,
        changeOrigin: false,
        secure: true,
        ws: false,
      },
    },
  },
});
