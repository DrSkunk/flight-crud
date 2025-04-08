import { config } from "../config/env.js";

// Replace default error handler
export function errorHandler(err, _req, res, _next) {
	// Try to use the status code from the error object
	// If it doesn't exist, fall back to 500 since it's probably a server error
	const statusCode = err.statusCode || 500;
	console.error(err);
	res.status(statusCode).json({
		code: statusCode,
		message: err.message,
		// Only show stack trace in non-production environments
		stack: config.nodeEnv === "production" ? null : err.stack,
	});
}

// Generic 404 error handler
export function notFound(req, res, next) {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
}
