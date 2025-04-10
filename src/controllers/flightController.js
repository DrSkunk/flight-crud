import { Flight } from "../models/Flight.js";
import { AppError } from "../utils/AppError.js";

// Get all flights
export async function getFlights() {
	const flights = await Flight.find().select("-_id -__v");
	return flights;
}

// Get flight by Flight number
export async function getFlightByFlightNumber(flightNumber) {
	const flight = await Flight.findOne({ flightNumber }).select("-_id -__v");

	if (!flight) {
		throw new AppError("Flight not found", 404);
	}

	return flight;
}

// Create new flight
export async function createFlight(flightData) {
	const {
		flightNumber,
		departure,
		destination,
		departureTime,
		arrivalTime,
		aircraft,
	} = flightData;

	const existingFlight = await Flight.findOne({ flightNumber });
	if (existingFlight) {
		throw new AppError("Flight number already exists", 409);
	}

	const flight = await Flight.create({
		flightNumber,
		departure,
		destination,
		departureTime,
		arrivalTime,
		aircraft,
	});
	if (!flight) {
		throw new Error("Flight creation failed");
	}
	// Don't return __v and _id fields
	return flight.toObject({
		versionKey: false,
		transform: (_, ret) => {
			const { _id, ...rest } = ret;
			Object.assign(ret, rest);
		},
	});
}

// Update a flight
export async function updateFlight(flightNumber, flightData) {
	const {
		flightNumber: newFlightNumber,
		departure,
		destination,
		departureTime,
		arrivalTime,
		aircraft,
	} = flightData;

	const flight = await Flight.findOneAndUpdate(
		{ flightNumber },
		{
			flightNumber: newFlightNumber,
			departure,
			destination,
			departureTime,
			arrivalTime,
			aircraft,
		},
		// new: true will return the updated document
		// runValidators: true will run the validators on the updated document
		{ new: true, runValidators: true },
	).select("-_id -__v"); // Don't return __v and _id fields

	if (!flight) {
		throw new AppError("Flight not found", 404);
	}

	return flight;
}

// Cancel a  a flight
// This does not delete the flight, but updates its status to 'cancelled'
export async function cancelFlight(flightNumber) {
	// Food for thought; should this throw an error when the flight is already cancelled?
	const flight = await Flight.findOneAndUpdate(
		{ flightNumber },
		{ status: "cancelled" },
		{ new: true },
	).select("-_id -__v"); // Don't return __v and _id fields

	if (!flight) {
		throw new AppError("Flight not found", 404);
	}

	return flight;
}
