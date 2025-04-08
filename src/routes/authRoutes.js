import express from "express";
import { authUser, registerUser } from "../controllers/authController.js";
import { authValidationRules, validateRequest } from "../utils/validation.js";

export const authRoutes = express.Router();

function authUserRoute(req, res, next) {
	const { username, password } = req.body;

	authUser(username, password)
		.then((token) => {
			res.status(200).json({ token });
		})
		.catch(next);
}

function registerUserRoute(req, res, next) {
	const { username, password } = req.body;

	registerUser(username, password)
		.then((user) => {
			res.status(201).json(user);
		})
		.catch(next);
}

authRoutes.post("/token", authValidationRules, validateRequest, authUserRoute);
authRoutes.post(
	"/register",
	authValidationRules,
	validateRequest,
	registerUserRoute,
);
