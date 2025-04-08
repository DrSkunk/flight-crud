import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const generateToken = (id) => {
	return jwt.sign({ id }, config.jwt.secret, {
		expiresIn: config.jwt.expiresIn,
	});
};
