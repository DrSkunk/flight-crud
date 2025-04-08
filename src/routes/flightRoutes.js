import express from "express";
import {
	cancelFlight,
	createFlight,
	getFlightByFlightNumber,
	getFlights,
	updateFlight,
} from "../controllers/flightController.js";

export const flightRoutes = express.Router();

function getAllFlightsRoute(_req, res) {
	getFlights()
		.then((flights) => {
			res.status(200).json(flights);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
}

function createFlightRoute(req, res) {
	const flightData = req.body;
	createFlight(flightData)
		.then((newFlight) => {
			res.status(201).json(newFlight);
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
}

function getFlightRoute(req, res) {
	const flightNumber = req.params.flightNumber;
	getFlightByFlightNumber(flightNumber)
		.then((flight) => {
			if (flight) {
				res.status(200).json(flight);
			} else {
				res.status(404).json({ message: "Flight not found" });
			}
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
}

// Update flight
function updateFlightRoute(req, res) {
	const flightNumber = req.params.flightNumber;
	const flightData = req.body;
	updateFlight(flightNumber, flightData)
		.then((updatedFlight) => {
			if (updatedFlight) {
				res.status(200).json(updatedFlight);
			} else {
				res.status(404).json({ message: "Flight not found" });
			}
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
}

// Delete flight
function cancelFlightRoute(req, res) {
	const flightNumber = req.params.flightNumber;
	cancelFlight(flightNumber)
		.then((result) => {
			if (result) {
				res.status(200).json({ message: "Flight deleted successfully" });
			} else {
				res.status(404).json({ message: "Flight not found" });
			}
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
}

flightRoutes.route("/").get(getAllFlightsRoute).post(createFlightRoute);

flightRoutes
	.route("/:flightNumber")
	.get(getFlightRoute)
	.put(updateFlightRoute)
	.delete(cancelFlightRoute);
