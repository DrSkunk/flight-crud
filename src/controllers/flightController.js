import { Flight } from "../models/Flight.js";

// Get all flights
export async function getFlights() {
	const flights = await Flight.find();
	return flights;
}

// Get flight by Flight number
export async function getFlightByFlightNumber(flightNumber) {
	const flight = await Flight.findOne({ flightNumber });

	if (!flight) {
		throw new Error("Flight not found");
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
	return flight;
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
	);

	if (!flight) {
		throw new Error("Flight not found");
	}

	return flight;
}

// Cancel a  a flight
// This does not delete the flight, but updates its status to 'cancelled'
export async function cancelFlight(flightNumber) {
	const flight = await Flight.findOneAndUpdate(
		{ flightNumber },
		{ status: "cancelled" },
		{ new: true },
	);

	if (!flight) {
		throw new Error("Flight not found");
	}

	return flight;
}
