const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'assets.scratch.mit.edu'],
    },
    reactStrictMode: true,
    webpack: (config) => {
        config.experiments = { topLevelAwait: true, layers: true };
        return config;
    },
};

module.exports = nextConfig;
