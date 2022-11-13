import mongoose from "mongoose";

export async function connectMongo() {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
	} catch (e) {
		console.log(`Mongo connection failed: ${e.message}`);
	}
}
