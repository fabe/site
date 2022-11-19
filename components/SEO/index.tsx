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
  url?: string;
}

export function SEO({ seo }: { seo?: SEOProps }) {
  return (
    <>
      <DefaultSeo {...{ ...defaultSEO, ...seo }} />
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* <link rel="canonical" href={baseUrl} /> */}

        <link
          rel="preload"
          href="/hubot-sans.var.woff2"
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
