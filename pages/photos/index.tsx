import type { GetStaticProps } from "next";
import React from "react";
import { SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_PHOTO_SETS } from "../../graphql/queries";
import Footer from "../../components/Footer";
import { Main } from "../../components/Layouts";
import MediaCard from "../../components/MediaCard";
import { PhotoSet } from "../../graphql/types/types.generated";

export default function Photos({ photoSets }) {
  console.log(photoSets);
  return (
    <>
      <SEO
        seo={{
          title: "Photos",
          path: "/photos",
        }}
      />
      <Main>
        <h1 className="pb-6 text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:pb-12 sm:text-3xl">
          Photos
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {photoSets.map((photoSet: PhotoSet) => (
            <MediaCard
              key={photoSet.id}
              title={photoSet.title}
              subtitle={photoSet.description}
              image={
                photoSet.featuredPhoto && {
                  alt: photoSet.title,
                  title: photoSet.title,
                  src: photoSet.featuredPhoto.url,
                  width: 124,
                  height: 124,
                }
              }
              href={`/photos/${photoSet.slug}`}
              borderTop
            />
          ))}
        </div>
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SETS,
  });

  return {
    props: {
      photoSets: data.photoSets,
    },
  };
};
