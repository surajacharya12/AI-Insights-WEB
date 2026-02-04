import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "images.pexels.com",
      "images.unsplash.com",
      "gen.pollinations.ai",      // New unified Pollinations endpoint
      "image.pollinations.ai",    // Legacy Pollinations endpoint (for existing images in DB)
      "img.hexahome.in",
      "imgs.search.brave.com"     // For Brave search images
    ],
  },
  /* config options here */
};

export default nextConfig;
