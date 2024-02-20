import type { GetStaticProps, GetStaticPaths } from "next";
import React from "react";
import { QUERY_PHOTO, QUERY_PHOTO_IDS } from "../../graphql/queries";
import { initializeApollo } from "../../graphql/client";
import LightboxPhoto from "../../components/Lightbox/Photo";
import Footer from "../../components/Footer";
import { SEO } from "../../components/SEO";

export default function Photo(props) {
  return (
    <>
      <SEO
        seo={{
          title: props.photo.description || "A photo",
          path: `/photos/${props.photo.id}`,
          image: `${props.photo.url}?w=1600&h=900&fit=fill`,
        }}
      />

      <div className="h-screen">
        <LightboxPhoto photo={props.photo} />
      </div>
      <div className="flex justify-center px-4 pb-20 sm:pb-8">
        <div className="w-full max-w-main grow">
          <Footer />
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_PHOTO_IDS,
  });

  const data = apolloClient.readQuery({
    query: QUERY_PHOTO_IDS,
  });

  const photos = data.photos.map((photo) => ({ params: { ...photo } }));

  return {
    paths: photos,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_PHOTO,
    variables: {
      id: params.id,
    },
  });

  const data = apolloClient.readQuery({
    query: QUERY_PHOTO,
    variables: {
      id: params.id,
    },
  });

  return {
    props: {
      photo: { ...data.photo },
    },
  };
};
