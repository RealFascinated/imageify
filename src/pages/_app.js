import "../styles/globals.css";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<SessionProvider session={session}>
			<NextUIProvider>
				<Component {...pageProps} />
			</NextUIProvider>
		</SessionProvider>
	);
}

export default MyApp;
