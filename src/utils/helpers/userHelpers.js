import UserModel from "../../models/UserModel";
import { connectMongo } from "./mongoHelpers";
import { generateSalt, hashPassword } from "./passwordHelpers";
import { randomString } from "./stringHelpers";

connectMongo();

/**
 * Returns the user with the given username
 *
 * @param {string} username The users username
 * @return The user object in mongo or null if not found
 */
export async function getUser(username) {
	return await UserModel.findOne({ username: username });
}

/**
 * Returns the user with the given upload key
 *
 * @param {string} uploadKey The users uploadKey
 * @return The user object in mongo or null if not found
 */
export async function getUserByUploadKey(uploadKey) {
	return await UserModel.findOne({ uploadKey: uploadKey });
}

/**
 * Creates a new user and returns the user object
 *
 * @param {string} username The username of the account
 * @param {string} password The non hashed password of the account
 *
 * @return null if user already exists, true if success, false if fail
 */
export async function createUser(username, password) {
	let user = await getUser(username);
	if (user !== null) {
		return null;
	}

	try {
		const salt = generateSalt();
		user = await UserModel.create({
			username: username,
			password: hashPassword(salt, password),
			salt: salt,
			uploadKey: randomString(16),

			discordEmbed: {
				embed: true,
				title: "{id}.{ext}",
				description: null,
				color: "0063EB",
			},
		});
		user.save();
	} catch (e) {
		return false;
	}
	return true;
}
