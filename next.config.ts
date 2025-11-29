import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  
  // Optimizaciones de imágenes y assets
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Optimizaciones experimentales
  experimental: {
    optimizePackageImports: ["@prisma/client", "zod"],
  },

  // Configuración de Turbopack (Next.js 16 usa Turbopack por defecto)
  turbopack: {},
};

export default nextConfig;
