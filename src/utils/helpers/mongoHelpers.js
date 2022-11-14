import mongoose from "mongoose";

/**
 * Connect to the database
 */
export async function connectMongo() {
	try {
		await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
	} catch (e) {
		console.log(`Mongo connection failed: ${e.message}`);
	}
}
