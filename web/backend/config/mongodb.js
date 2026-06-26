import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectToMongoDB = async (uri) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri, {});

      console.log("✅ MongoDB connected successfully (attempt " + attempt + ")");

      mongoose.connection.on("error", (err) => {
        console.log("MongoDB connection error: " + err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected. Attempting reconnect...");
      });

      mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected successfully");
      });

      return;
    } catch (error) {
      console.log("❌ MongoDB connection attempt " + attempt + "/" + MAX_RETRIES + " failed: " + error.message);

      if (attempt == MAX_RETRIES) {
        console.log("All MongoDB connection attempts exhausted. Exiting.");
        throw error;
      }

      console.log("Retrying in " + (RETRY_DELAY_MS / 1000) + "s...");
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected gracefully");
  } catch (error) {
    console.log("Error disconnecting MongoDB: " + error.message);
  }
}

export { connectToMongoDB, disconnectMongoDB };
