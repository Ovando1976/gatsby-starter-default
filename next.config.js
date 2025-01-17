// next.config.js

module.exports = {
  images: {
    domains: ["images.unsplash.com", "your-other-image-domain.com"], // Add your image domains here
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};