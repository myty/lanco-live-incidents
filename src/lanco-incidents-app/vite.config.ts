import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

interface ManifestOptions {
    /**
     * @default _npm_package_name_
     */
    name: string;
    /**
     * @default _npm_package_name_
     */
    short_name: string;
    /**
     * @default _npm_package_description_
     */
    description: string;
    /**
     *
     */
    icons: Record<string, any>[];
    /**
     * @default `routerBase + '?standalone=true'`
     */
    start_url: string;
    /**
     * Restricts what web pages can be viewed while the manifest is applied
     */
    scope: string;
    /**
     * Defines the default orientation for all the website's top-level
     */
    orientation:
        | "any"
        | "natural"
        | "landscape"
        | "landscape-primary"
        | "landscape-secondary"
        | "portrait"
        | "portrait-primary"
        | "portrait-secondary";
    /**
     * @default `standalone`
     */
    display: string;
    /**
     * @default `#ffffff`
     */
    background_color: string;
    /**
     * @default '#42b883
     */
    theme_color: string;
    /**
     * @default `ltr`
     */
    dir: "ltr" | "rtl";
    /**
     * @default `en`
     */
    lang: string;
    /**
     * @default A combination of `routerBase` and `options.build.publicPath`
     */
    publicPath: string;
}

const generateManifest = (): any => {
    return {
        name: "Lancaster Live Incidents",
        short_name: "Incidents",
        description:
            "A jazzed-up version of https://www.lcwc911.us/live-incident-list",
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
    plugins: [
        reactRefresh(),
        tsconfigPaths(),
        VitePWA({ injectRegister: false, manifest: generateManifest() }),
    ],
});
