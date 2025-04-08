import express from "express";
import {
	cancelFlight,
	createFlight,
	getFlightByFlightNumber,
	getFlights,
	updateFlight,
} from "../controllers/flightController.js";

export const flightRoutes = express.Router();

function getAllFlightsRoute(_req, res, next) {
	getFlights()
		.then((flights) => {
			res.status(200).json(flights);
		})
		.catch(next);
}

function createFlightRoute(req, res, next) {
	const flightData = req.body;
	createFlight(flightData)
		.then((newFlight) => {
			res.status(201).json(newFlight);
		})
		.catch(next);
}

function getFlightRoute(req, res, next) {
	const flightNumber = req.params.flightNumber;
	getFlightByFlightNumber(flightNumber)
		.then((flight) => {
			if (flight) {
				res.status(200).json(flight);
			} else {
				const error = new Error("Flight not found");
				error.statusCode = 404;
				throw error;
			}
		})
		.catch(next);
}

// Update flight
function updateFlightRoute(req, res, next) {
	const flightNumber = req.params.flightNumber;
	const flightData = req.body;
	updateFlight(flightNumber, flightData)
		.then((updatedFlight) => {
			if (updatedFlight) {
				res.status(200).json(updatedFlight);
			} else {
				const error = new Error("Flight not found");
				error.statusCode = 404;
				throw error;
			}
		})
		.catch(next);
}

// Delete flight
function cancelFlightRoute(req, res, next) {
	const flightNumber = req.params.flightNumber;
	cancelFlight(flightNumber)
		.then((result) => {
			if (result) {
				res.status(200).json({ message: "Flight deleted successfully" });
			} else {
				const error = new Error("Flight not found");
				error.statusCode = 404;
				throw error;
			}
		})
		.catch(next);
}

flightRoutes.route("/").get(getAllFlightsRoute).post(createFlightRoute);

flightRoutes
	.route("/:flightNumber")
	.get(getFlightRoute)
	.patch(updateFlightRoute)
	.delete(cancelFlightRoute);
