import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Simple /health endpoint reporting the database connection state
router.get("/", (_req, res) => {
	const dbState = mongoose.connection.readyState;
	if (dbState === mongoose.ConnectionStates.connected) {
		res.status(200).json({ status: "ok", database: "connected" });
	} else {
		res.status(503).json({
			status: "error",
			// disconnected, connecting, disconnecting, uninitialized
			database: mongoose.ConnectionStates[dbState],
			message: "Database connection issue detected",
		});
	}
});

export const healthRoutes = router;
