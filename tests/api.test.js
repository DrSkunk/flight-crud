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

	describe("Flights: Create", () => {
		it("should create a new flight", async () => {
			const res = await request(app).post("/api/v1/flights").send(testFlight);

			assert.strictEqual(res.statusCode, 201);
			assert.strictEqual(res.body.flightNumber, testFlight.flightNumber);
		});

		it("should return 400 for missing required fields", async () => {
			const incompleteFlight = { flightNumber: "BB456" };
			const res = await request(app)
				.post("/api/v1/flights")
				.send(incompleteFlight);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(res.body.message.includes("Validation failed"));
			assert.ok(res.body.message.includes("Departure airport is required"));
			assert.ok(res.body.message.includes("Destination airport is required"));
			assert.ok(res.body.message.includes("Departure time is required"));
			assert.ok(res.body.message.includes("Arrival time is required"));
			assert.ok(res.body.message.includes("Aircraft is required"));
		});

		it("should return 400 for duplicate flight number", async () => {
			await request(app).post("/api/v1/flights").send(testFlight); // Create the flight first
			const res = await request(app).post("/api/v1/flights").send(testFlight);

			assert.strictEqual(res.statusCode, 409);
			assert.ok(res.body.message.includes("Flight number already exists"));
		});

		it("should return 400 for invalid timestamps", async () => {
			const invalidDepartureTimestampsFlight = {
				flightNumber: "CC789",
				departure: "MUC",
				destination: "YVR",
				departureTime: "invalid-timestamp",
				arrivalTime: "2025-04-11T01:55:00Z",
				aircraft: "Boeing 737",
			};
			let res = await request(app)
				.post("/api/v1/flights")
				.send(invalidDepartureTimestampsFlight);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(
				res.body.message.includes(
					"Departure time must be a valid ISO 8601 date",
				),
			);

			const invalidArrivalTimestampsFlight = {
				flightNumber: "CC790",
				departure: "MUC",
				destination: "YVR",
				departureTime: "2025-04-10T15:45:00Z",
				arrivalTime: "invalid-timestamp",
				aircraft: "Boeing 737",
			};
			res = await request(app)
				.post("/api/v1/flights")
				.send(invalidArrivalTimestampsFlight);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(
				res.body.message.includes("Arrival time must be a valid ISO 8601 date"),
			);

			const invalidBothTimestampsFlight = {
				flightNumber: "CC791",
				departure: "MUC",
				destination: "YVR",
				departureTime: "invalid-timestamp",
				arrivalTime: "invalid-timestamp",
				aircraft: "Boeing 737",
			};
			res = await request(app)
				.post("/api/v1/flights")
				.send(invalidBothTimestampsFlight);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(
				res.body.message.includes(
					"Departure time must be a valid ISO 8601 date",
				),
			);
			assert.ok(
				res.body.message.includes("Arrival time must be a valid ISO 8601 date"),
			);
		});

		it("should return 400 when arrivalTime is before departureTime", async () => {
			const invalidTimeOrderFlight = {
				flightNumber: "DD101",
				departure: "MUC",
				destination: "YVR",
				departureTime: "2025-04-11T15:45:00Z",
				arrivalTime: "2025-04-10T01:55:00Z",
				aircraft: "Boeing 737",
			};
			const res = await request(app)
				.post("/api/v1/flights")
				.send(invalidTimeOrderFlight);

			assert.strictEqual(res.statusCode, 400);
			assert.ok(
				res.body.message.includes("Arrival time must be after departure time"),
			);
		});
	});

	describe("Flights: Get all", () => {
		it("should fetch all flights", async () => {
			const res = await request(app).get("/api/v1/flights");

			assert.strictEqual(res.statusCode, 200);
			assert.ok(Array.isArray(res.body));
		});
	});

	describe("Flights: Get flight", () => {
		it("should fetch a flight by flight number", async () => {
			const res = await request(app).get(
				`/api/v1/flights/${testFlight.flightNumber}`,
			);

			assert.strictEqual(res.statusCode, 200);
			assert.strictEqual(res.body.flightNumber, testFlight.flightNumber);
		});

		it("should return 404 for a non-existent flight", async () => {
			const res = await request(app).get("/api/v1/flights/XX000");

			assert.strictEqual(res.statusCode, 404);
			assert.strictEqual(res.body.message, "Flight not found");
		});
	});

	describe("Flights: Update flight", () => {
		it("should update an existing flight", async () => {
			const updatedData = {
				flightNumber: testFlight.flightNumber,
				departure: testFlight.departure,
				destination: "LAX",
				departureTime: testFlight.departureTime,
				arrivalTime: testFlight.arrivalTime,
				aircraft: testFlight.aircraft,
			};
			const res = await request(app)
				.patch(`/api/v1/flights/${testFlight.flightNumber}`)
				.send(updatedData);

			assert.strictEqual(res.statusCode, 200);
			assert.strictEqual(res.body.destination, updatedData.destination);
		});

		it("should return 404 when updating a non-existent flight", async () => {
			const updatedData = {
				flightNumber: testFlight.flightNumber,
				departure: testFlight.departure,
				destination: "LAX",
				departureTime: testFlight.departureTime,
				arrivalTime: testFlight.arrivalTime,
				aircraft: testFlight.aircraft,
			};
			const res = await request(app)
				.patch("/api/v1/flights/XX000")
				.send(updatedData);

			assert.strictEqual(res.statusCode, 404);
			assert.strictEqual(res.body.message, "Flight not found");
		});
	});

	describe("Flights: Delete flight", () => {
		it("should cancel an existing flight", async () => {
			const res = await request(app).delete(
				`/api/v1/flights/${testFlight.flightNumber}`,
			);

			assert.strictEqual(res.statusCode, 200);
			assert.strictEqual(res.body.flightNumber, testFlight.flightNumber);
			assert.strictEqual(res.body.status, "cancelled");
		});

		it("should return 404 when cancelling a non-existent flight", async () => {
			const res = await request(app).delete("/api/v1/flights/XX000");

			assert.strictEqual(res.statusCode, 404);
			assert.strictEqual(res.body.message, "Flight not found");
		});
	});
});
