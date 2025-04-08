import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { config } from "./env.js";

/**
 * Connect to MongoDB
 * If the URI is "memory", create an in-memory MongoDB server
 * Otherwise, connect to the specified MongoDB URI
 */
export async function connectDB() {
  let uri = config.mongodb.uri;
  if (config.mongodb.uri === "memory") {
    console.log(
      "MongoDB URI is set to memory, creating in-memory MongoDB server"
    );
    const instance = await MongoMemoryServer.create();
    uri = instance.getUri();
  }
  try {
    console.log(`Connecting to MongoDB at ${uri}`);
    await mongoose.connect(uri);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
