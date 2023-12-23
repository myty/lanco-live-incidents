/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ManifestOptions, VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

const generateManifest = (): Partial<ManifestOptions> => {
  return {
    name: "Central Penn Incidents",
    short_name: "Incidents",
    description: "A jazzed-up version of https://www.lcwc911.us/live-incident-list",
    theme_color: "#263989",
    background_color: "#263989",
    lang: "en-US",
    display: "standalone",
    orientation: "portrait",
    screenshots: [
      {
        src: "/screenshot1.png",
        sizes: "1079x1919",
        type: "image/png",
      },
      {
        src: "/screenshot2.png",
        sizes: "1079x1919",
        type: "image/png",
      },
    ],
    categories: ["medical", "news", "utilities"],
    icons: [
      {
        src: "/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), VitePWA({ injectRegister: false, manifest: generateManifest() })],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,
  },
});
