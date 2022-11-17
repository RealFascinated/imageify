const imageUrlParts = process.env.NEXT_PUBLIC_SITE_URL
	? process.env.NEXT_PUBLIC_SITE_URL.split("://")
	: "http://localhost:3000".split("://"); // To make tests pass

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	swcMinify: true,
	optimizeFonts: true,
	experimental: {
		optimizeCss: true,
	},

	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/api/files/**",
			},
			{
				protocol: imageUrlParts[0],
				hostname: imageUrlParts[1].split(":")[0],
				port: "443",
				pathname: "/api/files/**",
			},
		],
	},
};

module.exports = nextConfig;
