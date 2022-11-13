import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	email: String,
	username: String,
	password: String,
});

export default mongoose.models.User || mongoose.model("User", schema);
