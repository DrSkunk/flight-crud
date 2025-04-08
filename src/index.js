import path from "node:path";
import { fileURLToPath } from "node:url";

import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";
import { healthRoutes } from "./routes/healthRoutes.js";

// __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Basic CORS was added as a demo for a potential frontend application
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

// API routes
// Basic health check route: http://localhost:3000/health
app.use("/health", healthRoutes);

// Swagger Documentation: http://localhost:3000/api/v1/docs
const swaggerDocument = YAML.load(path.join(__dirname, "config/openapi.yaml"));
app.use(
  `${config.apiPrefix}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Start server, default port is 3000
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});

// Exposed to use in tests
export default app;
