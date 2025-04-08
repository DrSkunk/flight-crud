import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

// Load the test environment variables
dotenv.config({ path: ".env.test" });

export default defineConfig({
	test: {
		environment: "node",
		maxConcurrency: 1,
	},
});
