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
				port: "3000",
				pathname: "/api/files/**",
			},
		],
	},
};

module.exports = nextConfig;
