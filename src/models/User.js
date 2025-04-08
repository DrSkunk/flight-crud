import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		// Adds createdAt and updatedAt timestamps
		timestamps: true,
	},
);

// Hash password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(10); // 10 is the amount of rounds to salt
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
