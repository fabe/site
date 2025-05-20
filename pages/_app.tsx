import "../styles/globals.css";
import type { AppProps as NextAppProps } from "next/app";
import { ApolloCache, ApolloProvider } from "@apollo/client";
import { useApollo } from "../graphql/client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import localFont from "next/font/local";

const sansFont = localFont({
  src: [
    {
      path: "../public/inter.roman.var.woff2",
      style: "normal",
    },
    {
      path: "../public/inter.italic.var.woff2",
      style: "italic",
    },
  ],
  preload: false,
  weight: "100 900",
  display: "swap",
});

const Archipelago = dynamic(
  () => import("../components/Navigation/Archipelago"),
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
      <ApolloProvider client={apolloClient}>
        <style jsx global>
          {`
            :root {
              --sans-font: ${sansFont.style.fontFamily};
            }
          `}
        </style>

        <Component {...pageProps} />

        <Suspense>
          <Archipelago />
        </Suspense>
      </ApolloProvider>
    </>
  );
}
