import express from "express";
import {
	cancelFlight,
	createFlight,
	getFlightByFlightNumber,
	getFlights,
	updateFlight,
} from "../controllers/flightController.js";
import { protect } from "../middlewares/auth.js";
import { AppError } from "../utils/AppError.js";
import { validateRequest } from "../utils/validation.js";
import {
	flightNumberParamValidationRule,
	flightValidationRules,
} from "../utils/validation.js";

export const flightRoutes = express.Router();

// Ensure that the authentication token is checked for all routes
flightRoutes.use(protect);

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
				throw new AppError("Flight not found", 404);
			}
		})
		.catch(next);
}

// Update flight
function updateFlightRoute(req, res, next) {
	const flightNumber = req.params.flightNumber;
	const flightData = req.body;

	if (Object.keys(flightData).length === 0) {
		return next(
			new AppError("At least one field must be provided to update", 400),
		);
	}

	getFlightByFlightNumber(flightNumber)
		.then(() => updateFlight(flightNumber, flightData))
		.then((updatedFlight) => {
			if (updatedFlight) {
				res.status(200).json(updatedFlight);
			} else {
				throw new AppError("Flight not found", 404);
			}
		})
		.catch(next);
}

// Delete flight
function cancelFlightRoute(req, res, next) {
	const flightNumber = req.params.flightNumber;

	getFlightByFlightNumber(flightNumber)
		.then(() => cancelFlight(flightNumber))
		.then((updatedFlight) => {
			res.status(200).json(updatedFlight);
		})
		.catch(next);
}

flightRoutes
	.route("/")
	.get(getAllFlightsRoute)
	.post(flightValidationRules, validateRequest, createFlightRoute);

flightRoutes
	.route("/:flightNumber")
	.get(flightNumberParamValidationRule, validateRequest, getFlightRoute)
	.patch(
		[...flightNumberParamValidationRule, ...flightValidationRules],
		validateRequest,
		updateFlightRoute,
	)
	.delete(flightNumberParamValidationRule, validateRequest, cancelFlightRoute);
