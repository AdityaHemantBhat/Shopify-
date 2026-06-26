import { shopifyApp } from "@shopify/shopify-app-express";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { ApiVersion } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2026-04";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

let mongoDbUrl = process.env.MONGODB_URI;
if (mongoDbUrl == undefined) {
  mongoDbUrl = "mongodb://localhost:27017/shopify-announcement-banner";
}

let rawHost = process.env.HOST || process.env.RENDER_EXTERNAL_URL || "localhost:3000";
const hostName = rawHost.replace(/^https?:\/\//, "");

const shopify = shopifyApp({
  api: {
    apiVersion: ApiVersion.April26,
    restResources: restResources,
    billing: undefined,
    hostName: hostName,
    hostScheme: "https",
    isEmbeddedApp: true,
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
  sessionStorage: new MongoDBSessionStorage(mongoDbUrl),
});

export default shopify;
