/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["image.tmdb.org", "www.gravatar.com", "secure.gravatar.com"],
    },
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
}

module.exports = nextConfig