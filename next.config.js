/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	swcMinify: true,
	optimizeFonts: true,

	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				pathname: "/api/files/**",
			},
			{
				protocol: "http",
				hostname: process.env.NEXT_PUBLIC_SITE_URL,
				pathname: "/api/files/**",
			},
		],
	},
};

module.exports = nextConfig;
