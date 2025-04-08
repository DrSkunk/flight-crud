import { body, param, validationResult } from "express-validator";
import { AppError } from "./AppError";

//Flight validation rules for creating/updating flights
export const flightValidationRules = [
	body("flightNumber")
		.notEmpty()
		.withMessage("Flight number is required")
		.isString()
		.withMessage("Flight number must be a string")
		.matches(/^[A-Z]{2}\d{3,4}$/)
		.withMessage(
			"Flight number must follow the format: 2 letters followed by 3-4 digits",
		),
	body("departure")
		.notEmpty()
		.withMessage("Departure airport is required")
		.isString()
		.withMessage("Departure airport must be a string")
		.isLength({ min: 3, max: 3 })
		.withMessage("Airport code must be exactly 3 characters")
		.isAlpha()
		.withMessage("Airport code must contain only letters"),
	body("destination")
		.notEmpty()
		.withMessage("Destination airport is required")
		.isString()
		.withMessage("Destination airport must be a string")
		.isLength({ min: 3, max: 3 })
		.withMessage("Airport code must be exactly 3 characters")
		.isAlpha()
		.withMessage("Airport code must contain only letters")
		.custom((value, { req }) => {
			if (value === req.body.departure) {
				throw new Error("Destination cannot be the same as departure");
			}
			return true;
		}),
	body("departureTime")
		.notEmpty()
		.withMessage("Departure time is required")
		.isISO8601()
		.withMessage("Departure time must be a valid ISO 8601 date")
		.custom((value) => {
			if (new Date(value) < new Date()) {
				throw new Error("Departure time must be in the future");
			}
			return true;
		}),
	body("arrivalTime")
		.notEmpty()
		.withMessage("Arrival time is required")
		.isISO8601()
		.withMessage("Arrival time must be a valid ISO 8601 date")
		.custom((value, { req }) => {
			if (new Date(value) <= new Date(req.body.departureTime)) {
				throw new Error("Arrival time must be after departure time");
			}
			return true;
		}),
	body("aircraft")
		.notEmpty()
		.withMessage("Aircraft is required")
		.isString()
		.withMessage("Aircraft must be a string")
		.isLength({ min: 3, max: 50 })
		.withMessage("Aircraft must be between 3 and 50 characters"),
];

// FlightNumber parameter validation rule
export const flightNumberParamValidationRule = [
	param("flightNumber")
		.notEmpty()
		.withMessage("Flight number is required")
		.isString()
		.withMessage("Flight number must be a string")
		.matches(/^[A-Z]{2}\d{3,4}$/)
		.withMessage(
			"Flight number must follow the format: 2 letters followed by 3-4 digits",
		),
];

// Middleware to validate request
export function validateRequest(req, _res, next) {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}

	const error = new AppError(
		`Validation failed: ${errors
			.array()
			.map((err) => err.msg)
			.join(", ")}`,
		400,
	);
	return next(error);
}

// Validate auth
export const authValidationRules = [
	body("username")
		.notEmpty()
		.withMessage("Username is required")
		.isString()
		.withMessage("Username must be a string"),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isString()
		.withMessage("Password must be a string")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters"),
];
