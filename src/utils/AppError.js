export class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		// HTTP status code
		this.statusCode = statusCode;
	}
}
