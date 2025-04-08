import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

// Load the test environment variables
dotenv.config({ path: ".env.test" });

export default defineConfig({
	test: {
		environment: "node",
		maxConcurrency: 1,
	},
});
