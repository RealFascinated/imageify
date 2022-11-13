import mongoose, { Schema } from "mongoose";

const schema = new Schema({
	uploader: mongoose.Types.ObjectId,
	fileId: String,
	uploadDate: Date,
	contentType: String,
});

export default mongoose.models.File || mongoose.model("File", schema);
