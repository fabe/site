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
        enabled: !!process.env.PRERENDER,
        crawlLinks: true,
        // Ignore protocol-relative URLs (//github.com, //patents.google.com)
        // that the crawler misinterprets as local paths
        filter: (page) => !page.path.startsWith("//"),
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
    // Bundle all GraphQL/Apollo packages into the SSR build so they
    // share a single copy of the "graphql" module. Without this,
    // external packages resolve their own copy of "graphql" at runtime,
    // causing dual-package hazard (instanceof GraphQLSchema fails).
    noExternal: [
      "@apollo/client",
      "@apollo/server",
      "@apollo/server-plugin-landing-page-graphql-playground",
      "@graphql-tools/schema",
      "graphql",
    ],
  },
});
