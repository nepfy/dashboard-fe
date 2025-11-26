/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    },
    serverActions: {
      allowedOrigins: [
        "nepfy.com",
        "*.nepfy.com",
        "app.nepfy.com",
        "localhost:3000",
      ],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "9pv534kdwoxoqhab.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Allow iframe embedding for template-flash files
        source: "/template-flash/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Allow same-origin embedding
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Allow iframe embedding for template-flash files
        source: "/template-minimal/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Allow same-origin embedding
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Allow iframe embedding for template-minimal-visualize files
        source: "/template-minimal-visualize/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Allow same-origin embedding
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Allow iframe embedding for project pages (client proposals)
        // No X-Frame-Options header = allows embedding from any domain
        source: "/project/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Allow iframe embedding for subdomain project pages (no X-Frame-Options)
        // This handles username.staging-app.nepfy.com or username.app.nepfy.com
        source: "/:projectUrl*",
        has: [
          {
            type: "host",
            value: "(?<username>[^.]+)\\.(staging-)?app\\.nepfy\\.com",
          },
        ],
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Keep security headers for all other routes (excluding template paths and project pages)
        source:
          "/((?!template-flash|template-minimal-visualize|template-minimal|project).*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Vary",
            value: "Host",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
