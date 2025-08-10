/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimalizace obrázků - protože rychlost je důležitá
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true,
  },
  
  // Webpack konfigurace - pro speciální potřeby
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Přidáme podporu pro YAML soubory
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    });
    
    return config;
  },
  
  // Headers pro bezpečnost - protože bezpečnost není vtip
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // ESLint a TypeScript konfigurace - pro ignorování chyb během sestavení
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;