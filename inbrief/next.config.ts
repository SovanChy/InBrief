/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "3000",
          pathname: "/**",
        },
        {
          protocol: "https", 
          hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",

        }

      ],
    },
};

export default nextConfig;
