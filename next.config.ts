import type { NextConfig } from "next";

const developmentScriptPolicy =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  `script-src 'self' 'unsafe-inline'${developmentScriptPolicy}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "frame-src 'self' https://www.youtube-nocookie.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "Origin-Agent-Cluster",
    value: "?1",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "X-Download-Options",
    value: "noopen",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    minimumCacheTTL: 604800,
  },
  async redirects() {
    return [
      {
        // Codex's earlier lyrics-only page now lives inside the Kartik guide.
        source: "/festivals/damodarastakam",
        destination: "/festivals/kartik#damodarastakam",
        permanent: true,
      },
      {
        source: "/calendar",
        destination: "/festivals",
        permanent: true,
      },
      {
        source: "/events",
        destination: "/festivals",
        permanent: true,
      },
      {
        source: "/gallery",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/guesthouse",
        destination: "/guest-house",
        permanent: true,
      },
      {
        source: "/accommodation",
        destination: "/guest-house",
        permanent: true,
      },
      {
        source: "/accomodation",
        destination: "/guest-house",
        permanent: true,
      },
      {
        source: "/stay",
        destination: "/guest-house",
        permanent: true,
      },
      {
        source: "/volunteer",
        destination: "/serve",
        permanent: true,
      },
      {
        source: "/donations",
        destination: "/donate",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/hktc",
        destination: "/projects/hktc-nairobi",
        permanent: true,
      },
      {
        source: "/projects/hktc",
        destination: "/projects/hktc-nairobi",
        permanent: true,
      },
      {
        source: "/founder",
        destination: "/srila-prabhupada",
        permanent: true,
      },
      {
        source: "/founder-acharya",
        destination: "/srila-prabhupada",
        permanent: true,
      },
      {
        source: "/prabhupad",
        destination: "/srila-prabhupada",
        permanent: true,
      },
      {
        source: "/prabhupada",
        destination: "/srila-prabhupada",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/festivals/kirtan-safari/register",
        destination: "/festivals/kirtan-safari",
        permanent: true,
      },
      {
        source: "/festivals/janmastami",
        destination: "/festivals/janmashtami",
        permanent: true,
      },
      {
        source: "/festivals/janmashtami-2026",
        destination: "/festivals/janmashtami",
        permanent: true,
      },
      {
        source: "/festivals/radhastami",
        destination: "/festivals/radhashtami",
        permanent: true,
      },
      {
        source: "/festivals/radha-ashtami",
        destination: "/festivals/radhashtami",
        permanent: true,
      },
      {
        source: "/festivals/radhaastami",
        destination: "/festivals/radhashtami",
        permanent: true,
      },
      {
        source: "/festivals/gaur-purnima",
        destination: "/festivals/gaura-purnima",
        permanent: true,
      },
      {
        source: "/festivals/gauranga-purnima",
        destination: "/festivals/gaura-purnima",
        permanent: true,
      },
      {
        source: "/festivals/rathayatra",
        destination: "/festivals/rath-yatra",
        permanent: true,
      },
      {
        source: "/festivals/ratha-yatra",
        destination: "/festivals/rath-yatra",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/app-version.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
