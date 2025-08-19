/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Optimize CSS delivery
    optimizeCss: true,
    
    // Optimize server-side React rendering
    optimizeServerReact: true,
    
    // Optimize package imports (supported in Next.js 15+)
    optimizePackageImports: [
      'lucide-react',
      '@headlessui/react',
      'framer-motion',
      'date-fns'
    ],
    
    // Enable modern bundling features
    esmExternals: true,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rangolicloud.onrender.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.rangolistore.me',
        pathname: '/**',
      },
      // Add common CDN patterns
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    // Image optimization settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: false, // Security: disable SVG optimization
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // React strict mode
  reactStrictMode: process.env.NODE_ENV === 'production',

  // Performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      },
      // Static asset caching
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // API route headers
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      }
    ];
  },

  // Bundle analyzer (only in development)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../bundle-analyzer-report.html'
          })
        );
      }
      
      // Additional webpack optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };

      return config;
    }
  }),

  // Reduce build output noise
  typescript: {
    // Ignore TypeScript errors during build (not recommended for production)
    // ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Run ESLint on additional directories
    dirs: ['pages', 'components', 'lib', 'app'],
    // Ignore ESLint errors during build (not recommended)
    // ignoreDuringBuilds: false,
  },

  // Output configuration for better performance
  output: 'standalone', // Optimize for serverless deployment
  
  // Generate build ID for cache busting
  generateBuildId: async () => {
    // Use environment variable or timestamp
    return process.env.BUILD_ID || `build-${Date.now()}`;
  },

  // Environment-specific configurations
  ...(process.env.NODE_ENV === 'production' && {
    // Production-only optimizations
    productionBrowserSourceMaps: false, // Disable source maps in production
    poweredByHeader: false, // Remove X-Powered-By header
  }),

  // Redirects for SEO and UX
  async redirects() {
    return [
      // Redirect old URLs if needed
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ];
  },

  // Rewrites for API proxying if needed
  async rewrites() {
    return [
      // Example: Proxy to external API
      // {
      //   source: '/api/external/:path*',
      //   destination: 'https://external-api.com/:path*',
      // },
    ];
  },
};

export default nextConfig;