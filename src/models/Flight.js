import mongoose from "mongoose";

// For simplicity sake, we are just storing Strings for departure and destination.
// We could create a new model for Airport and use ObjectId references if needed.
const flightSchema = new mongoose.Schema(
	{
		flightNumber: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
		},
		departure: {
			type: String,
			required: true,
			trim: true,
		},
		destination: {
			type: String,
			required: true,
			trim: true,
		},
		departureTime: {
			type: Date,
			required: true,
		},
		arrivalTime: {
			type: Date,
			required: true,
		},
		aircraft: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["scheduled", "departed", "arrived", "cancelled"],
			default: "scheduled",
		},
	},
	{
		// Adds createdAt and updatedAt timestamps
		timestamps: true,
	},
);

export const Flight = mongoose.model("Flight", flightSchema);
