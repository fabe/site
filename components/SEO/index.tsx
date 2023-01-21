import Head from "next/head";
import { DefaultSeo } from "next-seo";

export const baseUrl = "https://fabianschultz.com";

export const defaultSEO = {
  title: "Fabian Schultz",
  description: "Product Designer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    site_name: "Fabian Schultz",
    images: [
      {
        url: `${baseUrl}/social.png`,
        alt: "Fabian Schultz",
      },
    ],
  },
  twitter: {
    handle: "@fschultz_",
    site: "@fschultz_",
    cardType: "summary_large_image",
  },
};

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export function SEO({ seo }: { seo?: SEOProps }) {
  return (
    <>
      <DefaultSeo {...{ ...defaultSEO, ...seo }} />
      <Head>
        <meta name="googlebot" content="index,follow" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {seo.path ? (
          <link
            rel="canonical"
            href={`${baseUrl}${seo.path === "/" ? "" : seo.path}`}
          />
        ) : null}

        <link
          rel="preload"
          href="/inter.roman.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* <link
          rel="preload"
          href="/literata.roman.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        /> */}

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            name: defaultSEO.title,
            url: baseUrl,
            image: defaultSEO.openGraph.images[0].url,
            author: {
              "@context": "http://schema.org",
              "@type": "Person",
              name: defaultSEO.title,
              url: baseUrl,
              jobTitle: "Product Designer",
              alumniOf: "University of Applied Sciences Potsdam",
              gender: "male",
              image: defaultSEO.openGraph.images[0].url,
              sameAs: [
                "https://twitter.com/fschultz_",
                "https://www.linkedin.com/in/fabian-schultz",
              ],
            },
          })}
        </script>

        <meta name="author" content="Fabian Schultz" />
        <meta
          name="theme-color"
          content="#DFDFDE"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="google-site-verification"
          content="Oh4RDwXU307Z8ZofFyLQcqmin4Zuv309dats9oWWeHU"
        />
        <link rel="me" href="https://mastodon.social/@fabians" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed"
          href={`${baseUrl}/posts/rss`}
        />
      </Head>
    </>
  );
}
