import "../styles/globals.css";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Layout from "src/components/Layout";
import { baseOpenGraph } from "src/consts/openGraphBase";
import { darkTheme } from "src/consts/themes";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	const router = useRouter();
	const shouldReturnMetadata = router.pathname !== "/files/[fileId]";

	return (
		<NextUIProvider theme={darkTheme}>
			<NextSeo
				titleTemplate="%s | Imageify"
				themeColor="#0063EB"
				openGraph={shouldReturnMetadata ? baseOpenGraph : undefined}
			/>
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
