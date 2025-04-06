/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: '**',
         
        },
        {
          protocol: "https", 
          hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",

        },

      ],

    },
};

export default nextConfig;
