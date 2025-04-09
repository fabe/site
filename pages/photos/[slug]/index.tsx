import type { GetStaticProps, GetStaticPaths } from "next";
import React, { useCallback } from "react";
import { QUERY_PHOTO_SET, QUERY_PHOTO_SET_IDS } from "../../../graphql/queries";
import { initializeApollo } from "../../../graphql/client";
import { SEO } from "../../../components/SEO";
import { Container } from "../../../components/Layouts";
import Image from "next/image";
import contentfulLoader from "../../../lib/contentfulLoader";
import Link from "next/link";
import Footer from "../../../components/Footer";
import { useRouter } from "next/router";
import Lightbox from "../../../components/Lightbox";
import LightboxPhoto from "../../../components/Lightbox/Photo";

export default function PhotoSet({ photoSet }) {
  const router = useRouter();

  // Check if we have an ID in the query parameters
  const selectedPhotoId = router.query.id;
  const selectedPhoto = selectedPhotoId
    ? photoSet.photos?.find((photo) => photo.id === selectedPhotoId)
    : null;

  // Handler for closing the lightbox
  const handleDismiss = useCallback(() => {
    router.push(`/photos/${photoSet.slug}`, undefined, {
      scroll: false,
      shallow: true,
    });
  }, [router, photoSet.slug]);

  return (
    <>
      <SEO
        seo={{
          title: photoSet.title || "Photo Set",
          path: `/photos/${photoSet.slug}`,
        }}
      />

      <Container>
        <div className="pb-6 sm:pb-12">
          <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
            {photoSet.title}
          </h1>
          {photoSet.description && (
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {photoSet.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {photoSet.photos?.map((photo) => (
            <Link
              key={photo.id}
              href={{
                pathname: router.pathname,
                query: { slug: photoSet.slug, id: photo.id },
              }}
              as={`/photos/${photoSet.slug}/${photo.id}`}
              scroll={false}
              shallow
              className="group relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900"
            >
              <Image
                src={photo.url}
                alt={photo.description || ""}
                className="object-cover transition-all group-hover:brightness-110 group-hover:saturate-110"
                fill
                sizes="(min-width: 640px) min(50vw, 350px), min(100vw, 350px)"
                loader={contentfulLoader}
                quality={75}
              />
            </Link>
          ))}
        </div>
      </Container>

      {selectedPhoto && (
        <Lightbox isOpen={true} onDismiss={handleDismiss}>
          <LightboxPhoto photo={selectedPhoto} />
        </Lightbox>
      )}

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

  const { data } = await apolloClient.query({
    query: QUERY_PHOTO_SET_IDS,
  });

  const paths = data.photoSets.map((photoSet) => ({
    params: { slug: photoSet.slug },
  }));

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

  return {
    props: {
      photoSet: data.photoSet,
    },
  };
};
