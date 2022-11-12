import "../styles/globals.css";
import type { AppProps as NextAppProps } from "next/app";
import { ApolloCache, ApolloProvider } from "@apollo/client";
import { useApollo } from "../graphql/client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import localFont from "@next/font/local";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

const interVar = localFont({
  src: "../public/inter.roman.var.woff2",
  weight: "400",
  display: "swap",
  variable: "--inter-font",
});

const Archipelago = dynamic(
  () => import("../components/Navigation/Archipelago")
);

type AppProps<P = any> = {
  pageProps: P;
} & Omit<NextAppProps<P>, "pageProps">;

interface CustomPageProps {
  initialApolloState?: ApolloCache<any>;
}

export default function MyApp({
  Component,
  pageProps,
}: AppProps<CustomPageProps>) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Head>
        <html className={interVar.variable} />
      </Head>

      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
        <Analytics />

        <Suspense>
          <Archipelago />
        </Suspense>
      </ApolloProvider>
    </>
  );
}
