import { config } from "../config/env.js";

// Replace default error handler
export function errorHandler(err, _req, res, _next) {
	const statusCode =
		err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
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
