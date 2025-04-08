import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";

export async function authUser(username, password) {
	try {
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).json({
				code: 401,
				message: "Invalid username or password",
			});
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			throw new AppError("Invalid username or password", 401);
		}

		// Generate token
		const token = generateToken(user._id);

		return token;
	} catch (error) {
		throw new AppError(error.message || "Server Error", 500);
	}
}

export async function registerUser(username, password) {
	try {
		const user = await User.create({
			username,
			password,
		});

		if (!user) {
			throw new AppError("Invalid user data", 400);
		}

		return user;
	} catch (error) {
		throw new AppError(error.message || "Server Error", 500);
	}
}
