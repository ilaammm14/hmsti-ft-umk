import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'netomqolevkemxamojhu.supabase.co',
      },
    ],
    // Fallback: izinkan semua domain (hanya untuk development)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
}

export default nextConfig
