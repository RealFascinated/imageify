import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongo } from "../../../utils/helpers/mongoHelpers";
import {
	generateRandomPassword,
	isValidPassword,
} from "../../../utils/helpers/passwordHelpers";
import { createUser, getUser } from "../../../utils/helpers/userHelpers";

// Create admin account if one doesn't exist yet (this is temporary)
// There will be a CLI eventually
const pass = generateRandomPassword();
createUser("admin", pass).then((returned) => {
	if (returned === true) {
		console.log(`Created admin account. Username: admin, Password: ${pass}`);
	}
});

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: {
					label: "Username",
					type: "text",
					placeholder: "admin",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				await connectMongo();
				const { username, password } = credentials;
				const user = await getUser(username);
				if (user == null) {
					return null;
				}

				if (user) {
					const validPassword = isValidPassword(password, user.password);
					if (validPassword === false) {
						return null;
					}
					user.lastLoginDate = new Date();
					await user.save();
					console.log(`User: ${user}`);
					return user;
				} else {
					return null;
				}
			},
		}),
	],
};

export default NextAuth(authOptions);
