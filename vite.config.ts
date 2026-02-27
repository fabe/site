import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      srcDirectory: "app",
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host: "https://fabianschultz.com",
      },
    }),
    nitro(),
  ],
  optimizeDeps: {
    // Exclude server-only modules from client dep optimization.
    // These should never be bundled for the browser.
    exclude: ["sharp", "rss-parser"],
  },
  ssr: {
    // Force Vite to bundle these CJS packages so named imports work
    noExternal: [
      "@apollo/client",
      "@apollo/server",
      "@apollo/server-plugin-landing-page-graphql-playground",
    ],
  },
});
