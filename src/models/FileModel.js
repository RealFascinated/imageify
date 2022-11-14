import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	uploader: mongoose.Types.ObjectId, // The users id who uploaded the file
	// The id of the file
	fileId: {
		type: String,
		index: true,
	},
	originalFileName: String, // The name of the original file
	uploadDate: Date, // The date when the file was uploaded
	contentType: String, // The mimetype of the file
	ext: String, // The extention of the file
	size: Number, // The size of the file

	// Image/Video specific properties
	width: Number, // The width of the image/video in pixels
	height: Number, // The height of the image/video in pixels
});

export default mongoose.models.File || mongoose.model("File", schema);
