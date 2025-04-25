/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        //ignore formiddable js import warnings
        config.ignoreWarnings = [
            { module: /node_modules\/handlebars\/lib\/index\.js/ },
            { file: /node_modules\/handlebars\/lib\/index\.js/ },
        ];
        return config
    },
    images: {
        domains: ['tmpfiles.org', "res.cloudinary.com", "firebasestorage.googleapis.com"],
    },
};

export default nextConfig;
