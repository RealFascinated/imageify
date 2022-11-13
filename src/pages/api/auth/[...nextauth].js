import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text", placeholder: "admin" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				console.log(credentials);
				const user = { id: "1", name: "J Smith", email: "admin@example.com" };

				if (user) {
					return user;
				} else {
					return null;
				}
			},
		}),
	],
};

export default NextAuth(authOptions);
