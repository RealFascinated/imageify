import "../styles/globals.css";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";
import Layout from "src/components/Layout";
import { darkTheme } from "src/consts/themes";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<NextUIProvider theme={darkTheme}>
			<NextSeo titleTemplate="%s | Imageify" />
			<Layout>
				<SessionProvider session={session}>
					<NextUIProvider>
						<Component {...pageProps} />
					</NextUIProvider>
				</SessionProvider>
			</Layout>
		</NextUIProvider>
	);
}

export default MyApp;
