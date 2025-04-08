import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";

export async function authUser(username, password) {
	const user = await User.findOne({ username });

	if (!user) {
		throw new AppError("Invalid username or password", 401);
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		throw new AppError("Invalid username or password", 401);
	}

	// Generate token
	const token = generateToken(user._id);

	return token;
}

export async function registerUser(username, password) {
	const existingUser = await User.findOne({ username });
	if (existingUser) {
		throw new AppError("User already exists", 409);
	}

	const user = await User.create({
		username,
		password,
	});

	if (!user) {
		throw new AppError("Invalid user data", 400);
	}

	return user;
}
