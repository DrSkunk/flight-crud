// Define required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

// Check if all required environment variables are set
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

// Config for the application, mostly loaded from environment variables
// * Note * that the mongodb.uri and jwt.secret are always set because of the check above,
// but the conditional ensures that the linter sees them as "string" and not "string|undefined"
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: process.env.API_PREFIX || "/api/v1",
  mongodb: {
    uri: process.env.MONGODB_URI || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },
};
