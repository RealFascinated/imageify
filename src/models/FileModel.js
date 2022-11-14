import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	uploader: mongoose.Types.ObjectId,
	fileId: String,
	uploadDate: Date,
	contentType: String,
	ext: String,

	// Image/Video specific properties
	width: Number, // The width of the image/video in pixels
	height: Number, // The height of the image/video in pixels
});

export default mongoose.models.File || mongoose.model("File", schema);
