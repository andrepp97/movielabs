/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['image.tmdb.org'],
    },
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
}

module.exports = nextConfig
