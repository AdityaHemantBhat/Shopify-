import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import shopify from "./shopify.js";
import { connectToMongoDB, disconnectMongoDB } from "./config/mongodb.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });

const __dirname = dirname(fileURLToPath(import.meta.url));
let PORT = process.env.BACKEND_PORT || process.env.PORT || "3000";
PORT = parseInt(PORT, 10);
let IS_PRODUCTION = false;
if (process.env.NODE_ENV === "production") {
  IS_PRODUCTION = true;
}

const app = express();

app.use(express.json());

app.use(compression());

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(shopify.config.auth.callbackPath, shopify.auth.callback());

app.post(shopify.config.webhooks.path, shopify.processWebhooks({ webhookHandlers: {} }));

app.use(
  "/api/*",
  shopify.validateAuthenticatedSession()
);

app.use("/api", announcementRoutes);

const STATIC_PATH = resolve(__dirname, "../frontend/dist");

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", (req, res, next) => {
  console.log("url hit: " + req.originalUrl);
  console.log("query obj is", JSON.stringify(req.query));
  next();
}, shopify.ensureInstalledOnShop(), async (req, res) => {
  res.set("Content-Type", "text/html");
  return res.sendFile(resolve(STATIC_PATH, "index.html"));
});

app.use(errorHandler);

const startServer = async () => {
  console.log("starting server now...");
  try {
    let mongoUri = process.env.MONGODB_URI;
    if (mongoUri == undefined) {
      mongoUri = "mongodb://localhost:27017/shopify-announcement-banner";
    }
    await connectToMongoDB(mongoUri);

    app.listen(PORT, () => {
      console.log("SERVER STARTED!!!");
      console.log("PORT IS: " + PORT);
      console.log("prod mode? " + IS_PRODUCTION);
    });
  } catch (error) {
    console.log("Oh no, error starting server :(");
    console.log(error.message);
    process.exit(1);
  }
}

const shutdown = async (signal) => {
  console.log("shutting down...", signal);
  await disconnectMongoDB();
  process.exit(0);
}

process.on("SIGINT", () => { shutdown("SIGINT"); });
process.on("SIGTERM", () => { shutdown("SIGTERM"); });

startServer();

export default app;

