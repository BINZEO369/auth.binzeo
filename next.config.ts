import type { NextConfig } from "next";

const configuredCentralBase = process.env.CENTRAL_API_BASE_URL?.trim().replace(/\/+$/, "");
if (!configuredCentralBase) {
  throw new Error("CENTRAL_API_BASE_URL is required; auth.binzeo has no local API fallback.");
}

const centralOrigin = new URL(configuredCentralBase).origin;
if (process.env.NODE_ENV === "production" && !centralOrigin.startsWith("https://")) {
  throw new Error("CENTRAL_API_BASE_URL must use HTTPS in production.");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/account", permanent: true },
      { source: "/dashboard/profile", destination: "/account", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/api/:path*", destination: `${centralOrigin}/v1/:path*` },
      ],
    };
  },
};

export default nextConfig;
