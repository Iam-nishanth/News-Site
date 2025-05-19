/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['tmpfiles.org', "res.cloudinary.com", "firebasestorage.googleapis.com"],
		unoptimized: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	// output: "export",
	// distDir: 'dist',
	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
	// typescript: {
	// 	ignoreBuildErrors: true,
	// },
	reactStrictMode: true,
	experimental: {
		serverActions: true,
	},
	turbopack: {
		resolveAlias: {
			underscore: "lodash",
			"@/*": "./src/*",
		},
		resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
	},
	webpack: (config) => {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			net: false,
			TLS: false,
			crypto: false,
		};
		return config;
	},
};

export default nextConfig;
