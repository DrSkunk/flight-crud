import cors from "cors";
import express from "express";

import { connectDB } from "./config/db.js";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Basic CORS was added as a demo for a potential frontend application
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

// Exposed to use in tests
export default app;
