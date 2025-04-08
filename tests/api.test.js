import { describe, it, afterAll } from "vitest";
import assert from "node:assert";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/index.js";

// Test flight data
const testFlight = {
	flightNumber: "AA123",
	departure: "MUC",
	destination: "YVR",
	departureTime: "2025-04-10T15:45:00Z",
	arrivalTime: "2025-04-11T01:55:00Z",
	aircraft: "Boeing 737",
};

describe("API tests", () => {
	// Cleanup after tests
	afterAll(async () => {
		await mongoose.connection.close();
	});

	describe("Flight Management", () => {
		it("should create a new flight", async () => {
			const res = await request(app).post("/api/v1/flights").send(testFlight);

			assert.strictEqual(res.statusCode, 201);
			assert.strictEqual(res.body.flightNumber, testFlight.flightNumber);
		});

		it("should fetch all flights", async () => {
			const res = await request(app).get("/api/v1/flights");

			assert.strictEqual(res.statusCode, 200);
			assert.ok(Array.isArray(res.body));
		});

		it("should fetch a flight by flight number", async () => {
			const res = await request(app).get(
				`/api/v1/flights/${testFlight.flightNumber}`,
			);

			assert.strictEqual(res.statusCode, 200);
			assert.strictEqual(res.body.flightNumber, testFlight.flightNumber);
		});

		it("should return 404 for a non-existent flight", async () => {
			const res = await request(app).get("/api/v1/flights/INVALID123");

			assert.strictEqual(res.statusCode, 404);
			assert.strictEqual(res.body.message, "Flight not found");
		});

		it("should update an existing flight", async () => {
			const updatedData = { destination: "LAX" };
			const res = await request(app)
				.patch(`/api/v1/flights/${testFlight.flightNumber}`)
				.send(updatedData);

			assert.strictEqual(res.statusCode, 200);
			assert.strictEqual(res.body.destination, updatedData.destination);
		});

		it("should return 404 when updating a non-existent flight", async () => {
			const res = await request(app)
				.patch("/api/v1/flights/INVALID123")
				.send({ destination: "LAX" });

			assert.strictEqual(res.statusCode, 404);
			assert.strictEqual(res.body.message, "Flight not found");
		});

		it("should cancel an existing flight", async () => {
			const res = await request(app).delete(
				`/api/v1/flights/${testFlight.flightNumber}`,
			);

			assert.strictEqual(res.statusCode, 200);
			assert.strictEqual(res.body.message, "Flight deleted successfully");
		});

		it("should return 404 when cancelling a non-existent flight", async () => {
			const res = await request(app).delete("/api/v1/flights/INVALID123");

			assert.strictEqual(res.statusCode, 404);
			assert.strictEqual(res.body.message, "Flight not found");
		});

		it("should return 500 for missing required fields", async () => {
			const incompleteFlight = { flightNumber: "BB456" };
			const res = await request(app)
				.post("/api/v1/flights")
				.send(incompleteFlight);

			assert.strictEqual(res.statusCode, 500);
			assert.ok(res.body.message.includes("validation failed"));
		});

		it("should return 500 for duplicate flight number", async () => {
			await request(app).post("/api/v1/flights").send(testFlight); // Create the flight first
			const res = await request(app).post("/api/v1/flights").send(testFlight);

			assert.strictEqual(res.statusCode, 500);
			assert.ok(res.body.message.includes("duplicate key error"));
		});
	});
});
