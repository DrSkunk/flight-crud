import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/User.js";

/**
 * Middleware to protect routes that require authentication
 */
export async function protect(req, res, next) {
	let token;

	// Check if token exists in headers
	if (req.headers.authorization?.startsWith("Bearer")) {
		try {
			// Extract token from header
			token = req.headers.authorization.split(" ")[1];

			// Verify token
			const decoded = jwt.verify(token, config.jwt.secret);

			// Add user from payload to req object
			req.user = await User.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			console.error(error);
			return res.status(401).json({
				code: 401,
				message: "Not authorized, token failed",
			});
		}
	}

	if (!token) {
		return res.status(401).json({
			code: 401,
			message: "Not authorized, no token",
		});
	}
}
