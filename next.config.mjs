/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'lh3.googleusercontent.com'
        ]
    }
};

export default nextConfig;
