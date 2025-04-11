import type { GetStaticProps, GetStaticPaths } from "next";
import React from "react";
import { QUERY_PHOTO_SET, QUERY_PHOTO_SET_IDS } from "../../../graphql/queries";
import { initializeApollo } from "../../../graphql/client";
import { SEO } from "../../../components/SEO";
import LightboxPhoto from "../../../components/Lightbox/Photo";
import Footer from "../../../components/Footer";
import Link from "next/link";

export default function Photo({ photoSet, photo, siteSettings }) {
  return (
    <>
      <SEO
        seo={{
          title: photo.description || "A photo",
          path: `/photos/${photoSet.slug}/${photo.id}`,
          image: `${photo.url}?w=1024&h=1024&fit=fill`,
        }}
      />

      <div className="h-screen">
        <LightboxPhoto photo={photo} />
      </div>

      <div className="flex justify-center px-4 pb-20 lg:pb-8">
        <div className="w-full max-w-main grow">
          <Footer />
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SET_IDS,
  });

  const paths = [];

  for (const photoSet of data.photoSets) {
    if (photoSet?.photos) {
      for (const photo of photoSet.photos) {
        paths.push({
          params: {
            slug: photoSet.slug,
            id: photo.id,
          },
        });
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SET,
    variables: {
      slug: params.slug,
    },
  });

  const photo = data.photoSet.photos.find((p) => p.id === params.id);

  return {
    props: {
      photoSet: data.photoSet,
      photo,
      siteSettings: data.siteSettings,
    },
  };
};
