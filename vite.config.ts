import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

const icons = [
  { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
  { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
  { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
  {
    src: "maskable-icon-512x512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
];

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["logo.svg", "apple-touch-icon-180x180.png"],
      manifest: {
        name: "Matematik TVET GFM031",
        short_name: "Matematik GFM",
        description:
          "Nota ringkas dan kuiz interaktif Matematik TVET GFM031. Boleh digunakan secara offline.",
        lang: "ms",
        dir: "ltr",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#f4f5f3",
        theme_color: "#0f172a",
        categories: ["education"],
        icons,
        shortcuts: [
          {
            name: "Buka nota",
            short_name: "Nota",
            url: "/nota/pengukuran",
            icons: [{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" }],
          },
          {
            name: "Cabaran kuiz",
            short_name: "Kuiz",
            url: "/kuiz/semua",
            icons: [{ src: "pwa-192x192.png", sizes: "192x192", type: "image/png" }],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
