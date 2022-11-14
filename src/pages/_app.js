import "../styles/globals.css";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import Layout from "src/components/Layout";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<Layout>
			<SessionProvider session={session}>
				<NextUIProvider>
					<Component {...pageProps} />
				</NextUIProvider>
			</SessionProvider>
		</Layout>
	);
}

export default MyApp;
