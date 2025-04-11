import type { GetStaticProps, GetStaticPaths } from "next";
import React, { useCallback, useState } from "react";
import { QUERY_PHOTO_SET, QUERY_PHOTO_SET_IDS } from "../../../graphql/queries";
import { initializeApollo } from "../../../graphql/client";
import { baseUrl, SEO } from "../../../components/SEO";
import { Container } from "../../../components/Layouts";
import Image from "next/image";
import contentfulLoader from "../../../lib/contentfulLoader";
import Link from "next/link";
import Footer from "../../../components/Footer";
import { useRouter } from "next/router";
import Lightbox from "../../../components/Lightbox";
import LightboxPhoto from "../../../components/Lightbox/Photo";
import Badge from "../../../components/Badge";
import { LinkShare } from "../../../components/Links";
import formatDate from "../../../lib/formatDate";

export default function PhotoSet({ photoSet, siteSettings }) {
  const router = useRouter();

  // URL for sharing
  const relativeUrl = `/photos/${photoSet.slug}`;
  const url = `${baseUrl}${relativeUrl}`;

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
        <div className="pb-3 sm:pb-6">
          <header className="pb-5 sm:pb-16 text-center">
            <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
              {photoSet.title}
            </h1>
            <div className="pt-1.5">
              {photoSet.description && <p>{photoSet.description}</p>}
            </div>
          </header>

          <div className="flex w-full flex-row justify-between mt-2">
            <div className="flex flex-row items-center gap-2">
              <Link
                href="/"
                className="flex flex-row items-center gap-2 [font-variation-settings:'wght'_450]"
              >
                <div>
                  <Image
                    alt={siteSettings.siteTitle}
                    title={siteSettings.siteTitle}
                    className="rounded-full bg-gray-200 dark:bg-neutral-600"
                    className={`rounded-full bg-gray-200 dark:bg-neutral-600`}
                    src={siteSettings.avatar.url || ""}
                    width={20}
                    height={20}
                  />
                </div>
              </Link>
              <Badge>{formatDate(photoSet.updatedAt)}</Badge>
            </div>
            <div className="relative">
              <LinkShare title={photoSet.title} url={url}>
                Share
              </LinkShare>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {photoSet.photos?.map((photo) => (
            <PhotoThumbnail
              key={photo.id}
              photo={photo}
              photoSet={photoSet}
              router={router}
            />
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

function PhotoThumbnail({ photo, photoSet, router }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={{
        pathname: router.pathname,
        query: { slug: photoSet.slug, id: photo.id },
      }}
      as={`/photos/${photoSet.slug}/${photo.id}`}
      scroll={false}
      shallow
      className="group relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900 sm:[&:nth-child(15n-12)]:col-span-2 sm:last:col-span-2 after:shadow-border dark:after:shadow-none after:absolute after:w-full after:h-full after:z-10"
    >
      <Image
        src={photo.url}
        alt={photo.description || ""}
        className={`object-cover transition-all group-hover:brightness-110 group-hover:saturate-110 transform-gpu bg-gray-200 dark:bg-neutral-900 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        } transition-all duration-300`}
        fill
        sizes="(min-width: 640px) min(50vw, 700px), min(100vw, 700px)"
        loader={contentfulLoader}
        quality={75}
        onLoad={() => setImageLoaded(true)}
      />
    </Link>
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
      siteSettings: data.siteSettings,
    },
  };
};
