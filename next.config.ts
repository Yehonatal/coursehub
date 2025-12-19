import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "20mb",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "github.com",
            },
            {
                protocol: "https",
                hostname: "fqlpzhfbounypvdwcabi.supabase.co",
            },
        ],
    },
};

export default nextConfig;
