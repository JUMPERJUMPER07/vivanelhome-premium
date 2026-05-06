import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // CDN principal da Shopee Brasil
      {
        protocol: "https",
        hostname: "down-br.img.susercontent.com",
        pathname: "/file/**",
      },
      // CDN da Shopee Singapura (imagens de sellers internacionais)
      {
        protocol: "https",
        hostname: "down-sg.img.susercontent.com",
        pathname: "/file/**",
      },
      // Supabase Storage (imagens enviadas pelo admin)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
