import "../styles/globals.css";
import type { AppProps as NextAppProps } from "next/app";
import { ApolloCache, ApolloProvider } from "@apollo/client";
import { useApollo } from "../graphql/client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />

      <Suspense>
        <Archipelago />
      </Suspense>
    </ApolloProvider>
  );
}
