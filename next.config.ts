import type { NextConfig } from 'next';

/**
 * Content Security Policy directive set.
 *
 * The policy is intentionally conservative yet practical for a Next.js app:
 *  - 'unsafe-inline' / 'unsafe-eval' are needed for Next.js dev runtime and
 *    for any inline <style>/<script> Next.js inserts during hydration. We
 *    mitigate by removing these via nonce-based CSP in a future iteration.
 *  - 'self' for scripts/styles/images that originate from the same origin.
 *  - External resources are scoped to the exact hosts we actually use:
 *    Supabase (api + storage + image transform), Google (apis, Drive,
 *    YouTube, Maps), Instagram, WhatsApp.
 *  - Frame-src allows Google Maps embed + YouTube embeds (used by Sermons
 *    iframe lightbox) + Vercel live preview (inspected domain).
 *  - Connect-src includes Supabase realtime + REST + WebSocket, Google APIs.
 *  - object-src 'none' to block plugin abuse (Flash/Java).
 *
 * If you add a new external integration, append the host to the relevant
 * directive here.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https://*.supabase.co",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://maps.google.com https://vercel.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googleapis.com https://api.whatsapp.com https://www.youtube.com https://www.instagram.com https://*.googleusercontent.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: csp },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/public',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Loosen CSP for API routes — they only respond JSON, no HTML/scripts,
      // and may need to redirect to OAuth providers in the future.
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // frame-ancestors 'none' for API responses (they should never be framed)
          { key: 'Content-Security-Policy', value: "default-src 'none'; frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
