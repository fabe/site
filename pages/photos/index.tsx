import type { GetStaticProps } from "next";
import React from "react";
import { SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_ALL_PHOTOS, QUERY_POSTS } from "../../graphql/queries";
import Footer from "../../components/Footer";
import Masonry from "../../components/Layouts/Masonry";
import { Container } from "../../components/Layouts";

export default function Photos({ photos }) {
  return (
    <>
      <SEO
        seo={{
          title: "Photos",
          path: "/photos",
        }}
      />

      <Container>
        <div className="flex items-center pb-6 sm:pb-12 gap-2">
          <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
            Photos
          </h1>
        </div>
      </Container>

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
