import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../graphql/client";

export default function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
