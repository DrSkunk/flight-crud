import { describe, it, afterAll } from "vitest";
import assert from "node:assert";
import request from "supertest";
import app from "../src/index.js";
import { disconnectDB } from "../src/config/db.js";

const testUser = {
	username: "testuser",
	password: "password123",
};

describe("Authentication API tests", () => {
	afterAll(async () => {
		await disconnectDB();
	});

	describe("User Registration", () => {
		it("should register a new user successfully", async () => {
			const res = await request(app)
				.post("/api/v1/auth/register")
				.send(testUser);

			assert.strictEqual(res.statusCode, 201);
			assert.strictEqual(res.body.message, "User registered successfully");
		});

		it("should return 409 when registering a duplicate username", async () => {
			// First registration
			await request(app).post("/api/v1/auth/register").send(testUser);

			// Second registration with same username
			const res = await request(app)
				.post("/api/v1/auth/register")
				.send(testUser);

			assert.strictEqual(res.statusCode, 409);
			assert.strictEqual(res.body.message, "User already exists");
		});

		it("should return 400 for missing required fields", async () => {
			const incompleteUser = { username: "incomplete" };
			const res = await request(app)
				.post("/api/v1/auth/register")
				.send(incompleteUser);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(res.body.message.includes("Validation failed"));
			assert.ok(res.body.message.includes("Password is required"));
		});

		it("should return 400 for password too short", async () => {
			const shortPasswordUser = {
				username: "shortpass",
				password: "12345",
			};
			const res = await request(app)
				.post("/api/v1/auth/register")
				.send(shortPasswordUser);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(
				res.body.message.includes("Password must be at least 6 characters"),
			);
		});
	});

	describe("Token Generation", () => {
		it("should generate a token for valid credentials", async () => {
			// Register user first
			await request(app).post("/api/v1/auth/register").send(testUser);

			// Then attempt to get token
			const res = await request(app).post("/api/v1/auth/token").send(testUser);

			assert.strictEqual(res.statusCode, 200);
			assert.ok(res.body.token);
			assert.ok(typeof res.body.token === "string");
		});

		it("should return 401 for invalid credentials", async () => {
			// Register user first
			await request(app).post("/api/v1/auth/register").send(testUser);

			// Then attempt with wrong password
			const res = await request(app).post("/api/v1/auth/token").send({
				username: testUser.username,
				password: "wrongpassword",
			});

			assert.strictEqual(res.statusCode, 401);
			assert.strictEqual(res.body.message, "Invalid username or password");
		});

		it("should return 401 for non-existent user", async () => {
			const res = await request(app).post("/api/v1/auth/token").send({
				username: "nonexistentuser",
				password: "password123",
			});

			assert.strictEqual(res.statusCode, 401);
			assert.strictEqual(res.body.message, "Invalid username or password");
		});
	});
});
