import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	// The username of the user
	username: {
		type: String,
		index: true,
	},
	password: String, // The hashed password of the user
	salt: String, // The salt the password was hashed with
	uploadKey: String, // The users upload key for ShareX
	lastLoginDate: Date, // The last time the user logged in

	// User Settings
	discordEmbed: {
		embed: {
			type: Boolean,
			default: true,
		},
		title: {
			type: String,
			default: "{id}.{ext}",
		},
		description: {
			type: String,
			default: null,
		},
		color: {
			type: String,
			default: "0063EB",
		},
	},
});

export default mongoose.models.User || mongoose.model("User", schema);
