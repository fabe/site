import type { GetStaticProps } from "next";
import React from "react";
import { SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_ALL_PHOTOS, QUERY_POSTS } from "../../graphql/queries";
import Footer from "../../components/Footer";
import Masonry from "../../components/Layouts/Masonry";
import Badge from "../../components/Badge";

export default function Photos({ photos }) {
  return (
    <>
      <SEO
        seo={{
          title: "Photos",
          path: "/photos",
        }}
      />

      <header className="text-center flex items-center flex-col py-20 sm:gap-4 gap-2">
        <h1 className="text-3xl text-neutral-800 dark:text-white [font-variation-settings:'opsz'_60,_'wght'_700] sm:text-6xl tracking-tight text-balance">
          Photos
        </h1>
        <span className="text-neutral-500 dark:text-silver-dark">
          Just a testing ground, for now.
        </span>
      </header>

      <div className="p-2">
        <Masonry photos={photos} />
      </div>

      <div className="flex justify-center px-4 pb-20 sm:pb-8">
        <div className="w-full max-w-main grow">
          <Footer />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_ALL_PHOTOS,
  });

  const data = apolloClient.readQuery({
    query: QUERY_ALL_PHOTOS,
  });

  return {
    props: {
      photos: data.photos,
    },
  };
};
