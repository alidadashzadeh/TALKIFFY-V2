import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, "User must have a phone number."],
			validate: [validator.isEmail, "Please provide a valid email address."],
			unique: true,
		},
		username: {
			type: String,
			required: [true, "A user must have a username!"],
			maxlength: 20,
		},
		avatar: { type: String },
		password: {
			type: String,
			required: [true, "Please provide a valid password!"],
			minlength: [8, "Password must be at least 8 character!"],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "Please confirm your password!"],
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: "Passwords do not match!",
			},
		},
		contacts: [{ type: mongoose.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true, versionKey: false },
);

userSchema.pre("save", async function (next) {
	// if password is not modified, do nothing
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;

	next();
});

userSchema.methods.isPasswordCorrect = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasChangedPasswordAfter = async function (tokenTimeStamp) {
	if (!this.passwrodChangedAt || this.passwrodChangedAt < tokenTimeStamp)
		return false;
};

const User = mongoose.model("User", userSchema);

export default User;
