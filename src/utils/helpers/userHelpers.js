/**
 * Returns the user with the given email address
 *
 * @param {string} email The users email address
 * @return The users object in mongo or null if not found
 */
export async function getUser(email) {
	const user = await UserModel.find({ email: email });
	return user;
}
