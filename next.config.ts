import type { NextConfig } from "next";

const centralEnabled = process.env.CENTRAL_API_ENABLED === "true";
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  env: { NEXT_PUBLIC_CENTRAL_API_ENABLED: centralEnabled ? "true" : "false" },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async rewrites() {
    if (!centralEnabled) return [];
    const base = process.env.CENTRAL_API_BASE_URL?.replace(/\/+$/, "");
    if (!base) throw new Error("CENTRAL_API_BASE_URL is required when CENTRAL_API_ENABLED=true");
    const parsed = new URL(base);
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
      throw new Error("CENTRAL_API_BASE_URL must use HTTPS in production");
    }
    return { beforeFiles: [{ source: "/api/:path*", destination: `${parsed.origin}/v1/:path*` }] };
  },
};

export default nextConfig;
