import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { ApolloProvider } from "@apollo/client";
import { lazy, Suspense, type ReactNode } from "react";
import { getClientApollo } from "@/graphql/client";
import "@/styles/globals.css";

const Archipelago = lazy(() => import("@/components/Navigation/Archipelago"));

export const baseUrl = "https://fabianschultz.com";

const defaultSEO = {
  title: "Fabian Schultz",
  description: "Product Designer",
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: defaultSEO.title },
      { name: "description", content: defaultSEO.description },
      { name: "author", content: "Fabian Schultz" },
      { name: "googlebot", content: "index,follow" },
      {
        name: "theme-color",
        content: "#DFDFDE",
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: "#171717",
        media: "(prefers-color-scheme: dark)",
      },
      {
        name: "google-site-verification",
        content: "Oh4RDwXU307Z8ZofFyLQcqmin4Zuv309dats9oWWeHU",
      },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: baseUrl },
      { property: "og:site_name", content: defaultSEO.title },
      { property: "og:image", content: `${baseUrl}/social.png` },
      { property: "og:image:alt", content: defaultSEO.title },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@supfabian" },
      { name: "twitter:creator", content: "@supfabian" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "me", href: "https://mastodon.social/@fabians" },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS feed",
        href: `${baseUrl}/posts/rss`,
      },
    ],
    scripts: [
      {
        src: "https://eu.umami.is/script.js",
        defer: true,
        attrs: {
          "data-website-id": "06795c3d-e407-438d-9ec4-1395a458e24f",
        },
      },
    ],
  }),
  component: RootComponent,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebSite",
              name: defaultSEO.title,
              url: baseUrl,
              image: `${baseUrl}/social.png`,
              author: {
                "@context": "http://schema.org",
                "@type": "Person",
                name: defaultSEO.title,
                url: baseUrl,
                jobTitle: "Product Designer",
                alumniOf: "University of Applied Sciences Potsdam",
                gender: "male",
                image: `${baseUrl}/social.png`,
                sameAs: [
                  "https://x.com/supfabian",
                  "https://www.linkedin.com/in/fabian-schultz",
                ],
              },
            }),
          }}
        />
      </head>
      <body className="h-full">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const apolloClient = getClientApollo();

  return (
    <RootDocument>
      <ApolloProvider client={apolloClient}>
        <Outlet />
        <Suspense>
          <Archipelago />
        </Suspense>
      </ApolloProvider>
    </RootDocument>
  );
}
