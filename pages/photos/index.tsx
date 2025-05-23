import type { GetStaticProps } from "next";
import React, { useState } from "react";
import { SEO } from "../../components/SEO";
import { initializeApollo } from "../../graphql/client";
import { QUERY_PHOTO_SETS } from "../../graphql/queries";
import Footer from "../../components/Footer";
import { Main } from "../../components/Layouts";
import Image from "next/image";
import Link from "next/link";
import contentfulLoader from "../../lib/contentfulLoader";
import { PhotoSet } from "../../graphql/types/types.generated";
import Badge from "../../components/Badge";

export default function Photos({ photoSets }) {
  return (
    <>
      <SEO
        seo={{
          title: "Photos",
          path: "/photos",
        }}
      />
      <Main>
        <div className="flex items-center justify-between pb-6 sm:pb-12 gap-2">
          <h1 className="text-2xl text-neutral-800 [font-variation-settings:'opsz'_32,_'wght'_500] dark:text-white sm:text-3xl">
            Photos
          </h1>
          <Badge>Work in Progress</Badge>
        </div>
        <div className="flex flex-col gap-8">
          {photoSets.map((photoSet: PhotoSet) => (
            <PhotoSetCard key={photoSet.id} photoSet={photoSet} />
          ))}
        </div>
      </Main>
    </>
  );
}

function PhotoSetCard({ photoSet }: { photoSet: PhotoSet }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      href={`/photos/${photoSet.slug}`}
      className="group relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-neutral-700 dark:bg-neutral-800"
    >
      {photoSet.featuredPhoto && (
        <Image
          alt={photoSet.title}
          title={photoSet.title}
          src={photoSet.featuredPhoto.url}
          fill
          sizes="100vw"
          className={`object-cover will-change-transform group-hover:scale-[1.04] transition-all duration-300 ease-in-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          loader={contentfulLoader}
          quality={90}
          onLoad={() => setImageLoaded(true)}
        />
      )}

      {/* Fixed gradient overlay that doesn't change on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

      {/* Progressive blur overlay - shorter height and fixed position */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] xs:h-[45%] sm:h-[30%] overflow-hidden">
        {/* Single blur layer with consistent styling */}
        <div
          className="absolute inset-0 backdrop-blur-[5px] backdrop-brightness-[.85] backdrop-saturate-[1.1]"
          style={{
            mask: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        ></div>

        {/* Title and description container - centered and at bottom */}
        <div className="absolute bottom-0 w-full px-4 pb-4 sm:pb-6 pt-8 text-center">
          <h2 className="[font-variation-settings:'opsz'_32,_'wght'_500] text-2xl sm:text-3xl font-medium text-white transition-transform duration-300 ease-out pointer-fine:group-hover:translate-y-4">
            {photoSet.title}
          </h2>
          <p className="mx-auto mt-1 sm:mt-1.5 max-w-md line-clamp-2 text-white/80 transition-all duration-300 ease-out pointer-fine:group-hover:opacity-0 pointer-fine:group-hover:translate-y-2">
            {photoSet.description}
          </p>
        </div>
      </div>
    </Link>
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
